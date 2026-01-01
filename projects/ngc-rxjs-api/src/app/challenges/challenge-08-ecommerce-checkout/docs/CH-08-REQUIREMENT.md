# Challenge 08: Auto-Checkout (Sequential)

**Estimated Time:** 60-75 minutes
**Difficulty:** Expert

## 1. Challenge 🎯
**Scenario:**
You are implementing an e-commerce checkout. It has a strict order logic:
1.  **Create Order**: Send cart to server. (Must pass)
2.  **Reserve Inventory**: Tell warehouse to hold items. (Must pass)
3.  **Process Payment**: Charge credit card. (Must pass)

**Task:**
Implement a button "Place Order" that triggers this chain of 3 API calls sequentially. If any step fails, the subsequent steps must NOT run.

## 2. Requirements 📋
*   [ ] **RxJS**: Use `concatMap` to chain the calls.
*   [ ] **Safety**: Ensure Step 3 never happens if Step 1 or 2 fails.
*   [ ] **State**: Show progress (e.g., "Processing Order..." -> "Reserving Inventory..." -> "Charging Card...").
*   **APIs**: FakeStore APIs (see below).

## 3. Expected Output 🖼️
*   **Button**: "Place Order".
*   **Status Text**: Updates as the stream progresses.
*   **Result**: Success message with Order ID or Error message.

## 4. Edge Cases / Constraints ⚠️
*   **SwitchMap?**: NO. If the user double-clicks, we don't want to cancel the first correct payment and start a new one incorrectly. `concatMap` queues or `exhaustMap` ignores. For this challenge, `concatMap` is safer (guarantees execution).
*   **MergeMap?**: NO. We cannot pay before we have an order ID.

## 5. Success Criteria ✅
*   [ ] Sequence is strictly observed in Network Timeline and Logs.
*   [ ] `concatMap` is used.
*   [ ] UI reflects the current step.
*   [ ] `takeUntilDestroyed` is used to unsubscribe from the subscription when the component is destroyed.
