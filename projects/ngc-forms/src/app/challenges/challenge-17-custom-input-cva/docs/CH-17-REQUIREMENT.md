# Challenge 17: Custom Input using ControlValueAccessor

**Estimated Time:** 30-45 minutes  
**Difficulty:** Advanced

---

## 🎯 Problem Statement

Build a **reusable custom input component** that integrates seamlessly with Angular's reactive forms using the `ControlValueAccessor` interface.

### Context

Angular provides native form controls (`<input>`, `<select>`, etc.), but custom components don't automatically work with `formControlName` or reactive forms. **ControlValueAccessor** bridges this gap by defining a contract for bidirectional data flow between custom components and Angular's forms infrastructure.

### What You'll Build

- Custom input component (`ngc-input`) implementing CVA interface
- Demo form using the custom component with `formControlName`
- Parent-level validation with error display
- Disabled state propagation from parent form

### Key Challenge

Understand and implement the **4 CVA methods** that enable:

1. Form → Component communication (`writeValue`)
2. Component → Form communication (`registerOnChange`)
3. Touch tracking (`registerOnTouched`)
4. Disabled state handling (`setDisabledState`)

---

## Requirements

### Data Models

```typescript
interface UserFormData {
  name: string;
  email: string;
}

interface InputConfig {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
}
```

### Component Structure

| Component | Purpose |
|-----------|--------|
| **CustomInputComponent** | Reusable CVA input with label, placeholder, type support |
| **DemoFormComponent** | Parent form using custom inputs with validation |

### 1. CustomInputComponent (CVA)

**Selector:** `ngc-input`

**@Input Properties:**

- `label?: string` - Optional label text
- `placeholder: string` - Placeholder text (default: '')
- `type: 'text' \| 'email' \| ...` - Input type (default: 'text')

**ControlValueAccessor Methods:**

| Method | Purpose | Implementation |
|--------|---------|----------------|
| `writeValue(value)` | Form → Component | Update internal value: `this.value = value \|\| ''` |
| `registerOnChange(fn)` | Store callback | Save callback: `this.onChange = fn` |
| `registerOnTouched(fn)` | Store touch callback | Save callback: `this.onTouched = fn` |
| `setDisabledState(isDisabled)` | Handle disabled state | Update state: `this.disabled = isDisabled` |

**Event Handlers:**

- `onInputChange(event)` - User types → call `onChange(value)` → notify parent
- `onInputBlur()` - User leaves field → call `onTouched()` → mark touched

**Provider Configuration:**

```typescript
providers: [{
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomInputComponent),
  multi: true
}]
```

### 2. DemoFormComponent

**Form Structure:**

```typescript
this.userForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]]
});
```

**Template Usage:**

```html
<ngc-input 
  formControlName="name" 
  label="Full Name" 
  placeholder="Enter name">
</ngc-input>
```

**Validation Requirements:**

| Field | Validations |
|-------|-------------|
| **name** | Required, min 3 characters |
| **email** | Required, valid email format |

### 3. Error Display

**Functions:**

- `shouldShowError(field)` - Check if error should display (`invalid && touched`)
- `getErrorMessage(field)` - Return error message based on error type

**Error Messages:**

| Validation Error | Message |
|-----------------|----------|
| `required` | "This field is required" |
| `minlength` | "Minimum X characters required" |
| `email` | "Invalid email format" |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|----------|
| **ControlValueAccessor** | Interface for custom form controls |
| **NG_VALUE_ACCESSOR** | Injection token for CVA registration |
| **forwardRef()** | Prevent circular dependency in provider |
| **ReactiveFormsModule** | Parent form management |
| **FormBuilder** | Create form structure |
| **Validators** | Built-in validation (required, minLength, email) |
| **Signals** | Reactive state (submitted, showSuccessMessage) |
| **@Input** | Component configuration (label, placeholder, type) |
| **Event Binding** | Capture user input and blur events |

---

## 📤 Expected Output

### User Flow

