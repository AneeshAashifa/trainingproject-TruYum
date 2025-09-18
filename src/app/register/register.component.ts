import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  private apiUrl = 'http://localhost:5030/api/auth/register';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }
  goToLogin() {
  this.router.navigate(['/user-login']);
}


  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  onRegister() {
    if (this.registerForm.invalid) return;

    const requestBody = { ...this.registerForm.value, role: 'User' };

    this.http.post<any>(this.apiUrl, requestBody).subscribe({
      next: () => {
        this.snackBar.open('✅ Registration successful! Please login.', 'Close', { duration: 3000 });
        this.router.navigate(['/user-login']);
      },
      error: (err) => {
        this.snackBar.open('❌ Registration failed: ' + (err.error?.title || err.message), 'Close', { duration: 3000 });
      }
    });
  }
}
