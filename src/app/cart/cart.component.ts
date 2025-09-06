import { Component, OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { OrdersService } from '../services/orders.service';
import { SignalrService } from '../services/signalr.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cart: any = {items:[] } ;
  private subs: Subscription[] = [];
  constructor(private router: Router,private cartService: CartService, private ordersService: OrdersService, private signalr: SignalrService) {}

  ngOnInit() {
    this.loadCart();
    if (localStorage.getItem('token')) {
      this.signalr.startConnection(() => {
        this.signalr.on('CartUpdated', (payload) => { this.cart = payload; });
        this.signalr.on('OrderPlaced', (payload) => {
          alert(`✅ Order placed! Total: ₹${payload.total ?? payload.Total ?? payload.TotalAmount ?? ''}`);
        });
      });
    }
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: res => this.cart = res,
      error: err => console.error('Error fetching cart', err)
    });
  }

  removeItem(menuItemId: number) {
    this.cartService.removeFromCart(menuItemId).subscribe({
      next: () => {},
      error: err => alert('Failed to remove: ' + err.message)
    });
  }

  placeOrder() {
    this.ordersService.placeOrder().subscribe({
      next: (res: any) => { alert('✅ Order placed! Total: ₹' + res.total || res.Total); this.cart = { items: [] }; },
      error: err => alert('Failed to place order: ' + err.message)
    });
  }

  ngOnDestroy() {
    this.signalr.off('CartUpdated');
    this.signalr.off('OrderPlaced');
  }

}
