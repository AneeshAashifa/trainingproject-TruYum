import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class SignalrService {
  private hubConnection?: signalR.HubConnection;

  startConnection(onStart?: () => void, onClose?: (err?: any) => void) {
    const token = localStorage.getItem('token') || '';
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiBase}/hubs/notifications`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => { console.log('SignalR connected'); if (onStart) onStart(); })
      .catch(err => { console.error('SignalR start error', err); });

    if (onClose && this.hubConnection) {
      this.hubConnection.onclose(onClose);
    }
  }

  stopConnection() {
    return this.hubConnection ? this.hubConnection.stop() : Promise.resolve();
  }

  on<T = any>(eventName: string, callback: (payload: T) => void) {
    this.hubConnection?.on(eventName, callback);
  }

  off(eventName: string) {
    this.hubConnection?.off(eventName);
  }
}