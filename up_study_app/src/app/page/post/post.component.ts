import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Post } from '../../shared/interfaces/post.interface';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-post',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {

  router = inject(Router);

  autService = inject(AuthService);

  fb = inject(FormBuilder);

  postForm = this.fb.group({

    itemname:["", [Validators.required]], 
    keywords:["", [Validators.required]], 
    creation:["", [Validators.required]], 
    institution:["", [Validators.required]], 
    numberpages:["", [Validators.required]], 
    academicarea:["", [Validators.required]], 
    Sinopsis:["", [Validators.required]],
    filelink:["", [Validators.required]]

  })

  onPost(){

    if(this.postForm.invalid){
      Swal.fire({
        text:'Revise los datos ingresados',
        icon:'error'
      })
      return;
    }

    const post = this.postForm.getRawValue() as Required<Post>;

    const publication = this.autService.post(post); 

    if (publication){
      this.postForm.reset(); 
      this.router.navigateByUrl('publication');
    }

  }

}
