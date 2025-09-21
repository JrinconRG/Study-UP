import { Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { PostComponent } from './page/post/post.component';
import { ProfileComponent } from './page/profile/profile.component';
import { PublicationComponent } from './page/publication/publication.component';
import { RegisterComponent } from './page/register/register.component';
import { HomeComponent } from './page/home/home.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [

    {
        path:"", 
        component: HomeComponent, 
        canActivate:[authGuard]
    },

    {
        path:"login", 
        component: LoginComponent
    }, 

    {
        path:"post", 
        component: PostComponent, 
        canActivate:[authGuard]
    },

    {
        path:"profile", 
        component: ProfileComponent, 
        canActivate:[authGuard]
    },

    {
        path:"publication", 
        component: PublicationComponent, 
        canActivate:[authGuard]
    },

    {
        path:"register", 
        component: RegisterComponent
    },

    {
        path:"**", 
        redirectTo: "",
        pathMatch: "full"
    }
   

];
