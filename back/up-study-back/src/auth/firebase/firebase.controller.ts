import { Controller, Post, Body, Req, UseGuards, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { FirebaseAuthGuard } from './firebase/firebase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.loginWithEmailAndPassword(dto.email, dto.password);
  }

  // ejemplo: login por token (cliente manda idToken en Authorization)
  @UseGuards(FirebaseAuthGuard)
  @Get('profile')
  async profile(@Req() req: any) {
    if (!req.user) throw new UnauthorizedException();
    // aquí deberías buscar/crear el usuario y devolverlo
    return { firebasePayload: req.user };
  }
}