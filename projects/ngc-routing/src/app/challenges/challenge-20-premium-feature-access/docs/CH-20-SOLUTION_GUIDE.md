# Challenge 20: Solution Guide - Premium Feature Access Control

## Overview

This challenge implements a 2-tier subscription system (Free/Premium) using Angular's `canMatch` guard to control access to premium features. The implementation is optimized for interview scenarios with a focus on core concepts.

**Time Estimate:** 35-45 minutes

---

## Step 1: Define Subscription Tier Model

Create a simple 2-tier system with feature lists.

```typescript
// models/subscription-tier.model.ts
export type SubscriptionTier = 'free' | 'premium';

export const TIER_FEATURES: Record<SubscriptionTier, string[]> = {
  free: [
    'Basic Profile',
    'Connect with Others',
    'Job Search'
  ],
  premium: [
    'Who Viewed Profile',
    'InMail Messaging',
    'Advanced Search',
    'Learning Courses',
    'Analytics Dashboard'
  ]
};
```

**Key Concepts:**
- Only 2 tiers for simplicity
- Clear feature separation
- Easy to explain in interviews

---

## Step 2: Build Subscription Service with Signals

Manage subscription state with Angular signals and localStorage auto-sync.

```typescript
// services/subscription.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';
import { SubscriptionTier, TIER_FEATURES } from '../models/subscription-tier.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly STORAGE_KEY = 'user_subscription_tier';
  
  // Signal: Current subscription tier
  currentTier = signal<SubscriptionTier>(this.loadTierFromStorage());
  
  // Computed: Convenience checks
  isPremium = computed(() => this.currentTier() === 'premium');
  isFree = computed(() => this.currentTier() === 'free');
  
  constructor() {
    // Auto-sync to localStorage on tier changes
    effect(() => {
      const tier = this.currentTier();
      localStorage.setItem(this.STORAGE_KEY, tier);
      console.log(`💾 Saved tier to localStorage: ${tier}`);
    });
  }
  
  /**
   * Check if user has required tier
   */
  hasTier(requiredTier: SubscriptionTier): boolean {
    return requiredTier === 'free' || this.currentTier() === 'premium';
  }
  
  /**
   * Change to specific tier
   */
  changeTier(newTier: SubscriptionTier): void {
    if (this.isValidTier(newTier)) {
      this.currentTier.set(newTier);
      console.log(`✅ Changed to ${newTier} tier`);
    }
  }
  
  /**
   * Toggle between free and premium
   */
  toggleTier(): void {
    const newTier = this.isFree() ? 'premium' : 'free';
    this.changeTier(newTier);
  }
  
  /**
   * Get features available to user
   */
  getAvailableFeatures(): string[] {
    const tier = this.currentTier();
    return tier === 'premium' 
      ? [...TIER_FEATURES.free, ...TIER_FEATURES.premium]
      : TIER_FEATURES.free;
  }
  
  private loadTierFromStorage(): SubscriptionTier {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return this.isValidTier(stored) ? stored : 'free';
  }
  
  private isValidTier(tier: any): tier is SubscriptionTier {
    return tier === 'free' || tier === 'premium';
  }
}
```

**Key Concepts:**
- Signal-based reactivity with `computed()` for derived state
- `effect()` for automatic localStorage sync
- Simple tier checking (no complex hierarchy)
- 6 core methods (down from 13 in original)

---

## Step 3: Implement canMatch Guard

Create a functional guard that reads tier requirement from route.data.

```typescript
// guards/premium.guard.ts
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { SubscriptionService } from '../services/subscription.service';
import { SubscriptionTier } from '../models/subscription-tier.model';

/**
 * Premium feature access guard using canMatch
 * 
 * Prevents route matching for users without required subscription tier.
 * Unlike canActivate, canMatch runs BEFORE route matching and lazy loading,
 * ensuring premium feature bundles never download for free users.
 */
export const premiumGuard: CanMatchFn = (route, segments) => {
  const subscriptionService = inject(SubscriptionService);
  const router = inject(Router);

  // Get required tier from route data, default to 'premium'
  const requiredTier: SubscriptionTier = route.data?.['requiredTier'] || 'premium';

  // Check if user has required subscription tier
  const hasAccess = subscriptionService.hasTier(requiredTier);

  if (hasAccess) {
    console.log(`[premiumGuard] ✅ Access granted`);
    return true;
  }

  console.log(`[premiumGuard] ❌ Access denied - Redirecting to upgrade`);
  
  // Redirect to upgrade page
  return router.createUrlTree(['/challenges/angular-routing/premium-feature-access/upgrade']);
};
```

**Key Concepts:**
- Single guard (not a factory) - reads config from route.data
- Returns `true` or `UrlTree` (no `false` needed for dual-route pattern)
- Simple redirect without query param complexity
- Easy to implement in 3-5 minutes

