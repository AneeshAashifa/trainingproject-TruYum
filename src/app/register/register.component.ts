import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  user = { username: '', password: '' };
  private apiUrl = 'http://localhost:5030/api/auth/register';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    const requestBody = {
      username: this.user.username,
      password: this.user.password,
      role: 'User'   // force all registered accounts to be User
    };

    this.http.post<any>(this.apiUrl, requestBody).subscribe({
      next: () => {
        alert('✅ Registration successful! Please login.');
        this.router.navigate(['/user-login']);
      },
      error: (err) => {
        if (err.error && err.error.title) {
      alert('❌ Registration failed: ' + err.error.title);
    } else {
      alert('❌ Registration failed: ' + err.message);
    }
  }
});
}
}
