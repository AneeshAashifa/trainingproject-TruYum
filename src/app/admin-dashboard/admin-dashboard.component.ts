import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

import { AdminService } from '../services/admin.service';
import { AdminEditDialogComponent } from './admin-edit-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    AdminEditDialogComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'image',
    'name',
    'price',
    'category',
    'veg',
    'active',
    'actions'
  ];

  dataSource: any[] = [];
  originalData: any[] = [];
  isLoading = false;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  /** 🔹 Load all items */
  loadItems(): void {
    this.isLoading = true;
    this.adminService.getAll().subscribe({
      next: (res) => {
        this.originalData = res;
        this.dataSource = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snack.open('❌ Failed to load items', 'Close', { duration: 3000 });
      }
    });
  }

  /** 🔹 Search filter */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource = this.originalData.filter(el =>
      el.name.toLowerCase().includes(filterValue) ||
      el.category.toLowerCase().includes(filterValue)
    );
  }

  /** 🔹 Open Add Dialog */
  openAdd(): void {
    const ref = this.dialog.open(AdminEditDialogComponent, {
      data: { mode: 'add' },
      width: '520px'
    });

    ref.afterClosed().subscribe(r => {
      if (r?.saved) this.loadItems();
    });
  }

  /** 🔹 Open Edit Dialog */
  openEdit(item: any): void {
    const ref = this.dialog.open(AdminEditDialogComponent, {
      data: { mode: 'edit', item },
      width: '520px'
    });

    ref.afterClosed().subscribe(r => {
      if (r?.saved) this.loadItems();
    });
  }

  /** 🔹 Logout */
  logout(): void {
    localStorage.clear();
    this.snack.open('👋 Logged out successfully', 'Close', { duration: 2500 });
    this.router.navigate(['/admin-login']);
  }

  /** 🔹 Confirm Delete */
  confirmDelete(item: any): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: `Delete "${item.name}"?`
      },
      width: '400px'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.adminService.delete(item.id).subscribe({
          next: () => {
            this.snack.open('🗑 Item deleted', 'Close', { duration: 2500 });
            this.loadItems();
          },
          error: () => {
            this.snack.open('❌ Failed to delete', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}
