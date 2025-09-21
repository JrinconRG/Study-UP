import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  autService = inject(AuthService); 

  router = inject(Router); 

  fb = inject(FormBuilder)

  loginForm = this.fb.group({
    email:["", [Validators.email, Validators.required]],
    password:["", [Validators.required]]
  })

    onLogin(){
    if(this.loginForm.invalid){
      Swal.fire({
        text:'Diligencie todos los campos',
        icon:'error'
      })
      return;
    }

    const {email, password } = this.loginForm.value as {email:string, password:string };

    this.autService.login(email, password).subscribe({
      next:(response)=>{
        if (!!response){
          this.router.navigateByUrl('publication');
        }
      },
      error:(error)=>{
        Swal.fire({
          text:'Credenciales incorrectas',
          icon:'error'
        })
      }
    });
  }

}
