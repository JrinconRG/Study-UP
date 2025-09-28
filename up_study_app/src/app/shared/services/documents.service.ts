import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; 



@Injectable({
  providedIn: 'root' // o en providers del módulo si quieres scope limitado
})
export class DocumentsService {
  // Ajusta la URL base a tu API
  private apiUrl = environment.apiUrl;  // por ejemplo: http://localhost:3000

  constructor(private http: HttpClient) {}

  /**
   * GET /documents
   * Obtiene la lista de documentos públicos
   */
  getPublicDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/documents`);
  }

  /**
   * POST /documents/upload
   * Sube un archivo y los datos del documento
   */
  uploadDocument(
    dto: any,
    file: File,
    firebaseToken?: string    // token del usuario autenticado
  ): Observable<any> {
    const formData = new FormData();

    // 📁 archivo
    formData.append('file', file);

    // 🔑 resto de campos del DTO
    Object.keys(dto).forEach(key => {
      const value = (dto as any)[key];
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const headers = new HttpHeaders({
      Authorization: `Bearer ${firebaseToken}`
    });

    return this.http.post(`${this.apiUrl}/documents/upload`, formData, { headers });
  }
}
