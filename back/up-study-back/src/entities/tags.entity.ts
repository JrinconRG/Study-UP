import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Document } from './document.entity';

@Entity('tbl_tags')
export class Tag {
  @PrimaryGeneratedColumn({ name: 'tag_id' })
  tagId: number;

  @Column({ name: 'name', type: 'varchar', length: 100, unique: true })
  name: string;

  @ManyToMany(() => Document, d => d.tags)
  documents: Document[];
}
