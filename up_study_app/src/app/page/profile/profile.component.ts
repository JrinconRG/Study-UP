import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TokenService } from '../../shared/services/token.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  
  tokenService = inject(TokenService); 

  username = ""; 

  ngOnInit(): void {
    this.username = this.tokenService.decodeToken()?.username || "";
  }

}
