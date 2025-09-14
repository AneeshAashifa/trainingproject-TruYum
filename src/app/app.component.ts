import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule, RouterLink, RouterLinkActive,MatButtonModule,MatIconModule,MatToolbarModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
   get isLoggedIn(): boolean {
    // 👈 reactive check every time Angular renders
    return !!localStorage.getItem('token');
  }

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']); // go back to home
  }
}