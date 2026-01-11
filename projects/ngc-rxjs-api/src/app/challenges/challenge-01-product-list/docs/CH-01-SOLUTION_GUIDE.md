# Solution: Product List

## 🧠 Approach
The goal is to fetch data asynchronously. To do this cleanly in Angular, we follow the **"Observable Data Service"** pattern:
1.  **Service**: Handles the HTTP call and returns an `Observable`.
2.  **Component**: Requests the observable but *does not subscribe* manually.
3.  **Template**: Uses the `async` pipe to subscribe and unwrap the data automatically.

This approach prevents memory leaks and makes the code easier to read.

## 🚀 Step-by-Step Implementation

### Step 1: Define the Interface
We define a strong type to match the API response. This gives us autocomplete and error checking.

```typescript
export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: Rating;
}
```

### Step 2: Create the Service
The service wraps Angular's `HttpClient`. We keep the logic simple: just return the `get` call.

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://fakestoreapi.com/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
```

### Step 3: Implement the Component
The component exposes the observable to the template. We catch errors here to update the UI state.

```typescript
@Component({ ... })
export class ProductListComponent {
  private productService = inject(ProductService);

  // Define the stream
  products$: Observable<Product[]> = this.productService.getProducts().pipe(
    catchError(err => {
      this.errorMessage = 'Failed to load products';
      return of([]); // Return empty list on error
    })
  );

  errorMessage = ''; // If Asked in interview
}
```

### Step 4: The Template
We use logic blocks (`@if`, `@for`) and the `async` pipe.

```html
<section>
  <h2>Product List</h2>

  <!-- Error State -->
  <!-- If asked in interview -->
  @if (errorMessage) {
    <div class="error">{{ errorMessage }}</div>
  }

  <!-- Data Stream -->
  @if (products$ | async; as products) {
    <p>Total Products: {{ products.length }}</p>

    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        @for (product of products; track product.id) {
          <tr>
            <td>{{ product.title }}</td>
            <td>{{ product.price | currency }}</td>
            <td>{{ product.rating.rate }} ({{ product.rating.count }})</td>
          </tr>
        }
      </tbody>
    </table>
  } @else {
    <!-- Loading State (async returns null initially) -->
    <div class="loading">Loading products...</div>
  }
</section>
```

## 🌟 Best Practices Used
*   **Separation of Concerns**: The Component doesn't know *how* to fetch data, only *where* to get it.
*   **Async Pipe**: We avoided `.subscribe()` in the TS file, so we don't need `ngOnDestroy`.
*   **Declarative Pattern**: The data flow is defined as a stream (`products$`) rather than a sequence of imperative steps.
*   **New Control Flow**: `@if`, `@for`, `@empty` are new in Angular 17.
