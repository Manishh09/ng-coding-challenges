# Challenge 14: Email Availability Check - Solution Guide

**Difficulty:** 🔵 Advanced  
**Estimated Time:** 45 minutes

---

## Solution Overview

Async validators return `Observable<ValidationErrors | null>` and are registered as the 3rd parameter in FormControl. Unlike sync validators, they make the control status `'PENDING'` during validation.

**Key Pattern:**
```typescript
FormControl(
  initialValue,
  [syncValidators],    // 2nd param
  [asyncValidators]    // 3rd param - returns Observable
)
```

**RxJS Flow:**
```
User types → timer(500ms) → switchMap(API call) → delay(1500ms) → map(result)
```

---

## Implementation Steps

### Step 1: Define Interfaces

**File**: `models/email.model.ts`

```typescript
export interface EmailAvailabilityResponse {
  available: boolean;
  email: string;
  suggestedAlternatives?: string[];
}
```

---

### Step 2: Email Validation Service

**File**: `services/email-validation.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class EmailValidationService {
  private readonly takenEmails = [
    'admin@company.com',
    'user1@product.io',
    'john.doe@example.com',
    'jane.smith@example.com',
    'test@test.com',
    'demo@demo.com'
  ];

  checkEmailAvailability(email: string): Observable<EmailAvailabilityResponse> {
    if (!email) return of({ available: true, email: '' });

    const normalized = email.toLowerCase().trim();
    const available = !this.takenEmails.includes(normalized);

    return of({
      available,
      email: normalized,
      suggestedAlternatives: available ? undefined : [
        `${normalized.split('@')[0]}123@${normalized.split('@')[1]}`,
        // ... more suggestions
      ]
    }).pipe(delay(1500)); // Simulate network delay
  }

  getTakenEmails(): string[] {
    return [...this.takenEmails];
  }
}
```

**Key Points:**
- Use `of()` to create Observable from value
- `delay(1500)` simulates realistic API latency
- Normalize to lowercase for case-insensitive comparison

---

### Step 3: Async Validator

**File**: `validators/email-availability.validator.ts`

```typescript
export function emailAvailabilityValidator(
  emailService: EmailValidationService,
  debounceTime: number = 500
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null); // Let required validator handle empty

    return timer(debounceTime).pipe(
      switchMap(() => emailService.checkEmailAvailability(control.value)),
      map(response => response.available ? null : {
        emailTaken: {
          email: control.value,
          message: `Email "${control.value}" is already registered`,
          suggestedAlternatives: response.suggestedAlternatives
        }
      }),
      catchError(() => of(null)) // Fail-open on error
    );
  };
}
```

**Critical RxJS Operators:**
- `timer(500)` - Waits 500ms before emitting (debounce)
- `switchMap()` - Cancels previous API call when new value arrives
- `map()` - Transforms response to ValidationErrors or null
- `catchError()` - Returns null on error (fail-open strategy)

---

### Step 4: Component Setup

**File**: `components/email-form/email-form.component.ts`

```typescript
export class EmailFormComponent implements OnInit {
  emailForm!: FormGroup;
  isValidating = signal(false);

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
        [Validators.required, Validators.email],              // Sync (2nd param)
        [emailAvailabilityValidator(this.emailService)]       // Async (3rd param)
      ],
      fullName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  private setupValidationStateMonitoring(): void {
    this.emailForm.get('email')?.statusChanges.subscribe(status => {
      this.isValidating.set(status === 'PENDING');
    });
  }

  isSubmitDisabled(): boolean {
    return this.emailForm.invalid || this.emailForm.pending;
  }
}
```

**Key Concepts:**
- Async validators in **3rd parameter** of FormControl
- `statusChanges` emits: `'VALID'`, `'INVALID'`, `'PENDING'`, `'DISABLED'`
- Block submission when `form.pending`

---

## 💡 Interview Discussion Points
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

## Interview Discussion Points

### AsyncValidatorFn Pattern
"Factory function that returns AsyncValidatorFn. Takes service as parameter for dependency injection. Returns Observable instead of direct value - enables async operations like API calls."

