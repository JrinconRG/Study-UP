import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/uptade-usuario.dto';
import { Role } from '../entities/roles.entity'; // ajustar ruta si es necesario
import { FirebaseService } from '../auth/firebase/firebase.service'; // ajustar ruta
import * as admin from 'firebase-admin';


@Injectable()
export class UsuariosService {
    constructor(

        @InjectRepository(Usuario)  private usuarioRepo: Repository<Usuario>,
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


    async findByFirebaseUid(uid:string):Promise<Usuario|null> {
    if (!uid) return null; 
      const user = await this.usuarioRepo.findOne({ where: {firebaseUid:uid}});
      return user ?? null;
    
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

  async getRoleById(roleId: number): Promise<Role | null> {
    if (!roleId) return null;
    const role = await this.roleRepo.findOne({ where: { roleId }});
    return role ?? null;
  }

}

