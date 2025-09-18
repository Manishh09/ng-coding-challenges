import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, shareReplay } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categories$!: Observable<Category[]>;

  private readonly http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    if (!this.categories$) {
      this.categories$ = this.http.get<string[]>('https://fakestoreapi.com/products/categories').pipe(
        map((categories: string[]) =>
          categories.map((name, index) => ({ id: index + 1, name }))
        ),
        tap(() => console.log('HTTP request triggered to fetch categories')),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
    return this.categories$;
  }
}

// shareReplay(1) will keep the subscription alive even when there are no subscribers, which might not be desired in all scenarios.
// shareReplay({ bufferSize: 1, refCount: true }) will unsubscribe from the source observable when there are no subscribers, which can be more efficient in certain cases.
