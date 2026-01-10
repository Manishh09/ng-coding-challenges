# Solution: Functional Guards

## 🧠 Approach
We manage the authentication state in a Service using a Signal. The Guards strictly check this Signal.
*   **AuthGuard**: If `!isLoggedIn()`, return `UrlTree(/login)`.
*   **GuestGuard**: If `isLoggedIn()`, return `UrlTree(/products)`.

## 🚀 Step-by-Step Implementation

### Step 1: The Auth Service
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  // The source of truth
  isLoggedIn = signal(false);

  login() {
    this.isLoggedIn.set(true);
    this.router.navigate(['/products']);
  }

  logout() {
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
```

### Step 2: The Functional Guards
Functional guards are just functions that can inject dependencies.

```typescript
// Protects /products
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) return true;

  // Redirect to login if not authenticated
  return router.createUrlTree(['/login']);
};

// Protects /login (prevents logged-in users from seeing it)
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) return true;

  // Redirect to dashboard if already authenticated
  return router.createUrlTree(['/products']);
};
```

### Step 3: Route Configuration
Apply the guards to the `canActivate` array.

```typescript
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard] // Only guests can visit
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [authGuard] // Only auth users can visit
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
```

## 🌟 Best Practices Used
*   **Functional Guards**: Less boilerplate than the old Class-based guards.
*   **UrlTree Redirects**: Returning a `UrlTree` cancels the current navigation and immediately schedules a new one to the redirect target. This is smoother than manually calling `router.navigate` inside a guard.
*   **Signals State**: Simple, reactive state management for the auth status.

