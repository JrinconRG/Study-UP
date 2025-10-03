import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../entities/document.entity';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { FirebaseModule } from '../auth/firebase/firebase.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), FirebaseModule],
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService],

})
export class DocumentsModule {}
