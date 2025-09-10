import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../services/cart.service';
import { SignalrService } from '../services/signalr.service';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ CommonModule,
    NgFor,
    NgIf,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuItems: any[] = [];
  private menuApi = `${environment.apiUrl}/menu`;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private signalr: SignalrService
  ) {}

  ngOnInit() {
    this.fetchMenu();
    if (localStorage.getItem('token')) {
      this.signalr.startConnection();
    }
  }

  fetchMenu(category?: string) {
    let url = this.menuApi;
    if (category) url = `${this.menuApi}/category/${category}`;
    this.http.get<any[]>(url).subscribe({
      next: res => (this.menuItems = res),
      error: err => console.error('Error fetching menu:', err)
    });
  }

  addToCart(item: any) {
    this.cartService.addToCart(item.id).subscribe({
      next: () => {
        alert(`✅ Added ${item.name} to cart`);
      },
      error: err =>
        alert('❌ Failed to add: ' + (err.error || err.message))
    });
  }
}