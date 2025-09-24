import { Entity, PrimaryColumn } from 'typeorm';

@Entity('tbl_document_tags')
export class DocumentTag {
  @PrimaryColumn({ name: 'document_id' })
  documentId: number;

  @PrimaryColumn({ name: 'tag_id' })
  tagId: number;
}
