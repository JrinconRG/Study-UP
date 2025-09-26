import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; 


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = environment.apiUrl; // ⚡ Ajusta según tu backend

  constructor(private http: HttpClient) {}

  /**
   * GET /usuarios
   * Lista todos los usuarios
   */
  findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  /**
   * GET /usuarios/:id
   * Obtiene un usuario por ID
   */
  findOneById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarios/${id}`);
  }

  /**
   * POST /usuarios/sync
   * Sincroniza un usuario desde Firebase (requiere token Firebase)
   */
  syncFromFirebase(firebaseToken: string, body?: Partial<any>): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${firebaseToken}`
    });
    return this.http.post(`${this.apiUrl}/usuarios/sync`, body || {}, { headers });
  }

  /**
   * POST /usuarios/register
   * Registra un usuario nuevo en la base de datos
   */
  register(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/register`, dto);
  }

  /**
   * PUT /usuarios/:id
   * Actualiza un usuario (requiere token Firebase)
   */
    update(id: number, dto: any, firebaseToken?: string): Observable<any> {
    let headers = new HttpHeaders();
    if (firebaseToken) {
        headers = headers.set('Authorization', `Bearer ${firebaseToken}`);
    }
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, dto, { headers });
    }

  /**
   * DELETE /usuarios/:id
   * Eliminación lógica de un usuario (requiere token Firebase)
   */
  remove(id: number, firebaseToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${firebaseToken}`
    });
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`, { headers });
  }
}
