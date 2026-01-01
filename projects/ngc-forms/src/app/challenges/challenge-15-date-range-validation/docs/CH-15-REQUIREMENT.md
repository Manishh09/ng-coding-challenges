# Challenge 15: Cross-Field Validation (Date Range)

**Estimated Time:** 45-60 minutes
**Difficulty:** Advanced

## 1. Challenge 🎯
**Scenario:**
You have a "Time Off Request" / "Leave Request" form.
Rule: **End Date** cannot be before **Start Date**.

**Task:**
Create a **FormGroup Validator** that compares two sibling controls.

## 2. Requirements 📋
*   [ ] **Scope**: Validation must happen at the **Group** level (since it depends on 2 fields).
*   [ ] **Logic**: `endDate < startDate` is INVALID.
*   [ ] **UX**: Show error only when *both* fields are touched (or form submitted).

## 3. Expected Output 🖼️
*   **Start**: Jan 10
*   **End**: Jan 5
*   **Result**: Error message "End date must be after start date" appears.

## 4. Edge Cases / Constraints ⚠️
*   **Empty Fields**: If either date is missing, return `null` (valid). Let `Validators.required` handle the empties.
*   **Same Day**: Decided by business rule. Usually Start == End is allowed (1 day off).

## 5. Success Criteria ✅
*   [ ] Cross-field validator implementation.
*   [ ] Validator is applied to the `FormGroup`, not `FormControl`.
*   [ ] Validator returns `{ dateRangeInvalid: true }` when invalid.
*   [ ] Template checks `form.hasError('dateRangeInvalid')`.
