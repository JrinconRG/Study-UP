import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  autService = inject(AuthService);

  router = inject(Router); 

  fb = inject(FormBuilder);

  passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const rePassword = control.get('repassword')?.value;
    return password === rePassword ? null : { passwordsMismatch: true };

  };

  registryForm = this.fb.group({
    username: ["", [Validators.minLength(6), Validators.required]], 
    name: ["", [Validators.required]], 
    email: ["", [Validators.email]], 
    password: ["", [Validators.required]], 
    repassword: []
  }, { validators: this.passwordsMatchValidator })

    onRegistry() {

    if (this.registryForm.invalid) {
      Swal.fire({
        text: 'Debe diligenciar todos los campos',
        icon: 'error'
      })
      return;
    }

    const user = this.registryForm.getRawValue() as Required<User>;

    this.autService.registry(user)
      .subscribe({
        next: (response) => {
          if (!!response) {
            this.router.navigateByUrl('publication');
          }
          this.registryForm.reset();
        },
        error: (error) => {
          Swal.fire({
            text: 'Revisa los datos ingresados',
            icon: 'error'
          })
        }
      });
  }

}
