import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  menuItems: any[] = [];
  newItem: any = { name: '', description: '', price: 0, category: 'Beverage', active: true, imageUrl: '' };
  editingItem: any = null; // ✅ holds the item being edited
  private apiUrl = 'http://localhost:5030/api/menu';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchMenu();
  }

  // ✅ Fetch all menu items
  fetchMenu() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => (this.menuItems = res),
      error: (err) => console.error('❌ Error fetching menu', err)
    });
  }

  // ✅ Add new item
  addMenuItem() {
    this.http.post(this.apiUrl, this.newItem).subscribe({
      next: () => {
        alert('✅ Item added');
        this.fetchMenu();
        this.newItem = { name: '', description: '', price: 0, category: 'Beverage', active: true, imageUrl: '' };
      },
      error: (err) => alert('❌ Failed to add: ' + JSON.stringify(err.error))
    });
  }

  // ✅ Enable edit mode
  editMenuItem(item: any) {
    this.editingItem = { ...item }; // clone so we don’t edit live
  }

  // ✅ Save edited item
  updateMenuItem() {
    this.http.put(`${this.apiUrl}/${this.editingItem.category}/${this.editingItem.id}`, this.editingItem).subscribe({
      next: () => {
        alert('✏️ Item updated');
        this.fetchMenu();
        this.editingItem = null;
      },
      error: (err) => alert('❌ Failed to update: ' + JSON.stringify(err.error))
    });
  }

  // ✅ Cancel edit mode
  cancelEdit() {
    this.editingItem = null;
  }

  // ✅ Delete item
  deleteMenuItem(item: any) {
    this.http.delete(`${this.apiUrl}/${item.category}/${item.id}`).subscribe({
      next: () => {
        alert('🗑️ Item deleted');
        this.fetchMenu();
      },
      error: (err) => alert('❌ Failed to delete: ' + JSON.stringify(err.error))
    });
  }
}
