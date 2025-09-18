import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
   categories: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error('❌ Failed to load categories', err)
    });
  }

  goToSearch(query: string) {
    const trimmed = (query || '').trim();
    const queryParams: any = {};
    if (trimmed) {
      queryParams.q = trimmed;
    }
    this.router.navigate(['/menu'], { queryParams });
  }

  imageForCategory(cat: any): string {
    if (cat?.imageUrl) {
      return cat.imageUrl;
    }
    const name: string = (cat?.name || '').toLowerCase();
    const base = 'assets/images/';
    const mapping: { keyword: string; file: string }[] = [
      { keyword: 'pizza', file: 'margherita-pizza.jpg' },
      { keyword: 'burger', file: 'paneer-burger.jpg' },
      { keyword: 'pasta', file: 'white-sauce-pasta.jpg' },
      { keyword: 'sandwich', file: 'veg-sandwich.jpg' },
      { keyword: 'fries', file: 'french-fries.jpg' },
      { keyword: 'nachos', file: 'nachos.jpg' },
      { keyword: 'garlic', file: 'garlic-bread.jpg' },
      { keyword: 'wings', file: 'chicken-wings.jpg' },
      { keyword: 'cake', file: 'black-forest-cake.jpg' },
      { keyword: 'tea', file: 'Lemon Iced Tea.jpg' },
      { keyword: 'coffee', file: 'cold-coffee.jpg' },
      { keyword: 'juice', file: 'fresh-juice.jpg' },
      { keyword: 'fresh', file: 'fresh-juice.jpg' },
      { keyword: 'beverage', file: 'beverage.jpg' },
      { keyword: 'starter', file: 'starter.jpg' },
      { keyword: 'snack', file: 'snack.jpg' },
      { keyword: 'main', file: 'maincourse.jpg' }
    ];
    const found = mapping.find(m => name.includes(m.keyword));
    return base + (found ? found.file : 'default-food.jpg');
  }

  goToMenu(categoryId?: string) {
    if (categoryId) {
      this.router.navigate(['/menu'], { queryParams: { categoryId } });
    } else {
      this.router.navigate(['/menu']);
    }
  }
}