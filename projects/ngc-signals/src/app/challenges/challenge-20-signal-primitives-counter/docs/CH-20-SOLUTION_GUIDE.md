# Solution: BookMyShow — Movie Seat Selector

## 🧠 Approach

Use Angular's three signal primitives to build a fully reactive seat selector with **zero RxJS**:

1. **`signal()`** — mutable state for seat count.
2. **`computed()`** — derived pricing and boundary flags.
3. **`effect()`** — analytics side-effect logging.

## 🚀 Step-by-Step Implementation

### Step 1: Define the Mutable State

```typescript
private readonly PRICE_PER_SEAT = 250;
private readonly MIN_SEATS = 1;
private readonly MAX_SEATS = 10;

seats = signal<number>(this.MIN_SEATS);
```

`signal<number>(1)` creates a writable signal. Read with `seats()`, write with `seats.set()` or `seats.update()`.

### Step 2: Derive State with `computed()`

```typescript
totalPrice = computed(() => this.seats() * this.PRICE_PER_SEAT);
isAtMin   = computed(() => this.seats() <= this.MIN_SEATS);
isAtMax   = computed(() => this.seats() >= this.MAX_SEATS);

priceBreakdown = computed(() => ({
  seats: this.seats(),
  pricePerSeat: this.PRICE_PER_SEAT,
  total: this.totalPrice()
}));
```

`computed()` signals are **read-only** and **lazy** — they only recalculate when a dependency changes and are read.

### Step 3: Implement Clamped Updates

```typescript
increment(): void {
  this.seats.update(s => Math.min(s + 1, this.MAX_SEATS));
}

decrement(): void {
  this.seats.update(s => Math.max(s - 1, this.MIN_SEATS));
}

reset(): void {
  this.seats.set(this.MIN_SEATS);
}
```

Using `Math.min`/`Math.max` inside `update()` guarantees the value stays within bounds without extra conditional logic.

### Step 4: Add the Analytics Effect

```typescript
constructor() {
  effect(() => {
    console.log('📊 [Analytics]', {
      seatsSelected: this.seats(),
      totalPrice: this.totalPrice(),
      timestamp: new Date().toISOString()
    });
  });
}
```

`effect()` auto-tracks which signals are read inside it and re-runs whenever those signals change. It fires once immediately on creation.

### Step 5: Bind in the Template

```html
<!-- Counter with boundary-disabled buttons -->
<button [disabled]="isAtMin()" (click)="decrement()">−</button>
<span>{{ seats() }}</span>
<button [disabled]="isAtMax()" (click)="increment()">+</button>

<!-- Reactive price breakdown -->
<td>{{ priceBreakdown().total | currency:'INR' }}</td>

<!-- Proceed button with validation -->
<button [disabled]="seats() < 1 || totalPrice() <= 0">
  Proceed to Pay
</button>
```

Signal values are read in templates using `()` — Angular's change detection picks up changes automatically.

## 🌟 Key Takeaways

* **No subscriptions, no `async` pipe** — signals are synchronous and template-friendly.
* **`update()` for relative changes**, **`set()` for absolute values** — choose the right method.
* **`computed()` is lazy and cached** — it won't recalculate unless dependencies change.
* **`effect()` is for side effects only** — never use it to set other signals (use `computed()` instead).
* **Boundary logic inside `update()`** eliminates scattered `if` checks across the component.
