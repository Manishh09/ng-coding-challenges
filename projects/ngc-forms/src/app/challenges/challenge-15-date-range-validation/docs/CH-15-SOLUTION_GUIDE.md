# Challenge 15: Date Range Validation - Solution Guide

## 📖 Table of Contents

1. [Solution Overview](#solution-overview)
2. [File Structure](#file-structure)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Key Patterns & Best Practices](#key-patterns--best-practices)
5. [Testing Strategy](#testing-strategy)
6. [Common Pitfalls](#common-pitfalls)
7. [Extensions & Improvements](#extensions--improvements)
8. [Key Takeaways](#key-takeaways)

---

## 📋 Solution Overview

This challenge demonstrates **cross-field validation** in Angular Reactive Forms. Unlike previous challenges where validators checked individual fields in isolation, this challenge validates the **relationship between multiple fields** at the FormGroup level.

### Core Architecture

```
┌─────────────────────────────────────────┐
│         LeaveFormComponent              │
│  ┌───────────────────────────────────┐  │
│  │        FormGroup                   │  │
│  │  ┌──────────┐  ┌──────────┐      │  │
│  │  │startDate │  │ endDate  │      │  │
│  │  │FormControl│ │FormControl│      │  │
│  │  └──────────┘  └──────────┘      │  │
│  │                                    │  │
│  │  validators: [dateRangeValidator()]│  │
│  │              ↑                     │  │
│  │      Validates both controls       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Key Difference from Control-Level Validation

| Aspect | Control-Level | **Group-Level (This Challenge)** |
|--------|---------------|----------------------------------|
| Applied to | FormControl | **FormGroup** |
| Receives | FormControl | **AbstractControl (FormGroup)** |
| Accesses | Own value | **Multiple child controls** |
| Error on | `control.errors` | **`formGroup.errors`** |
| Display | `control.hasError()` | **`formGroup.hasError()`** |

---

## 📁 File Structure

```
challenge-15-date-range-validation/
├── models/
│   └── leave-request.model.ts           # Interfaces and types
├── validators/
│   └── date-range.validator.ts          # Cross-field validator
├── components/
│   └── leave-form/
│       ├── leave-form.component.ts      # Component logic
│       ├── leave-form.component.html    # Template
│       ├── leave-form.component.scss    # Styles
│       └── leave-form.component.spec.ts # Tests
└── docs/
    ├── CH-15-REQUIREMENT.md
    └── CH-15-SOLUTION_GUIDE.md
```

---

## 🔨 Step-by-Step Implementation

### Step 1: Create Models (`leave-request.model.ts`)

Define TypeScript interfaces for type safety:

```typescript
export type LeaveType = 'vacation' | 'sick' | 'personal' | 'unpaid';

export interface LeaveRequestFormData {
  leaveType: LeaveType;
  startDate: string;  // ISO format: YYYY-MM-DD
  endDate: string;
  reason: string;
}

export interface LeaveRequest extends LeaveRequestFormData {
  id: number;
  employeeName: string;
  status: 'pending' | 'approved' | 'rejected';
  totalDays: number;
  submittedAt: Date;
}

export interface DateRangeValidationError {
  dateRangeInvalid: {
    message: string;
    startDate: string;
    endDate: string;
  };
}

export interface LeaveTypeConfig {
  value: LeaveType;
  label: string;
  maxDays?: number;
  description: string;
}

export const LEAVE_TYPES: LeaveTypeConfig[] = [
  {
    value: 'vacation',
    label: 'Vacation Leave',
    maxDays: 30,
    description: 'Annual vacation time'
  },
  {
    value: 'sick',
    label: 'Sick Leave',
    maxDays: 15,
    description: 'Medical or health-related leave'
  },
  {
    value: 'personal',
    label: 'Personal Leave',
    maxDays: 10,
    description: 'Personal matters or emergencies'
  },
  {
    value: 'unpaid',
    label: 'Unpaid Leave',
    description: 'Extended leave without pay'
  }
];
```

**Key Points:**

- ✅ Use union types for LeaveType (type safety)
- ✅ Store dates as ISO strings (YYYY-MM-DD) matching HTML5 date input
- ✅ Define configuration array for leave types
- ✅ Structure error interface to match validator return

---

### Step 2: Implement Cross-Field Validator (`date-range.validator.ts`)

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // 1. Control is the FormGroup, not individual FormControl
    const startDateControl = control.get('startDate');
    const endDateControl = control.get('endDate');

    // 2. Get the values
    const startValue = startDateControl?.value;
    const endValue = endDateControl?.value;

    // 3. Skip validation if either field is empty
    // Let the required validator handle empty field validation
    if (!startValue || !endValue) {
      return null;
    }

    // 4. Convert ISO date strings to Date objects
    const startDate = new Date(startValue);
    const endDate = new Date(endValue);

    // 5. Validate that dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return {
        invalidDate: {
          message: 'Invalid date format detected',
          startDate: startValue,
          endDate: endValue
        }
      };
    }

    // 6. Check if end date is after start date
    // Using <= to ensure end date is strictly greater (not equal)
    if (endDate <= startDate) {
      return {
        dateRangeInvalid: {
          message: 'End date must be after start date',
          startDate: startValue,
          endDate: endValue
        }
      };
    }

    // 7. Valid date range
    return null;
  };
}
```

**Critical Implementation Details:**

1. **Function Signature:**

   ```typescript
   (control: AbstractControl): ValidationErrors | null
   ```

   - Receives `AbstractControl` (the FormGroup)
   - Returns `ValidationErrors` object or `null`

2. **Accessing Child Controls:**

   ```typescript
   const startDateControl = control.get('startDate');
   ```

   - Use `control.get('fieldName')` to access children
   - Don't assume control exists (use optional chaining)

3. **Empty Field Handling:**

   ```typescript
   if (!startValue || !endValue) {
     return null;  // Let required validator handle
   }
   ```

   - Return `null` when fields are empty
   - Don't show cross-field error for incomplete data

4. **Date Comparison:**

   ```typescript
   if (endDate <= startDate) {  // Use <=, not just <
     return { dateRangeInvalid: {...} };
   }
   ```

   - Use `<=` to catch both reversed AND same dates
   - Same date is invalid (need at least 1 day)

---

### Step 3: Helper Functions for Date Handling

```typescript
/**
 * Optional: Validator to prevent selection of past dates
 */
export function noPastDatesValidator(fieldName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return {
        pastDate: {
          message: `${fieldName} cannot be in the past`,
          selectedDate: control.value
        }
      };
    }

    return null;
  };
}

/**
 * Calculates the number of days between two dates
 */
export function calculateDaysBetween(
  startDate: string | Date, 
  endDate: string | Date
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Reset time to midnight for accurate day calculation
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Add 1 to include both start and end dates
  return diffDays + 1;
}
```

**Date Calculation Notes:**

- Include both start and end dates in count (add 1)
- Reset time to midnight to compare only dates
- Handle millisecond conversion correctly

---

### Step 4: Component Logic (`leave-form.component.ts`)

```typescript
import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveRequestFormData, LEAVE_TYPES } from '../models/leave-request.model';
import { dateRangeValidator, calculateDaysBetween, noPastDatesValidator } from '../validators/date-range.validator';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leave-form.component.html',
  styleUrl: './leave-form.component.scss'
})
export class LeaveFormComponent implements OnInit {
  leaveForm!: FormGroup;
  leaveTypes = LEAVE_TYPES;
  
  // Signals for reactive state
  submitted = signal<boolean>(false);
  showSuccessMessage = signal<boolean>(false);
  successMessage = signal<string>('');
  
  // Computed signal for total days
  totalDays = computed(() => {
    const startDate = this.leaveForm?.get('startDate')?.value;
    const endDate = this.leaveForm?.get('endDate')?.value;
    
    if (startDate && endDate && !this.leaveForm?.hasError('dateRangeInvalid')) {
      return calculateDaysBetween(startDate, endDate);
    }
    
    return 0;
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize form with cross-field validation
   * KEY PATTERN: Apply dateRangeValidator at FormGroup level
   */
  private initializeForm(): void {
    this.leaveForm = this.fb.group({
      leaveType: ['vacation', [Validators.required]],
      startDate: ['', [
        Validators.required,
        noPastDatesValidator('Start date')
      ]],
      endDate: ['', [
        Validators.required,
        noPastDatesValidator('End date')
      ]],
      reason: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]]
    }, {
      // Apply cross-field validator at FormGroup level
      validators: [dateRangeValidator()]
    });
  }

  /**
   * Get error message for individual form controls
   */
  getControlError(fieldName: string): string | null {
    const control = this.leaveForm.get(fieldName);
    
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    const errors = control.errors;

    if (errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (errors['minLength']) {
      return `${this.getFieldLabel(fieldName)} must be at least ${errors['minLength'].requiredLength} characters`;
    }

    if (errors['pastDate']) {
      return errors['pastDate'].message;
    }

    return null;
  }

  /**
   * Get FormGroup-level error message
   * KEY PATTERN: Check formGroup.hasError(), not control.hasError()
   */
  getGroupErrorMessage(): string | null {
    if (this.leaveForm.hasError('dateRangeInvalid')) {
      return this.leaveForm.errors?.['dateRangeInvalid']?.message || 'Invalid date range';
    }

    if (this.leaveForm.hasError('invalidDate')) {
      return this.leaveForm.errors?.['invalidDate']?.message || 'Invalid date format';
    }

    return null;
  }

  /**
   * Show group error only when both date fields touched
   */
  shouldShowGroupError(): boolean {
    const startDateControl = this.leaveForm.get('startDate');
    const endDateControl = this.leaveForm.get('endDate');
    
    return !!(
      (startDateControl?.touched || this.submitted()) &&
      (endDateControl?.touched || this.submitted()) &&
      this.getGroupErrorMessage()
    );
  }

  /**
   * Business rule: Check if days exceed maximum for leave type
   */
  exceedsMaxDays(): boolean {
    const leaveType = this.leaveForm.get('leaveType')?.value;
    const leaveConfig = LEAVE_TYPES.find(type => type.value === leaveType);
    const maxDays = leaveConfig?.maxDays;
    const days = this.totalDays();
    
    return maxDays !== undefined && days > maxDays;
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.leaveForm.invalid || this.exceedsMaxDays()) {
      Object.keys(this.leaveForm.controls).forEach(key => {
        this.leaveForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formData: LeaveRequestFormData = this.leaveForm.value;
    
    this.successMessage.set(
      `Leave request submitted! ${this.totalDays()} days of ${formData.leaveType} leave.`
    );
    this.showSuccessMessage.set(true);

    // Auto-reset after 5 seconds
    setTimeout(() => {
      this.leaveForm.reset({ leaveType: 'vacation' });
      this.submitted.set(false);
      this.showSuccessMessage.set(false);
    }, 5000);
  }
}
```

**Key Component Patterns:**

1. **FormGroup Registration:**

   ```typescript
   this.fb.group({...controls}, { 
     validators: [dateRangeValidator()]  // ← Group level
   });
   ```

2. **Computed Signals:**

   ```typescript
   totalDays = computed(() => {
     // Automatically recalculates when form values change
   });
   ```

3. **Conditional Error Display:**

   ```typescript
   shouldShowGroupError(): boolean {
     return bothFieldsTouched && hasGroupError;
   }
   ```

---

### Step 5: Template with Dual Error Display (`leave-form.component.html`)

```html
<form [formGroup]="leaveForm" (ngSubmit)="onSubmit()">
  
  <!-- Start Date Field -->
  <div class="form-group">
    <label for="startDate">Start Date <span class="required">*</span></label>
    <input 
      type="date" 
      id="startDate" 
      formControlName="startDate"
      [class.is-invalid]="shouldShowError('startDate') || shouldShowGroupError()" />
    
    <!-- Control-Level Error -->
    @if (shouldShowError('startDate') && getControlError('startDate')) {
      <div class="error-message">
        {{ getControlError('startDate') }}
      </div>
    }
  </div>

  <!-- End Date Field -->
  <div class="form-group">
    <label for="endDate">End Date <span class="required">*</span></label>
    <input 
      type="date" 
      id="endDate" 
      formControlName="endDate"
      [class.is-invalid]="shouldShowError('endDate') || shouldShowGroupError()" />
    
    <!-- Control-Level Error -->
    @if (shouldShowError('endDate') && getControlError('endDate')) {
      <div class="error-message">
        {{ getControlError('endDate') }}
      </div>
    }
  </div>

  <!-- Group-Level Error (Cross-Field Validation) -->
  @if (shouldShowGroupError()) {
    <div class="group-error-message" role="alert">
      <div class="error-icon">⚠</div>
      <div class="error-content">
        <strong>Date Range Error:</strong>
        <p>{{ getGroupErrorMessage() }}</p>
      </div>
    </div>
  }

  <!-- Total Days Display -->
  @if (totalDays() > 0 && !shouldShowGroupError()) {
    <div class="total-days-display">
      <span class="days-label">Total Leave Days:</span>
      <span class="days-value">{{ totalDays() }}</span>
    </div>
  }

  <!-- Submit Button -->
  <button 
    type="submit" 
    [disabled]="leaveForm.invalid || exceedsMaxDays()">
    Submit Leave Request
  </button>
</form>
```

**Template Key Patterns:**

1. **Dual Error Display:**
   - Control errors: Below each field
   - Group errors: Special section between fields

2. **Error Styling:**

   ```html
   [class.is-invalid]="
     shouldShowError('endDate') ||    ← Control error
     shouldShowGroupError()            ← Group error
   "
   ```

3. **Conditional Rendering:**

   ```html
   @if (totalDays() > 0 && !shouldShowGroupError()) {
     <!-- Only show when valid range -->
   }
   ```

---

## 🎯 Key Patterns & Best Practices

### 1. FormGroup Validator Registration

```typescript
// ✅ CORRECT: Apply at FormGroup level
this.fb.group({
  startDate: ['', [Validators.required]],
  endDate: ['', [Validators.required]]
}, {
  validators: [dateRangeValidator()]  // ← Second parameter
});

// ❌ WRONG: Applying to control
startDate: ['', [Validators.required, dateRangeValidator()]]
```

### 2. Accessing Controls in Validator

```typescript
// ✅ CORRECT: Access via control.get()
const startDateControl = control.get('startDate');
const value = startDateControl?.value;

// ❌ WRONG: Trying to access directly
const value = control.value.startDate;  // Won't work
```

### 3. Error Display Pattern

```typescript
// ✅ CORRECT: Check FormGroup for group errors
if (this.leaveForm.hasError('dateRangeInvalid')) {
  // Show error
}

// ❌ WRONG: Check control for group error
if (this.leaveForm.get('endDate')?.hasError('dateRangeInvalid')) {
  // Won't find it - error is on FormGroup
}
```

### 4. Empty Field Handling

```typescript
// ✅ CORRECT: Return null for empty fields
if (!startValue || !endValue) {
  return null;  // Let required validator handle
}

// ❌ WRONG: Show error for incomplete data
if (!startValue || !endValue) {
  return { dateRangeInvalid: {...} };  // Confusing
}
```

### 5. Date Comparison

```typescript
// ✅ CORRECT: Use <= to catch same dates
if (endDate <= startDate) {
  return { dateRangeInvalid: {...} };
}

// ❌ WRONG: Only catches reversed dates
if (endDate < startDate) {
  // Allows same date (usually invalid for ranges)
}
```

---

## 🧪 Testing Strategy

### Unit Tests for Validator

```typescript
describe('dateRangeValidator', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl('')
    }, { validators: [dateRangeValidator()] });
  });

  it('should be valid when end date is after start date', () => {
    form.patchValue({
      startDate: '2025-01-15',
      endDate: '2025-01-20'
    });
    
    expect(form.hasError('dateRangeInvalid')).toBeFalsy();
    expect(form.valid).toBeTruthy();
  });

  it('should be invalid when end date equals start date', () => {
    form.patchValue({
      startDate: '2025-01-15',
      endDate: '2025-01-15'
    });
    
    expect(form.hasError('dateRangeInvalid')).toBeTruthy();
  });

  it('should not show error when fields are empty', () => {
    form.patchValue({
      startDate: '',
      endDate: ''
    });
    
    expect(form.hasError('dateRangeInvalid')).toBeFalsy();
  });
});
```

### Component Tests

```typescript
describe('LeaveFormComponent', () => {
  it('should show group error only when both dates touched', () => {
    component.leaveForm.patchValue({
      startDate: '2025-01-20',
      endDate: '2025-01-15'
    });
    
    // Neither touched
    expect(component.shouldShowGroupError()).toBeFalsy();
    
    // Both touched
    component.leaveForm.get('startDate')?.markAsTouched();
    component.leaveForm.get('endDate')?.markAsTouched();
    expect(component.shouldShowGroupError()).toBeTruthy();
  });

  it('should calculate total days correctly', () => {
    component.leaveForm.patchValue({
      startDate: '2025-01-15',
      endDate: '2025-01-20'
    });
    
    expect(component.totalDays()).toBe(6);  // Inclusive
  });
});
```

---

## ⚠️ Common Pitfalls

### 1. Applying Validator to Wrong Level

```typescript
// ❌ WRONG
startDate: ['', [dateRangeValidator()]]  // Control level

// ✅ CORRECT
this.fb.group({...}, { validators: [dateRangeValidator()] })
```

### 2. Checking Control for Group Error

```html
<!-- ❌ WRONG -->
@if (leaveForm.get('endDate')?.hasError('dateRangeInvalid')) {
  <div>Error</div>
}

<!-- ✅ CORRECT -->
@if (leaveForm.hasError('dateRangeInvalid')) {
  <div>{{ leaveForm.errors?.['dateRangeInvalid']?.message }}</div>
}
```

### 3. Showing Error Too Early

```typescript
// ❌ WRONG: Show immediately
shouldShowGroupError(): boolean {
  return !!this.getGroupErrorMessage();
}

// ✅ CORRECT: Show only after both fields touched
shouldShowGroupError(): boolean {
  return bothFieldsTouched && !!this.getGroupErrorMessage();
}
```

### 4. Incorrect Day Calculation

```typescript
// ❌ WRONG: Off by one
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
return diffDays;  // Missing the inclusive count

// ✅ CORRECT: Include both dates
return diffDays + 1;
```

### 5. Not Resetting Time for Date Comparison

```typescript
// ❌ WRONG: Time affects comparison
const start = new Date(startValue);
const end = new Date(endValue);
if (end < start) { /* ... */ }

// ✅ CORRECT: Reset time to midnight
start.setHours(0, 0, 0, 0);
end.setHours(0, 0, 0, 0);
if (end < start) { /* ... */ }
```

---

## 🚀 Extensions & Improvements

### 1. Weekend and Holiday Exclusion

```typescript
export function calculateBusinessDays(
  startDate: string, 
  endDate: string,
  holidays: Date[] = []
): number {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    const day = current.getDay();
    const isWeekend = day === 0 || day === 6;
    const isHoliday = holidays.some(h => 
      h.toDateString() === current.toDateString()
    );
    
    if (!isWeekend && !isHoliday) {
      count++;
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}
```

### 2. Maximum Range Validator

```typescript
export function maxRangeValidator(maxDays: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;
    
    if (!startDate || !endDate) return null;
    
    const days = calculateDaysBetween(startDate, endDate);
    
    if (days > maxDays) {
      return {
        maxRangeExceeded: {
          message: `Date range cannot exceed ${maxDays} days`,
          days,
          maxDays
        }
      };
    }
    
    return null;
  };
}
```

### 3. Minimum Range Validator

```typescript
export function minRangeValidator(minDays: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;
    
    if (!startDate || !endDate) return null;
    
    const days = calculateDaysBetween(startDate, endDate);
    
    if (days < minDays) {
      return {
        minRangeNotMet: {
          message: `Date range must be at least ${minDays} days`,
          days,
          minDays
        }
      };
    }
    
    return null;
  };
}
```

### 4. Dynamic Leave Type Validation

```typescript
export function leaveTypeLimitValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const leaveType = control.get('leaveType')?.value;
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;
    
    if (!startDate || !endDate) return null;
    
    const days = calculateDaysBetween(startDate, endDate);
    const config = LEAVE_TYPES.find(t => t.value === leaveType);
    
    if (config?.maxDays && days > config.maxDays) {
      return {
        leaveTypeLimitExceeded: {
          message: `${config.label} allows maximum ${config.maxDays} days`,
          days,
          maxDays: config.maxDays,
          leaveType
        }
      };
    }
    
    return null;
  };
}
```

### 5. Remaining Leave Balance Check

```typescript
export function leaveBalanceValidator(
  getUserBalance: (leaveType: LeaveType) => Observable<number>
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const leaveType = control.get('leaveType')?.value;
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;
    
    if (!startDate || !endDate) {
      return of(null);
    }
    
    const requestedDays = calculateDaysBetween(startDate, endDate);
    
    return getUserBalance(leaveType).pipe(
      map(balance => {
        if (requestedDays > balance) {
          return {
            insufficientBalance: {
              message: `Insufficient leave balance. Requested: ${requestedDays}, Available: ${balance}`,
              requested: requestedDays,
              available: balance
            }
          };
        }
        return null;
      }),
      catchError(() => of(null))
    );
  };
}
```

---

## 🎓 Key Takeaways

### 1. Cross-Field Validation Architecture

✅ **When to Use FormGroup-Level Validators:**

- Validating relationships between fields (date ranges, password confirmation)
- Business rules involving multiple fields (total cost, quantity limits)
- Conditional validation based on other field values

✅ **When to Use Control-Level Validators:**

- Single field rules (required, minLength, pattern)
- Field-specific constraints (email format, phone number)
- Independent validation that doesn't depend on other fields

### 2. Error Management Strategy

```
Control Errors (Field-Specific)
├── Required
├── MinLength/MaxLength
├── Pattern
└── Custom field validators

Group Errors (Multi-Field)
├── Date Range Invalid
├── Password Mismatch
├── Total Exceeds Limit
└── Conditional Business Rules
```

### 3. Implementation Checklist

- [ ] Validator receives `AbstractControl` (FormGroup)
- [ ] Access controls via `control.get('fieldName')`
- [ ] Return `null` for empty fields
- [ ] Attach errors to FormGroup, not controls
- [ ] Display errors using `formGroup.hasError()`
- [ ] Show group errors only when all fields touched
- [ ] Handle edge cases (same date, empty fields)
- [ ] Test all validation scenarios

### 4. Production Considerations

1. **Performance:**
   - Group validators run on every form value change
   - Keep validation logic lightweight
   - Use debouncing for expensive checks

2. **User Experience:**
   - Don't show cross-field errors prematurely
   - Provide clear, actionable error messages
   - Highlight all related fields on group error

3. **Accessibility:**
   - Use `role="alert"` for error messages
   - Ensure keyboard navigation works
   - Provide screen reader friendly labels

4. **Testing:**
   - Test all edge cases thoroughly
   - Verify error display timing
   - Check form submission behavior

---

## 📚 Related Resources

- [Angular Reactive Forms Documentation](https://angular.io/guide/reactive-forms)
- [Custom Validators Guide](https://angular.io/guide/form-validation#custom-validators)
- [Form Validation Best Practices](https://angular.io/guide/form-validation)

---

**Challenge 15 Complete!** 🎉

You've mastered cross-field validation in Angular Reactive Forms. This pattern is essential for building robust, user-friendly forms that enforce complex business rules and relationships between fields.

**Next Steps:**

- Explore async cross-field validation (e.g., checking leave balance with API)
- Combine multiple group-level validators
- Build forms with nested FormGroups and cross-validation
- Implement dynamic validation based on user roles or business context

---

**Difficulty**: Advanced  
**Estimated Time**: 60-90 minutes  
**Category**: Angular Forms  
**Skills Learned**: Cross-Field Validation, FormGroup Validators, Date Handling, Business Rules
