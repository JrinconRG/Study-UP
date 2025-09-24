import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Category } from './categories.entity';
import { Tag } from './tags.entity';

@Entity('tbl_documents')
export class Document {
  @PrimaryGeneratedColumn({ name: 'document_id' })
  documentId: number;

  @Column({ name: 'title', type: 'varchar', length: 300 })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'author_id', nullable: true , type: 'int'})
  authorId: number | null;

  @ManyToOne(() => Usuario, u => u.documents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: Usuario | null;

  @Column({ name: 'category_id', nullable: true ,type: 'int'})
  categoryId: number | null;

  @ManyToOne(() => Category, c => c.documents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @Column({ name: 'storage_url', type: 'text' })
  storageUrl: string;

  @Column({ name: 'file_name', type: 'varchar', length: 300, nullable: true })
  fileName: string | null;

  @Column({ name: 'file_size', type: 'bigint', nullable: true })
  fileSize: string | null;

  @Column({ name: 'content_type', type: 'varchar', length: 100, nullable: true })
  contentType: string | null;

  @Column({ name: 'publish_date', type: 'date', nullable: true })
  publishDate: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'is_public', type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @ManyToMany(() => Tag, t => t.documents)
  @JoinTable({
    name: 'tbl_document_tags',
    joinColumns: [{ name: 'document_id' }],
    inverseJoinColumns: [{ name: 'tag_id' }]
  })
  tags: Tag[];
}
