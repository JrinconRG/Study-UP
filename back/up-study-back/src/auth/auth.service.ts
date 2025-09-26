import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from './firebase/firebase.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import fetch from 'node-fetch';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly usuariosService: UsuariosService,
  ) {}

  async loginWithEmailAndPassword(email: string, password: string) {
    const API_KEY = process.env.FIREBASE_API_KEY;
    if (!API_KEY) throw new InternalServerErrorException('FIREBASE_API_KEY missing');

    const resp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    );

    const body = await resp.json();
    if (!resp.ok) {
      const err = body?.error?.message || 'Invalid credentials';
      throw new UnauthorizedException(err);
    }

    const idToken = body.idToken;
    const verified = await this.firebaseService.getAuth().verifyIdToken(idToken);
    const firebaseUid = verified.uid;

    const maybeUser = await this.usuariosService.findByFirebaseUid(firebaseUid);

    if(!maybeUser){
        throw new UnauthorizedException('User not registered. ');
    }

    const user:Usuario = maybeUser;

    //Obtengo rol
    let role=2;
    if(user.roleId && this.usuariosService.getRoleById){
        const roleObj = await this.usuariosService.getRoleById(user.roleId);
         if (roleObj && typeof roleObj.roleId === 'number') role = roleObj.roleId;
    }

    return { idToken, refreshToken: body.refreshToken, user, role };
  }

  async verifyToken(idToken: string) {
    try {
      return await this.firebaseService.getAuth().verifyIdToken(idToken);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}