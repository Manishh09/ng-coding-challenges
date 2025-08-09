import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
 
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  #apiUrl = 'https://fakestoreapi.com/products';

  #httpClient = inject(HttpClient)

  getProducts(): Observable<Product[]> {
    return this.#httpClient.get<Product[]>(this.#apiUrl);
  }
}
