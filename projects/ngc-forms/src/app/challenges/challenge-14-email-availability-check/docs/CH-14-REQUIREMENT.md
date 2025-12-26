# Challenge 14: Email Availability Check (Custom Async Validator)

**Difficulty:** 🔵 Advanced  
**Category:** Angular Reactive Forms → Custom Async Validators  
**Estimated Time:** 60-90 minutes

---

## 🎯 Problem Statement

In most modern applications, users must register using an email address that is not already associated with an existing account.

To improve user experience and reduce form submission errors, the system should validate email availability **while the user is typing**, without blocking the UI.

Your task is to design a **custom asynchronous validator** that checks whether an email address already exists in the system by simulating an API call.

---

## 📋 Requirements

### Core Functionality

#### 1. Implement a Custom Async Validator

Create a reusable `emailAvailabilityValidator` factory function that:

- Returns an `AsyncValidatorFn`
- Accepts an `EmailValidationService` instance as a parameter
- Checks email existence via a simulated backend/API
- Returns validation result asynchronously as an `Observable<ValidationErrors | null>`

**Validator Signature:**
```typescript
export function emailAvailabilityValidator(
  emailService: EmailValidationService,
  debounceTime?: number
): AsyncValidatorFn
```

#### 2. Create a Simulated API Service

Implement `EmailValidationService` with:

- **Hardcoded list of taken emails:**
  - `admin@company.com`
  - `user1@product.io`
  - `john.doe@example.com`
  - `jane.smith@example.com`
  - `test@test.com`
  - `demo@demo.com`

- **Method:**
  ```typescript
  checkEmailAvailability(email: string): Observable<EmailAvailabilityResponse>
  ```

- **Artificial delay:** Use RxJS `delay(1500)` to simulate network latency (1.5 seconds)

- **Case-insensitive comparison:** Normalize emails to lowercase before checking

- **Response structure:**
  ```typescript
  interface EmailAvailabilityResponse {
    available: boolean;
    email: string;
    suggestedAlternatives?: string[];
  }
  ```

#### 3. Implement Debouncing

The validator must:

- Trigger only after the user **pauses typing** (500ms debounce)
- Use RxJS `timer()` or `debounceTime()` operator
- Cancel previous pending checks if the email changes (use `switchMap`)

#### 4. Handle Validation States

Display appropriate UI feedback:

- **PENDING State:**
  - Show loading indicator (spinner + text: "Checking email availability...")
  - Disable submit button
  - Apply visual styling to input field (e.g., blue border)

- **INVALID State (Email Taken):**
  - Display error message: `Email "[email]" is already registered`
  - Show suggested alternatives (e.g., `username123@domain.com`)
  - Apply error styling (red border)

- **VALID State (Email Available):**
  - Display success message: "Email is available!"
  - Apply success styling (green border)

- **Empty Input:**
  - No async validation (let `Validators.required` handle it)

#### 5. Form Structure

Create a registration form with:

**Fields:**
- **Email Address** (required, email format, async availability check)
- **Full Name** (required, minLength: 3, maxLength: 50)

**Validation Rules:**
- Email: `[Validators.required, Validators.email]` (sync) + `[emailAvailabilityValidator(...)]` (async)
- Full Name: `[Validators.required, Validators.minLength(3), Validators.maxLength(50)]`

**Submit Button:**
- Disabled when: `form.invalid` OR `form.pending`
- Shows "Validating..." text when form is pending

---

## 🧪 Edge Cases to Handle

| Scenario | Expected Behavior |
|----------|-------------------|
| **Rapid typing** | Only the last email (after 500ms pause) triggers validation |
| **Copy-pasted email** | Validation still waits 500ms before checking |
| **Switching emails quickly** | Previous API request is cancelled (switchMap) |
| **Uppercase vs lowercase** | `Admin@Company.com` → treated as duplicate |
| **Leading/trailing spaces** | `  test@test.com  ` → trimmed before validation |
| **Empty input** | Returns `null` immediately (no API call) |
| **Network delay** | Shows loading state for full 1.5s + 500ms debounce |
| **API failure (simulated)** | Fail-open: allow email (use `catchError(() => of(null))`) |
| **Form submission during validation** | Submit button remains disabled |

---

## ✅ Expected Output

### Test Cases

| User Input | Expected Result | Time |
|------------|-----------------|------|
| `admin@company.com` | ❌ Email already registered | ~2s |
| `Admin@Company.com` | ❌ Duplicate (case-insensitive) | ~2s |
| `user2@product.io` | ✅ Email is available! | ~2s |
| *(empty field)* | ❌ Required (no async call) | Instant |
| *(typing "test...")* | ⏳ Waiting for pause... | 0s |
| `test@test.com` (after pause) | ⏳ Checking... → ❌ Taken | ~2s |
| `newuser@example.com` | ⏳ Checking... → ✅ Available | ~2s |

**Total validation time:** Debounce (500ms) + API delay (1500ms) = **~2 seconds**

---

## 🎨 User Interface Requirements

### Layout

**Two-column layout:**
- **Left side:** Registration form
- **Right side:** List of already registered emails (for testing reference)

### Form Section (Left)

