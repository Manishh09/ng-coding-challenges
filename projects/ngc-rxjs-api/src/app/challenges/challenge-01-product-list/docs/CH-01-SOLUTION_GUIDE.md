# Challenge 01: Fetch Product List - Solution Guide

## Solution Approach

This guide walks through the solution for Challenge 01 in **clear, logical steps**, explaining how to implement asynchronous data fetching from an API using **Angular + RxJS best practices**.

---

## Steps Overview

1. Create Product Models (Interfaces)
2. Create a Product Service to Fetch API Data
3. Create the Product List Component
4. Create the Product List Template
5. Clean Up Subscriptions (Best Practice)

---

## Step 1: Define Product Interfaces

Create `product.ts` to define the product data structure:

```typescript
export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}
```

## Step 2: Create ProductService to Fetch Data

`product.service.ts` — Service to get products from API:

```typescript
// Import necessary Angular and RxJS modules
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// ... other imports

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiUrl = "API_ENDPOINT_URL";

  // inject http client using inject function
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    // Make HTTP GET request to fetch products
    return this.http.get<Product[]>(this.apiUrl);
  }
}
```

## Step 3: Build ProductListComponent

`product-list.component.ts` — Component to display products:

```typescript
// Import necessary Angular modules and RxJS operators
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
// ... other imports

@Component({
   /*Metadata*/
})
export class ProductListComponent implements OnInit, OnDestroy {



  private destroy$ = new Subject<void>();
  private productService = inject(ProductService);

  ngOnInit(): void {
    // Set loading state


    // Call service method to get products
    this.productService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          // Handle successful response
          //  Handle Loading State

        error: () => {
          // Handle error response

        }
      });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Step 4: Create ProductListComponent Template

`product-list.component.html`:

```html
<section>
  <h2>Product List</h2>

  <!-- Show loading state -->
  @if (loading) {
  <div>Loading products...</div>
  }

  <!-- Show error state -->
  @if (error) {
  <div>Failed to load products. Please try again later.</div>
  }

  <!-- Show empty state -->
  @if (!loading && !error && productList.length === 0) {
  <div>No Products Available</div>
  }

  <!-- Show products table when data is available -->
  @if (!loading && !error && productList.length > 0) {
  <table>
    <thead>
      <tr>
        <th>Column Headers</th>
        <!-- Add other column headers -->
      </tr>
    </thead>
    <tbody>
      <!-- Loop through products -->
      @for (product of productList; track product.id) {
      <tr>
        <td>{{ product.propertyName }}</td>
        <td>{{ product.price | currency }}</td>
        <!-- Display other product properties -->
      </tr>
      }
    </tbody>
  </table>
  }
</section>
```

## Summary

- Define **interfaces** to type API data
- Use a **service** (`ProductService`) to handle HTTP requests
- Use the modern **`inject()` function** for dependency injection instead of constructor injection
- Make components **standalone** for better modularity
- In your **component**, subscribe to the service's Observable, show loading, errors, and data
- Use **new control flow syntax** (`@if`, `@for`) instead of structural directives (`*ngIf`, `*ngFor`)
- Unsubscribe properly using `takeUntil` and `ngOnDestroy` to avoid memory leaks
- The template adjusts the UI based on loading, error, empty, or data states

---

## Working Flow

1. **User navigates** to ProductListComponent
2. **Component injects** ProductService
3. **On initialization**, component calls `getProducts()`
4. **Service makes** HTTP GET request to FakeStore API
5. **Component displays** loading state while waiting
6. **When data arrives**, component updates UI with product data
7. **If error occurs**, component shows error message
8. **On component destruction**, subscriptions are cleaned up

---
