import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role?: string;
  exp?: number;
}

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please login again.');
      this.router.navigate(['/admin-login']);
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        alert('Session expired. Please login again.');
        localStorage.clear();
        this.router.navigate(['/admin-login']);
        return false;
      }

      if (decoded.role === 'Admin') {
        return true;
      } else {
        alert('Access denied: Admins only');
        this.router.navigate(['/unauthorized']);
        return false;
      }
    } catch (err) {
      console.error('Invalid token', err);
      localStorage.clear();
      this.router.navigate(['/admin-login']);
      return false;
    }
  }
}