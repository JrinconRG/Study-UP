import { Controller, Get, UseGuards, Req } from '@nestjs/common'; 
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard'; 

@Controller('profile') 
export class ProfileController 
{ @UseGuards(FirebaseAuthGuard)
  @Get() 
  me(@Req() req) { // req.user contiene los datos del token de Firebase 
    return { uid: req.user.uid, email: req.user.email }; } }