import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Document } from './document.entity';
import { Usuario } from './usuario.entity';

@Entity('tbl_downloads')
export class Download {
  @PrimaryGeneratedColumn({ name: 'download_id', type: 'bigint' })
  downloadId: number;

  @Column({ name: 'document_id', type: 'int' })
  documentId: number;

  @ManyToOne(() => Document, d => d.documentId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column({ name: 'user_id', nullable: true , type: 'int'})
  userId: number | null;

  @ManyToOne(() => Usuario, u => u.downloads, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: Usuario | null;

  @CreateDateColumn({ name: 'downloaded_at', type: 'timestamptz' })
  downloadedAt: Date;
}
