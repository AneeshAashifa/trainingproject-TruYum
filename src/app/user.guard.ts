import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('role');
    if (role === 'User') {
      return true;
    }
    alert('❌ Access denied. Users only!');
    this.router.navigate(['/user-login']);
    return false;
  }
}
