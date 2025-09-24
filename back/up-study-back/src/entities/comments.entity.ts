import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Document } from './document.entity';
import { Usuario } from './usuario.entity';

@Entity('tbl_comments')
export class Comment {
  @PrimaryGeneratedColumn({ name: 'comment_id', type: 'bigint' })
  commentId: number;

  @Column({ name: 'document_id', nullable: true , type: 'int'})
  documentId: number | null;

  @ManyToOne(() => Document, d => d.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column({ name: 'author_id', nullable: true ,type: 'int',})
  authorId: number | null;

  @ManyToOne(() => Usuario, u => u.comments, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: Usuario | null;

  @Column({ name: 'body', type: 'text' })
  body: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;
}
