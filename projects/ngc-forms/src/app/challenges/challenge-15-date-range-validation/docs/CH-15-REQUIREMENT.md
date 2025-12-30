# Challenge 15: Date Range Validation (Cross-Field Validator)

**Estimated Time:** 45 minutes  
**Difficulty:** Advanced

---

## Problem Statement

Build a **leave request form** where the **end date must be after the start date**. This validation requires examining multiple fields together at the **FormGroup level**, not individual controls.

**Key Concept:** Unlike previous challenges where validators checked fields in isolation, this uses **cross-field validation** to validate relationships between fields.

## Requirements

### Form Fields (4 fields)

1. **Leave Type** (dropdown): Required, pre-populated options
2. **Start Date** (date input): Required  
3. **End Date** (date input): Required, must be after start date
4. **Reason** (textarea): Required, minimum 10 characters

### Validation Rules

**Individual Field Validation:**

- All fields required
- Reason minimum 10 characters

**Cross-Field Validation (Core Focus):**

- End date must be **after** start date (not equal)
- Implement at **FormGroup level**, not control level
- Show error only when both date fields are touched
- Return `null` if either date is empty (let required handle it)

### Error Display Pattern

```typescript
// WRONG: Checking control for group error
if (leaveForm.get('endDate')?.hasError('dateRangeInvalid')) { }

// CORRECT: Checking FormGroup for group error  
if (leaveForm.hasError('dateRangeInvalid')) { }
```

### UI Requirements

**Simple single-column layout with:**

- Form fields stacked vertically
- Error messages below each field
- Group error displayed between date fields (distinct styling)
- Submit button disabled when form invalid
- Basic success message on submit

## Expected Output

### Valid Form

```
Leave Type: Vacation
Start Date: 2025-01-15
End Date: 2025-01-20
Reason: Planning a family vacation
Total Days: 6 days
[Submit] Enabled
```

### Invalid Range (Group Error)

```
Start Date: 2025-01-20
End Date: 2025-01-15

Date Range Error: End date must be after start date

[Submit] Disabled
```

## Test Cases

Test these scenarios to validate your implementation:

1. **Valid Range:** Start: Jan 15, End: Jan 20 → Valid
2. **Same Date:** Start: Jan 15, End: Jan 15 → Error
3. **Reversed Range:** Start: Jan 20, End: Jan 15 → Error  
4. **Empty Fields:** One or both dates empty → No group error
5. **Untouched Fields:** No errors shown initially

6. **Reversed Range:**

   ```typescript
   startDate: '2025-01-20'
   endDate: '2025-01-15'
   // Should show group error: "End date must be after start date"
   ```

7. **Exceeds Type Limit:**

   ```typescript
   leaveType: 'vacation' (max 30 days)
   days: 36
   // Should show warning and disable submit
   ```

## Key Concepts

### 1. FormGroup-Level Validators vs Control-Level Validators

**Control-Level (Challenge 13, 14):**

```typescript
// Applied to individual FormControl
email: ['', [Validators.required], [emailAvailabilityValidator()]]
       ↑                              ↑
    FormControl                    AsyncValidator
```

## Key Concept: FormGroup vs Control Validators

### Control-Level Validation (Previous Challenges)

```typescript
// Applied to individual FormControl
email: ['', [Validators.required], [asyncValidator()]]
```

### Group-Level Validation (This Challenge)

```typescript
// Applied to entire FormGroup
this.fb.group({
  startDate: ['', [Validators.required]],
  endDate: ['', [Validators.required]]
}, {
  validators: [dateRangeValidator()]  // ← Group level
});
```

### Key Differences

| Aspect | Control-Level | Group-Level |
|--------|---------------|-------------|
| Applied to | FormControl | FormGroup |
| Receives | FormControl | AbstractControl (FormGroup) |
| Validates | Single field | Multiple fields |
| Error location | `control.errors` | `formGroup.errors` |
| Check with | `control.hasError()` | `formGroup.hasError()` |

## Success Criteria

Your implementation must:

1. Use FormGroup-level validator (not control-level)
2. Display group errors separately from control errors
3. Show error only when both date fields touched
4. Handle empty fields correctly (return null)
5. Disable submit when form invalid
6. Use `form.hasError()` not `control.hasError()` for group errors

## Learning Objectives

- Understand difference between control and group validators
- Implement cross-field validation patterns
- Access multiple controls within validator
- Display FormGroup-level errors correctly
- Handle conditional error display logic

---
