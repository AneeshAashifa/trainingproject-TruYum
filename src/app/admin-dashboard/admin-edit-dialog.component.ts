import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../services/admin.service';
import { MatOptionModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-admin-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-edit-dialog.component.html',
  styleUrls: ['./admin-edit-dialog.component.css']
})
export class AdminEditDialogComponent implements OnInit {
  form: FormGroup;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snack: MatSnackBar,
    private http: HttpClient,
    private dialogRef: MatDialogRef<AdminEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: [data?.item?.name || '', Validators.required],
      description: [data?.item?.description || ''],
      price: [data?.item?.price || 0, Validators.required],
      categoryId: [data?.item?.categoryId || null, Validators.required],
      veg: [data?.item?.veg ?? true],
      imageUrl: [data?.item?.imageUrl || ''],
      active: [data?.item?.active ?? true]
    });
  }

  ngOnInit(): void {
    // ✅ Fetch categories from API
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe({
      next: res => (this.categories = res),
      error: err => {
        console.error('Failed to load categories:', err);
        this.snack.open('❌ Failed to load categories', 'Close', { duration: 3000 });
      }
    });
  }

  save() {
    if (this.form.invalid) return;

    const payload = { ...this.form.value };

    if (this.data.mode === 'add') {
      this.adminService.add(payload).subscribe({
        next: () => {
          this.snack.open('✅ Item added successfully', 'Close', { duration: 3000 });
          this.dialogRef.close({ saved: true });
        },
        error: () => this.snack.open('❌ Failed to add item', 'Close', { duration: 3000 })
      });
    } else {
      this.adminService.update(this.data.item.id, payload).subscribe({
        next: () => {
          this.snack.open('✏ Item updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close({ saved: true });
        },
        error: () => this.snack.open('❌ Failed to update item', 'Close', { duration: 3000 })
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}