**canMatch Lifecycle:**
```
User navigates → canMatch runs → Returns true/UrlTree → Route matches (if true) → Lazy load → Component
```

---

## Step 4: Configure Dual-Route Pattern

Set up routes with same path—first with guard, second as fallback.

```typescript
// challenge-20.routes.ts
import { Routes } from '@angular/router';
import { premiumGuard } from './guards/premium.guard';

export const challenge20Routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/subscription-manager/subscription-manager.component')
        .then(m => m.SubscriptionManagerComponent),
    title: 'Challenge 20: Premium Feature Access'
  },

  // ===== WORKSPACE ROUTE (Premium Required) =====
  
  // Route 1: Premium tier access - loads actual feature
  {
    path: 'workspace',
    canMatch: [premiumGuard],
    data: { requiredTier: 'premium' },
    loadComponent: () =>
      import('./components/premium-dashboard/premium-dashboard.component')
        .then(m => m.PremiumDashboardComponent),
    title: 'Premium Workspace'
  },

  // Route 2: Fallback route - loads upgrade prompt
  // Same path, no guard - Router falls back here if canMatch blocks
  {
    path: 'workspace',
    loadComponent: () =>
      import('./components/upgrade-prompt/upgrade-prompt.component')
        .then(m => m.UpgradePromptComponent),
    title: 'Upgrade Required'
  }
];
```

**Key Concepts:**
- Same path `/workspace` used twice
- First route has `canMatch` guard
- Second route has no guard (always matches)
- Router tries routes in order

**How Dual-Route Works:**

1. User navigates to `/workspace`
2. Router tries first route with `canMatch: [premiumGuard]`
3. Guard checks tier:
   - **Premium user**: Returns `true` → First route matches → Premium component loads
   - **Free user**: Returns `UrlTree` → Redirects to upgrade page
4. Lazy loading only happens if guard returns `true`

---

## Step 5: Build Components

### Premium Dashboard Component

Simplified component showing 3 key metrics (no complex mock data).

```typescript
// components/premium-dashboard/premium-dashboard.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-premium-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './premium-dashboard.component.html',
  styleUrl: './premium-dashboard.component.scss'
})
export class PremiumDashboardComponent {
  subscriptionService = inject(SubscriptionService);
  
  currentTier = this.subscriptionService.currentTier;
  
  // Simple readonly properties (no signals, no arrays)
  readonly profileViews = 1247;
  readonly inMailCredits = 15;
  readonly learningCoursesCount = 150;
}
```

### Upgrade Prompt Component

Simple fallback component with single upgrade button.

```typescript
// components/upgrade-prompt/upgrade-prompt.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-upgrade-prompt',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './upgrade-prompt.component.html',
  styleUrl: './upgrade-prompt.component.scss'
})
export class UpgradePromptComponent {
  subscriptionService = inject(SubscriptionService);
  
  currentTier = this.subscriptionService.currentTier;
  isUpgrading = signal(false);
  
  upgradeToPremium(): void {
    this.isUpgrading.set(true);
    
    setTimeout(() => {
      this.subscriptionService.changeTier('premium');
      this.isUpgrading.set(false);
    }, 1000);
  }
}
```

### Subscription Manager Component

Test panel with toggle button to switch tiers.

```typescript
// components/subscription-manager/subscription-manager.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import { TIER_FEATURES } from '../../models/subscription-tier.model';

@Component({
  selector: 'app-subscription-manager',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './subscription-manager.component.html',
  styleUrl: './subscription-manager.component.scss'
})
export class SubscriptionManagerComponent {
  subscriptionService = inject(SubscriptionService);
  
  currentTier = this.subscriptionService.currentTier;
  tierFeatures = TIER_FEATURES;
  
  toggleTier(): void {
    this.subscriptionService.toggleTier();
  }
}
```

---

## Step 6: Testing the Implementation

### Test Case 1: Free User Blocked from Premium Route

```typescript
// Initial state: Free tier
1. Open subscription manager
2. Verify current tier shows "Free"
3. Click "Try Access" for Workspace route
4. Observe redirect to upgrade prompt
5. Check Network tab - premium component NOT downloaded
```

### Test Case 2: Premium User Accesses Feature

```typescript
// Switch to Premium tier
1. Click "Upgrade to Premium" toggle button
2. Verify tier badge changes to "Premium"
3. Click "Try Access" for Workspace route
4. Observe premium dashboard loads
5. See 3 feature cards with metrics
```

### Test Case 3: localStorage Persistence

```typescript
1. Switch to Premium tier
2. Refresh page (F5)
3. Observe tier remains "Premium" (loaded from localStorage)
4. Effect() automatically syncs changes
```

---

## Interview Talking Points

### Q: When would you use canMatch instead of canActivate?

**Answer:**

