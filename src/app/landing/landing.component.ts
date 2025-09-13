import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
   categories: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error('❌ Failed to load categories', err)
    });
  }

  goToMenu(categoryId?: string) {
    if (categoryId) {
      this.router.navigate(['/menu'], { queryParams: { categoryId } });
    } else {
      this.router.navigate(['/menu']);
    }
  }
}