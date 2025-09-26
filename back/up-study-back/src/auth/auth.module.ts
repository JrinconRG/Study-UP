import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Usuario } from '../entities/usuario.entity';
import { Role } from '../entities/roles.entity';
import { UsuariosModule } from '../usuarios/usuarios.module'; // <- importar el módulo de usuarios


@Module({
  imports: [
    FirebaseModule,
    TypeOrmModule.forFeature([Usuario, Role]),
    UsuariosModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
