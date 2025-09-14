import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryService } from '../services/category.service';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
 // optional typed interface if you have
import { CategoryEditDialogComponent } from './category-edit-dialog.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatToolbarModule,
    CategoryEditDialogComponent
  ],
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {
  categories: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'actions'];
  isLoading = false;
  search = '';

  constructor(
    private svc: CategoryService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.svc.getAll().subscribe({
      next: res => { this.categories = res || []; this.isLoading = false; },
      error: err => { this.isLoading = false; this.snack.open('Failed to load categories', 'Close', { duration: 3000 }); console.error(err); }
    });
  }

  filtered(): any[] {
    const q = (this.search || '').toLowerCase().trim();
    if (!q) return this.categories;
    return this.categories.filter(c => (c.name || '').toLowerCase().includes(q));
  }

  openAdd(): void {
    const ref = this.dialog.open(CategoryEditDialogComponent, { width: '420px', data: { mode: 'add' } });
    ref.afterClosed().subscribe(r => { if (r?.saved) { this.snack.open('Category added', 'Close', { duration: 2000 }); this.load(); }});
  }

  openEdit(cat: any): void {
    const ref = this.dialog.open(CategoryEditDialogComponent, { width: '420px', data: { mode: 'edit', category: cat } });
    ref.afterClosed().subscribe(r => { if (r?.saved) { this.snack.open('Category updated', 'Close', { duration: 2000 }); this.load(); }});
  }

  delete(cat: any): void {
    if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
    this.svc.delete(cat.id).subscribe({
      next: () => { this.snack.open('Category deleted', 'Close', { duration: 2000 }); this.load(); },
      error: err => { this.snack.open('Failed to delete: ' + (err?.error || err?.message || ''), 'Close', { duration: 3000 }); console.error(err); }
    });
  }
}