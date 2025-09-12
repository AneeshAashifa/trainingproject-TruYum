import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = `${environment.apiUrl}/menu`;

  constructor(private http: HttpClient) {}

  getAll(category?: string): Observable<any[]> {
    const url = category ? `${this.base}?category=${category}` : this.base;
    return this.http.get<any[]>(url);
  }

  getById(id: number) {
    return this.http.get(`${this.base}/${id}`);
  }

  add(item: any) {
    return this.http.post(this.base, item);
  }

  update(id: number, item: any) {
    return this.http.put(`${this.base}/${id}`, item);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}