1. User sees form with 2 custom input fields (name, email)
2. User types in name field → parent form updates immediately
3. User leaves field (blur) → field marked as touched
4. User submits with invalid data → errors display
5. User corrects errors → submit button becomes enabled
6. User submits valid form → success message displays
7. User clicks reset → form clears, errors hidden

### CVA Data Flow

```
┌─────────────────────────────────────────┐
│     PARENT FORM (ReactiveForm)         │
│   userForm = { name: '', email: '' }   │
└───────┬────────────────────┬────────────┘
        │ writeValue()       │ onChange()
        │ (Form → Component) │ (Component → Form)
        ▼                    ▲
┌─────────────────────────────────────────┐
│  CUSTOM INPUT (ControlValueAccessor)    │
│  - Receives value via writeValue()      │
│  - User types → calls onChange(value)   │
│  - User blurs → calls onTouched()       │
└─────────────────────────────────────────┘
```

### Test Scenarios

| Scenario | Action | Expected Result |
|----------|--------|----------------|
| **Data Flow** | Type "John" in name field | `form.value.name === "John"` immediately |
| **Validation** | Submit with empty name | "This field is required" displays |
| **Min Length** | Type "Jo" (2 chars) | "Minimum 3 characters required" displays |
| **Touch Tracking** | Click in field, then blur | Field marked as touched, errors show if invalid |
| **Disabled State** | Call `form.get('name')?.disable()` | Name input appears disabled, cannot type |
| **Programmatic Update** | Call `form.patchValue({ name: 'Jane' })` | Input displays "Jane" |
| **Reset** | Click reset button | Form clears, errors hidden, 1 empty entry |

---

## ✅ Success Criteria

### Implementation Checklist

- [ ] CustomInputComponent implements all 4 CVA methods
- [ ] NG_VALUE_ACCESSOR provider with forwardRef configured
- [ ] Component works with formControlName directive
- [ ] User input triggers onChange callback → parent updates
- [ ] Blur event triggers onTouched callback → marks touched
- [ ] Disabled state propagates from parent form
- [ ] Demo form has 2 fields (name, email) with validations
- [ ] Validation happens at parent form level (not in CVA)
- [ ] Errors display based on parent form state (touched + invalid)
- [ ] Submit button disabled when form invalid

### Interview Discussion Topics

| Topic | Key Points |
|-------|------------|
| **What is CVA?** | Interface bridging custom components with reactive forms, 4 methods for bidirectional data flow |
| **Data Flow** | writeValue (Form→Component), onChange (Component→Form), onTouched (touch tracking), setDisabledState (disabled sync) |
| **Why forwardRef?** | References class in its own metadata before definition complete, prevents circular dependency |
| **Why multi: true?** | Allows multiple CVA providers in same form, Angular supports multiple NG_VALUE_ACCESSOR tokens |
| **Validation Location?** | Parent form level - keeps component reusable, business logic separate from UI |
| **CVA vs @Input/@Output?** | CVA integrates with reactive forms infrastructure, supports formControlName, validation, disabled state |

### Common Pitfalls

| Issue | Solution |
|-------|----------|
| **Forgot forwardRef** | Wrap class: `forwardRef(() => CustomInputComponent)` |
| **Not calling onChange** | Call `this.onChange(value)` in input event handler |
| **Validation in CVA** | Move all validators to parent form definition |
| **Null handling** | Handle null in writeValue: `this.value = value \|\| ''` |
| **useClass instead of useExisting** | Use `useExisting` to ensure singleton instance |
| **Missing multi: true** | Add `multi: true` in provider configuration |

---

## ✅ Completion Checklist

- [ ] All 4 CVA methods implemented correctly
- [ ] Component works with formControlName directive
- [ ] Bidirectional data flow working (type → form updates, patchValue → input updates)
- [ ] Touch tracking functional (blur → marks touched)
- [ ] Disabled state handled (parent disable → input disabled)
- [ ] Validation at parent form level
- [ ] Error display based on parent form state
- [ ] Clean, well-commented code
- [ ] Can explain CVA data flow clearly
