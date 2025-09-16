import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="toast-container" [class.show]="show" [class.success]="type === 'success'" [class.error]="type === 'error'">
      <div class="toast-content">
        <div class="toast-icon">
          <mat-icon *ngIf="type === 'success'">check_circle</mat-icon>
          <mat-icon *ngIf="type === 'error'">error</mat-icon>
          <mat-icon *ngIf="type === 'info'">info</mat-icon>
        </div>
        <div class="toast-message">
          <div class="toast-title">{{ title }}</div>
          <div class="toast-description">{{ message }}</div>
          <button *ngIf="showAction" mat-button class="toast-action" (click)="onActionClick()">
            {{ actionText }}
          </button>
        </div>
        <button mat-icon-button class="toast-close" (click)="onClose()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div class="toast-progress" [class.active]="show"></div>
    </div>
  `,
  styleUrls: ['./toast-notification.component.css']
})
export class ToastNotificationComponent implements OnInit {
  @Input() show = false;
  @Input() type: 'success' | 'error' | 'info' = 'success';
  @Input() title = '';
  @Input() message = '';
  @Input() duration = 3000;
  @Input() showAction = false;
  @Input() actionText = 'Sign In';
  @Output() closed = new EventEmitter<void>();
  @Output() actionClicked = new EventEmitter<void>();

  ngOnInit() {
    if (this.show && this.duration > 0) {
      setTimeout(() => {
        this.onClose();
      }, this.duration);
    }
  }

  onClose() {
    this.show = false;
    this.closed.emit();
  }

  onActionClick() {
    this.actionClicked.emit();
  }
}
