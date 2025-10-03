import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Body, Req, BadRequestException, Get, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FirebaseAuthGuard } from '../auth/firebase/firebase-auth.guard';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import * as fs from 'fs';
import { extname } from 'path';

const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10 MB - ajusta segun tu plan

function fileFilter(req: any, file: Express.Multer.File, cb: Function) {
  console.log('=== fileFilter RAW LOG ===');
  console.log('req.headers[content-type]:', req.headers['content-type']);
  console.log('req.is multipart?:', req.is && req.is('multipart/form-data'));
  console.log('req.body keys:', Object.keys(req.body || {}));
  console.log('file object:', JSON.stringify({
    originalname: file?.originalname,
    fieldname: file?.fieldname,
    encoding: file?.encoding,
    mimetype: file?.mimetype,
    size: file?.size,
    buffer_present: !!(file as any).buffer,
    path: (file as any).path
  }, null, 2));
  console.log('===========================');
  cb(null, true); // aceptar todo mientras debuggeamos
}



@Controller('documents')
export class DocumentsController {
    private readonly logger = new Logger(DocumentsController.name);
    constructor( private readonly documentsService: DocumentsService ) {}

    @Get()
    findAll(){
        return this.documentsService.findAllPublic();
    }
    @Get(':id')
    findOne(@Body('id') id:string){
        return this.documentsService.findOne(Number(id));
    }

    @Get('search/:name')
    findOneByName(@Body('name') name:string){
        return this.documentsService.findOneByName(name);
    }


    @UseGuards(FirebaseAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', 
        {  storage: diskStorage({
      destination: (req, file, cb) => {
        const tmpDir = '/tmp/uploads';
        try { fs.mkdirSync(tmpDir, { recursive: true }); } catch {}
        cb(null, tmpDir);
      },
      filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        cb(null, unique);
      },
    }),
    limits: { fileSize: FILE_SIZE_LIMIT },
    fileFilter,
   }))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreateDocumentDto,
        @Req() req: any,
    ) {
    if (!file) throw new BadRequestException('Archivo requerido'); 
         // el usuario verificado por el guard
        const firebaseUser = req.user;

        

         // createWithUpload espera file.path (ruta temporal)
        const result = await this.documentsService.createWithUpload(dto, file);
        return result;
    }
    

    
}

