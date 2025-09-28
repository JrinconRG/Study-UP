export interface DocumentModel {
  title: string;
  description?: string;
  authorId?: number;
  categoryId?: number;
  storageUrl?: string;
  fileName?: string;
  fileSize?: string;   // lo guardas como string porque en la entidad es bigint
  contentType?: string;
  publishDate?: string;
  isPublic?: boolean;
  tagIds?: number[];

}