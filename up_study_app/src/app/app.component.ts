import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { PostComponent } from './page/post/post.component';
import { ProfileComponent } from './page/profile/profile.component';
import { PublicationComponent } from './page/publication/publication.component';
import { RegisterComponent } from './page/register/register.component';
import { HomeComponent } from './page/home/home.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'up_study_app';
}
