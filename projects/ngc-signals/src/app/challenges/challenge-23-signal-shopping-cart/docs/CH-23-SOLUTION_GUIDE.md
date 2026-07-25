# Solution: Swiggy — Food Delivery Cart

## 🧠 Approach

Two source signals (`cartItems` and `couponCode`) feed a **chained pipeline** of `computed()` signals — each bill line depends on the one before it. This is the core pattern behind every e-commerce cart UI.

**Computed pipeline:**
```
cartItems (signal<CartItem[]>)
  ├─ itemCount  → sum of quantities
  ├─ isEmpty    → cartItems.length === 0
  └─ subtotal   → Σ (price × quantity)
       ├─ deliveryFee     → ₹40 or 0 if subtotal ≥ 299
       ├─ isDeliveryFree  → deliveryFee === 0
       ├─ cartSuggestion  → "₹X away" or "unlocked!"
       └─ couponDiscount  → 20% if code === 'SWIGGY20'  ← couponCode (signal)
            └─ discountedSubtotal → subtotal − discount
                 ├─ gst        → 5% of discountedSubtotal
                 └─ grandTotal → discounted + delivery + gst
                      └─ savings → discount + waived delivery
```

## 🚀 Step-by-Step Implementation

### Step 1: Cart Model

```typescript
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}
```

### Step 2: Source Signals

```typescript
cartItems = signal<CartItem[]>([]);
couponCode = signal<string>('');
```

### Step 3: Immutable Cart Operations

```typescript
addItem(menuItem: Omit<CartItem, 'quantity'>): void {
  this.cartItems.update(items => {
    const existing = items.find(i => i.id === menuItem.id);
    if (existing) {
      return items.map(i =>
        i.id === menuItem.id
          ? { ...i, quantity: Math.min(i.quantity + 1, 10) }
          : i
      );
    }
    return [...items, { ...menuItem, quantity: 1 }];
  });
}

updateQuantity(id: number, delta: number): void {
  this.cartItems.update(items =>
    items.map(i =>
      i.id === id
        ? { ...i, quantity: Math.max(1, Math.min(i.quantity + delta, 10)) }
        : i
    )
  );
}
```

**Key**: `addItem` checks `find()` first — if the item exists, it maps to increment the matching quantity; if not, it spreads a new item. Never mutates the original array.

### Step 4: Chained Computed Pipeline

```typescript
subtotal = computed(() =>
  this.cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0)
);

deliveryFee = computed(() =>
  this.subtotal() >= 299 ? 0 : 40
);

couponDiscount = computed(() => {
  if (this.couponCode().toUpperCase() === 'SWIGGY20') {
    return Math.round(this.subtotal() * 0.20);
  }
  return 0;
});

discountedSubtotal = computed(() =>
  this.subtotal() - this.couponDiscount()
);

gst = computed(() =>
  Math.round(this.discountedSubtotal() * 0.05)
);

grandTotal = computed(() =>
  this.discountedSubtotal() + this.deliveryFee() + this.gst()
);
```

Each `computed()` reads the previous computed — Angular tracks the full chain. Changing one cart item triggers: `cartItems → subtotal → deliveryFee, couponDiscount → discountedSubtotal → gst → grandTotal`.

### Step 5: Free Delivery Suggestion

```typescript
cartSuggestion = computed(() => {
  const sub = this.subtotal();
  if (sub === 0) return '';
  if (sub < 299) return `Add ₹${299 - sub} more for free delivery!`;
  return "You've unlocked FREE delivery!";
});
```

### Step 6: Template Bill Breakdown

```html
<div class="bill-row">
  <span>Delivery Fee</span>
  <span [class.strikethrough]="isDeliveryFree()">₹40</span>
  @if (isDeliveryFree()) {
    <span class="free-tag">FREE</span>
  }
</div>
```

The strikethrough and FREE tag are conditionally rendered from `isDeliveryFree()` — a computed that reads `deliveryFee()`.

## 🌟 Key Takeaways

* **Chained `computed()` is the pipeline pattern** — each stage derives from the previous, just like a spreadsheet formula chain.
* **Two source signals, one pipeline** — `couponCode` enters mid-chain at the discount stage.
* **`Math.round()` for currency** — avoid floating-point display issues in price calculations.
* **Merge-on-add prevents duplicates** — check `find()` before deciding to `map()` or `spread`.
* **Conditional `computed()`** (delivery fee) shows how business rules live inside the signal graph, not in imperative handlers.
