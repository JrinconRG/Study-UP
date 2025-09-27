import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuariosService } from '../../shared/services/usuarios.service'; // ⚡ Ajusta la ruta según tu proyecto
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  avatarUrl: string | null = null;

  // inyección de dependencias
  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);

  ngOnInit(): void {
    // 1️⃣ Inicializar el formulario
    this.profileForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email]],
      firebase_uid: [{ value: '', disabled: true }], // UID solo lectura
      role_id: [null],
      profile_image_url: ['']
    });

    // 2️⃣ Cargar datos actuales del usuario
    this.loadUsuario();
  }

  /** Cargar los datos del usuario autenticado desde la API */
  private loadUsuario(): void {
    // aquí podrías obtener el ID desde un AuthService o token
    const userId = 1; // ⚡ reemplaza con el ID real del usuario autenticado
    this.usuariosService.findOneById(userId).subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          full_name: user.full_name,
          email: user.email,
          firebase_uid: user.firebase_uid,
          role_id: user.role_id,
          profile_image_url: user.profile_image_url
        });

        this.avatarUrl = user.profile_image_url || null;
      },
      error: (err) => {
        console.error('Error cargando usuario', err);
        Swal.fire('Error', 'No se pudieron cargar los datos del perfil', 'error');
      }
    });
  }

  /** Guardar cambios del perfil */
  onSubmit(): void {
    if (this.profileForm.invalid) {
      Swal.fire('Atención', 'Debes completar los campos obligatorios', 'warning');
      return;
    }

    const userId = 1; // ⚡ ID real del usuario autenticado
    const payload = this.profileForm.getRawValue(); // incluye los valores editables

    this.usuariosService.update(userId, payload).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al actualizar usuario', err);
        Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
      }
    });
    
  }
}
