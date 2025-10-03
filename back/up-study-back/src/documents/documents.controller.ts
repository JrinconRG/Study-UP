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
  // aceptar solo mime types especificos

  const allowedMimes = [ 'application/pdf']

  // extension adicional para pdfs
  const allowedExts = ['.pdf'];

  const ext = extname(file.originalname).toLowerCase();
  const isValidMime = allowedMimes.includes(file.mimetype);
  const isValidExt = allowedExts.includes(ext);

  if (isValidMime && isValidExt) {
    cb(null, true);
  } else {
    cb(new BadRequestException(`Tipo de archivo no permitido. Solo se aceptan pdf. Recibido : ${file.mimetype}`), false);
  }
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

