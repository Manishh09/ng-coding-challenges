// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly categoriesUrl = 'https://fakestoreapi.com/products/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(this.categoriesUrl).pipe(
      catchError(() => {
        // Return fallback categories if API fails
        return of([]);
      })
    );
  }
}
