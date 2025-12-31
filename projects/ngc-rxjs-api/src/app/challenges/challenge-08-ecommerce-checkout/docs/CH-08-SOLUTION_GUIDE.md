# Solution: Sequential Checkout

## 🧠 Approach
We need strict ordering: A -> B -> C.
1.  **Service**: 3 separate methods.
2.  **Component**:
    *   Trigger `checkout()`.
    *   Use `concatMap`.
    *   `Order API` -> `concatMap` -> `Inventory API` -> `concatMap` -> `Payment API`.

## 🚀 Step-by-Step Implementation

### Step 1: Define the Interface
```typescript
interface Order { id: number; total: number; }
```

### Step 2: Create the Service
```typescript
@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private http = inject(HttpClient);
  createOrder(cart: any) { return this.http.post<Order>('api/order', cart); }
  reserveInventory(orderId: number) { return this.http.post('api/inventory', { orderId }); }
  processPayment(orderId: number) { return this.http.post('api/pay', { orderId }); }
}
```

### Step 3: Implement the Component (The Chain)
```typescript
@Component({ ... })
export class CheckoutComponent {
  private service = inject(CheckoutService);
  status = signal('Idle');

  checkout() {
    this.status.set('Creating Order...');

    this.service.createOrder({ items: [] }).pipe(
      // Step 2: Order Created -> Reserve
      tap(() => this.status.set('Reserving Inventory...')),
      concatMap(order => this.service.reserveInventory(order.id).pipe(map(() => order))),

      // Step 3: Reserved -> Pay
      tap(() => this.status.set('Processing Payment...')),
      concatMap(order => this.service.processPayment(order.id))
    ).subscribe({
      next: () => this.status.set('Order Placed Successfully! ✅'),
      error: (err) => this.status.set('Checkout Failed ❌: ' + err.message)
    });
  }
}
```

### Step 4: The Template
```html
<button (click)="checkout()" mat-raised-button color="primary">Place Order</button>
<div class="status-box">
  <h3>Status: {{ status() }}</h3>
</div>
```

## 🌟 Best Practices Used
*   **concatMap**: The strict enforcer. It waits for the inner Observable to complete before subscribing to the next one.
*   **tap**: Used for side-effects (like updating the UI text) without affecting the data stream.
*   **Error Handling**: If `createOrder` fails, the `concatMap` simply never runs, and the `error` block in `subscribe` catches it immediately.
