import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoryService } from '../services/category.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './category-edit-dialog.component.html',
  styleUrls: ['./category-edit-dialog.component.css']
})
export class CategoryEditDialogComponent implements OnInit {
  form!: FormGroup;
  mode: 'add' | 'edit' = 'add';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private svc: CategoryService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    // ✅ Initialize form inside ngOnInit
    this.mode = this.data?.mode || 'add';
    this.form = this.fb.group({
      name: [this.data?.category?.name || '', Validators.required],
      active: [this.data?.category?.active ?? true]
    });
  }

  save(): void {
    if (this.form.invalid) return;
    const payload = { ...this.form.value };

    if (this.mode === 'add') {
      this.svc.add(payload).subscribe({
        next: () => {
          this.snack.open('Category added', 'Close', { duration: 2000 });
          this.dialogRef.close({ saved: true });
        },
        error: err => {
          this.snack.open(
            'Failed to add: ' + (err?.error || err?.message || ''),
            'Close',
            { duration: 3000 }
          );
          console.error(err);
        }
      });
    } else {
      const id = this.data.category.id;
      this.svc.update(id, payload).subscribe({
        next: () => {
          this.snack.open('Category updated', 'Close', { duration: 2000 });
          this.dialogRef.close({ saved: true });
        },
        error: err => {
          this.snack.open(
            'Failed to update: ' + (err?.error || err?.message || ''),
            'Close',
            { duration: 3000 }
          );
          console.error(err);
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}