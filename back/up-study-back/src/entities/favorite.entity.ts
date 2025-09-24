import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Document } from './document.entity';

@Entity('tbl_favorites')
export class Favorite {
  @PrimaryColumn({ name: 'user_id' , type: 'int'})
  userId: number;

  @PrimaryColumn({ name: 'document_id', type: 'int' })
  documentId: number;

  @CreateDateColumn({ name: 'favorited_at', type: 'timestamptz' })
  favoritedAt: Date;

  @ManyToOne(() => Usuario, u => u.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Usuario;

  @ManyToOne(() => Document, d => d.documentId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: Document;
}
