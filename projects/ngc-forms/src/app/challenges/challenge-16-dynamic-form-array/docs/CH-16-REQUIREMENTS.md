# Challenge 16: Dynamic FormArray

**Estimated Time:** 40-50 minutes
**Difficulty:** Expert

## 1. Challenge 🎯
**Scenario:**
Users need to input their "Work History". Since everyone has a different number of jobs, you need a form that grows and shrinks.

**Task:**
Use `FormArray` to create a dynamic list of FormGroups (Company, Role, Years).

## 2. Requirements 📋
*   [ ] **Structure**: Use `FormArray` to hold a list of experiences.
*   [ ] **Constraints**:
    *   Minimum: 1 entry (cannot delete the last one).
    *   Maximum: 5 entries (disable "Add" button).
*   [ ] **Calculations**: Display the "Total Years of Experience" automatically.

## 3. Expected Output 🖼️
*   **Initial**: 1 empty row.
*   **Action**: Click "Add Job" -> 2 rows.
*   **Action**: Click "Delete" on Row 1 -> 1 row left.
*   **Calc**: Job A (2 years) + Job B (3 years) = "Total: 5 Years".

## 4. Edge Cases / Constraints ⚠️
*   **Reset**: Clicking Reset should revert to 1 empty row, typically clearing all data.
*   **Validation**: Every row must be valid before the main "Submit" button works.

## 5. Success Criteria ✅
*   [ ] `FormArray` is used.
*   [ ] User can Add/Remove rows.
*   [ ] Total Years updates in real-time.
*   [ ] Min 1 / Max 5 constraints are enforced.
