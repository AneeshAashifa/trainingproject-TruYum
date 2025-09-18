import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
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
  goToRegister() {
  this.router.navigate(['/signup']);
}


  onLogin() {
    if (this.loginForm.invalid) {
      this.snackBar.open('⚠️ Please fill in all fields', 'Close', { duration: 3000 });
      return;
    }

    this.http.post<any>(this.apiUrl, this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username',res.username);
        localStorage.setItem('role',res.role);
        this.snackBar.open(`✅Welcome,${res.username}!`, 'Close', { duration: 3000 });
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        this.snackBar.open(
          '❌ Login failed: ' + (err.error?.title || err.message),
          'Close',
          { duration: 3000 }
        );
      }
    });
  }
}