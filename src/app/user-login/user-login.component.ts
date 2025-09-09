import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SignalrService } from '../services/signalr.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule,MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
],
  templateUrl: './user-login.component.html'
})
export class UserLoginComponent {
  loginForm: FormGroup;
  private apiUrl = 'http://localhost:5030/api/auth/login';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.http.post<any>(this.apiUrl, this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.snackBar.open('✅ Login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        this.snackBar.open('❌ Login failed: ' + (err.error?.title || err.message), 'Close', { duration: 3000 });
      }
    });
  }
}