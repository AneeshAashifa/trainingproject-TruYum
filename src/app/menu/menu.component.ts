import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../services/cart.service';
import { SignalrService } from '../services/signalr.service';
import { ToastService } from '../services/toast.service';
import { environment } from '../../environments/environments';
import { ActivatedRoute, Router } from '@angular/router';
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
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const categoryId = params['categoryId'];
      this.fetchMenu(categoryId);
    });

    if (localStorage.getItem('token')) {
      this.signalr.startConnection();
    }
    const favs = localStorage.getItem('favourites');
    if (favs) {
      this.favourites = new Set(JSON.parse(favs));
    }
  }

  fetchMenu(categoryId?: string) {
    let url = this.menuApi;
    if (categoryId) url = `${this.menuApi}?categoryId=${categoryId}`;
    this.http.get<any[]>(url).subscribe({
      next: res => (this.menuItems = res),
      error: err => console.error('Error fetching menu:', err)
    });
  }
  addToCart(item: any) {
    this.cartService.addToCart(item.id).subscribe({
      next: () => {
        this.toastService.showSuccess(
          'Added to Cart! 🛒',
          `${item.name} has been added to your cart successfully.`,
          3000
        );
      },
      error: err => {
        // Check if it's an authentication error (401 Unauthorized)
        if (err.status === 401) {
          this.toastService.showError(
            'Please Sign In First! 🔐',
            'You need to sign in to add items to your cart. Please sign up or log in to continue.',
            5000,
            true,
            'Sign In',
            () => this.router.navigate(['/user-login'])
          );
        } else {
          this.toastService.showError(
            'Failed to Add Item',
            'Something went wrong. Please try again.',
            4000
          );
        }
      }
    });
  }
  resolveItemImage(item: any): string {
    if (item?.imageUrl) {
      return item.imageUrl;
    }
    const slugify = (v: string) => (v || '')
      .toLowerCase()
      .replace(/&/g,' and ')
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'');
    const name: string = (item?.name || '').toLowerCase();
    const category: string = (item?.categoryName || '').toLowerCase();
    const base = 'assets/images/';
    // Prefer a file that matches the item name, then category
    const nameFile = `${slugify(item?.name)}.jpg`;
    const catFile = `${slugify(item?.categoryName)}.jpg`;
    // Try name/category convention first. If not present, fall back to keyword map
    const tryConventional = name ? base + nameFile : (category ? base + catFile : '');
    const mapping: { keyword: string; file: string }[] = [
      { keyword: 'pizza', file: 'margherita-pizza.jpg' },
      { keyword: 'margherita', file: 'margherita-pizza.jpg' },
      { keyword: 'veggie', file: 'veggie-supreme-pizza.jpg' },
      { keyword: 'supreme', file: 'veggie-supreme-pizza.jpg' },
      { keyword: 'burger', file: 'paneer-burger.jpg' },
      { keyword: 'pasta', file: 'white-sauce-pasta.jpg' },
      { keyword: 'sandwich', file: 'veg-sandwich.jpg' },
      { keyword: 'fries', file: 'french-fries.jpg' },
      { keyword: 'nachos', file: 'nachos.jpg' },
      { keyword: 'garlic', file: 'garlic-bread.jpg' },
      { keyword: 'wings', file: 'chicken-wings.jpg' },
      { keyword: 'chicken wings', file: 'chicken-wings.jpg' },
      { keyword: 'cake', file: 'black-forest-cake.jpg' },
      { keyword: 'tea', file: 'Lemon Iced Tea.jpg' },
      { keyword: 'coffee', file: 'cold-coffee.jpg' },
      { keyword: 'beverage', file: 'beverage.jpg' },
      { keyword: 'starter', file: 'starter.jpg' },
      { keyword: 'snack', file: 'snack.jpg' },
      { keyword: 'main', file: 'maincourse.jpg' },
      { keyword: 'watermelon', file: 'beverage.jpg' },
      { keyword: 'water melon', file: 'beverage.jpg' },
      { keyword: 'melon', file: 'beverage.jpg' }
    ];
    const hay = `${name} ${category}`;
    const found = mapping.find(m => hay.includes(m.keyword));
    return tryConventional || (base + (found ? found.file : 'default-food.jpg'));
  }
  handleImgError(event: Event) {
    const img = event.target as HTMLImageElement | null;
    if (img && !img.dataset['fallback']) {
      img.src = 'assets/images/default-food.jpg';
      img.dataset['fallback'] = 'true';
    }
  }
  get filteredMenu() {
  return this.menuItems.filter(item => {
    const matchesSearch =
      !this.searchTerm ||
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
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