# Challenge 23: Swiggy — Food Delivery Cart

**Estimated Time:** 30-45 minutes  
**Difficulty:** Intermediate

## 1. Challenge 🎯

**Scenario:**  
You're a frontend engineer at Swiggy. Build the cart sidebar — add/remove items, update quantities, apply a coupon code, and show a fully reactive price breakdown with delivery fee and GST.

**Task:**  
The Swiggy cart is a masterclass in derived state: every price shown on screen is a function of items × quantities, with conditional delivery fee (free above ₹299), GST, coupon discounts, and a savings badge. None of these are stored — they're all derived. Model the cart as `signal<CartItem[]>` and chain `computed()` signals to produce each line of the price breakdown reactively.

## 2. Requirements 📋

* [ ] **Cart CRUD**: Create `signal<CartItem[]>` — implement `addItem` (merge if exists), `removeItem`, `updateQuantity` (min 1, max 10), and `clearCart` — all via immutable `update()`; show a restaurant header with item count badge.
* [ ] **Chained Price Pipeline**: Build a chained `computed()` pipeline: `itemCount` → `subtotal` → `deliveryFee` (₹40, waived if subtotal ≥ ₹299) → `couponDiscount` (`signal<string>` coupon code, 20% off for 'SWIGGY20') → `GST` (5% on discounted subtotal) → `grandTotal`.
* [ ] **Bill Breakdown**: Display a Swiggy-style bill panel: subtotal, delivery fee (struck-through when waived), savings in green, GST, and grand total — each line reactive with no manual recalculation.
* [ ] **Free Delivery Banner**: Add a `computed cartSuggestion()` that returns a progress message: '₹X away from free delivery' when subtotal < ₹299, or 'You've unlocked free delivery!' when met — display as a banner above the bill.

## 3. Expected Output 🖼️

| User Action | Result |
|-------------|--------|
| Click ADD on menu item | Item appears in cart (or quantity +1 if exists) |
| Click `+` / `−` on cart item | Quantity updates, all prices recalculate |
| Click ✕ on cart item | Item removed, all prices recalculate |
| Type 'SWIGGY20' in coupon | 20% discount applied, savings shown |
| Subtotal reaches ₹299 | Delivery fee struck through, "FREE" tag shown |
| Subtotal below ₹299 | Banner shows "Add ₹X more for free delivery!" |
| Click "Clear Cart" | Cart emptied, empty state shown |

**Visual Feedback:**

* **Item Count Badge**: Orange badge on header showing total items.
* **Quantity Controls**: Inline ± buttons with Swiggy orange accent.
* **Bill Breakdown**: Dashed-border section with line items, strikethrough delivery fee.
* **Savings Banner**: Green banner showing total savings.
* **Suggestion Banner**: Amber when below threshold, green when free delivery unlocked.

## 4. Edge Cases / Constraints ⚠️

* **Merge on Add**: If `addItem` is called for an existing item, increment quantity (up to max 10) — don't create a duplicate.
* **Quantity Bounds**: `updateQuantity` must clamp between 1 and 10.
* **Coupon Case-Insensitive**: `'swiggy20'`, `'SWIGGY20'`, `'Swiggy20'` should all work.
* **GST on Discounted**: GST is calculated on `subtotal - couponDiscount`, not on the raw subtotal.
* **Savings Calculation**: Includes both coupon discount and waived delivery fee.
* **Empty State**: Show an empty cart illustration/message when no items.

## 5. Success Criteria ✅

* [ ] `signal<CartItem[]>` is the single source of truth for cart items.
* [ ] `signal<string>` is a separate source signal for the coupon code.
* [ ] Chained `computed()` pipeline produces each bill line: `subtotal` → `deliveryFee` → `couponDiscount` → `gst` → `grandTotal`.
* [ ] `addItem` merges duplicates; `updateQuantity` clamps 1–10.
* [ ] Delivery fee is ₹40, waived when subtotal ≥ ₹299.
* [ ] Coupon 'SWIGGY20' gives 20% off subtotal.
* [ ] `cartSuggestion` computed shows progress toward free delivery.
* [ ] All mutations use immutable `update()` patterns.
* [ ] No RxJS — only signal primitives are used.

### Key Concepts

| Concept | Example |
|---------|---------|
| Chained computed | `subtotal → deliveryFee → discountedSubtotal → gst → grandTotal` |
| Conditional derived state | `deliveryFee = computed(() => subtotal() >= 299 ? 0 : 40)` |
| Merge-on-add | `addItem` checks `find()` before spread |
| Multi-source computed | `couponDiscount` reads both `subtotal()` and `couponCode()` |
