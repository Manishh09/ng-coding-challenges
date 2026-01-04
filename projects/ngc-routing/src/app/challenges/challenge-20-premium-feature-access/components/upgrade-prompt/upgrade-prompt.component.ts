import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';

/**
 * Upgrade Prompt Component
 *
 * Simplified for interview scenario - single upgrade button without query param complexity.
 * This component is shown to free-tier users when they attempt to access premium features.
 * Demonstrates the canMatch guard fallback pattern - when guard blocks premium route,
 * this component loads instead (same path, different route without guard).
 *
 * Interview Focus:
 * - Shows dual-route pattern clearly
 * - Simple upgrade flow (no payment processing)
 * - Easy to implement in 5-7 minutes
 * - Focus is on guard fallback concept
 *
 * Key Features:
 * - Display premium features
 * - Simple upgrade button
 * - Navigate to premium after upgrade
 */
@Component({
  selector: 'app-upgrade-prompt',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './upgrade-prompt.component.html',
  styleUrls: ['./upgrade-prompt.component.scss']
})
export class UpgradePromptComponent {
  private router = inject(Router);
  subscriptionService = inject(SubscriptionService);

  currentTier = this.subscriptionService.currentTier;
  isUpgrading = signal(false);

  constructor() {
    console.log('[UpgradePrompt] ❌ User blocked by canMatch guard');
    console.log(`[UpgradePrompt] Current tier: ${this.currentTier()}`);
    console.log('[UpgradePrompt] Showing upgrade options...');
  }

  /**
   * Upgrade to premium tier
   * Simulates payment flow with 1.5s delay
   */
  upgradeToPremium(): void {
    console.log('[UpgradePrompt] Starting upgrade to premium...');
    this.isUpgrading.set(true);

    // Simulate API call/payment processing
    setTimeout(() => {
      this.subscriptionService.changeTier('premium');
      this.isUpgrading.set(false);

      console.log('[UpgradePrompt] ✅ Upgrade successful!');
      console.log('[UpgradePrompt] Navigating to premium workspace...');

      // Navigate to premium workspace
      this.router.navigate(['/challenges/angular-routing/premium-feature-access/workspace']);
    }, 1500);
  }
}
