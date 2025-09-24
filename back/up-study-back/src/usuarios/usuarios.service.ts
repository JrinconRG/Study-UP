import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../../src/entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/uptade-usuario.dto';
import { Role } from '../../../src/entities/roles.entity'; // ajustar ruta si es necesario
import { FirebaseService } from '../../../src/auth/firebase/firebase.service'; // ajustar ruta
import * as admin from 'firebase-admin';


@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
        @InjectRepository(Role) private roleRepo: Repository<Role>,
        private firebaseService: FirebaseService,

    ) {}

    findAll(){
        return this.usuarioRepo.find({ where: {isDeleted: false}} );
    }

    async findOneById(id:number){
        const u = await this.usuarioRepo.findOne({where:{userId:id}});
        if (!u) throw new NotFoundException('Usuario no encontrado');
        return u;
    }


    async findOrCreateFromFirebase(firebasePayload: any, optionalDto?: Partial<CreateUsuarioDto>) {
    if (!firebasePayload || !firebasePayload.uid) {
      throw new Error('Invalid firebase payload');
    }

    const uid = firebasePayload.uid;

    // 1) intentar encontrar
    let user = await this.usuarioRepo.findOne({ where: { firebaseUid: uid } });
    if (user) return user;

    // 2) crear nuevo usando info del token y opcionales
    const dto: Partial<CreateUsuarioDto> = {
      firebaseUid: uid,
      email: firebasePayload.email || optionalDto?.email || null,
      fullName: optionalDto?.fullName ?? firebasePayload.name ?? null,
      profileImageUrl: optionalDto?.profileImageUrl ?? firebasePayload.picture ?? null,
      roleId: optionalDto?.roleId ?? undefined,
    };
    

    // si opcionalDto.roleId no existe, puedes asignar role por defecto 'usuario' si quieres:
    if (!dto.roleId) {
      const defaultRole = await this.roleRepo.findOne({ where: { name: 'USER' } });
      dto.roleId = defaultRole ? defaultRole.roleId : undefined;
    }

    const newUser = this.usuarioRepo.create(dto as any);
    const savedUser = await this.usuarioRepo.save(newUser);
    return savedUser;

  
}

    async update(id:number, dto:UpdateUsuarioDto){
        const user = await this.findOneById(id);
        Object.assign(user, dto);
        return this.usuarioRepo.save(user);}

    async softDelete(id:number){
        const user = await this.findOneById(id);
        user.isDeleted = true;
        return this.usuarioRepo.save(user);
    }

    async createWithFirebase(dto: CreateUsuarioDto) {
        const auth = this.firebaseService.getAuth();


        if(!dto.email || !dto.password){
            throw new Error('Email and password are required');
        }
        // 1) crear en Firebase Auth
        let firebaseUser: admin.auth.UserRecord | null = null;
        try {
            firebaseUser = await auth.createUser({
                email:dto.email,
                password: dto.password,
                displayName: dto.fullName ?? undefined,
                photoURL: dto.profileImageUrl ?? undefined,
            });


        }catch (err) {
      // error al crear en firebase
         throw new InternalServerErrorException(`Error creando usuario en Firebase: ${err.message || err}`);
    }
        // 2) crear en base de datos local
        const defaultRole = await this.roleRepo.findOne({ where: { name: 'USER' } });
        const roleIdToUse = dto.roleId ?? (defaultRole ? defaultRole.roleId : 2);


        const userEntity = this.usuarioRepo.create({
        firebaseUid: firebaseUser.uid,
        email: dto.email,
        fullName: dto.fullName ?? firebaseUser.displayName ?? null,
        profileImageUrl: dto.profileImageUrl ?? firebaseUser.photoURL ?? null,
        roleId: roleIdToUse,
        // otros campos por defecto que tengas en la entidad
        } as any);

        try {
      const saved = await this.usuarioRepo.save(userEntity);
      // No retornes password, de hecho no lo guardamos.
      return saved;
    } catch (dbErr) {
      // Si falla el guardado en la DB, eliminamos el usuario en Firebase para no dejar huella.
      try {
        await auth.deleteUser(firebaseUser.uid);
      } catch (delErr) {
        // si falla el delete, loguea y avisa; pero aún no podemos hacer mucho más aquí.
        console.error('Fallo al eliminar usuario Firebase luego de error DB:', delErr);
      }
      throw new InternalServerErrorException(`Error guardando usuario en DB: ${dbErr.message || dbErr}`);
    }
  }


    }



