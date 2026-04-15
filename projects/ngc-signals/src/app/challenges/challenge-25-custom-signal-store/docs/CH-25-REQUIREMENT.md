# Challenge 25: MakeMyTrip — Flight Booking Signal Store

**Estimated Time:** 45-60 minutes  
**Difficulty:** Advanced

## 1. Challenge 🎯

**Scenario:**  
You're architecting MakeMyTrip's multi-step flight booking flow. Build a custom signal-based store to manage shared booking state across Search, Travellers, Review, and Payment steps.

**Task:**  
Create a `BookingStore` service with a private writable signal, readonly exposure via `asReadonly()`, computed selectors, and typed action methods — the pattern NgRx SignalStore uses under the hood.

## 2. Requirements 📋

* [ ] **BookingStore Service**: Private `signal<BookingState>(initialState)` — expose via `asReadonly()`. Implement actions: `selectFlight(flight)`, `addTraveller(traveller)`, `removeTraveller(id)`, `applyPromoCode(code)`, `setPaymentStatus(status)` — each calling `update()` on private state.
* [ ] **Computed Selectors**: `selectedFlight()`, `travellers()`, `fareBreakdown()` (baseFare × travellers + 12% taxes − promo discount), `isBookingValid()` (flight selected + ≥1 traveller with valid details).
* [ ] **4-Step Booking UI**: Each step reads from the store; the Next button uses `isBookingValid()` to guard progression.
* [ ] **Snapshot & Rollback**: `bookingSnapshot()` captures current state. If payment fails, `rollback()` restores the snapshot using `signal.set(snapshot)`.

## 3. Expected Output 🖼️

| User Action | Result |
|-------------|--------|
| Click a flight card | Flight selected, highlighted |
| Add traveller name + age | Traveller appears in list, fare recalculates |
| Enter 'MMT500' promo code | ₹500 discount applied to total |
| Click "Pay Now" | Payment processes (random success/fail) |
| Payment fails | State rolls back to snapshot |

## 4. Edge Cases / Constraints ⚠️

* **Private state**: No component should directly call `_state.set()` — only through action methods.
* **Promo code**: Only `'MMT500'` gives ₹500 off. All others give ₹0.
* **Fare with no travellers**: Show base fare for 1 person as preview.
* **Rollback**: Must restore the exact state before the failed payment attempt.

## 5. Success Criteria ✅

* [ ] Store uses private `signal` + public `asReadonly()`.
* [ ] All mutations go through named action methods using `update()`.
* [ ] `fareBreakdown` is a `computed()` that reads flight, travellers, and promo state.
* [ ] `isBookingValid` computed guards the Next button.
* [ ] `bookingSnapshot()` + `rollback()` work for failed payments.
* [ ] All 4 steps inject and read from the same `BookingStore`.

### Key Concepts

| Concept | Example |
|---------|---------|
| Private signal + readonly | `private _state = signal(init); state = _state.asReadonly()` |
| Typed action | `selectFlight(f) { _state.update(s => ({...s, selectedFlight: f})) }` |
| Computed selector | `fareBreakdown = computed(() => derive from _state())` |
| Snapshot/rollback | `set(structuredClone(state))` / `set(snapshot)` |
