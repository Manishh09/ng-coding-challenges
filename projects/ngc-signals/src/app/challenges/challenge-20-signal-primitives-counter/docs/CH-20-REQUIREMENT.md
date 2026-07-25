# Challenge 20: BookMyShow — Movie Seat Selector

**Estimated Time:** 20-30 minutes  
**Difficulty:** Beginner

## 1. Challenge 🎯

**Scenario:**  
You're a developer at BookMyShow. Build the seat quantity selector used in the movie booking flow using Angular's core signal primitives — `signal()`, `computed()`, and `effect()`.

**Task:**  
The BookMyShow seat selector lets users pick 1–10 seats per booking. Before payment, the UI must reactively show a live price breakdown, disable +/- buttons at boundaries, and track selection changes for the analytics team.

## 2. Requirements 📋

* [ ] **Seat Counter**: Build a seat counter using `signal<number>(1)` — implement increment and decrement clamped to min(1) and max(10) using `update()`; add a `reset()` that reverts to 1.
* [ ] **Computed Signals**: Add `computed()` signals: `totalPrice` (seats × ₹250), `isAtMin`, `isAtMax`, `priceBreakdown` (`{ seats, pricePerSeat, total }`) — disable the +/- buttons based on boundary computeds.
* [ ] **Analytics Effect**: Implement `effect()` that logs `{ seatsSelected, totalPrice, timestamp }` to the console on every change — simulating the analytics event dispatch BookMyShow would fire.
* [ ] **Summary Card**: Display a selection summary card: seat count badge, price breakdown table, and a "Proceed to Pay" button that is only enabled when `seats ≥ 1` and `totalPrice > 0`.

## 3. Expected Output 🖼️

| User Action | Result |
|-------------|--------|
| Click `+` | Seat count increases by 1, price updates |
| Click `+` at 10 seats | `+` button is disabled |
| Click `−` | Seat count decreases by 1, price updates |
| Click `−` at 1 seat | `−` button is disabled |
| Click Reset | Seat count returns to 1 |
| Any change | Console logs analytics event |

**Visual Feedback:**

* **Seat Badge**: Large number showing current seat count.
* **Price Table**: Breakdown of seats × price per seat = total.
* **Proceed Button**: Enabled when selection is valid.

## 4. Edge Cases / Constraints ⚠️

* **Boundary Clamping**: `update()` must clamp values — do not rely on external `if` checks.
* **Reset at Min**: Reset button should be disabled when already at minimum (1 seat).
* **Effect Timing**: `effect()` runs once on creation and then on every signal change — the initial log is expected.
* **Currency**: Display prices in INR (₹) format.

## 5. Success Criteria ✅

* [ ] `signal<number>(1)` is used for seat count state.
* [ ] `computed()` derives `totalPrice`, `isAtMin`, `isAtMax`, and `priceBreakdown`.
* [ ] `effect()` logs analytics payload on every change.
* [ ] `+` button disabled when `isAtMax()` is true.
* [ ] `−` button disabled when `isAtMin()` is true.
* [ ] Price breakdown updates reactively without manual recalculation.
* [ ] "Proceed to Pay" button respects validation conditions.
* [ ] No RxJS — only signal primitives are used.

### Key Concepts

| Primitive | Purpose | Example |
|-----------|---------|---------|
| `signal()` | Mutable reactive state | `seats = signal(1)` |
| `computed()` | Derived read-only state | `totalPrice = computed(() => seats() * 250)` |
| `effect()` | Side effects on change | `effect(() => console.log(seats()))` |