1. **Performance matters**: Prevent lazy-loading bundles for unauthorized users
2. **Dual-route pattern**: Same path, different components based on conditions
3. **Route-level decisions**: Feature flags, A/B testing, subscription tiers

Use `canActivate` for:
1. Component-level checks (e.g., form validation before leaving)
2. Single route scenarios
3. When lazy loading already happened

### Q: How does the dual-route pattern work?

**Answer:**

```
Routes: [
  { path: 'feature', canMatch: [guard], component: Premium },  ← Try first
  { path: 'feature', component: Fallback }                      ← Try if first fails
]

Premium user: guard returns true → First route matches → Premium loads
Free user: guard returns UrlTree → Redirect → Fallback loads
```

### Q: What are the performance benefits?

**Answer:**

1. **Bundle Size**: Premium components never downloaded for free users
2. **Network**: Saves bandwidth on unnecessary code
3. **Parsing**: JavaScript engine doesn't parse unused code
4. **Memory**: Lower memory footprint
5. **Initial Load**: Faster app startup

**Example**: Premium dashboard bundle = 50KB. With 80% free users, canMatch saves 40KB * 0.8 = 32KB average per user.

### Q: Can you explain the effect() usage for localStorage?

**Answer:**

```typescript
effect(() => {
  const tier = this.currentTier();
  localStorage.setItem(this.STORAGE_KEY, tier);
});
```

- **Automatic sync**: No manual save() calls needed
- **Reactive**: Runs whenever currentTier() changes
- **Reliable**: Can't forget to save (automatic side effect)
- **Clean code**: Single source of truth

---

## Common Pitfalls

1. **Route Order**: Guarded route must come BEFORE fallback route
2. **Return Type**: Don't explicitly type guard return value (let CanMatchFn infer)
3. **Lazy Loading**: Guard runs BEFORE lazy loading resolves
4. **Signal Effects**: effect() must be in constructor or injection context

---

## Performance Metrics

- **Model**: 40 lines (vs 110 for 4-tier system)
- **Service**: 6 methods (vs 13 for production system)
- **Guard**: 1 guard (vs 4 for factory pattern)
- **Components**: Simplified (no mock arrays)
- **Implementation Time**: 35-45 minutes (interview-optimized)

---

## Extensions (Optional)
  {
    path: 'enterprise',
    canMatch: [enterpriseGuard],
    loadComponent: () => import('./components/premium-dashboard/premium-dashboard.component')
      .then(m => m.PremiumDashboardComponent),
    data: { tier: 'enterprise' }
  },
  {
    path: 'enterprise',
    loadComponent: () => import('./components/upgrade-prompt/upgrade-prompt.component')
      .then(m => m.UpgradePromptComponent),
    data: { requiredTier: 'enterprise' }
  }
];
```

**How It Works:**
1. User navigates to `/workspace`
2. Router tries **first** route with `canMatch: [premiumGuard]`
3. Guard checks tier:
   * **Premium/Enterprise**: Guard returns `true` → Route matches → Premium component loads
   * **Free/Basic**: Guard returns `false` or `UrlTree` → Route skipped
4. Router tries **second** route (no guard)
5. Route matches → Upgrade prompt loads

**Key Benefits:**
* Same URL, different UX based on permissions
* Premium bundle never downloads for free users
* No error pages—seamless upgrade flow

---

## Step 5: Build Premium Dashboard Component

Display premium features with mock data.

```typescript
// components/premium-dashboard/premium-dashboard.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-premium-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './premium-dashboard.component.html',
  styleUrls: ['./premium-dashboard.component.scss']
})
export class PremiumDashboardComponent {
  subscriptionService = inject(SubscriptionService);
  currentTier = this.subscriptionService.currentTier;
  
  profileViews = 1247;
  viewers = [
    { name: 'Sarah Chen', title: 'Senior Developer', company: 'Tech Corp', avatar: '👩‍💻' },
    { name: 'Mike Johnson', title: 'Product Manager', company: 'Startup Inc', avatar: '👨‍💼' },
    // ...
  ];
  
  inMailCount = 15;
  learningCourses = [
    { title: 'Advanced Angular Patterns', progress: 75 },
    { title: 'System Design Interview', progress: 40 },
    // ...
  ];
}
```

**HTML Highlights:**
```html
<div class="premium-dashboard">
  <div class="header">
    <h1>🏆 Premium Workspace</h1>
    <span class="tier-badge">{{ currentTier() | titlecase }}</span>
  </div>
  
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">{{ profileViews }}</div>
      <div class="stat-label">Profile Views (Last 90 Days)</div>
    </div>
    <!-- More stats -->
  </div>
  
  <div class="feature-section">
    <h2>👀 Who Viewed Your Profile</h2>
    @for (viewer of viewers; track viewer.name) {
      <div class="viewer-card">
        <div class="avatar">{{ viewer.avatar }}</div>
        <div class="details">
          <h3>{{ viewer.name }}</h3>
          <p>{{ viewer.title }} at {{ viewer.company }}</p>
        </div>
      </div>
    }
  </div>
