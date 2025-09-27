import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiURL = 'https://fakestoreapi.com/products';

  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL);
  }

  updateInventory(productId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiURL}/${productId}`, { stock: quantity });
  }
}
