// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> { return this.http.get<any[]>(this.api); }
  add(payload: any) { return this.http.post(this.api, payload); }
  update(id: number, payload: any) { return this.http.put(`${this.api}/${id}`, payload); }
  delete(id: number) { return this.http.delete(`${this.api}/${id}`); }
}