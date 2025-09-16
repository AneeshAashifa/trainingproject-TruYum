import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastNotificationComponent],
  template: `
    <div class="toast-wrapper">
      <app-toast-notification
        *ngFor="let toast of toasts; trackBy: trackByToastId"
        [show]="true"
        [type]="toast.type"
        [title]="toast.title"
        [message]="toast.message"
        [duration]="toast.duration || 3000"
        [showAction]="toast.showAction || false"
        [actionText]="toast.actionText || 'Action'"
        (closed)="removeToast(toast.id)"
        (actionClicked)="handleActionClick(toast)"
      ></app-toast-notification>
    </div>
  `,
  styleUrls: ['./toast-container.component.css']
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeToast(id: string) {
    this.toastService.removeToast(id);
  }

  trackByToastId(index: number, toast: ToastMessage): string {
    return toast.id;
  }

  handleActionClick(toast: ToastMessage) {
    if (toast.actionCallback) {
      toast.actionCallback();
    }
    this.removeToast(toast.id);
  }
}
