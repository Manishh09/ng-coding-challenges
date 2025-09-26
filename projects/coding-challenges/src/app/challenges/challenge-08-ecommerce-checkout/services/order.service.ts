import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Order, PaymentStatus } from '../models/order.model';
import { Payment } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiURL = 'https://fakestoreapi.com/carts';

  private http = inject(HttpClient);

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiURL, order);
  }

  processPayment(orderId: number): Observable<Payment> {
    // Mock payment
    return of({ id: 1, orderId, amount: 100, status: 'completed' });
  }
}
