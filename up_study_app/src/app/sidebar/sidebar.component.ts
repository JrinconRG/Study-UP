import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  isOpen = true;  // 👉 Estado: true = expandida, false = contraída

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}