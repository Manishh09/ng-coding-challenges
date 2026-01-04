import { Routes } from '@angular/router';
import { premiumGuard } from './guards/premium.guard';

/**
 * Challenge 20: Premium Feature Access Control (canMatch Guard)
 *
 * Demonstrates the dual-route pattern with canMatch guards:
 * - Multiple routes with the same path
 * - First route has canMatch guard (restricted access)
 * - Second route has no guard (fallback)
 * - Router tries routes in order, uses first match
 *
 * Key Benefits:
 * - Lazy loading optimization (premium bundles never load for free users)
 * - Better UX (upgrade prompt instead of error)
 * - Route-level access control before component activation
 */
export const challenge20Routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/subscription-manager/subscription-manager.component')
        .then(m => m.SubscriptionManagerComponent),
    title: 'Challenge 20: Premium Feature Access'
  },

  // ===== WORKSPACE ROUTE (Premium Required) =====
  // Dual-route pattern demonstration

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
  },

  // Redirect root to subscription manager
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ''
  }
];

/**
 * Interview Talking Points for canMatch:
 *
 * 1. When to Use canMatch vs canActivate:
 *    - canMatch: Route-level decision before lazy loading
 *    - canActivate: Component-level decision after route matched
 *    - Use canMatch when: Performance matters, multiple routes same path, bundle size concerns
 *
 * 2. Dual-Route Pattern Benefits:
 *    - Single URL, different components based on permissions
 *    - No error pages, seamless UX with upgrade prompts
 *    - Router handles fallback automatically
 *
 * 3. Performance Impact:
 *    - Premium component bundle never downloaded for free users
 *    - Guards run before lazy loading resolves
 *    - Reduces initial load time and bandwidth usage
 *
 * 4. Return Values:
 *    - true: Allow route matching, continue to activation
 *    - false: Block route, try next matching route
 *    - UrlTree: Block route and redirect with context (query params)
 *
 * 5. Real-World Use Cases:
 *    - SaaS subscription tiers (like LinkedIn, GitHub, Notion)
 *    - Feature flagging based on user roles
 *    - A/B testing with different component versions
 *    - Geographic restrictions (region-specific content)
 */
