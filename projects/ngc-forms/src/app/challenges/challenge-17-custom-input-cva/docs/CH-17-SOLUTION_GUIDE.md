# Challenge 17: Custom Input using ControlValueAccessor - Solution Guide

**Difficulty:** 🟡 Intermediate  
**Estimated Time:** 30-40 minutes

---

## 📚 Solution Overview

**ControlValueAccessor (CVA)** bridges custom components with Angular's reactive forms. It defines 4 methods enabling bidirectional data flow:

1. **writeValue()** - Form → Component (Angular calls when form value changes)
2. **registerOnChange()** - Store callback for Component → Form communication
3. **registerOnTouched()** - Store callback for touch tracking
4. **setDisabledState()** - Sync disabled state from parent

**Key Pattern:**
```typescript
@Component({
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomInputComponent),
    multi: true
  }]
})
export class CustomInputComponent implements ControlValueAccessor { }
```

---

## 📝 Implementation Steps

### Step 1: Define Models

**File**: `models/user-form.model.ts`

```typescript
export interface UserFormData {
  name: string;
  email: string;
}

export interface InputConfig {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
}
```

### Step 2: CustomInputComponent (CVA)

**File**: `components/custom-input/custom-input.component.ts`

```typescript
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ngc-input',
  standalone: true,
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomInputComponent),
    multi: true
  }]
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'email' | 'tel' | 'password' | 'number' = 'text';

  value: string = '';
  disabled: boolean = false;

  // Callbacks stored by Angular
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  // 1️⃣ Form → Component
  writeValue(value: any): void {
    this.value = value || '';
  }

  // 2️⃣ Store Component → Form callback
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // 3️⃣ Store touch tracking callback
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // 4️⃣ Handle disabled state
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // User interaction: input change
  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value); // Notify parent form
  }

  // User interaction: blur
  onInputBlur(): void {
    this.onTouched(); // Mark as touched
  }
}
```

**Key Points:**
- `NG_VALUE_ACCESSOR` provider with `forwardRef` + `multi: true`
- Store callbacks in `registerOnChange` and `registerOnTouched`
- Call `onChange(value)` when user types
- Call `onTouched()` on blur
- Handle null in `writeValue`

### Step 3: CustomInput Template

**File**: `components/custom-input/custom-input.component.html`

```html
<div class="custom-input-wrapper">
  @if (label) {
    <label class="input-label">{{ label }}</label>
  }
  <input
    class="input-field"
    [type]="type"
    [value]="value"
    [placeholder]="placeholder"
    [disabled]="disabled"
    (input)="onInputChange($event)"
    (blur)="onInputBlur()" />
</div>
```

**Bindings:**
- `[value]="value"` - Display current value
- `[disabled]="disabled"` - Reflect disabled state
- `(input)` - User types → `onChange(value)`
- `(blur)` - User leaves → `onTouched()`

### Step 4: DemoFormComponent

**File**: `components/demo-form/demo-form.component.ts`

```typescript
export class DemoFormComponent implements OnInit {
  userForm!: FormGroup;
  submitted = signal(false);

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  shouldShowError(field: string): boolean {
    const control = this.userForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.userForm.get(field);
    if (!control?.errors) return '';
    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['email']) return 'Invalid email format';
    return '';
  }
}
```

### Step 5: DemoForm Template

**File**: `components/demo-form/demo-form.component.html`

```html
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <div class="form-field">
    <ngc-input
      formControlName="name"
      label="Full Name"
      placeholder="Enter name"
      type="text">
    </ngc-input>
    @if (shouldShowError('name')) {
      <div class="error-message">{{ getErrorMessage('name') }}</div>
    }
  </div>

  <div class="form-field">
    <ngc-input
      formControlName="email"
      label="Email Address"
      placeholder="Enter email"
      type="email">
    </ngc-input>
    @if (shouldShowError('email')) {
      <div class="error-message">{{ getErrorMessage('email') }}</div>
    }
  </div>

  <button type="submit" [disabled]="userForm.invalid && submitted()">
    Submit
  </button>
</form>
```

