# Challenge 12: Reactive Login Form

**Estimated Time:** 30-45 minutes  
**Difficulty:** Beginner

---

## Description

Build a fully functional login form using Angular's **Reactive Forms** approach. This challenge focuses on mastering `FormGroup`, `FormControl`, built-in validators, and dynamic error handling in templates.

---

## Requirements

### 1. Form Structure

Create a login form with the following fields:

- **Email Field**
  - Type: `email`
  - Validation: Required, must be a valid email format
  - Placeholder: "Enter your email"
  
- **Password Field**
  - Type: `password`
  - Validation: Required, minimum length of 6 characters
  - Placeholder: "Enter your password (min 6 characters)"

### 2. Validation Requirements

#### Email Validation
- Show "Email is required" when field is empty and touched
- Show "Please enter a valid email address" when format is invalid
- Display green checkmark when valid

#### Password Validation
- Show "Password is required" when field is empty and touched
- Show "Password must be at least 6 characters (current: X)" when too short
- Display green checkmark when valid

#### Error Display Rules
- Errors should only appear after the field has been **touched** or **dirty**
- Errors must appear when form is **submitted** even if fields haven't been touched
- Use inline error messages below each field with appropriate styling

### 3. Submit Button Behavior

- Button should be **disabled** when the form is **invalid**
- Button should be **enabled** when all validations pass
- On successful submit, display a success message
- Log form values to console for verification

### 4. Additional Features

- **Reset Button**: Clear all form values and validation states
- **Form Status Display**: Show real-time form status (Valid/Invalid, Touched, Dirty)
- **Success Message**: Display user-friendly success message after valid submission
- **Form Preview**: Show current form values in JSON format for learning purposes

---

## Architecture

### Component Layer
- **Component Name**: `LoginFormComponent`
- **Location**: `components/login-form/`
- Use Angular's `FormBuilder` to create the form
- Implement proper lifecycle hooks (`ngOnInit`)
- Use Angular Signals for reactive state management

### Model Layer
- **Interface**: `LoginCredentials`
- **Location**: `models/login-credentials.ts`
- Properties:
  - `email: string`
  - `password: string`

### Form Configuration
```typescript
loginForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]]
});
```

---

## Constraints & Expectations

1. **Reactive Forms Only**: Use `ReactiveFormsModule`, not Template-driven Forms
2. **Standalone Components**: Component must be standalone with proper imports
3. **Type Safety**: Use TypeScript interfaces for form data
4. **No Direct DOM Manipulation**: Use Angular's form API exclusively
5. **Accessibility**: Include proper labels, ARIA attributes, and semantic HTML
6. **Best Practices**: Follow Angular style guide and coding conventions

---

## UI/UX Requirements

### Layout
- Centered card layout with gradient background
- Clean, modern design with proper spacing
- Responsive design for mobile and desktop

### Visual Feedback
- Red border and error message for invalid fields
- Green border and success message for valid fields
- Disabled button with reduced opacity
- Success alert with animation
- Smooth transitions for all state changes

### Color Scheme
- Primary: Green gradient (#a8e063 to #56ab2f)
- Error: Red (#e74c3c)
- Success: Green (#27ae60)
- Neutral: Gray tones for secondary elements

---

## Technical Concepts Tested

### 1. Reactive Forms API
- Creating `FormGroup` with `FormBuilder`
- Defining `FormControl` instances
- Accessing form controls in templates
- Form state management

### 2. Validators
- Built-in validators: `Validators.required`
- Email validation: `Validators.email`
- Length validation: `Validators.minLength(6)`
- Custom error message generation

### 3. Template Binding
- `[formGroup]` directive
- `formControlName` directive
- Property binding for dynamic classes
- Event binding for form submission

### 4. Error Handling
- Checking control validity: `field.invalid`
- Checking control state: `field.touched`, `field.dirty`
- Accessing errors: `field.hasError()`, `field.getError()`
- Conditional error display with `@if`

### 5. Form State
- `valid` / `invalid`
- `touched` / `untouched`
- `dirty` / `pristine`
- `submitted`

---

## Best Practices

### Code Organization
Separate concerns: Component logic, template, styles  
Use TypeScript interfaces for type safety  
Create helper methods for common operations  
Use getter methods for clean template access  

### Form Design
Initialize form in `ngOnInit()`  
Use `FormBuilder` for cleaner syntax  
Mark all fields as touched on submit  
Provide clear, user-friendly error messages  

### Template Design
Use semantic HTML (`<form>`, `<label>`, proper input types)  
Add `novalidate` to prevent browser validation  
Include `autocomplete` attributes  
Use Angular's new control flow (`@if`)  

### Accessibility
Proper label-input associations  
ARIA roles for error messages (`role="alert"`)  
Keyboard navigation support  
Focus management  

---

## Example Usage

```typescript
// Component initialization
ngOnInit(): void {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
}

// Form submission
onSubmit(): void {
  if (this.loginForm.valid) {
    const credentials: LoginCredentials = this.loginForm.value;
    console.log('Login attempt:', credentials);
  }
}
```

```html
<!-- Template binding -->
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <input type="email" formControlName="email" />
  
  @if (hasError('email')) {
    <div class="error">{{ getErrorMessage('email') }}</div>
  }
  
  <button [disabled]="loginForm.invalid">Login</button>
</form>
```

---

## Evaluation Criteria

Your solution will be evaluated on:

1. **Correct Implementation** (40%)
   - Proper use of FormGroup and FormControl
   - Correct validator application
   - Proper form state management

2. **Error Handling** (30%)
   - Dynamic error messages
   - Appropriate error display timing
   - User-friendly error text

3. **Code Quality** (20%)
   - Clean, readable code
   - Type safety
   - Proper component structure
   - Best practices adherence

4. **UI/UX** (10%)
   - Visual feedback for validation states
   - Disabled button behavior
   - Success message display
   - Overall user experience

---

## Resources

- [Angular Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [Form Validation](https://angular.dev/guide/forms/form-validation)
- [FormBuilder API](https://angular.dev/api/forms/FormBuilder)
- [Validators API](https://angular.dev/api/forms/Validators)

---

## Next Steps

After completing this challenge:
1. Explore custom validators
2. Learn about async validators
3. Implement cross-field validation
4. Study form arrays for dynamic forms
5. Add password strength indicator

---

**Good luck!**
