import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../../src/entities/usuario.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { FirebaseModule } from '../../../src/auth/firebase/firebase.module';
import { Role } from '../../../src/entities/roles.entity'; //
@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Role]), FirebaseModule],
  providers: [UsuariosService],
  controllers: [UsuariosController],
  exports: [UsuariosService],
})
export class UsuariosModule {}
