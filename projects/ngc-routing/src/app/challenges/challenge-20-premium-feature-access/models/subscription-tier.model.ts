/**
 * Subscription tier for SaaS application
 * Simplified to 2 tiers for interview scenario: Free → Premium
 *
 * Interview Focus:
 * - Demonstrates canMatch guard concept clearly
 * - Reduces implementation time by ~40%
 * - Easy to explain under time pressure
 * - Extensible to more tiers if needed
 */
export type SubscriptionTier = 'free' | 'premium';

/**
 * Tier hierarchy mapping for comparison
 * Higher number = higher tier (premium > free)
 */
export const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  free: 0,
  premium: 1
};

/**
 * Features available per tier
 * Premium tier includes all free features plus premium-only features
 */
export const TIER_FEATURES: Record<SubscriptionTier, string[]> = {
  free: [
    'Basic Profile',
    'Public Content Access',
    'Limited Messaging (5/day)'
  ],
  premium: [
    'Advanced Analytics Dashboard',
    'See Who Viewed Your Profile',
    'InMail Messaging (Unlimited)',
    'Premium Badge',
    'Learning Courses Access'
  ]
};
