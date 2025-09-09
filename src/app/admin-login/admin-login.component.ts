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
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule,MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
],
  templateUrl: './admin-login.component.html'
})
export class AdminLoginComponent {
  adminLoginForm: FormGroup;
  private apiUrl = 'http://localhost:5030/api/auth/login';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.adminLoginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onAdminLogin() {
    if (this.adminLoginForm.invalid) return;

    this.http.post<any>(this.apiUrl, this.adminLoginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.snackBar.open('✅ Admin login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.snackBar.open('❌ Admin login failed: ' + (err.error?.title || err.message), 'Close', { duration: 3000 });
      }
    });
  }
}