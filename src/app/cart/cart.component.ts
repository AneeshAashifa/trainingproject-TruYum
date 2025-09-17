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
import { ToastService } from '../services/toast.service';

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
    private signalr: SignalrService,
    private toastService: ToastService
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
          this.toastService.showSuccess(
            'Order Placed Successfully! 🎉',
            `Your order has been placed with a total of ₹${payload.total ?? payload.Total}`,
            4000
          );
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
      error: (err) => {
        if (err.status === 401) {
          this.toastService.showError('Please Sign In First! 🔐', 'You need to sign in to modify your cart.', 4000, true, 'Sign In', () => this.router.navigate(['/user-login']));
        } else {
          this.toastService.showError('Failed to Update', 'Could not increase quantity. Please try again.', 3000);
        }
      }
    });
  }

  // ✅ Decrease quantity
  decrease(item: any) {
    const id = item.menuItemId || item.MenuItemId;
    this.cartService.decreaseQuantity(id).subscribe({
      next: () => this.loadCart(),
      error: (err) => {
        if (err.status === 401) {
          this.toastService.showError('Please Sign In First! 🔐', 'You need to sign in to modify your cart.', 4000, true, 'Sign In', () => this.router.navigate(['/user-login']));
        } else {
          this.toastService.showError('Failed to Update', 'Could not decrease quantity. Please try again.', 3000);
        }
      }
    });
  }

  // ✅ Remove item
  removeItem(item: any) {
    const id = item.menuItemId || item.MenuItemId;
    const itemName = item.menuItem?.name || item.MenuItem?.Name || 'Item';
    
    this.cartService.removeFromCart(id).subscribe({
      next: () => {
        this.loadCart();
        this.toastService.showSuccess(
          'Item Removed Successfully! 🗑️',
          `${itemName} has been removed from your cart.`,
          3000
        );
      },
      error: (err) => {
        if (err.status === 401) {
          this.toastService.showError('Please Sign In First! 🔐', 'You need to sign in to modify your cart.', 4000, true, 'Sign In', () => this.router.navigate(['/user-login']));
        } else {
          this.toastService.showError('Failed to Remove', 'Could not remove item from cart. Please try again.', 3000);
        }
      }
    });
  }

  // ✅ Checkout
  checkout() {
    this.ordersService.placeOrder().subscribe({
      next: (res: any) => {
        this.router.navigate(['/order-confirmation'], { state: { order: res } });
      },
      error: (err) => {
        if (err.status === 401) {
          this.toastService.showError('Please Sign In First! 🔐', 'You need to sign in to place an order.', 4000, true, 'Sign In', () => this.router.navigate(['/user-login']));
        } else {
          this.toastService.showError('Checkout Failed', 'Could not place your order. Please try again.', 4000);
        }
      }
    });
  }

  // ✅ Image fallback for broken item images in cart
  onCartImgError(event: Event) {
    const img = event.target as HTMLImageElement | null;
    if (img && !img.dataset['fallback']) {
      img.src = 'assets/images/default-food.jpg';
      img.dataset['fallback'] = 'true';
    }
  }

  ngOnDestroy() {
    // ✅ Clean SignalR listeners
    this.signalr.off('CartUpdated');
    this.signalr.off('OrderPlaced');
    this.subs.forEach((s) => s.unsubscribe());
  }
}
