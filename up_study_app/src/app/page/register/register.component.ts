import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { UsuariosService } from '../../shared/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // ✅ Inyectamos el servicio de usuarios
  private usuariosService = inject(UsuariosService);
  private router = inject(Router); 
  private fb = inject(FormBuilder);

  passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const rePassword = control.get('repassword')?.value;
    return password === rePassword ? null : { passwordsMismatch: true };
  };

  registryForm = this.fb.group({
    username: ['', [Validators.minLength(6), Validators.required]],
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    repassword: ['']
  }, { validators: this.passwordsMatchValidator });

  onRegistry() {
    if (this.registryForm.invalid) {
      Swal.fire({
        text: 'Debe diligenciar todos los campos',
        icon: 'error'
      });
      return;
    }

    // ✅ Armamos el objeto que espera el backend
    const formValue = this.registryForm.getRawValue();

  const newUser: any = {
    firebase_uid: '',                      
    email: formValue.email,                 
    full_name: formValue.name,             
    profile_image_url: '',                  
    role_id: null,                         
    password: formValue.password           
    
  };

    this.usuariosService.register(newUser).subscribe({
      next: (response) => {
        Swal.fire({
          text: 'Usuario registrado correctamente',
          icon: 'success'
        }).then(() => {
          this.registryForm.reset();
          this.router.navigateByUrl('publication');
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          text: 'Error al registrar el usuario. Revisa los datos.',
          icon: 'error'
        });
      }
    });
  }
}
