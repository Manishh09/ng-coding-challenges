# Challenge 17: Custom Input using ControlValueAccessor

## 🎯 Overview

This challenge demonstrates how to build a reusable custom input component using Angular's `ControlValueAccessor` interface. You'll learn how to create form controls that integrate seamlessly with Angular's reactive forms infrastructure.

## 📚 What You'll Learn

- Implement `ControlValueAccessor` interface with all 4 methods
- Configure `NG_VALUE_ACCESSOR` provider with `forwardRef`
- Understand bidirectional data flow between forms and custom components
- Work with `formControlName` directive on custom components
- Handle disabled state propagation from parent forms
- Implement touch tracking for validation UX
- Validate at parent level while keeping components reusable

## 🏗️ Project Structure

```
challenge-16-custom-input-cva/
├── models/
│   └── user-form.model.ts          # TypeScript interfaces
├── components/
│   ├── custom-input/               # Reusable CVA component
│   │   ├── custom-input.component.ts
│   │   ├── custom-input.component.html
│   │   ├── custom-input.component.scss
│   │   └── custom-input.component.spec.ts
│   └── demo-form/                  # Demo form using custom input
│       ├── demo-form.component.ts
│       ├── demo-form.component.html
│       ├── demo-form.component.scss
│       └── demo-form.component.spec.ts
└── docs/
    ├── CH-16-REQUIREMENT.md        # Detailed requirements
    └── CH-16-SOLUTION_GUIDE.md     # Step-by-step solution guide
```

## 🔑 Key Concepts

### ControlValueAccessor Interface

The `ControlValueAccessor` interface has 4 essential methods:

1. **writeValue(value: any)**: Called when the form updates the control value
   - Data Flow: Form → Component
   - Purpose: Update component's internal value

2. **registerOnChange(fn: any)**: Registers callback for value changes
   - Data Flow: Component → Form
   - Purpose: Notify parent form when user changes value

3. **registerOnTouched(fn: any)**: Registers callback for touch tracking
   - Purpose: Mark field as touched when user interacts
   - Important for validation error display logic

4. **setDisabledState(isDisabled: boolean)**: Handle disabled state
   - Purpose: Sync disabled state from parent form
   - Enables/disables the input based on parent form state

### Provider Configuration

```typescript
providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomInputComponent),
    multi: true
  }
]
```

- **NG_VALUE_ACCESSOR**: Token that Angular uses to find CVA implementations
- **forwardRef()**: Prevents circular dependency errors
- **multi: true**: Allows multiple CVAs in the same form

## 🚀 Features

### Custom Input Component

- ✅ Implements all 4 CVA methods
- ✅ Supports `formControlName` directive
- ✅ Configurable label, placeholder, and input type
- ✅ Handles disabled state from parent
- ✅ Touch tracking on blur
- ✅ Clean, reusable design

### Demo Form

- ✅ Two fields: name (required, minLength) and email (required, email format)
- ✅ Parent-level validation (not inside CVA)
- ✅ Error display based on form state
- ✅ Success message on valid submission
- ✅ Form reset functionality
- ✅ Responsive two-column layout

## 📖 Documentation

- **[Requirement Document](./docs/CH-16-REQUIREMENT.md)**: Detailed challenge requirements, acceptance criteria, and test scenarios
- **[Solution Guide](./docs/CH-16-SOLUTION_GUIDE.md)**: Step-by-step implementation guide with explanations, best practices, and interview talking points

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests for custom input component
npm test -- --include='**/custom-input.component.spec.ts'

# Run tests for demo form
npm test -- --include='**/demo-form.component.spec.ts'
```

## 💡 Usage Example

```typescript
// In parent component
this.userForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]]
});
```

```html
<!-- In template -->
<form [formGroup]="userForm">
  <ngc-input
    formControlName="name"
    label="Full Name"
    placeholder="Enter your name">
  </ngc-input>
  
  @if (shouldShowError('name')) {
    <div class="error">{{ getErrorMessage('name') }}</div>
  }
</form>
```

## 🎓 Interview Preparation

### Common Questions

1. **Why ControlValueAccessor instead of @Input/@Output?**
   - CVA integrates with reactive forms infrastructure
   - Supports formControlName and disabled state
   - Standard Angular pattern for custom form controls

2. **When is each CVA method called?**
   - `writeValue()`: Form sets value programmatically
   - `registerOnChange()`: During component initialization
   - `registerOnTouched()`: During component initialization
   - `setDisabledState()`: When parent enables/disables control

3. **Where should validation happen?**
   - Always at the parent form level
   - Keeps CVA component reusable
   - Separates concerns: UI vs business logic

## 🏆 Learning Outcomes

After completing this challenge, you will be able to:

- ✅ Build truly reusable form controls
- ✅ Integrate custom components with reactive forms
- ✅ Explain the CVA data flow pattern
- ✅ Handle touch tracking and disabled state
- ✅ Validate forms at the appropriate level
- ✅ Use forwardRef to avoid circular dependencies
- ✅ Discuss CVA patterns confidently in interviews

## 📚 Additional Resources

- [Angular ControlValueAccessor API](https://angular.io/api/forms/ControlValueAccessor)
- [Custom Form Controls Guide](https://angular.io/guide/forms/form-validation#custom-validators)
- [forwardRef Documentation](https://angular.io/api/core/forwardRef)

## ⏱️ Estimated Time

**30-45 minutes** (interview-focused implementation)

---

**Difficulty**: Advanced  
**Category**: Angular Forms  
**Tags**: ControlValueAccessor, Custom Form Controls, NG_VALUE_ACCESSOR, Reusable Components, forwardRef, Reactive Forms
