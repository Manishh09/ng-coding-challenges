# Solution: Cross-Field Validation

## 🧠 Approach
Standard validators take a `FormControl`.
Cross-field validators take a `FormGroup` (or `AbstractControl` acting as a group).
This gives them access to `.get('child1')` and `.get('child2')`.

## 🚀 Step-by-Step Implementation

### Step 1: The Validator Function
```typescript
export const dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const start = control.get('startDate')?.value;
  const end = control.get('endDate')?.value;

  if (!start || !end) return null; // Let required validators handle emptiness

  const startDate = new Date(start);
  const endDate = new Date(end);

  return endDate < startDate ? { dateRangeInvalid: true } : null;
};
```

### Step 2: Applying to FormGroup
```typescript
@Component({ ... })
export class LeaveRequestComponent {
  fb = inject(FormBuilder);

  form = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  }, { 
    validators: [dateRangeValidator] // <-- Applied to the group!
  });
}
```

### Step 3: Template Error Handling
We only show the error if the group is invalid AND the user has interacted with the dates.
```html
<form [formGroup]="form">
  <input type="date" formControlName="startDate">
  <input type="date" formControlName="endDate">

  @if (form.hasError('dateRangeInvalid') && 
       (form.get('startDate')?.touched && form.get('endDate')?.touched)) {
     <div class="error">
       End date must be after start date.
     </div>
  }
</form>
```

## 🌟 Best Practices Used
*   **Validator Location**: Notice we passed `{ validators: [] }` as the **2nd argument** to `fb.group`. This is where Group-level options go.
*   **Null Checks**: Always return `null` if the dependencies (start/end) are missing. Don't make your cross-field validator double as a "required" validator.
*   **UX Timing**: Group errors can be annoying if they pop up too early. Checking `touched` on both fields ensures the user has finished their thought process.
        maxRangeValidator(30)
      ]);
    }
    this.leaveForm.updateValueAndValidity();
  });
}
```

---

## Interview Tips

### What Interviewers Look For

1. **Understanding of Validation Levels**
   - When to use control vs FormGroup validators
   - How to access FormGroup from validator function
   - Difference between control.errors and formGroup.errors

2. **Error Handling**
   - Proper error display logic (touch state)
   - Distinguishing control errors from group errors
   - Rich error objects with metadata

3. **Code Quality**
   - Reusable validator functions
   - Proper TypeScript types
   - Separation of concerns (validator in separate file)
   - Clean template with template variables

4. **Edge Cases**
   - Handling empty fields
   - Catching same date scenario
   - Validating date objects properly
   - Display logic for multiple fields

### Discussion Points

**"Why did you apply the validator at FormGroup level?"**
> "Because I need to validate the relationship between two fields - start date and end date. A control-level validator only has access to one field's value, but I need to compare both dates. FormGroup-level validators receive the entire FormGroup as the `AbstractControl` parameter, so I can access both fields using `control.get()`."

**"How do you prevent showing the error too early?"**
> "I check if both related fields have been touched before displaying the group error. This prevents confusing users when they've only filled one field. The logic is: `(startTouched || submitted) && (endTouched || submitted)`. This ensures the error only appears after both fields have been interacted with."

**"Why return null for empty fields?"**
> "Returning null delegates empty field handling to the 'required' validator. This follows the single responsibility principle - each validator handles one concern. The required validator handles presence, and the date range validator handles the relationship between dates. If I validated empty fields here, I'd get conflicting error messages."

**"Could you make this validator reusable for other date pairs?"**
> "Yes! I could parameterize the field names:
>
> ```typescript
> export function dateRangeValidator(startField = 'startDate', endField = 'endDate'): ValidatorFn {
>   return (control: AbstractControl): ValidationErrors | null => {
>     const startDate = control.get(startField)?.value;
>     const endDate = control.get(endField)?.value;
>     // ... validation logic
>   };
> }
> ```
>
> Then use it like: `validators: [dateRangeValidator('checkIn', 'checkOut')]`"

---

## Quick Reference

### Validator Pattern

```typescript
export function crossFieldValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const field1 = control.get('field1')?.value;
    const field2 = control.get('field2')?.value;
    
    if (!field1 || !field2) return null;
    
    if (/* validation fails */) {
      return { errorKey: { message: '...' } };
    }
    
    return null;
  };
}
```

### Application

```typescript
this.fb.group({
  field1: ['', [Validators.required]],
  field2: ['', [Validators.required]]
}, {
  validators: [crossFieldValidator()]
})
```

### Error Check

```typescript
// In component
if (this.form.hasError('errorKey')) { }

// In template
@if (getGroupError(); as msg) {
  <div>{{ msg }}</div>
}
```

---

## Checklist

- [ ] Validator created in separate file
- [ ] Validator applied at FormGroup level (second parameter)
- [ ] Validator returns null for empty fields
- [ ] Uses `<=` to catch same and reversed dates
- [ ] Rich error object with metadata
- [ ] Group error display logic checks both fields touched
- [ ] Control errors and group errors displayed separately
- [ ] Template uses template variables (`as errorMsg`)
- [ ] Business logic methods implemented
- [ ] Form submission and reset working

---
