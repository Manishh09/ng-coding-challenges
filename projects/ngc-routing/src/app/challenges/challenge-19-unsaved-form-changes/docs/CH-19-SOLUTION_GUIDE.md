# Solution: canDeactivate Guard

## 🧠 Approach

The `canDeactivate` guard prevents navigation when a component has unsaved changes. Unlike `canActivate` (protects entry), `canDeactivate` protects exit.

**Pattern:**

1. **Interface**: Define `CanDeactivateComponent` with `canDeactivate()` method.
2. **Guard**: Check component state before allowing navigation.
3. **Component**: Implement interface, track form `dirty` and `saved` states.
4. **Dialog**: Show confirmation only when form is dirty and not saved.

**Key Distinction:**

* **Router Guard** (`canDeactivate`): Handles internal navigation (links, router.navigate, back button).
* **Browser Event** (`beforeunload`): Handles browser close/refresh (separate implementation).

---

## 🚀 Step-by-Step Implementation

### Step 1: Define the Interface

**File**: `models/can-deactivate-component.interface.ts`

```typescript
import { Observable } from 'rxjs';

export interface CanDeactivateComponent {
  canDeactivate(): boolean | Observable<boolean>;
}
```

**Why?**  
Creates a contract between guard and component. Any component implementing this interface can use the guard—making it reusable across multiple forms.

---

### Step 2: Confirmation Dialog Service

**File**: `services/confirm-dialog.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  confirm(message: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      // Use native confirm for simplicity (production: Angular Material Dialog)
      const result = window.confirm(message);
      observer.next(result);
      observer.complete();
    });
  }

  getUnsavedChangesMessage(): string {
    return 'You have unsaved changes. Are you sure you want to leave?';
  }
}
```

**Production Enhancement:**  
Replace `window.confirm()` with Angular Material Dialog for better UX.

---

### Step 3: The canDeactivate Guard

**File**: `guards/can-deactivate.guard.ts`

```typescript
import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CanDeactivateComponent } from '../models/can-deactivate-component.interface';
import { ConfirmDialogService } from '../services/confirm-dialog.service';

export const canDeactivateGuard: CanDeactivateFn<CanDeactivateComponent> = (
  component
): boolean | Observable<boolean> => {
  const confirmService = inject(ConfirmDialogService);

  // Safety check: component must implement interface
  if (!component || typeof component.canDeactivate !== 'function') {
    return true;
  }

  const canDeactivate = component.canDeactivate();

  // Allow navigation if component says ok
  if (canDeactivate === true) {
    return true;
  }

  // Block and show confirmation if component says no
  if (canDeactivate === false) {
    return confirmService.confirm(
      confirmService.getUnsavedChangesMessage()
    );
  }

  // Handle Observable case (async checks)
  return canDeactivate;
};
```

**Critical Points:**

* **Generic Type**: `CanDeactivateFn<CanDeactivateComponent>` enforces type safety.
* **Inject Function**: Modern Angular DI (no constructor needed).
* **Three Cases**: `true` (allow), `false` (confirm), `Observable` (async).
* **Delegation**: Guard asks component, component knows its state.

---

### Step 4: Component Implementation

**File**: `components/user-form/user-form.component.ts`

```typescript
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, CanDeactivateComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  userForm!: FormGroup;
  saved = signal(false);
  saving = signal(false);

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

  // ============================================
  // CORE: CanDeactivateComponent Implementation
  // ============================================
  canDeactivate(): boolean {
    // Allow if form hasn't been touched
    if (this.userForm.pristine) return true;

    // Allow if form was successfully saved
    if (this.saved()) return true;

    // Block if form has unsaved changes
    return false;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }
    this.saveForm();
  }

  private saveForm(): void {
    this.saving.set(true);

    // Simulate API call
    setTimeout(() => {
      console.log('User data saved:', this.userForm.value);
      
      this.saving.set(false);
      this.saved.set(true);
      
      // CRITICAL: Mark form as pristine after save
      this.userForm.markAsPristine();
      
      // Auto-navigate after save
      setTimeout(() => {
        this.router.navigate(['/challenges/angular-routing']);
      }, 1000);
    }, 1500);
  }

  // ============================================
  // EDGE CASE: Browser Refresh/Close Protection
  // ============================================
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.userForm.dirty && !this.saved()) {
      $event.returnValue = true; // Triggers browser warning
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsTouched();
    });
  }
}
```

**Key Implementation Details:**

#### 1. Interface Implementation

```typescript
canDeactivate(): boolean {
  return this.userForm.pristine || this.saved();
}
```

Returns `false` when form is dirty AND not saved—triggering the guard.

#### 2. Form State Management

```typescript
userForm.dirty      // Angular tracks changes automatically
userForm.pristine   // Opposite of dirty
saved = signal(false)  // Custom flag for post-save navigation
```

#### 3. Post-Save Behavior

```typescript
this.saved.set(true);
this.userForm.markAsPristine();  // CRITICAL!
```

Both are required. Without `markAsPristine()`, form stays dirty despite save flag.

#### 4. Browser Refresh Protection

```typescript
@HostListener('window:beforeunload', ['$event'])
unloadNotification($event: BeforeUnloadEvent): void {
  if (this.userForm.dirty && !this.saved()) {
    $event.returnValue = true;
  }
}
```

**Separate from router guards!** Router guards handle internal navigation. `beforeunload` handles browser close/refresh/tab close.

