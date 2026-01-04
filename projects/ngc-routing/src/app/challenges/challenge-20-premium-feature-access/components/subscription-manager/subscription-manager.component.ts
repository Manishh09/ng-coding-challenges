import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import { TIER_FEATURES } from '../../models/subscription-tier.model';

/**
 * Subscription Manager Component
 *
 * Simplified for interview scenario - single toggle button to switch between free/premium.
 * Test panel for demonstrating canMatch guard behavior with auto-navigation.
 *
 * Interview Focus:
 * - Simple tier switching UI
 * - Auto-navigation to demonstrate guard in action
 * - Clear visual feedback with notification
 * - Easy to implement in 5-10 minutes
 *
 * Key Features:
 * - Display current tier
 * - Toggle between free/premium
 * - Auto-navigate to workspace after toggle
 * - Visual notification feedback
 * - Show feature comparison
 */
@Component({
  selector: 'app-subscription-manager',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './subscription-manager.component.html',
  styleUrls: ['./subscription-manager.component.scss']
})
export class SubscriptionManagerComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  subscriptionService = inject(SubscriptionService);

  currentTier = this.subscriptionService.currentTier;
  isPremium = this.subscriptionService.isPremium;
  tierFeatures = TIER_FEATURES;

  // Notification signals for visual feedback
  showNotification = signal(false);
  notificationMessage = signal('');

  /**
   * Toggle between free and premium tiers
   * Auto-navigates to workspace to demonstrate guard behavior immediately
   */
  toggleTier(): void {
    const previousTier = this.currentTier();
    this.subscriptionService.toggleTier();
    const newTier = this.currentTier();

    console.log(`[SubscriptionManager] Toggled: ${previousTier} → ${newTier}`);

    // Show notification with appropriate message
    this.notificationMessage.set(
      newTier === 'premium'
        ? '🎉 Upgraded to Premium! Navigating to workspace...'
        : '📉 Downgraded to Free. Testing guard...'
    );
    this.showNotification.set(true);

    // Auto-navigate after short delay to let user see the tier change
    setTimeout(() => {
      console.log('[SubscriptionManager] Auto-navigating to workspace to test canMatch guard...');
      this.router.navigate(['../workspace'], { relativeTo: this.route });

      // Hide notification after navigation
      setTimeout(() => this.showNotification.set(false), 3000);
    }, 800);
  }
}
