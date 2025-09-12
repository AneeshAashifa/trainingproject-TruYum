import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatButtonModule
  ],
  templateUrl: './admin-edit-dialog.component.html',
  styleUrls: ['./admin-edit-dialog.component.css']
})
export class AdminEditDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<AdminEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
      category: ['', Validators.required],
      veg: [true],
      imageUrl: [''],
      active: [true]
    });

    if (data?.mode === 'edit' && data.item) {
      this.form.patchValue(data.item);
    }
  }

  save() {
    if (this.form.invalid) return;
    const payload = { ...this.form.value };

    if (this.data.mode === 'add') {
      this.adminService.add(payload).subscribe({
        next: () => {
          this.snack.open('✅ Item added', 'Close', { duration: 2500 });
          this.dialogRef.close({ saved: true });
        },
        error: () => this.snack.open('❌ Failed to add', 'Close', { duration: 3000 })
      });
    } else {
      this.adminService.update(this.data.item.id, payload).subscribe({
        next: () => {
          this.snack.open('✏ Item updated', 'Close', { duration: 2500 });
          this.dialogRef.close({ saved: true });
        },
        error: () => this.snack.open('❌ Failed to update', 'Close', { duration: 3000 })
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}