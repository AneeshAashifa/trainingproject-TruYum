import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartService } from '../services/cart.service';
import { OrdersService } from '../services/orders.service';
import { SignalrService } from '../services/signalr.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: any = { items: [] };
  displayedColumns: string[] = ['item', 'price', 'quantity', 'remove'];
  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private cartService: CartService,
    private ordersService: OrdersService,
    private signalr: SignalrService
  ) {}

  ngOnInit() {
    this.loadCart();

    // ✅ Live cart updates if logged in
    if (localStorage.getItem('token')) {
      this.signalr.startConnection(() => {
        this.signalr.on('CartUpdated', (payload) => {
          this.cart = payload;
        });
        this.signalr.on('OrderPlaced', (payload) => {
          alert(`✅ Order placed! Total: ₹${payload.total ?? payload.Total}`);
        });
      });
    }
  }

  // ✅ Total calculation
  get totalAmount(): number {
    if (!this.cart?.items) return 0;
    return this.cart.items.reduce((sum: number, item: any) => {
      const price = item.menuItem?.price || item.MenuItem?.Price || 0;
      const qty = item.quantity || item.Quantity || 0;
      return sum + price * qty;
    }, 0);
  }

  // ✅ Fetch cart from backend
  loadCart() {
    this.cartService.getCart().subscribe({
      next: (res) => (this.cart = res),
      error: (err) => console.error('Error fetching cart', err)
    });
  }

  // ✅ Increase quantity
  increase(item: any) {
    const id = item.menuItemId || item.MenuItemId;
    this.cartService.increaseQuantity(id).subscribe({
      next: () => this.loadCart(),
      error: (err) => alert('Failed to increase: ' + err.message)
    });
  }

  // ✅ Decrease quantity
  decrease(item: any) {
    const id = item.menuItemId || item.MenuItemId;
    this.cartService.decreaseQuantity(id).subscribe({
      next: () => this.loadCart(),
      error: (err) => alert('Failed to decrease: ' + err.message)
    });
  }

  // ✅ Remove item
  removeItem(item: any) {
    const id = item.menuItemId || item.MenuItemId;
    this.cartService.removeFromCart(id).subscribe({
      next: () => this.loadCart(),
      error: (err) => alert('Failed to remove: ' + err.message)
    });
  }

  // ✅ Checkout
  checkout() {
    this.ordersService.placeOrder().subscribe({
      next: (res: any) => {
        this.router.navigate(['/order-confirmation'], { state: { order: res } });
      },
      error: (err) => alert('Checkout failed: ' + err.message)
    });
  }

  ngOnDestroy() {
    // ✅ Clean SignalR listeners
    this.signalr.off('CartUpdated');
    this.signalr.off('OrderPlaced');
    this.subs.forEach((s) => s.unsubscribe());
  }
}
