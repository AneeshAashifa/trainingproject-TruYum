import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent {
  order: any;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.order = nav?.extras?.state?.['order'];
  }

  goHome() {
    this.router.navigate(['/']);
  }
  goToOrderHistory() {
    this.router.navigate(['/order-history']);
  }
  get finalTotal(): number {
  const subtotal = this.order?.total || this.order?.Total || 0;
  const tax = subtotal * 0.05;
  const delivery = subtotal > 0 ? 50 : 0;
  return subtotal + tax + delivery;
}
}