import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
  showAction?: boolean;
  actionText?: string;
  actionCallback?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  showSuccess(title: string, message: string, duration: number = 3000) {
    this.addToast({
      id: this.generateId(),
      type: 'success',
      title,
      message,
      duration
    });
  }

  showError(title: string, message: string, duration: number = 4000, showAction: boolean = false, actionText: string = 'Action', actionCallback?: () => void) {
    this.addToast({
      id: this.generateId(),
      type: 'error',
      title,
      message,
      duration,
      showAction,
      actionText,
      actionCallback
    });
  }

  showInfo(title: string, message: string, duration: number = 3000) {
    this.addToast({
      id: this.generateId(),
      type: 'info',
      title,
      message,
      duration
    });
  }

  private addToast(toast: ToastMessage) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);
  }

  removeToast(id: string) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }

  clearAll() {
    this.toastsSubject.next([]);
  }
}
