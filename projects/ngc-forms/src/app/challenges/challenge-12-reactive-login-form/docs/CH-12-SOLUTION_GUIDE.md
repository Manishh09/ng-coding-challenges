# Solution: Reactive Forms

## 🧠 Approach
We use Angular's **ReactiveFormsModule** because it allows strict testing and logic separation from the template.
1.  **TypeScript**: Define the `FormGroup`.
2.  **HTML**: Bind to `[formGroup]`.
3.  **Feedback**: Use `control.hasError()` and `control.touched`.

## 🚀 Step-by-Step Implementation

### Step 1: Component Logic
```typescript
@Component({ ... imports: [ReactiveFormsModule, NgIf] ... })
export class LoginComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Helper for template
  get f() { return this.form.controls; }

  login() {
    if (this.form.valid) {
      console.log('Login Payload:', this.form.value);
    }
  }
}
```

### Step 2: Template
```html
<form [formGroup]="form" (ngSubmit)="login()">
  <!-- Email -->
  <label>Email</label>
  <input formControlName="email" type="email">
  @if (f.email.touched && f.email.invalid) {
    <div class="error">
      @if (f.email.hasError('required')) { Email is required }
      @if (f.email.hasError('email')) { Invalid Email Format }
    </div>
  }

  <!-- Password -->
  <label>Password</label>
  <input formControlName="password" type="password">
  @if (f.password.touched && f.password.invalid) {
    <div class="error">Min length is 6</div>
  }

  <button [disabled]="form.invalid">Login</button>
</form>
```

## 🌟 Best Practices Used
*   **Control Accessor**: Defining `get f() { return this.form.controls }` makes the HTML much cleaner (`f.email` vs `form.get('email')`).
*   **Touched Check**: Always check `touched` before showing errors to avoid annoying the user immediately upon page load.
*   **Typed Forms (New in Angular 14+)**: The implicit typing of `fb.group` prevents us from accidentally assigning a number to an email field.
