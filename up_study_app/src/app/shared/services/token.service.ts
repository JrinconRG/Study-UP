import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../util/constants';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  getToken():string | null{
    return sessionStorage.getItem(TOKEN_KEY);
  }

  decodeToken():JwtPayload | null{
    const token = this.getToken(); 
    if(!token) return null; 
    try{
      return jwtDecode<JwtPayload>(token); 
    }catch (error){
      console.error("token invalido", error); 
      return null;
    }
  }

  isTokenExpired():boolean {
    const payload = this.decodeToken(); 
    if(!payload?.exp) return true; 

    const now = Math.floor(Date.now() / 1000); 
    return payload.exp < now;
  }

  clearToken(): void {
    sessionStorage.removeItem(TOKEN_KEY); 
  }
} 