### Debouncing Strategy
"Use `timer(500)` instead of `debounceTime()` operator. Waits 500ms before emitting - reduces API calls, improves UX. Balance: too short = many calls, too long = slow feedback."

### Request Cancellation
"`switchMap()` cancels previous request when new value arrives. Prevents race conditions. Alternative `mergeMap()` allows concurrent calls - wrong for validation."

### Error Handling
"Fail-open strategy: `catchError(() => of(null))`. On API error, treat as valid. Better UX than blocking user. Alternative fail-closed blocks on error - use cautiously."

### Status Monitoring
"`statusChanges` Observable emits when control status changes: `'VALID'`, `'INVALID'`, `'PENDING'`, `'DISABLED'`. Subscribe to track async validation state and update UI."

---

## Common Pitfalls

| Issue | Solution |
|-------|----------|
| Not returning Observable | AsyncValidatorFn must return `Observable<ValidationErrors \| null>` |
| Making API call for empty value | Return `of(null)` immediately for empty, let required validator handle |
| Using mergeMap instead of switchMap | Use `switchMap()` to cancel previous requests, prevents race conditions |
| No debouncing | Add `timer(500)` before API call to reduce unnecessary requests |
| Blocking user on API error | Use `catchError(() => of(null))` for fail-open strategy |
| Not disabling submit during validation | Check `form.pending` in addition to `form.invalid` |

---

## Key Tests

```typescript
// Async validator - available email
it('should return null for available email', fakeAsync(() => {
  const validator = emailAvailabilityValidator(mockService);
  const control = new FormControl('newuser@example.com');
  
  let result: ValidationErrors | null = null;
  validator(control).subscribe(res => result = res);
  
  tick(2000); // debounce + API delay
  expect(result).toBeNull();
}));

// Async validator - taken email
it('should return emailTaken error', fakeAsync(() => {
  const validator = emailAvailabilityValidator(mockService);
  const control = new FormControl('admin@company.com');
  
  let result: ValidationErrors | null = null;
  validator(control).subscribe(res => result = res);
  
  tick(2000);
  expect(result?.['emailTaken']).toBeDefined();
  expect(result?.['emailTaken'].suggestedAlternatives).toBeDefined();
}));

// Component - PENDING state
it('should set isValidating during validation', fakeAsync(() => {
  component.emailForm.get('email')?.setValue('test@example.com');
  
  tick(500); // Debounce
  expect(component.isValidating()).toBe(true);
  
  tick(1500); // API delay
  expect(component.isValidating()).toBe(false);
}));
```

---

## Implementation Checklist

- [ ] `emailAvailabilityValidator` returns `Observable<ValidationErrors | null>`
- [ ] Debouncing with `timer(500)` implemented
- [ ] `switchMap()` cancels previous requests
- [ ] Service simulates API with `delay(1500)`
- [ ] Case-insensitive comparison (toLowerCase + trim)
- [ ] Empty values return `of(null)` immediately (no API call)
- [ ] `statusChanges` subscription tracks PENDING state
- [ ] Loading spinner displayed when `isValidating()` is true
- [ ] Error messages include suggested alternatives
- [ ] Submit button disabled when `form.invalid || form.pending`
- [ ] Fail-open on errors: `catchError(() => of(null))`
- [ ] Template shows PENDING, VALID, INVALID states correctly

---

## Key Takeaways

**AsyncValidatorFn** returns `Observable<ValidationErrors | null>`, registered as 3rd parameter  
**Debouncing** with `timer(500)` reduces API calls, improves performance  
**switchMap()** cancels previous requests, prevents race conditions  
**statusChanges** Observable tracks `'PENDING'` state for loading indicators  
**Fail-open** strategy (`catchError(() => of(null))`) provides better UX on errors  
Return `of(null)` immediately for empty values (no API call)  
Block submission when `form.pending` in addition to `form.invalid`  
Use `delay()` operator to simulate realistic API latency in services
