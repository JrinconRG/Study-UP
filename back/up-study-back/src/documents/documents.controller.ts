import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Body , Req, BadRequestException, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseAuthGuard } from '../auth/firebase/firebase-auth.guard';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { memoryStorage } from 'multer';
import { Upload } from '@google-cloud/storage/build/cjs/src/resumable-upload';

@Controller('documents')
export class DocumentsController {
    constructor( private readonly documentsService: DocumentsService ) {}

    @Get()
    findAll(){
        return this.documentsService.findAllPublic();
    }


    @UseGuards(FirebaseAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto:CreateDocumentDto,
        @Req() req: any,
    ) {
        const firebaseUser = req.user;

        const result = await this.documentsService.createWithUpload(dto, file);
        return result;
    }}
