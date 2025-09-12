import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = 'http://localhost:5030/api/categories'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  add(cat: any): Observable<any> {
    return this.http.post(this.apiUrl, cat);
  }
  update(id: number, cat: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, cat);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}