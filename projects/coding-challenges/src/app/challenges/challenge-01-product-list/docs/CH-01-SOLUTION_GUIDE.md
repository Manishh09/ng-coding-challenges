# Challenge 01: Fetch Product List 

## 🧭 Solution Approach

This guide walks through the solution for Challenge 01 in **clear, logical steps**, explaining how to implement asynchronous data fetching from an API using **Angular + RxJS best practices**.

---

## Steps
1. Create Product Models (Interfaces)
2. Create a Product Service to Fetch API Data
3. Create the Product List Component
4. Create the Product List Template
5. Clear Up Subscriptions (Best Practice)

---

## ✅ Step 1: Create Product Models (Interfaces)

Define TypeScript interfaces for the expected API response types. This ensures **type safety** and **clean code**.

```ts
// product.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export interface Rating {
  rate: number;
  count: number;
}
```

These interfaces match the structure of products from the [FakeStore API](https://fakestoreapi.com/products).

---

## ✅ Step 2: Create a Service to Fetch API Data

### ServiceName: ProductService (product.service.ts)
**Purpose**: Encapsulate the HTTP request logic in a dedicated service.

```ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  ...
})
export class ProductService {
  // api url
  
  // inject http

  getProducts(): Observable<Product[]> {
    return this.#httpClient.get<Product[]>(this.#apiUrl);
  }
}
```

💡 The service is responsible for API interactions, making the component cleaner and more focused on UI concerns.

---

## ✅ Step 3: Create the Product List Component

```ts
 

@Component({
   ...
})
export class ProductListComponent implements OnInit, OnDestroy {
  // Store products data
  
  // Loading and error states 

  // Inject ProductService using the inject function  

  // Subject for subscription management
  #destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.#getProducts();
  }

  #getProducts() {
    this.loading = true;
    
    this.#productService.getProducts()
      .pipe(takeUntil(this.#destroy$))
      .subscribe({
        next: (products) => {
          // handle success, loading state
        },
        error: (err) => {
          // handle error, loading state
        }
      });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    ...
  }
}
```

💡 The component follows Single Responsibility Principle - it's only concerned with displaying the product list and handling component lifecycle.

---

## ✅ Step 4: Create the Product List Template

```html
<section class="product-list-container">
    <h2>Product List</h2>
    
    <!-- Loading state -->
    @if (loading) {
        ...
    }
    
    <!-- Error state -->
    @if (error) {
        ...
    }
    
    <!-- Data display -->
    @if (!loading && !error) {
        <div class="product-count">
            <p>Total Products: <strong>{{ productList.length }}</strong></p>
        </div>
        
        <table class="product-table">
            <thead>
                <tr>
                    <th>#</th>
                    ...
                </tr>
            </thead>
            <tbody>
                @for (product of productList; track product.id) {
                <tr>
                    <td>{{ product.id }}</td>
                    ....
                </tr>
                }
                @empty {
                <tr>
                    <td class="empty" colspan="5">No Products Available</td>
                </tr>
                }
            </tbody>
        </table>
    }
</section>
```

💡 The template handles all possible states (loading, error, empty data, and populated data) using Angular's modern control flow syntax.

---

## ✅ Step 5: Subscription Management (Best Practice)

### 💡 Why Clean Up Subscriptions?
Angular's Observable pattern requires proper cleanup to prevent memory leaks, especially when component instances are destroyed and recreated frequently.

### Option 1: Use `takeUntilDestroyed()` (Angular 16+)

The modern approach using Angular's built-in `DestroyRef`:

```ts
 

@Component({/* ... */})
export class ProductListComponent implements OnInit {
  // Inject services
  #productService = inject(ProductService);
  #destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.#productService.getProducts()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (products) => {
          this.productList = products;
        },
        // ...
      });
  }
}
```

### Option 2: Use `async` pipe (Declarative Approach)

A completely declarative approach that avoids manual subscription:

```ts
@Component({/* ... */})
export class ProductListComponent {
  // Inject service
  #productService = inject(ProductService);
  
  // Stream of products
  protected products$ = this.#productService.getProducts().pipe(
    catchError(err => {
      this.error = true;
      console.error('Error fetching products:', err);
      return of([]);
    })
  );
}
```

Template:
```html
@if (products$ | async as products;) {
  <div>
    <!-- Display products -->
  </div>
}

@if (loading) {
    <div class="loading-spinner">Loading products...</div>
}

@if (error) {
    <div class="error-message">Failed to load products. Please try again later.</div>
}

```
### Option 3: Use `Subject` + `takeUntil` (Pre-Angular 16)

The approach demonstrated in our solution:

```ts
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.#productService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.productList = products;
        },
        // ...
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## ✅ Alternative Approaches

### Signal-Based Approach (Angular 16+)

Using Angular's Signals for more reactive state management:

```ts
import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({/* ... */})
export class ProductListComponent {
  #productService = inject(ProductService);
  
  // State as signals
  protected products = signal<Product[]>([]);
  protected loading = signal(false);
  protected error = signal(false);
  
  constructor() {
    this.fetchProducts();
  }
  
  fetchProducts() {
    this.loading.set(true);
    this.error.set(false);
    
    this.#productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}
```

---

## ✅ Final Summary of Flow

1. User navigates to ProductListComponent
2. Component injects ProductService
3. On initialization, component calls getProducts()
4. Service makes HTTP GET request to FakeStore API
5. Component displays loading state while waiting
6. When data arrives, component updates UI with product data
7. If error occurs, component shows error message
8. On component destruction, subscriptions are cleaned up

---

## 📚 Additional Learning Resources

- [Angular HttpClient Documentation](https://angular.io/guide/http)
- [RxJS Observable Documentation](https://rxjs.dev/guide/observable)
- [Angular Signals](https://angular.io/guide/signals)
- [Subscription Management in Angular](https://angular.io/guide/rx-library#subscribing)