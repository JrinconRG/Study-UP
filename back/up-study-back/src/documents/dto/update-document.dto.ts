export class UpdateDocumentDto {
  title?: string;
  description?: string;
  authorId?: number;
  categoryId?: number;
  storageUrl?: string;
  fileName?: string;
  fileSize?: string;
  contentType?: string;
  publishDate?: string;
  isPublic?: boolean;
  tagIds?: number[];
}
