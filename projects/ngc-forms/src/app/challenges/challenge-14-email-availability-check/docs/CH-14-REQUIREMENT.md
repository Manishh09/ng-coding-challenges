# Challenge 14: Email Availability Check (Custom Async Validator)

**Estimated Time:** 45 minutes  
**Difficulty:** Advanced

---

## Problem Statement

Build a **custom asynchronous validator** that checks email availability in real-time without blocking the UI. The validator must simulate an API call with realistic delay and provide instant feedback.

### The Challenge

Create a registration form that:

- Validates email availability asynchronously (simulated API)
- Shows loading state during validation (~2 seconds)
- Prevents duplicate email registration
- Provides email suggestions when taken
- Handles rapid typing with debouncing (500ms)

---

## Requirements

### 1. Custom Async Validator

**Signature:**
```typescript
function emailAvailabilityValidator(
  emailService: EmailValidationService,
  debounceTime?: number
): AsyncValidatorFn
```

**Returns:** `Observable<ValidationErrors | null>`

**Error Model:**
```typescript
{
  emailTaken: {
    email: string;
    message: string;
    suggestedAlternatives?: string[];
  }
}
```

**Key Points:**
- Debounce with `timer(500)` before checking
- Cancel previous requests with `switchMap()`
- Fail-open on error (returns null)

### 2. Email Validation Service

**Method Signature:**
```typescript
checkEmailAvailability(email: string): Observable<EmailAvailabilityResponse>
```

**Response Model:**
```typescript
interface EmailAvailabilityResponse {
  available: boolean;
  email: string;
  suggestedAlternatives?: string[];
}
```

**Taken Emails (Hardcoded):**
- `admin@company.com`
- `user1@product.io`
- `john.doe@example.com`
- `jane.smith@example.com`
- `test@test.com`
- `demo@demo.com`

**Behavior:**
- Case-insensitive comparison (toLowerCase + trim)
- Simulated delay: 1500ms (`delay(1500)`)
- Generate 3 email suggestions when taken

### 3. Form Structure

**Form Model:**
```typescript
interface EmailFormData {
  email: string;
  fullName: string;
}
```

**Field Configuration:**
- **Email:** Required, email format, async availability check
  - Sync validators: `Validators.required`, `Validators.email`
  - Async validators: `emailAvailabilityValidator(service)` (3rd parameter)
- **Full Name:** Required, 3-50 characters
  - Validators: `Validators.required`, `minLength(3)`, `maxLength(50)`

### 4. Validation States

**Form Control Status Values:**
- `'VALID'` - All validators passed
- `'INVALID'` - At least one validator failed
- `'PENDING'` - Async validator running
- `'DISABLED'` - Control disabled

**UI Feedback:**

| State | Display | Behavior |
|-------|---------|----------|
| **PENDING** | "Checking email availability..." | Show spinner, disable submit |
| **INVALID** | "Email already registered" + suggestions | Show error, red border |
| **VALID** | "Email is available!" | Green border, enable submit |
| **Empty** | - | No async call (required validator handles) |

**Implementation:** Monitor `statusChanges` Observable to track state transitions

---

## Tech Stack

| Technology | Purpose |
|------------|----------|
| **AsyncValidatorFn** | Returns Observable for async validation |
| **RxJS Operators** | `timer`, `switchMap`, `map`, `catchError`, `of`, `delay` |
| **statusChanges** | Observable that emits when form control status changes |
| **Angular Signals** | Track validation loading state |
| **ReactiveFormsModule** | Form controls and validation |

---

## Expected Output

### User Flow

1. **User Types Email** → Wait 500ms pause → Show loading ("Checking...")
2. **API Responds** (after 1.5s) → Show result (Available / Taken)
3. **If Taken** → Display suggestions: `username123@domain.com`
4. **Submit** → Blocked if invalid or pending

### Validation Test Cases

| Input | Result | Time | Notes |
|-------|--------|------|-------|
| `admin@company.com` | Already registered | ~2s | Case-insensitive match |
| `Admin@Company.com` | Already registered | ~2s | Normalized to lowercase |
| `newuser@example.com` | Email is available! | ~2s | Unique email |
| *(empty field)* | Required | 0s | No async call |
| *(rapid typing)* | ⏳ Waiting... | - | Debounce delays check |
| `test@test.com` | Already registered | ~2s | Trimmed before check |

**Total Time:** Debounce (500ms) + API delay (1500ms) = **~2 seconds**

### Edge Cases Handling

| Scenario | Behavior |
|----------|----------|
| Rapid typing | Only last email (after pause) validated |
| Previous request pending | Cancelled via `switchMap()` |
| API error | Fail-open: allow email |
| Empty value | Return `null` (no API call) |
| Form pending | Submit button disabled |

---

## Success Criteria

### Interview Discussion Topics

| Topic | Key Points |
|-------|------------|
| **AsyncValidatorFn** | Returns Observable, registered as 3rd parameter, control status becomes PENDING |
| **Debouncing** | Why 500ms? Balance UX and API calls, use `timer()` operator |
| **Request cancellation** | `switchMap()` vs `mergeMap()`, prevents race conditions |
| **Error handling** | Fail-open strategy (`catchError(() => of(null))`), better UX than blocking user |
| **Loading states** | Monitor `statusChanges`, update UI with isValidating signal |
| **Performance** | Debounce reduces API calls, cancel previous requests, return early for empty |

### Implementation Checklist

- [ ] `emailAvailabilityValidator` returns `Observable<ValidationErrors | null>`
- [ ] Debouncing with `timer(500)` before API call
- [ ] `switchMap()` cancels previous requests
- [ ] Service simulates API with `delay(1500)`
- [ ] Case-insensitive comparison (toLowerCase + trim)
- [ ] Empty values return `of(null)` immediately
- [ ] `statusChanges` subscription tracks PENDING state
- [ ] Loading spinner displayed during validation
- [ ] Error messages include suggested alternatives
- [ ] Submit button disabled when `form.invalid || form.pending`
- [ ] Fail-open on errors (`catchError(() => of(null))`)

### Time Expectation

**Interview:** 30-40 minutes (explain approach, discuss tradeoffs)

---
