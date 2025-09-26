import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router); 

  const tokenService = inject(TokenService); 


  //if(tokenService.isTokenExpired()){
  //  router.navigateByUrl("login")
  //  return false
  //}
  return true;
};
