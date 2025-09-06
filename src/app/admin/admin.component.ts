import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  menuItems: any[] = [];
  newItem: any = { name: '', description: '', price: 0, category: 'beverages', active: true, imageUrl: '' };
  private apiUrl = 'https://localhost:7208/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchMenu();
  }

  fetchMenu() {
    this.http.get<any[]>(`${this.apiUrl}/menu`).subscribe({
      next: (res) => (this.menuItems = res),
      error: (err) => console.error('Error fetching menu', err)
    });
  }

  addMenuItem() {
    let endpoint = '';
    switch (this.newItem.category) {
      case 'beverages': endpoint = '/beverages'; break;
      case 'starters': endpoint = '/starters'; break;
      case 'maincourses': endpoint = '/maincourses'; break;
      case 'snacks': endpoint = '/snacks'; break;
    }
    this.http.post(`${this.apiUrl}${endpoint}`, this.newItem).subscribe({
      next: () => {
        alert('✅ Item added');
        this.fetchMenu();
        this.newItem = { name: '', description: '', price: 0, category: 'beverages', active: true, imageUrl: '' };
      },
      error: (err) => alert('❌ Failed to add: ' + err.error)
    });
  }

  deleteMenuItem(item: any) {
    let endpoint = '';
    switch (item.category?.toLowerCase()) {
      case 'beverage': endpoint = '/beverages'; break;
      case 'starter': endpoint = '/starters'; break;
      case 'maincourse': endpoint = '/maincourses'; break;
      case 'snack': endpoint = '/snacks'; break;
    }
    this.http.delete(`${this.apiUrl}${endpoint}/${item.id}`).subscribe({
      next: () => {
        alert('🗑️ Item deleted');
        this.fetchMenu();
      },
      error: (err) => alert('❌ Failed to delete: ' + err.error)
    });
  }
}
