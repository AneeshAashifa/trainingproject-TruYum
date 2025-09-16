import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule, RouterLink, FormsModule, RouterLinkActive,MatButtonModule,MatIconModule,MatToolbarModule, ChatComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private router: Router) {}
  get isLoggedIn(): boolean {
    // 👈 reactive check every time Angular renders
    return !!localStorage.getItem('token');
  }
  get username(): string | null {
    return localStorage.getItem('username');
  }
  get role(): string | null {
  return localStorage.getItem('role');
  } 
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.router.navigate(['/']); // go back to home
  }
}