**Key Pattern:**
```html
<ngc-input formControlName="name" ... ></ngc-input>
```
Works exactly like native `<input formControlName="name">`!

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────┐
│   PARENT FORM (ReactiveForm)   │
│   userForm = { name: '' }       │
└─────┬──────────────────┬─────────┘
      │ writeValue()      │ onChange()
      │ (Form→Component)  │ (Component→Form)
      ▼                   ▲
┌─────────────────────────────────────┐
│  CUSTOM INPUT (CVA)            │
│  User types → onChange(value)  │
│  User blurs → onTouched()      │
└─────────────────────────────────────┘
```

---

## 💡 Interview Discussion Points

### What is ControlValueAccessor?
"CVA is the bridge between custom components and reactive forms. It's an interface with 4 methods enabling bidirectional data flow, making custom components work like native inputs with formControlName."

### Explain Each CVA Method

| Method | Purpose | When Called |
|--------|---------|-------------|
| **writeValue** | Form→Component | Angular calls when form value changes programmatically (`patchValue`, `setValue`) |
| **registerOnChange** | Store callback | Angular passes callback, we call it when user input changes |
| **registerOnTouched** | Store touch callback | Angular passes callback, we call it on blur to mark touched |
| **setDisabledState** | Sync disabled state | Angular calls when parent enables/disables control |

### Why forwardRef()?
"We reference the class in its own decorator metadata before the class is fully defined. `forwardRef` delays evaluation until runtime, preventing circular dependency errors."

### Why multi: true?
"`multi: true` allows multiple providers for NG_VALUE_ACCESSOR token. A form can have multiple CVA components, so Angular needs to support multiple implementations."

### Where Should Validation Happen?
"Parent form level, not inside CVA. This keeps the component reusable and focused on UI. Business logic (validation rules) stays separate in the parent."

### CVA vs @Input/@Output?

| Aspect | CVA | @Input/@Output |
|--------|-----|----------------|
| **Integration** | Automatic with reactive forms | Manual binding |
| **Usage** | `formControlName="field"` | `[(ngModel)]="value"` |
| **Validation** | Integrated | Manual |
| **Disabled State** | Automatic sync | Manual handling |
| **Touch Tracking** | Built-in | Manual |

---

## ⚠️ Common Pitfalls

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Missing forwardRef** | "Can't resolve parameters" error | Wrap: `forwardRef(() => CustomInputComponent)` |
| **Not calling onChange** | Form doesn't update when typing | Call `this.onChange(value)` in input handler |
| **Validation in CVA** | Component not reusable | Move validators to parent form definition |
| **Null handling** | Error on reset/init | Handle in writeValue: `this.value = value \|\| ''` |
| **useClass vs useExisting** | Multiple instances created | Use `useExisting` not `useClass` |
| **Missing multi: true** | Provider conflicts | Add `multi: true` in provider config |

---

## 🧪 Key Tests

```typescript
describe('CustomInputComponent - CVA', () => {
  it('should update parent form when user types', () => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'John';
    input.dispatchEvent(new Event('input'));
    expect(component.userForm.value.name).toBe('John');
  });

  it('should update component when form value changes', () => {
    component.userForm.patchValue({ name: 'Jane' });
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('Jane');
  });

  it('should mark field as touched on blur', () => {
    const input = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('blur'));
    expect(component.userForm.get('name')?.touched).toBe(true);
  });

  it('should handle disabled state', () => {
    component.userForm.get('name')?.disable();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBe(true);
  });
});
```

---

## ✅ Completion Checklist

- [ ] CustomInputComponent implements all 4 CVA methods
- [ ] NG_VALUE_ACCESSOR provider with forwardRef configured
- [ ] Component works with formControlName directive
- [ ] User input triggers onChange → parent form updates
- [ ] Blur triggers onTouched → marks field touched
- [ ] Disabled state propagates from parent
- [ ] Demo form validates at parent level
- [ ] Errors display from parent form state
- [ ] Null handling in writeValue
- [ ] Can explain CVA data flow clearly
- [ ] Tests cover all 4 CVA methods
