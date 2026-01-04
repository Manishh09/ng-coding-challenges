# Challenge 20: Premium Feature Access Control

**Estimated Time:** 30-45 minutes  
**Difficulty:** Advanced

## 1. Challenge 🎯

**Scenario:**  
You are building a LinkedIn-style professional platform with subscription tiers (Free and Premium). Premium features like "Who Viewed Your Profile" and "InMail Messaging" should only be accessible to premium subscribers. Free-tier users should see an upgrade prompt instead.

**Task:**  
Implement **canMatch route guards** to control feature access based on subscription tier, preventing premium component bundles from loading for unauthorized users.

## 2. Requirements 📋

* [ ] **Tier Model**: Define subscription tiers (`free`, `premium`) with feature lists.
* [ ] **Service**: Create `SubscriptionService` with signals for tier management and localStorage persistence (auto-sync with effect).
* [ ] **Guard**: Implement `canMatch` functional guard that reads tier requirement from route.data.
* [ ] **Dual-Route Pattern**: Configure same path with guard (premium component) and without guard (upgrade prompt).
* [ ] **Components**:
  * **Premium Dashboard**: Shows 3 premium features (profile views, InMail credits, learning courses).
  * **Upgrade Prompt**: Shows single pricing card with upgrade button (fallback for blocked users).
  * **Subscription Manager**: Test panel with toggle button to switch between free/premium tiers.
* [ ] **Guard Return Values**:
  * `true` - Allow route matching and component load.
  * `UrlTree` - Block route and redirect to upgrade page.

## 3. Expected Output 🖼️

### Route Access Matrix

| Route | Guard | Free | Premium |
| ------- | ------- | ------ | --------- |
| `/workspace` | `premiumGuard` | ❌ Upgrade Prompt | ✅ Dashboard |

### User Flows

**Free User Accesses Premium Feature:**

1. Navigate to `/workspace`
2. Router tries first route with `canMatch: [premiumGuard]`
3. Guard checks tier → returns `UrlTree` redirect
4. Router redirects to upgrade prompt
5. **Result**: User sees pricing card with upgrade button
6. **Bundle**: Premium component never downloaded!

**Premium User Accesses Feature:**

1. Navigate to `/workspace`
2. Router tries first route with `canMatch: [premiumGuard]`
3. Guard checks tier → returns `true`
4. Router matches route, lazy-loads premium component
5. **Result**: User sees premium dashboard

## 4. Edge Cases / Constraints ⚠️

* **Route Ordering**: Guarded route must come **before** fallback route in config.
* **Lazy Loading**: Premium component bundle should never load for unauthorized users (performance optimization).
* **Guard Return Types**: Support `boolean` and `UrlTree`.
* **Persistence**: Subscription tier must persist across page refreshes (localStorage with effect() auto-sync).
* **Navigation Timing**: `canMatch` runs **before** route matching, unlike `canActivate` which runs **after**.

## 5. canMatch vs canActivate 🔍

| Aspect | canMatch | canActivate |
|--------|----------|-------------|
| **Timing** | Before route matching | After route matching |
| **Lazy Loading** | Blocks lazy loading | Lazy loading happens first |
| **Multiple Routes** | Allows fallback routes | Single route only |
| **Use Case** | Performance, access control | Component-level checks |
| **Bundle Size** | Prevents download | Component already loaded |
| **Example** | SaaS subscription tiers | User authentication |

## 6. Interview Focus 🎤

**Key Discussion Points:**

1. **When to use canMatch over canActivate?**
   * Performance: Avoid loading bundles for unauthorized users
   * Dual-route pattern: Same path, different components
   * Route-level decisions vs component-level

2. **How does the dual-route pattern work?**
   * Router tries routes in order
   * First route with canMatch guard
   * Second route without guard (fallback)
   * Seamless UX without error pages

3. **Real-world applications:**
   * LinkedIn Premium features
   * GitHub Pro features
   * Notion team/enterprise workspaces
   * Geographic content restrictions

4. **Performance benefits:**
   * Reduced initial bundle size for free users
   * Bandwidth savings
   * Faster page loads
   * Better Core Web Vitals

## 7. Learning Outcomes 📚

✅ Understand `canMatch` guard lifecycle and return values  
✅ Implement dual-route pattern for feature access control  
✅ Optimize lazy loading with route guards  
✅ Build tier-based subscription systems with signals  
✅ Handle guard redirects with UrlTree  
✅ Compare `canMatch` vs `canActivate` trade-offs  
✅ Apply SaaS access control patterns  
✅ Use effect() for localStorage auto-sync
