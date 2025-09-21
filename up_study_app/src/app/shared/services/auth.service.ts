import { inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import Swal from 'sweetalert2';
import { Post } from '../interfaces/post.interface';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../interfaces/login-respose.interface';
import { catchError, map, Observable, tap } from 'rxjs';
import { TOKEN_KEY } from '../util/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLogged = signal(false);

  http = inject(HttpClient);
  
  private urlBase = 'http://localhost:3000/api/v1';

  login(email: string, password: string): Observable<boolean> {

    return this.http.post<LoginResponse>(`${this.urlBase}/auth/login`, { email, password }).pipe(
      tap({
        next: (response) => {
          sessionStorage.setItem(TOKEN_KEY, response.token);
          this.isLogged.update(() => true);
        },
      }),
      map((response) => {
        return response.success;
      }),
      catchError((error) => {
        console.error('From service', error);
        throw new Error('Credenciales no válidas');
      })
    );
  }


  registry(user: User): Observable<boolean> {
    return this.http.post<LoginResponse>(`${this.urlBase}/auth/sign-up`, user).pipe(
      tap({
        next: (response) => {
          sessionStorage.setItem(TOKEN_KEY, response.token);
          this.isLogged.update(() => true);
        },
      }),
      map((response) => {
        return response.success;
      }),
      catchError((error) => {
        console.error('From service', error);
        throw error;
      })
    );
  }
   
  post(post: Post): boolean {
    try {
      localStorage.setItem(post.itemname!, JSON.stringify(post));
      return true;
    }catch (error) {
      console.error('Error al guardar el post:', error);
      return false;
      }
    }

}
