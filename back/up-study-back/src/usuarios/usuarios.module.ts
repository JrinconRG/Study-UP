import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { FirebaseModule } from '../auth/firebase/firebase.module';
import { Role } from '../entities/roles.entity'; //
@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Role]), FirebaseModule],
  providers: [UsuariosService],
  controllers: [UsuariosController],
  exports: [UsuariosService],
})
export class UsuariosModule {}
