# Challenge 14: Email Availability Check - Solution Guide

**Difficulty:** 🔵 Advanced  
**Category:** Angular Reactive Forms → Custom Async Validators  
**Estimated Time:** 60-90 minutes

---

## 📚 Table of Contents

1. [Solution Overview](#solution-overview)
2. [File Structure](#file-structure)
3. [Implementation Steps](#implementation-steps)
4. [Key Patterns & Best Practices](#key-patterns--best-practices)
5. [Testing Strategy](#testing-strategy)
6. [Common Pitfalls](#common-pitfalls)
7. [Extension Ideas](#extension-ideas)
8. [Key Takeaways](#key-takeaways)

---

## Solution Overview

This challenge demonstrates how to implement **asynchronous form validation** in Angular using custom `AsyncValidatorFn` functions. Unlike synchronous validators that return results immediately, async validators return Observables that emit validation results after asynchronous operations (like API calls) complete.

### Architecture Diagram

```
Component (EmailFormComponent)
    ↓ uses
EmailValidationService ← injects into → emailAvailabilityValidator
    ↓ simulates API                           ↓ returns AsyncValidatorFn
Observable<Response> ← delay(1500ms) ←─ timer(500ms) + switchMap
```

### Key Technologies

- **AsyncValidatorFn:** Returns `Observable<ValidationErrors | null>`
- **RxJS Operators:** `timer`, `switchMap`, `map`, `catchError`, `of`, `delay`
- **Angular Signals:** For tracking validation loading state
- **statusChanges:** Observable that emits when form control status changes

---

## File Structure

```
challenge-14-email-availability-check/
├── models/
│   └── email.model.ts                  (Interfaces)
├── services/
│   └── email-validation.service.ts     (Simulated API)
├── validators/
│   └── email-availability.validator.ts (Async validator)
├── components/
│   └── email-form/
│       ├── email-form.component.ts     (Form component)
│       ├── email-form.component.html   (Template)
│       ├── email-form.component.scss   (Styles)
│       └── email-form.component.spec.ts (Tests)
└── docs/
    ├── CH-14-REQUIREMENT.md
    └── CH-14-SOLUTION_GUIDE.md
```

---

## Implementation Steps

### Step 1: Define Interfaces (models/email.model.ts)

Create TypeScript interfaces for type safety:

```typescript
export interface EmailFormData {
  email: string;
  fullName: string;
}

export interface EmailAvailabilityResponse {
  available: boolean;
  email: string;
  suggestedAlternatives?: string[];
}

export interface EmailValidationError {
  emailTaken: {
    email: string;
    message: string;
    suggestedAlternatives?: string[];
  };
}
```

**Why this structure?**
- `EmailFormData`: Represents form values
- `EmailAvailabilityResponse`: API response format
- `EmailValidationError`: Structured validation error for detailed feedback

---

### Step 2: Create Simulated API Service (services/email-validation.service.ts)

```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EmailAvailabilityResponse } from '../models/email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailValidationService {
  private readonly takenEmails: string[] = [
    'admin@company.com',
    'user1@product.io',
    'john.doe@example.com',
    'jane.smith@example.com',
    'test@test.com',
    'demo@demo.com'
  ];

  checkEmailAvailability(email: string): Observable<EmailAvailabilityResponse> {
    if (!email) {
      return of({ available: true, email: '' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const available = !this.takenEmails.includes(normalizedEmail);

    return of({
      available,
      email: normalizedEmail,
      suggestedAlternatives: available ? undefined : this.generateSuggestions(normalizedEmail)
    }).pipe(
      delay(1500) // Simulate network delay
    );
  }

  private generateSuggestions(email: string): string[] {
    const [username, domain] = email.split('@');
    if (!username || !domain) return [];

    return [
      `${username}123@${domain}`,
      `${username}.dev@${domain}`,
      `${username}2024@${domain}`
    ];
  }

  getTakenEmails(): string[] {
    return [...this.takenEmails];
  }
}
```

**Key Points:**
- ✅ Use `of()` to create Observables from values
- ✅ Use `delay(1500)` to simulate realistic API latency
- ✅ Normalize email to lowercase for case-insensitive comparison
- ✅ Generate helpful suggestions when email is taken
- ✅ Return defensive copy of takenEmails array

---

### Step 3: Implement Async Validator (validators/email-availability.validator.ts)

```typescript
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { EmailValidationService } from '../services/email-validation.service';

export function emailAvailabilityValidator(
  emailService: EmailValidationService,
  debounceTime: number = 500
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // Empty value = valid (let required validator handle this)
    if (!control.value) {
      return of(null);
    }

    // Debounce: wait before validating
    return timer(debounceTime).pipe(
      switchMap(() => emailService.checkEmailAvailability(control.value)),
      map(response => {
        if (response.available) {
          return null; // Valid
        }

        // Invalid: email is taken
        return {
          emailTaken: {
            email: control.value,
            message: `Email "${control.value}" is already registered`,
            suggestedAlternatives: response.suggestedAlternatives
          }
        };
      }),
      catchError(error => {
        // Fail-open: on error, allow the email
        console.error('Email validation error:', error);
        return of(null);
      })
    );
  };
}
```

**Critical RxJS Patterns:**

1. **timer(debounceTime):** Waits 500ms before emitting
2. **switchMap():** Cancels previous API call when new value arrives
3. **map():** Transforms response to ValidationErrors or null
4. **catchError():** Handles errors gracefully (fail-open strategy)
5. **of(null):** Returns immediate Observable with null (valid)

**Why `switchMap` instead of `mergeMap`?**
- `switchMap`: Cancels previous, keeps only latest (correct for validation)
- `mergeMap`: Allows multiple concurrent calls (wrong - race conditions)

---

### Step 4: Build Form Component (components/email-form/email-form.component.ts)

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailValidationService } from '../../services/email-validation.service';
import { EmailFormData } from '../../models/email.model';
import { emailAvailabilityValidator } from '../../validators/email-availability.validator';

@Component({
  selector: 'app-email-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './email-form.component.html',
  styleUrl: './email-form.component.scss'
})
export class EmailFormComponent implements OnInit {
  emailForm!: FormGroup;

  // Signals for state management
  submitted = signal(false);
  showSuccessMessage = signal(false);
  successMessage = signal('');
  isValidating = signal(false); // Track PENDING state

  constructor(
    private fb: FormBuilder,
    public emailService: EmailValidationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupValidationStateMonitoring();
  }

  private initializeForm(): void {
    this.emailForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email], // Sync validators
        [emailAvailabilityValidator(this.emailService)] // Async validators
      ],
      fullName: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ]
    });
  }

  private setupValidationStateMonitoring(): void {
    const emailControl = this.emailForm.get('email');

    // Monitor status changes to track PENDING state
    emailControl?.statusChanges.subscribe(status => {
      this.isValidating.set(status === 'PENDING');
    });
  }

  onSubmit(): void {
    this.submitted.set(true);

    // Block submission if invalid or pending
    if (this.emailForm.invalid || this.emailForm.pending) {
      this.markFormGroupTouched(this.emailForm);
      return;
    }

    const formData: EmailFormData = this.emailForm.value;

    // Demo: just show success message
    this.successMessage.set(`Registration successful! Welcome, ${formData.fullName}!`);
    this.showSuccessMessage.set(true);
    setTimeout(() => this.showSuccessMessage.set(false), 3000);

    this.emailForm.reset();
    this.submitted.set(false);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  hasError(fieldName: string, errorType: string): boolean {
    const control = this.emailForm.get(fieldName);
    return !!(control && control.hasError(errorType) && (control.touched || this.submitted()));
  }

  getErrorMessage(fieldName: string): string {
    const control = this.emailForm.get(fieldName);
    if (!control || (!control.touched && !this.submitted())) return '';

    if (control.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }

    if (control.hasError('emailTaken')) {
      const error = control.errors?.['emailTaken'];
      return error?.message || 'This email is already registered';
    }

    return '';
  }

  getSuggestedEmails(): string[] {
    const emailControl = this.emailForm.get('email');
    const error = emailControl?.errors?.['emailTaken'];
    return error?.suggestedAlternatives || [];
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      email: 'Email address',
      fullName: 'Full name'
    };
    return labels[fieldName] || fieldName;
  }

  getFieldClass(fieldName: string): string {
    const control = this.emailForm.get(fieldName);
    if (!control) return '';

    const isTouched = control.touched || this.submitted();
    if (!isTouched) return '';

    // Special handling for async validation
    if (fieldName === 'email' && control.status === 'PENDING') {
      return 'is-validating';
    }

    return control.valid ? 'is-valid' : 'is-invalid';
  }

  shouldShowValidation(fieldName: string): boolean {
    const control = this.emailForm.get(fieldName);
    return !!(control && (control.touched || this.submitted()));
  }

  isSubmitDisabled(): boolean {
    return this.emailForm.invalid || this.emailForm.pending;
  }
}
```

**Key Implementation Details:**

1. **Async Validator Registration:**
   ```typescript
   email: [
     '',
     [syncValidators],     // 2nd parameter
     [asyncValidators]     // 3rd parameter
   ]
   ```

2. **Status Monitoring:**
   ```typescript
   statusChanges.subscribe(status => {
     // status can be: 'VALID', 'INVALID', 'PENDING', 'DISABLED'
   })
   ```

3. **Prevent Submission During Validation:**
   ```typescript
   if (this.emailForm.invalid || this.emailForm.pending) {
     return; // Don't submit
   }
   ```

---

### Step 5: Create Template (components/email-form/email-form.component.html)

Key template sections:

#### Email Field with Loading State

```html
<div class="form-group">
  <label for="email" class="form-label">
    Email Address <span class="required">*</span>
  </label>
  
  <input
    type="email"
    id="email"
    formControlName="email"
    class="form-control"
    [ngClass]="getFieldClass('email')"
    placeholder="Enter your email address"
  />

  <!-- Loading Indicator (PENDING state) -->
  @if (isValidating()) {
    <div class="loading-indicator">
      <span class="spinner"></span>
      <span>Checking email availability...</span>
    </div>
  }

  <!-- Error Messages with Suggestions -->
  @if (shouldShowValidation('email') && !isValidating() && getErrorMessage('email')) {
    <div class="error-message">
      <span class="error-icon">⚠</span>
      {{ getErrorMessage('email') }}
      
      @if (getSuggestedEmails().length > 0) {
        <div class="suggestions">
          <strong>Try these instead:</strong>
          <ul>
            @for (suggestion of getSuggestedEmails(); track suggestion) {
              <li>{{ suggestion }}</li>
            }
          </ul>
        </div>
      }
    </div>
  }

  <!-- Success Indicator -->
  @if (shouldShowValidation('email') && !isValidating() && !getErrorMessage('email')) {
    <div class="success-message">
      <span class="success-icon">✓</span>
      Email is available!
    </div>
  }
</div>
```

#### Submit Button with Pending State

```html
<button
  type="submit"
  class="btn btn-primary"
  [disabled]="isSubmitDisabled()">
  @if (isValidating()) {
    <span>Validating...</span>
  } @else {
    <span>Register</span>
  }
</button>
```

---

### Step 6: Add Styles (components/email-form/email-form.component.scss)

#### Loading Spinner Animation

```scss
.loading-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3498db;
  font-size: 0.9rem;

  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(52, 152, 219, 0.3);
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Validation State Styles

```scss
.form-control {
  &.is-validating {
    border-color: #3498db;
    background-color: #f0f9ff;
  }

  &.is-valid {
    border-color: #27ae60;
    background-color: #f0fdf4;
  }

  &.is-invalid {
    border-color: #e74c3c;
    background-color: #fef2f2;
  }
}
```

---

### Step 7: Register Route (app.routes.ts)

```typescript
const CHALLENGE_COMPONENTS = {
  'email-availability-check': () =>
    import('./challenges/challenge-14-email-availability-check/components/email-form/email-form.component')
      .then(m => m.EmailFormComponent),
};
```

---

### Step 8: Add Metadata (challenges.json)

```json
{
  "email-availability-check": {
    "id": 14,
    "slug": "email-availability-check",
    "title": "Challenge 14: Email Availability Check (Custom Async Validator)",
    "categoryId": "angular-forms",
    "difficulty": "Advanced",
    "enabled": true,
    "order": 3,
    "tags": [
      "Async Validators",
      "AsyncValidatorFn",
      "RxJS",
      "debounceTime",
      "switchMap",
      "Loading States"
    ]
  }
}
```

---

## Key Patterns & Best Practices

### 1. Async Validator Factory Pattern

```typescript
// ✅ Good: Factory function with service injection
export function emailAvailabilityValidator(service: EmailValidationService): AsyncValidatorFn {
  return (control) => { /* ... */ };
}

// ❌ Bad: Validator as class (harder to inject dependencies)
export class EmailAvailabilityValidator implements AsyncValidator {
  validate(control) { /* ... */ }
}
```

### 2. Debouncing Strategy

```typescript
// ✅ Good: Debounce in validator
timer(500).pipe(switchMap(() => service.check(...)))

// ❌ Bad: No debouncing (API called on every keystroke)
service.check(control.value)

// ❌ Bad: Debounce in component (couples validator to component)
control.valueChanges.pipe(debounceTime(500)).subscribe(...)
```

### 3. Request Cancellation

```typescript
// ✅ Good: switchMap cancels previous request
timer(500).pipe(switchMap(() => apiCall))

// ❌ Bad: mergeMap allows multiple concurrent calls
timer(500).pipe(mergeMap(() => apiCall)) // Race condition!

// ❌ Bad: No cancellation (wasted API calls)
timer(500).pipe(concatMap(() => apiCall))
```

### 4. Error Handling Strategy

```typescript
// ✅ Good: Fail-open (allow on error)
catchError(() => of(null)) // User can proceed

// ⚠️ Use with caution: Fail-closed (block on error)
catchError(() => of({ apiError: true })) // User blocked

// ❌ Bad: No error handling (uncaught errors)
// Missing catchError operator
```

### 5. Empty Value Handling

```typescript
// ✅ Good: Return immediately for empty values
if (!control.value) {
  return of(null); // Let required validator handle this
}

// ❌ Bad: Make API call for empty value
// Wastes API call, delays validation
```

### 6. Status Monitoring

```typescript
// ✅ Good: Subscribe to statusChanges
statusChanges.subscribe(status => {
  this.isValidating.set(status === 'PENDING');
})

// ❌ Bad: Poll control status
setInterval(() => {
  this.isValidating.set(control.status === 'PENDING');
}, 100);
```

---

## Testing Strategy

### Unit Tests for Async Validator

```typescript
it('should return null for available email', fakeAsync(() => {
  const service = jasmine.createSpyObj('EmailValidationService', ['checkEmailAvailability']);
  service.checkEmailAvailability.and.returnValue(
    of({ available: true, email: 'test@example.com' })
  );

  const validator = emailAvailabilityValidator(service);
  const control = new FormControl('test@example.com');

  let result: ValidationErrors | null = null;
  validator(control).subscribe(res => result = res);

  tick(2000); // debounce + API delay
  expect(result).toBeNull();
}));

it('should return emailTaken error for taken email', fakeAsync(() => {
  const service = jasmine.createSpyObj('EmailValidationService', ['checkEmailAvailability']);
  service.checkEmailAvailability.and.returnValue(
    of({ available: false, email: 'admin@company.com', suggestedAlternatives: ['admin123@company.com'] })
  );

  const validator = emailAvailabilityValidator(service);
  const control = new FormControl('admin@company.com');

  let result: ValidationErrors | null = null;
  validator(control).subscribe(res => result = res);

  tick(2000);
  expect(result).toEqual({
    emailTaken: jasmine.objectContaining({
      email: 'admin@company.com',
      suggestedAlternatives: ['admin123@company.com']
    })
  });
}));
```

### Component Tests

```typescript
it('should set isValidating to true when email validation is pending', fakeAsync(() => {
  component.emailForm.get('email')?.setValue('test@example.com');
  
  tick(500); // Debounce
  expect(component.isValidating()).toBe(true);
  
  tick(1500); // API delay
  expect(component.isValidating()).toBe(false);
}));

it('should disable submit button during validation', () => {
  component.emailForm.get('email')?.setValue('test@example.com');
  expect(component.isSubmitDisabled()).toBe(true); // PENDING state
});
```

---

## Common Pitfalls

### 1. ❌ Forgetting to Return Observable

```typescript
// ❌ Wrong: Returns void
return (control: AbstractControl) => {
  service.check(control.value); // No return!
};

// ✅ Correct: Returns Observable
return (control: AbstractControl): Observable<ValidationErrors | null> => {
  return timer(500).pipe(switchMap(() => service.check(control.value)));
};
```

### 2. ❌ Not Handling Empty Values

```typescript
// ❌ Wrong: Makes API call for empty string
return service.check(control.value); // Wastes API call

// ✅ Correct: Early return for empty
if (!control.value) {
  return of(null);
}
return service.check(control.value);
```

### 3. ❌ Using Promise Instead of Observable

```typescript
// ❌ Wrong: Async validator must return Observable
return async (control: AbstractControl) => {
  const result = await service.check(control.value);
  return result ? { error: true } : null;
};

// ✅ Correct: Return Observable
return (control: AbstractControl): Observable<ValidationErrors | null> => {
  return service.check(control.value).pipe(map(...));
};
```

### 4. ❌ Not Cancelling Previous Requests

```typescript
// ❌ Wrong: All requests complete (race condition)
control.valueChanges.pipe(
  mergeMap(() => service.check(...))
)

// ✅ Correct: Previous requests cancelled
control.valueChanges.pipe(
  switchMap(() => service.check(...))
)
```

### 5. ❌ Blocking Form on API Error

```typescript
// ❌ Wrong: User blocked if API fails
catchError(error => {
  return of({ apiError: { message: 'Service unavailable' } });
})

// ✅ Correct: Fail-open (allow user to proceed)
catchError(error => {
  console.error('Validation error:', error);
  return of(null); // Treat as valid
})
```

---

## Extension Ideas

### 1. Real API Integration

Replace simulated service with real HTTP calls:

```typescript
checkEmailAvailability(email: string): Observable<EmailAvailabilityResponse> {
  return this.http.get<EmailAvailabilityResponse>(
    `${this.apiUrl}/auth/check-email?email=${encodeURIComponent(email)}`
  ).pipe(
    catchError(() => of({ available: true, email }))
  );
}
```

### 2. Caching Strategy

Cache validation results to avoid redundant API calls:

```typescript
private cache = new Map<string, EmailAvailabilityResponse>();

checkEmailAvailability(email: string): Observable<EmailAvailabilityResponse> {
  const normalized = email.toLowerCase().trim();
  
  if (this.cache.has(normalized)) {
    return of(this.cache.get(normalized)!);
  }
  
  return this.http.get<EmailAvailabilityResponse>(...).pipe(
    tap(response => this.cache.set(normalized, response)),
    delay(1500)
  );
}
```

### 3. Progressive Debouncing

Adjust debounce time based on input length:

```typescript
const debounceMs = control.value.length < 5 ? 1000 : 500;
return timer(debounceMs).pipe(switchMap(...));
```

### 4. Retry Logic

Retry failed API calls with exponential backoff:

```typescript
return service.check(control.value).pipe(
  retry({
    count: 3,
    delay: (error, retryCount) => timer(Math.pow(2, retryCount) * 1000)
  }),
  catchError(() => of(null))
);
```

---

## Key Takeaways

### Async Validators

✅ Return `Observable<ValidationErrors | null>`  
✅ Register in 3rd parameter of FormControl  
✅ Control status becomes `'PENDING'` during validation  
✅ Previous validations are NOT automatically cancelled  

### RxJS Best Practices

✅ Use `switchMap` to cancel previous requests  
✅ Use `timer()` for debouncing  
✅ Use `catchError()` for graceful error handling  
✅ Use `of()` for immediate Observable values  

### UX Considerations

✅ Show loading indicators during validation  
✅ Disable submit button while `form.pending`  
✅ Debounce to reduce API calls  
✅ Provide helpful error messages with suggestions  
✅ Fail-open on errors (don't block user)  

### Performance

✅ Debounce user input (500ms recommended)  
✅ Cancel in-flight requests with switchMap  
✅ Return early for empty values (no API call)  
✅ Consider caching results  

---

## Success Criteria Checklist

- ✅ Async validator returns `Observable<ValidationErrors | null>`
- ✅ Debouncing with 500ms delay implemented
- ✅ API simulation with 1.5s delay works
- ✅ Loading spinner displays during PENDING state
- ✅ Previous requests cancelled with switchMap
- ✅ Error messages show suggested alternatives
- ✅ Submit button disabled during validation
- ✅ Case-insensitive email matching
- ✅ Empty email returns null immediately
- ✅ Form handles VALID, INVALID, PENDING states
- ✅ API errors handled gracefully (fail-open)
- ✅ No TypeScript errors
- ✅ Component follows Angular best practices
- ✅ Tests cover async validation scenarios

---

**Congratulations! You've mastered async form validation in Angular! 🎉**
