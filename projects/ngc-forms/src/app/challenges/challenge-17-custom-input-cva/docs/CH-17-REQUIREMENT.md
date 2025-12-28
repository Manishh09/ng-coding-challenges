# Challenge 16: Custom Input using ControlValueAccessor

## 📋 Overview

Build a reusable custom input component implementing the `ControlValueAccessor` interface to work seamlessly with Angular's reactive forms. This challenge teaches you how to bridge the gap between custom components and Angular's forms infrastructure.

## 🎯 Learning Objectives

By completing this challenge, you will learn:

- ✅ Implement `ControlValueAccessor` interface with all 4 methods
- ✅ Configure `NG_VALUE_ACCESSOR` provider with `forwardRef`
- ✅ Understand bidirectional data flow: Form ↔ Component
- ✅ Use custom controls with `formControlName` directive
- ✅ Handle disabled state propagation from parent form
- ✅ Validate at parent level (not inside CVA component)
- ✅ Display errors from parent form state

## 🔑 Key Concepts

### What is ControlValueAccessor?

`ControlValueAccessor` is an interface that bridges Angular's reactive forms and custom components. It defines 4 essential methods that enable bidirectional data flow:

1. **writeValue(value)**: Form → Component (receive values)
2. **registerOnChange(fn)**: Register callback for Component → Form communication
3. **registerOnTouched(fn)**: Register callback for touch tracking
4. **setDisabledState(isDisabled)**: Handle disabled state from parent

### Why Use ControlValueAccessor?

- ✅ Makes custom components work like native inputs
- ✅ Enables use with `formControlName` directive
- ✅ Supports two-way binding with `[(ngModel)]`
- ✅ Integrates with Angular's validation system
- ✅ Reusable across different forms

### Data Flow Pattern

```
Parent Form (ReactiveForm)
    ↓ writeValue()
Custom Component (CVA)
    ↓ onChange() callback
Parent Form (receives value)
```

## 📝 Requirements

### Part 1: Custom Input Component

Create `CustomInputComponent` implementing `ControlValueAccessor`:

```typescript
@Component({
  selector: 'ngc-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  // Implement 4 CVA methods here
}
```

#### Required @Input Properties

- `label?: string` - Optional label text
- `placeholder?: string` - Placeholder text
- `type?: string` - Input type (text, email, tel, password, number)

#### Required CVA Methods

1. **writeValue(value: any): void**
   - Called when the form updates the control value
   - Updates the internal value of the component
   - Example: `this.value = value || '';`

2. **registerOnChange(fn: any): void**
   - Registers a callback function that Angular calls when the component value changes
   - Store this callback: `this.onChange = fn;`
   - Call it when user input changes: `this.onChange(newValue);`

3. **registerOnTouched(fn: any): void**
   - Registers a callback for touch tracking
   - Store this callback: `this.onTouched = fn;`
   - Call it on blur: `this.onTouched();`

4. **setDisabledState(isDisabled: boolean): void**
   - Called when the parent form enables/disables the control
   - Update internal state: `this.disabled = isDisabled;`

#### Event Handlers

```typescript
onInputChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  this.value = value;
  this.onChange(value); // Notify parent form
}

onInputBlur(): void {
  this.onTouched(); // Mark as touched
}
```

### Part 2: Demo Form Component

Create a demo form that uses the custom input component:

```typescript
this.userForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]]
});
```

#### Template Usage

```html
<form [formGroup]="userForm">
  <ngc-input
    formControlName="name"
    label="Full Name"
    placeholder="Enter your name">
  </ngc-input>
  
  <!-- Error display from parent form -->
  @if (shouldShowError('name')) {
    <div class="error">{{ getErrorMessage('name') }}</div>
  }
</form>
```

### Part 3: Error Display

Display validation errors from parent form state:

```typescript
shouldShowError(field: string): boolean {
  const control = this.userForm.get(field);
  return !!(control?.invalid && control?.touched);
}

getErrorMessage(field: string): string {
  const control = this.userForm.get(field);
  if (control?.errors?.['required']) return 'Field is required';
  if (control?.errors?.['minlength']) return 'Too short';
  if (control?.errors?.['email']) return 'Invalid email';
  return '';
}
```

## ✅ Acceptance Criteria

- [ ] Custom input component implements all 4 CVA methods
- [ ] NG_VALUE_ACCESSOR provider configured with forwardRef
- [ ] Component works with formControlName directive
- [ ] User input triggers onChange callback
- [ ] Blur event triggers onTouched callback
- [ ] Disabled state propagates from parent form
- [ ] Demo form has 2 fields: name and email
- [ ] Validation happens at parent form level
- [ ] Errors display based on parent form state
- [ ] Submit button disabled when form invalid

## 🧪 Test Scenarios

### Scenario 1: Basic Data Flow

1. Type "John" in name field
2. **Expected**: Parent form receives value immediately
3. **Expected**: form.value.name === "John"

### Scenario 2: Validation

1. Leave name field empty
2. Click submit
3. **Expected**: "Name is required" error displays
4. Type "Jo" (2 characters)
5. **Expected**: "Name must be at least 3 characters" error displays

### Scenario 3: Touch Tracking

1. Click in name field
2. Click outside (blur)
3. **Expected**: onTouched() called
4. **Expected**: Field marked as touched
5. **Expected**: Errors now visible (if invalid)

### Scenario 4: Disabled State

1. Add code: `this.userForm.get('name')?.disable();`
2. **Expected**: Name input appears disabled
3. **Expected**: Cannot type in field

## 💡 Interview Talking Points

### Why ControlValueAccessor?

"ControlValueAccessor bridges custom components with Angular's reactive forms. It provides standardized methods for bidirectional data flow, making our component behave like a native input."

### Data Flow Explanation

"When the user types, we call onChange(value) to notify the parent form. When the form updates programmatically, Angular calls writeValue(value) to update our component."

### Why Validate at Parent Level?

"Validation logic belongs in the parent form, not in the reusable component. This keeps the component focused on UI and user interaction, while the parent manages business rules."

### forwardRef() Purpose

"We use forwardRef because we're referencing the class in its own metadata before it's fully defined. This prevents circular dependency errors."

## 📚 Resources

- [Angular ControlValueAccessor Guide](https://angular.io/api/forms/ControlValueAccessor)
- [Custom Form Controls](https://angular.io/guide/forms/form-validation#custom-validators)
- [forwardRef Documentation](https://angular.io/api/core/forwardRef)

## ⏱️ Estimated Time

**30-45 minutes** (interview-focused scope)

## 🏆 Success Indicators

- ✅ All 4 CVA methods implemented correctly
- ✅ Component works with formControlName
- ✅ Bidirectional data flow working
- ✅ Touch tracking functional
- ✅ Disabled state handled
- ✅ Validation at parent level
- ✅ Clean, well-commented code

## 🚀 Challenge Yourself

If you finish early:

- Add support for error display inside component (optional @Input)
- Add custom styling for focus states
- Support for custom validators
- Add prefix/suffix slots (icon support)
