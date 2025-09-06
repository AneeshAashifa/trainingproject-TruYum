import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-choice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-choice.component.html',
  styleUrls: ['./login-choice.component.css']
})
export class LoginChoiceComponent {
  constructor(private router: Router) {}

  goToUserLogin() {
    this.router.navigate(['/user-login']);
  }

  goToAdminLogin() {
    this.router.navigate(['/admin-login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
