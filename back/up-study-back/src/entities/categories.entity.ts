import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Document } from './document.entity';

@Entity('tbl_categories')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'name', type: 'varchar', length: 150, unique: true })
  name: string;

  @Column({ name: 'slug', type: 'varchar', length: 150, unique: true })
  slug: string;

  @OneToMany(() => Document, d => d.category)
  documents: Document[];
}
