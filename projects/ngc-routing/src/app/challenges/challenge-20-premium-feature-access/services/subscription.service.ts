import { Injectable, signal, computed, effect } from '@angular/core';
import { SubscriptionTier, TIER_HIERARCHY, TIER_FEATURES } from '../models/subscription-tier.model';

/**
 * Subscription management service for SaaS application
 *
 * Simplified for interview scenario with 2 tiers (free/premium).
 * Uses Angular Signals for reactive state management.
 * Persists subscription state to localStorage for session continuity.
 *
 * Key Features:
 * - Tier hierarchy management (free → premium)
 * - localStorage persistence with automatic sync
 * - Reactive computed properties
 * - Simple tier switching
 *
 * Interview Focus:
 * - Demonstrates signal-based state management
 * - Shows localStorage integration pattern
 * - Easy to implement in 5-8 minutes
 *
 * @example
 * ```typescript
 * constructor(private subscriptionService: SubscriptionService) {
 *   // Check if user has premium access
 *   if (this.subscriptionService.isPremium()) {
 *     // Show premium features
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly STORAGE_KEY = 'user_subscription_tier';

  // Private signal for internal state management
  private _currentTier = signal<SubscriptionTier>(this.loadTierFromStorage());

  // Public readonly signal for external consumption
  readonly currentTier = this._currentTier.asReadonly();

  // Computed signals for common tier checks
  readonly isPremium = computed(() => this._currentTier() === 'premium');
  readonly isFree = computed(() => this._currentTier() === 'free');

  constructor() {
    // Persist tier changes to localStorage automatically
    effect(() => {
      const tier = this._currentTier();
      localStorage.setItem(this.STORAGE_KEY, tier);
      console.log(`[SubscriptionService] Tier changed to: ${tier}`);
    });
  }

  /**
   * Check if user's current tier meets or exceeds the required tier
   *
   * @param requiredTier - The minimum tier required
   * @returns true if user's tier >= requiredTier
   *
   * @example
   * ```typescript
   * if (subscriptionService.hasTier('premium')) {
   *   // User has premium tier
   * }
   * ```
   */
  hasTier(requiredTier: SubscriptionTier): boolean {
    const currentLevel = TIER_HIERARCHY[this._currentTier()];
    const requiredLevel = TIER_HIERARCHY[requiredTier];
    return currentLevel >= requiredLevel;
  }

  /**
   * Change subscription tier
   * Simplified to handle both upgrade and downgrade in one method
   *
   * @param tier - Target subscription tier ('free' or 'premium')
   *
   * @example
   * ```typescript
   * // Upgrade to premium
   * subscriptionService.changeTier('premium');
   *
   * // Downgrade to free
   * subscriptionService.changeTier('free');
   * ```
   */
  changeTier(tier: SubscriptionTier): void {
    if (tier === this._currentTier()) {
      console.log(`[SubscriptionService] Already on ${tier} tier`);
      return;
    }

    console.log(`[SubscriptionService] Changing from ${this._currentTier()} to ${tier}`);
    this._currentTier.set(tier);
  }

  /**
   * Toggle between free and premium tiers
   * Convenient for testing/demo purposes
   *
   * @example
   * ```typescript
   * // In test panel component
   * toggleTier() {
   *   this.subscriptionService.toggleTier();
   * }
   * ```
   */
  toggleTier(): void {
    const newTier: SubscriptionTier = this.isPremium() ? 'free' : 'premium';
    this.changeTier(newTier);
  }

  /**
   * Get features available for current tier
   *
   * @returns Array of feature strings
   */
  getAvailableFeatures(): string[] {
    return TIER_FEATURES[this._currentTier()];
  }

  /**
   * Load subscription tier from localStorage
   * Falls back to 'free' if no stored value or invalid value
   *
   * @private
   */
  private loadTierFromStorage(): SubscriptionTier {
    const stored = localStorage.getItem(this.STORAGE_KEY);

    if (stored && this.isValidTier(stored)) {
      console.log(`[SubscriptionService] Loaded tier from storage: ${stored}`);
      return stored as SubscriptionTier;
    }

    console.log('[SubscriptionService] No stored tier found, defaulting to free');
    return 'free';
  }

  /**
   * Validate if string is a valid subscription tier
   *
   * @private
   */
  private isValidTier(value: string): value is SubscriptionTier {
    return ['free', 'premium'].includes(value);
  }
}
