import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SignalrService } from '../services/signalr.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.component.html'
})
export class AdminLoginComponent {
  creds = { username: '', password: '' };
  private apiUrl = 'http://localhost:5030/api/auth/login';

  constructor(private http: HttpClient, private router: Router, private signalr: SignalrService) {}

  login() {
    this.http.post<any>(this.apiUrl, this.creds).subscribe({
      next: (res) => {
        if (res.role === 'Admin') {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          this.signalr.startConnection();
          alert('✅ Admin login successful!');
          this.router.navigate(['/admin']);
        } else {
          alert(' This account is not an Admin.');
        }
      },
      error: (err) => {
        alert(' Login failed: ' + err.error);
      }
    });
  }
}
