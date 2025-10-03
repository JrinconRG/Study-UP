import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Document } from '../entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FirebaseService } from '../auth/firebase/firebase.service';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);


@Injectable()
export class DocumentsService{
    private readonly logger = new Logger(DocumentsService.name);
    constructor(
        @InjectRepository(Document)
        private readonly docRepo: Repository<Document>,
        private readonly firebaseService: FirebaseService, 
    ){}
        

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


    private async uploadFileStream(filePath: string, destPath: string, contentType: string) {
        const bucket = this.firebaseService.getStorage();
        const file = bucket.file(destPath);

        const metadata = {
            contentType,
            cacheControl: 'public, max-age=86400', // 1 día - ajusta
            contentDisposition: `inline; filename="${destPath.split('/').pop()}"`,
            metadata: {
                firebaseStorageDownloadTokens: uuidv4(),
            },
            };

        return new Promise<void>((resolve, reject) => {
            const readStream = fs.createReadStream(filePath);
            const writeStream = file.createWriteStream({ resumable: true, metadata });

            readStream.on('error', (err) => {
                this.logger.error('readStream error', err);
                writeStream.destroy();
                reject(new InternalServerErrorException('Error leyendo archivo temporal'));
            });

            writeStream.on('error', (err) => {
                this.logger.error('upload writeStream error', err);
                reject(new InternalServerErrorException('Error subiendo archivo a storage'));
            });

            writeStream.on('finish', () => {
                resolve();
            });

            // pipe read -> write
            readStream.pipe(writeStream);
            });
        }

        async generateSignedUrl(storagePath: string, expiresInSeconds = 60 * 60 * 24 * 7) {
            const bucket = this.firebaseService.getStorage();
            const file = bucket.file(storagePath);
            try {
            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + expiresInSeconds * 1000,
            });
            return url;
            } catch (error) {
                this.logger.error('Error generando signed url', error as any);
                throw new InternalServerErrorException('No se pudo generar URL de descarga');
                }
            }

    async createWithUpload(dto: CreateDocumentDto, file: Express.Multer.File){
            let fileSize = file.size;
            if (!fileSize && file.path) {
            try {
                const st = fs.statSync(file.path);
                fileSize = st.size;
            } catch (e) {
                fileSize = 0; // fallback si no se puede determinar
                this.logger.warn('No se pudo determinar el tamaño del archivo desde la ruta', e);
            }
            }
            console.log('Determined fileSize:', fileSize);


        const ext = (file.originalname || '').split('.').pop();
        const filename = `${uuidv4()}.${ext || 'bin'}`;
        const destPath = `documents/${new Date().getFullYear()}/${filename}`;

        try {
      // Subir mediante stream desde ruta temporal
            await this.uploadFileStream(file.path, destPath, file.mimetype);

            // Borrar archivo temporal
            try { await unlinkAsync(file.path); } catch (e) { this.logger.warn('No se pudo borrar archivo temporal', e); }
            
            let saved;
            try {

            // Guardar metadatos en DB
                const document = this.docRepo.create({
                    title: dto.title,
                    description: dto.description,
                    authorId: dto.authorId || null,
                    categoryId: dto.categoryId || null,
                    storageUrl: destPath,
                    fileName: file.originalname,
                    fileSize: file.size,
                    contentType: file.mimetype,
                    publishDate: dto.publishDate || null,
                    isPublic: dto.isPublic ?? true,
                } as any);
            
                saved = await this.docRepo.save(document);}
                catch(dbError){
                    this.logger.error('Error guardando en BD, intentando limpiar storage', dbError );

                    // ⚠️ Compensación: borrar archivo de Firebase si la DB falla
                    try {
                        const bucket = this.firebaseService.getStorage();
                        await bucket.file(destPath).delete();
                        this.logger.warn('Archivo eliminado de storage tras fallo en BD');
                }catch(deleteErr){
                        this.logger.error('No se pudo eliminar archivo de storage tras fallo en BD', deleteErr );
                }
                throw new InternalServerErrorException('Error guardando documento en BD');}

        // Generar signed URL on-demand para devolver al resultado de la subida
            const signedUrl = await this.generateSignedUrl(destPath);

            return { document: saved, downloadUrl: signedUrl };
            } catch (err) {
            this.logger.error('createWithUpload failed', err as any);
            // Intentar limpiar temp
            try { if (file && file.path) await unlinkAsync(file.path); } catch {}
            throw err instanceof InternalServerErrorException ? err : new InternalServerErrorException('Error al procesar la subida');
            }
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
   
    




    