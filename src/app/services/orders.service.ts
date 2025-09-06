import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder() { return this.http.post(`${this.apiUrl}/place`, {}); }
  history() { return this.http.get(`${this.apiUrl}/history`); }
}