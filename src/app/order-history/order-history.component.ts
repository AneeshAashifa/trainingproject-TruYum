import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  displayedColumns: string[] = ['id', 'date', 'total', 'status', 'items'];

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.history().subscribe({
      next: (res: any) => {
        const getId = (o: any) => Number(o?.id ?? o?.Id ?? 0);
        this.orders = (res || []).slice().sort((a: any, b: any) => getId(a) - getId(b));
      },
      error: (err) => console.error('❌ Failed to fetch order history', err)
    });
  }

  getFinalTotal(order: any): number {
    const subtotal = order?.total ?? order?.Total ?? 0;
    const tax = subtotal * 0.05;
    const delivery = subtotal > 0 ? 50 : 0;
    return subtotal + tax + delivery;
  }
}