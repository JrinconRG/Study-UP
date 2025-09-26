import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; 


@Injectable({
  providedIn: 'root'
})
export class RolesService {
  // ⚡ Ajusta la URL base según tu backend
  private apiUrl = environment.apiUrl; // ej. http://localhost:3000

  constructor(private http: HttpClient) {}

  /**
   * GET /roles
   * Obtiene todos los roles
   */
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }

  /**
   * GET /roles/:id
   * Obtiene un rol por su ID
   */
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/roles/${id}`);
  }

  /**
   * POST /roles
   * Crea un nuevo rol (requiere token de Firebase)
   */
  create(dto: any, firebaseToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${firebaseToken}`
    });
    return this.http.post(`${this.apiUrl}/roles`, dto, { headers });
  }

  /**
   * DELETE /roles/:id
   * Elimina un rol por ID (requiere token de Firebase)
   */
  remove(id: number, firebaseToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${firebaseToken}`
    });
    return this.http.delete(`${this.apiUrl}/roles/${id}`, { headers });
  }
}
