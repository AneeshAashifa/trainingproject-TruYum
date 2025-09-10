import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart(): Observable<any> { return this.http.get(this.apiUrl); }
  addToCart(menuItemId: number) { return this.http.post(`${this.apiUrl}/add/${menuItemId}`, {}); }
  removeFromCart(menuItemId: number) { return this.http.delete(`${this.apiUrl}/remove/${menuItemId}`); }
  increaseQuantity(menuItemId: number) { return this.http.post(`${this.apiUrl}/increase/${menuItemId}`, {}); }
  decreaseQuantity(menuItemId: number) { return this.http.post(`${this.apiUrl}/decrease/${menuItemId}`, {}); }
}