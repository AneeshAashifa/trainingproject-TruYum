import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { OrdersService } from '../services/orders.service';
import { SignalrService } from '../services/signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule
],
  templateUrl: './cart.component.html',
   styleUrls: ['./cart.component.css']

})
export class CartComponent implements OnInit {
   cart: any = { items: [] };
  displayedColumns: string[] = ['name', 'price', 'quantity', 'remove'];
  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private cartService: CartService,
    private ordersService: OrdersService,
    private signalr: SignalrService
  ) {}

  ngOnInit() {
    this.loadCart();
    if (localStorage.getItem('token')) {
      this.signalr.startConnection(() => {
        this.signalr.on('CartUpdated', (payload) => { this.cart = payload; });
        this.signalr.on('OrderPlaced', (payload) => {
          alert(`✅ Order placed! Total: ₹${payload.total ?? payload.Total}`);
        });
      });
    }
  }

  get totalAmount(): number {
    if (!this.cart?.items) return 0;
    return this.cart.items.reduce((sum: number, item: any) => {
      const price = item.menuItem?.price || item.MenuItem?.Price || 0;
      const qty = item.quantity || item.Quantity || 0;
      return sum + price * qty;
    }, 0);
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: res => this.cart = res,
      error: err => console.error('Error fetching cart', err)
    });
  }

  increase(item: any) {
    this.cartService.increaseQuantity(item.menuItemId || item.MenuItemId).subscribe({
      next: () => this.loadCart(),
      error: err => alert('Failed to increase: ' + err.message)
    });
  }

  decrease(item: any) {
    this.cartService.decreaseQuantity(item.menuItemId || item.MenuItemId).subscribe({
      next: () => this.loadCart(),
      error: err => alert('Failed to decrease: ' + err.message)
    });
  }

  removeItem(menuItemId: number) {
    this.cartService.removeFromCart(menuItemId).subscribe({
      next: () => this.loadCart(),
      error: err => alert('Failed to remove: ' + err.message)
    });
  }

  checkout() {
    this.ordersService.placeOrder().subscribe({
      next: (res: any) => {
        this.router.navigate(['/order-confirmation'], { state: { order: res } });
      },
      error: err => alert('Checkout failed: ' + err.message)
    });
  }

  ngOnDestroy() {
    this.signalr.off('CartUpdated');
    this.signalr.off('OrderPlaced');
  }
}