# Solution: MakeMyTrip — Flight Booking Signal Store

## 🧠 Approach

Build a **custom signal store** — the same pattern NgRx SignalStore uses internally:
- Private writable `signal` (the single source of truth)
- Public `asReadonly()` exposure (consumers can read, not write)
- `computed()` selectors for derived state
- Named action methods for all mutations

```
BookingStore (Injectable service)
├── _state (private signal<BookingState>)
├── state = _state.asReadonly()           ← public readonly
├── selectedFlight = computed(...)        ← selector
├── travellers = computed(...)            ← selector
├── fareBreakdown = computed(...)         ← derived from flight + travellers + promo
├── isBookingValid = computed(...)        ← guards navigation
├── selectFlight(flight)                  ← action
├── addTraveller(t) / removeTraveller(id) ← actions
├── applyPromoCode(code)                  ← action
├── setPaymentStatus(status)              ← action
├── bookingSnapshot() / rollback()        ← snapshot pattern
└── reset()                               ← clear all state
```

## 🚀 Step-by-Step Implementation

### Step 1: Define the State Shape

```typescript
export interface BookingState {
  selectedFlight: Flight | null;
  travellers: Traveller[];
  promoCode: string;
  promoDiscount: number;
  paymentStatus: PaymentStatus;
}
```

### Step 2: Private Signal + Readonly

```typescript
@Injectable({ providedIn: 'root' })
export class BookingStore {
  private _state = signal<BookingState>({ ...INITIAL_STATE });
  readonly state = this._state.asReadonly();
```

`asReadonly()` returns a `Signal<T>` (not `WritableSignal<T>`) — consumers can call `state()` to read, but cannot call `set()` or `update()`.

### Step 3: Computed Selectors

```typescript
readonly selectedFlight = computed(() => this._state().selectedFlight);
readonly travellers = computed(() => this._state().travellers);

readonly fareBreakdown = computed<FareBreakdown>(() => {
  const flight = this._state().selectedFlight;
  const count = this._state().travellers.length;
  const baseFare = flight?.baseFare ?? 0;
  const subtotal = baseFare * Math.max(count, 1);
  const taxes = Math.round(subtotal * 0.12);
  const total = Math.max(subtotal + taxes - this._state().promoDiscount, 0);
  return { baseFare, travellersCount: count, subtotal, taxes, promoDiscount: this._state().promoDiscount, total };
});
```

### Step 4: Action Methods

```typescript
selectFlight(flight: Flight): void {
  this._state.update(s => ({ ...s, selectedFlight: flight }));
}

addTraveller(traveller: Traveller): void {
  this._state.update(s => ({ ...s, travellers: [...s.travellers, traveller] }));
}

applyPromoCode(code: string): void {
  const discount = code.toUpperCase() === 'MMT500' ? 500 : 0;
  this._state.update(s => ({ ...s, promoCode: code, promoDiscount: discount }));
}
```

### Step 5: Snapshot & Rollback

```typescript
private _snapshot: BookingState | null = null;

bookingSnapshot(): void {
  this._snapshot = structuredClone(this._state());
}

rollback(): void {
  if (this._snapshot) {
    this._state.set(this._snapshot);
    this._snapshot = null;
  }
}
```

`structuredClone()` deep-copies the state so the snapshot is independent. On failure, `set(snapshot)` restores the exact pre-payment state.

### Step 6: Consume in Component

```typescript
store = inject(BookingStore);

// Template reads:
store.selectedFlight()?.airline
store.fareBreakdown().total
store.isBookingValid()
```

All 4 steps inject the same singleton service and read the same signals — no input/output wiring needed.

## 🌟 Key Takeaways

* **Private signal + `asReadonly()`** is the encapsulation pattern — prevents unauthorized writes.
* **Named actions** make state changes traceable and testable.
* **Computed selectors** derive UI state without storing redundant data.
* **`structuredClone` + `set()`** is a simple optimistic update / rollback pattern.
* This is exactly what NgRx SignalStore does — understanding this makes you a better consumer of the library.