---

### Step 5: Register Guard in Routes

**File**: `app.routes.ts`

```typescript
import { canDeactivateGuard } from './challenges/challenge-19-unsaved-form-changes/guards/can-deactivate.guard';

const CHALLENGE_COMPONENTS = {
  'unsaved-form-changes': () =>
    import('./challenges/challenge-19-unsaved-form-changes/components/user-form/user-form.component')
      .then(m => m.UserFormComponent),
};

export const NGC_ROUTING_ROUTES: Routes = [
  ...Object.entries(CHALLENGE_COMPONENTS).map(([challengeId, componentLoader]) => ({
    path: challengeId,
    children: [
      {
        path: 'workspace',
        loadComponent: componentLoader,
        canDeactivate: challengeId === 'unsaved-form-changes' 
          ? [canDeactivateGuard] 
          : [],
        data: { /* ... */ }
      }
    ]
  }))
];
```

---

## 🌟 Best Practices Used

### 1. Interface Pattern for Reusability

**Without Interface** (Tightly Coupled):

```typescript
export const guard: CanDeactivateFn<UserFormComponent> = (component) => {
  return component.userForm.pristine;  // Knows internal details
};
```

**With Interface** (Loosely Coupled):

```typescript
export const guard: CanDeactivateFn<CanDeactivateComponent> = (component) => {
  return component.canDeactivate();  // Generic, reusable
};
```

### 2. Dummy Function Initialization

```typescript
onChange: (value: string) => void = () => {};
```

Prevents errors if component used outside form context.

### 3. Separation of Concerns

* **Guard**: Decides when to show dialog.
* **Component**: Knows its own state.
* **Service**: Handles dialog display.

### 4. Fail-Open Strategy

If guard can't determine state, allow navigation (don't block user).

---

## 🔍 Key Concepts Explained

### canDeactivate vs canActivate

| Guard Type | Purpose | When Executed | Use Case |
|------------|---------|---------------|----------|
| `canActivate` | Protects entry | Before entering route | Auth, permissions |
| `canDeactivate` | Protects exit | Before leaving route | Unsaved changes |

### Form State Lifecycle

```
Initial → pristine: true, dirty: false
   ↓
User types → dirty: true, pristine: false
   ↓
Form saved → markAsPristine() → dirty: false, pristine: true
```

### Navigation Flow

```
User clicks link/back button
    ↓
Router checks canDeactivate guards
    ↓
Guard calls component.canDeactivate()
    ↓
If false → Show confirmation
    ↓
User confirms → Proceed
User cancels → Block
```

---

## ⚠️ Common Pitfalls

### Issue 1: Guard Not Triggering

❌ **WRONG**: Component doesn't implement interface

```typescript
export class UserFormComponent {
  // No canDeactivate() method
}
```

✅ **CORRECT**: Implement interface

```typescript
export class UserFormComponent implements CanDeactivateComponent {
  canDeactivate(): boolean {
    return this.userForm.pristine || this.saved();
  }
}
```

### Issue 2: Guard Triggers After Save

❌ **WRONG**: Only setting saved flag

```typescript
private saveForm(): void {
  this.saved.set(true);  // Form still dirty!
}
```

✅ **CORRECT**: Also mark as pristine

```typescript
private saveForm(): void {
  this.saved.set(true);
  this.userForm.markAsPristine();  // Clear dirty flag
}
```

### Issue 3: Browser Refresh Not Warning

❌ **WRONG**: Missing HostListener

```typescript
// No beforeunload handler
```

✅ **CORRECT**: Add HostListener

```typescript
@HostListener('window:beforeunload', ['$event'])
unloadNotification($event: BeforeUnloadEvent): void {
  if (this.userForm.dirty && !this.saved()) {
    $event.returnValue = true;
  }
}
```

---

## 🎯 Interview Tips

### What to Mention While Coding

1. **"I'll use native confirm for speed, but in production I'd use Angular Material Dialog"**
   * Shows pragmatism and production awareness

2. **"The interface pattern makes this reusable across multiple components"**
   * Demonstrates SOLID principles

3. **"Browser refresh needs beforeunload—separate from router guards"**
   * Shows understanding of different navigation contexts

4. **"I'm marking the form pristine after save to clear the dirty flag"**
   * Explains reasoning while coding

### Common Interview Questions

**Q: "Why use canDeactivate instead of blocking the back button?"**  
A: `canDeactivate` works with all navigation methods (links, back, URL changes), while blocking back button only prevents one case and provides poor UX.

**Q: "What if save takes 10 seconds and user navigates?"**  
A: Track `saving` state and block navigation: `return this.saving() ? false : ...`

**Q: "How would you test this?"**  
A: Unit test guard logic, component test for form state, E2E test with Playwright for actual navigation.

---

## 📦 Summary

**What We Built:**

* ✅ Reusable `canDeactivate` guard (functional pattern)
* ✅ `CanDeactivateComponent` interface for type safety
* ✅ Form with dirty/pristine tracking
* ✅ Browser refresh protection (`beforeunload`)
* ✅ Complete route integration

**Key Takeaways:**

1. `canDeactivate` prevents accidental navigation with unsaved changes.
2. Interface pattern enables reusability.
3. Form state (`dirty`/`pristine`) is tracked automatically by Angular.
4. Browser events require separate handling from router guards.
5. Functional guards are the modern Angular pattern.
