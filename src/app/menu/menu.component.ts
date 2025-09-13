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
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MatFormField } from '@angular/material/form-field';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ CommonModule,
    NgFor,
    NgIf,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatLabel,MatFormField
],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuItems: any[] = [];
  searchTerm = '';
  showFavouritesOnly = false;
  favourites: Set<number> = new Set();
  private menuApi = `${environment.apiUrl}/menu`;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private signalr: SignalrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      this.fetchMenu(category);
    });

    if (localStorage.getItem('token')) {
      this.signalr.startConnection();
    }
    const favs = localStorage.getItem('favourites');
    if (favs) {
      this.favourites = new Set(JSON.parse(favs));
    }
  }

  fetchMenu(category?: string) {
    let url = this.menuApi;
    if (category) url = `${this.menuApi}?category=${category}`;
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
  get filteredMenu() {
  return this.menuItems.filter(item => {
    const matchesSearch =
      !this.searchTerm ||
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(this.searchTerm.toLowerCase()));

    const matchesFavourite = !this.showFavouritesOnly || this.favourites.has(item.id);

    return matchesSearch && matchesFavourite;
  });
}
toggleFavourite(item:any){
    if (this.favourites.has(item.id)) {
    this.favourites.delete(item.id);
  } else {
    this.favourites.add(item.id);
  }

  // Save to localStorage so it persists
  localStorage.setItem('favourites', JSON.stringify([...this.favourites]));
  }
}