import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SignalrService } from '../services/signalr.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-login.component.html'
})
export class UserLoginComponent {
  creds = { username: '', password: '' };
  private apiUrl = 'http://localhost:5030/api/auth/login';

  constructor(private http: HttpClient, private router: Router,private signalr: SignalrService) {}

  login() {
    this.http.post<any>(this.apiUrl, this.creds).subscribe({
      next: (res) => {
        if (res.role === 'User') {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          this.signalr.startConnection();
          alert('✅ User login successful!');
          this.router.navigate(['/menu']);
        } else {
          alert('❌ This account is not an User.');
        }
      },
      error: (err) => {
        alert('❌ Login failed: ' + err.error);
      }
    });
  }
}
