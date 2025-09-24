import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FirebaseService } from '../auth/firebase/firebase.service';
import { v4 as uuidv4 } from 'uuid';



@Injectable()
export class DocumentsService{
    constructor(
        @InjectRepository(Document)
        private readonly docRepo: Repository<Document>,
        private readonly firebaseService: FirebaseService, ){}
        

    findAllPublic(){
        return this.docRepo.find({ where: {isPublic: true, isDeleted: false}, relations:['author','tags','category']});
    }

    async findOne(id:number){
        const document = await this.docRepo.findOne({ where: {documentId:id},relations: ['author','tags','category'] });
        if (!document) throw new NotFoundException('Documento no encontrado');
        return document;

    }

    async findOneByName(name: string) {
        const documents = await this.docRepo.find({where: {title: ILike(`%${name}%`)},
        relations: ['author', 'tags', 'category'],
        });

        if (!documents.length) throw new NotFoundException('No se encontraron documentos');
        return documents;
    }
    private async uploadToFirebase(buffer: Buffer, destPath: string, contentType: string){
        const bucket = this.firebaseService.getStorage();
        const file = bucket.file(destPath);

        //guardar buffer en firebase
        await file.save(buffer, {
            metadata: { contentType },
            resumable: false,
        });

        const signedUrls = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 días
        });

        return {
        storagePath: destPath,
        signedUrl: signedUrls[0],
        };
    }

    async createWithUpload(dto: CreateDocumentDto, file: Express.Multer.File){

        const ext = (file.originalname || '').split('.').pop();
        const filename = `${uuidv4()}.${ext || 'bin'}`;
        const destPath = `documents/${new Date().getFullYear()}/${filename}`;

        //subir a firebase

        const {storagePath, signedUrl} = await this.uploadToFirebase(file.buffer, destPath, file.mimetype);
    
    
        const document = this.docRepo.create({
            title: dto.title,
            description: dto.description,
            authorId: dto.authorId || null,
            categoryId: dto.categoryId || null,
            storageUrl: storagePath,
            fileName: file.originalname,
            fileType: file.size,
            contentType: file.mimetype,
            publishDate: dto.publishDate ||  null,
            isPublic: dto.isPublic ?? true,
        }as any);

        const saved = await this.docRepo.save(document);

        //devuelve registro y url de descarga
        return {document: saved, downloadUrl: signedUrl };
    }

    async softDelete(id: number) {
        const doc = await this.findOne(id);
        doc.isDeleted = true;
        return this.docRepo.save(doc);
    }

    async update(id: number, dto: UpdateDocumentDto) {
    const doc = await this.findOne(id);
    Object.assign(doc, dto);
    return this.docRepo.save(doc);
  }





        }
   
    




    