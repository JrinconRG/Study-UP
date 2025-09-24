import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from '../auth/firebase/firebase.module';
import { Role } from '../entities/roles.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), FirebaseModule],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModulo {}