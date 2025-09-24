import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) throw new UnauthorizedException('No auth header');

    const parts = authHeader.split(' ');
    const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : authHeader;

    if (!token) throw new UnauthorizedException('Token missing');

    try {
      const verified = await this.firebaseService.getAuth().verifyIdToken(token);
      req.user = verified; // payload available in controllers
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
