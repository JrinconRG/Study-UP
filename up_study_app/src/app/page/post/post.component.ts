import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { DocumentModel } from './model/DocumentModel';
import Swal from 'sweetalert2';
import { Post } from '../../shared/interfaces/post.interface';
import { AuthService } from '../../shared/services/auth.service';
import { DocumentsService } from '../../shared/services/documents.service';

@Component({
  selector: 'app-post',
  imports: [RouterLink, ReactiveFormsModule, SidebarComponent],
  templateUrl: './post.component.html'
})
export class PostComponent {

  router = inject(Router);
  documentsService = inject(DocumentsService);
  autService = inject(AuthService);

  form = inject(FormBuilder).nonNullable.group({
    tittle: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
  });

  onSubmit(): void {
 
    if(this.form.invalid){
      Swal.fire({
        text:'Diligencie todos los campos',
        icon:'error'
      })
      return;
    }

    const post: DocumentModel = {
      title: this.form.value.tittle || 'Documento sin título',
      description: this.form.value.description
    };


    console.log(post);
    this.documentsService.uploadDocument(post, new File([], 'dummy.txt'), '')
    .subscribe(
      (resp) =>
        console.log('Documento subido con éxito', resp))

  }



}