```
┌──────────────────────────────────────────────┐
│  Email Registration                          │
│  Test the async email availability validator │
├──────────────────────────────────────────────┤
│                                              │
│  Email Address *                             │
│  ┌────────────────────────────────────────┐ │
│  │ Enter your email address               │ │
│  └────────────────────────────────────────┘ │
│  ⏳ Checking email availability...           │
│  OR                                          │
│  ✓ Email is available!                       │
│  OR                                          │
│  ⚠ Email "test@test.com" is already         │
│     registered                               │
│     Try these instead:                       │
│     • test123@test.com                       │
│     • test.dev@test.com                      │
│                                              │
│  Full Name *                                 │
│  ┌────────────────────────────────────────┐ │
│  │ Enter your full name                   │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │        Register  / Validating...       │ │
│  └────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### Email List Section (Right)

```
┌────────────────────────────┐
│  Already Registered Emails │
│  (Try these to test)       │
├────────────────────────────┤
│  📧 admin@company.com       │
│  📧 user1@product.io        │
│  📧 john.doe@example.com    │
│  📧 jane.smith@example.com  │
│  📧 test@test.com           │
│  📧 demo@demo.com           │
└────────────────────────────┘
```

### Examples Section (Bottom)

Three cards showing:
1. **Available Emails** - Examples that will pass validation
2. **Taken Emails** - Examples from the hardcoded list
3. **Async Features** - Technical details (debounce, API delay, etc.)

---

## 🧠 Concepts Evaluated

### Angular Forms
- Custom async validator design
- Difference between sync and async validators
- Registering async validators (3rd parameter)
- Handling `PENDING` validation state
- Monitoring form status with `statusChanges` observable

### RxJS
- Observable streams vs Promises
- `timer()` operator for debouncing
- `switchMap()` for request cancellation
- `map()` for transforming responses
- `catchError()` for error handling
- `of()` for immediate Observable values
- `delay()` for simulating latency

### UX Design
- Loading indicators during async operations
- Optimistic vs pessimistic validation
- Debouncing for performance optimization
- Helpful error messages with suggestions
- Visual feedback for different states

### Best Practices
- Separation of concerns (validator, service, component)
- Fail-open vs fail-closed error handling
- Reusable validator factory pattern
- Type-safe error structures
- Proper cleanup (switchMap auto-cancels)

---

## 📚 Technical Specifications

### Async Validator Structure

```typescript
export function emailAvailabilityValidator(
  emailService: EmailValidationService,
  debounceTime: number = 500
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null); // Empty = valid (required handles this)
    }

    return timer(debounceTime).pipe(
      switchMap(() => emailService.checkEmailAvailability(control.value)),
      map(response => {
        if (response.available) {
          return null; // Valid
        }
        return {
          emailTaken: {
            email: control.value,
            message: `Email "${control.value}" is already registered`,
            suggestedAlternatives: response.suggestedAlternatives
          }
        };
      }),
      catchError(() => of(null)) // Fail-open on error
    );
  };
}
```

### Form Control Registration

```typescript
this.emailForm = this.fb.group({
  email: [
    '',
    [Validators.required, Validators.email], // Sync validators
    [emailAvailabilityValidator(this.emailService)] // Async validators
  ],
  fullName: ['', [Validators.required, Validators.minLength(3)]]
});
```

### Status Monitoring

```typescript
ngOnInit(): void {
  this.emailForm.get('email')?.statusChanges.subscribe(status => {
    this.isValidating.set(status === 'PENDING');
  });
}
```

### Control Status Values

- `'VALID'` - All validators (sync + async) passed
- `'INVALID'` - At least one validator failed
- `'PENDING'` - Async validator is currently running
- `'DISABLED'` - Control is disabled

---

## 🎓 Learning Outcomes

After completing this challenge, you will be able to:

1. **Create custom async validators** with proper Observable return types
2. **Implement debouncing strategies** to optimize API calls
3. **Handle loading states** during asynchronous validation
4. **Cancel in-flight requests** using RxJS operators
5. **Differentiate between sync and async validators** in Angular
6. **Monitor form status** with `statusChanges` observable
7. **Simulate API calls** with realistic delays for testing
8. **Provide helpful error messages** with suggested alternatives
9. **Implement fail-open error handling** for better UX
10. **Structure validation logic** with separation of concerns

---

## 🚀 Extension Ideas (Optional)

1. **API Error Simulation:**
   - Add 10% chance of API failure
   - Display error message: "Unable to verify email. Please try again."
   - Implement retry logic with exponential backoff

2. **Email Suggestion Algorithm:**
   - Check for typos (e.g., `gmial.com` → `gmail.com`)
   - Suggest popular domains if current domain is uncommon
   - Use Levenshtein distance for fuzzy matching

3. **Rate Limiting:**
   - Limit validation requests to 3 per minute
   - Display cooldown message if limit exceeded

4. **Real-time Availability Meter:**
   - Show percentage of similar emails taken
   - Display color-coded availability bar

5. **Multiple Async Validators:**
   - Add username availability check
   - Add domain blacklist check
   - Combine multiple async validators

6. **Caching Strategy:**
   - Cache validation results for 5 minutes
   - Avoid redundant API calls for same email

---

## 📖 References

- [Angular Custom Validators](https://angular.io/guide/form-validation#custom-validators)
- [AsyncValidatorFn Documentation](https://angular.io/api/forms/AsyncValidatorFn)
- [RxJS switchMap Operator](https://rxjs.dev/api/operators/switchMap)
- [RxJS debounceTime Operator](https://rxjs.dev/api/operators/debounceTime)
- [Angular Form Status](https://angular.io/api/forms/AbstractControl#status)

---

## ✅ Success Criteria

Your implementation is complete when:

- ✅ Async validator triggers after 500ms pause
- ✅ Loading spinner appears during validation
- ✅ Validation takes ~2 seconds total (debounce + API delay)
- ✅ Previous requests are cancelled when email changes
- ✅ Error messages show suggested alternatives
- ✅ Submit button disabled during validation
- ✅ Case-insensitive email matching works
- ✅ Empty email returns null immediately (no API call)
- ✅ Form handles PENDING, VALID, INVALID states
- ✅ API errors fail-open (allow submission)
- ✅ No TypeScript compilation errors
- ✅ Component follows Angular best practices

---

**Good luck! 🚀**