</div>
```

---

## Step 6: Build Upgrade Prompt Component

Show pricing and upgrade options when guard blocks access.

```typescript
// components/upgrade-prompt/upgrade-prompt.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import { PRICING_PLANS, SubscriptionTier } from '../../models/subscription-tier.model';

@Component({
  selector: 'app-upgrade-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upgrade-prompt.component.html',
  styleUrls: ['./upgrade-prompt.component.scss']
})
export class UpgradePromptComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  subscriptionService = inject(SubscriptionService);
  
  pricingPlans = PRICING_PLANS;
  requestedFeature = signal<string>('');
  requiredTier = signal<SubscriptionTier>('premium');
  returnUrl = signal<string>('');
  
  ngOnInit(): void {
    // Get context from query params (set by guard)
    this.route.queryParams.subscribe(params => {
      this.requestedFeature.set(params['feature'] || 'Premium Features');
      this.requiredTier.set(params['requiredTier'] || 'premium');
      this.returnUrl.set(params['returnUrl'] || '/workspace');
    });
  }
  
  upgradeTo(tier: SubscriptionTier): void {
    console.log(`Upgrading to ${tier}...`);
    
    // Simulate API call
    setTimeout(() => {
      this.subscriptionService.upgradeTier(tier);
      
      // Navigate to originally requested feature
      this.router.navigateByUrl(this.returnUrl());
    }, 1500);
  }
}
```

**HTML Highlights:**
```html
<div class="upgrade-prompt">
  <div class="header">
    <div class="lock-icon">🔒</div>
    <h1>Unlock Premium Features</h1>
    <p>You need {{ requiredTier() | titlecase }} to access: {{ requestedFeature() }}</p>
  </div>
  
  <div class="pricing-grid">
    @for (plan of pricingPlans; track plan.tier) {
      <div class="pricing-card" [class.recommended]="plan.tier === requiredTier()">
        <h3>{{ plan.name }}</h3>
        <div class="price">${{ plan.price }}/{{ plan.period }}</div>
        <ul>
          @for (feature of plan.features; track feature) {
            <li>{{ feature }}</li>
          }
        </ul>
        <button (click)="upgradeTo(plan.tier)">Upgrade</button>
      </div>
    }
  </div>
</div>
```

---

## Step 7: Build Subscription Manager (Test Panel)

Create admin panel to test guard behavior by switching tiers.

```typescript
// components/subscription-manager/subscription-manager.component.ts
import { Component, inject } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { SubscriptionTier } from '../../models/subscription-tier.model';

@Component({
  selector: 'app-subscription-manager',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './subscription-manager.component.html',
  styleUrls: ['./subscription-manager.component.scss']
})
export class SubscriptionManagerComponent {
  subscriptionService = inject(SubscriptionService);
  currentTier = this.subscriptionService.currentTier;
  tiers: SubscriptionTier[] = ['free', 'basic', 'premium', 'enterprise'];
  
  changeTier(newTier: SubscriptionTier): void {
    if (newTier === 'free') {
      this.subscriptionService.cancelSubscription();
    } else {
      this.subscriptionService.upgradeTier(newTier);
    }
  }
}
```

**HTML:**
```html
<div class="subscription-manager">
  <h1>🔑 Subscription Manager</h1>
  
  <div class="tier-switcher">
    <h2>Switch Tier (Test Mode)</h2>
    @for (tier of tiers; track tier) {
      <button 
        [class.active]="currentTier() === tier"
        [disabled]="currentTier() === tier"
        (click)="changeTier(tier)">
        {{ tier | titlecase }}
      </button>
    }

If you want to extend this challenge further, consider:

1. **Add more tiers** (Basic, Enterprise) with hierarchical access
2. **Implement Observable guards** for async tier validation
3. **Add route animations** for smooth tier-based transitions
4. **Build pricing calculator** with annual/monthly toggle
5. **Add feature flags** combining canMatch with environment configs

---

## Summary

✅ **canMatch Guard**: Route-level access control **before** lazy loading  
✅ **Dual-Route Pattern**: Same path, guarded + fallback routes for seamless UX  
✅ **Performance**: Premium bundles never download for unauthorized users  
✅ **Signal-based Service**: Reactive state management with effect() localStorage sync  
✅ **UrlTree Redirects**: Simple redirects without query param complexity  
✅ **2-Tier System**: Optimized for interview scenarios (35-45 minutes)

**Time Investment**: 35-45 minutes (interview-optimized)  
**Files Created**: 7 (model, service, guard, 3 components, routes)  
**Lines of Code**: ~420 (focused on core concepts)
