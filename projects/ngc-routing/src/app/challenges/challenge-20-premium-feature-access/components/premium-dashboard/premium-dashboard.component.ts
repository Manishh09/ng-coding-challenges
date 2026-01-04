import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';

/**
 * Premium Dashboard Component
 *
 * Simplified for interview scenario - shows 3 simple premium features.
 * This component is only accessible to users with Premium tier.
 * Demonstrates the canMatch guard in action - free users never load this component.
 *
 * Interview Focus:
 * - Shows guard protection works
 * - Minimal mock data (3 simple metrics)
 * - Easy to implement in 5-7 minutes
 * - Focus is on guard concept, not UI complexity
 *
 * Key Features (Simple):
 * - Profile Views Count
 * - InMail Credits
 * - Learning Access Status
 */
@Component({
  selector: 'app-premium-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './premium-dashboard.component.html',
  styleUrls: ['./premium-dashboard.component.scss']
})
export class PremiumDashboardComponent {
  subscriptionService = inject(SubscriptionService);

  currentTier = this.subscriptionService.currentTier;

  // Simple mock data - focus on demonstration, not realism
  readonly profileViews = 1247;
  readonly inMailCredits = 15;
  readonly learningCoursesCount = 150;

  constructor() {
    console.log(`[PremiumDashboard] ✅ Component loaded for ${this.currentTier()} tier user`);
    console.log('[PremiumDashboard] This component is protected by canMatch guard');
    console.log('[PremiumDashboard] Free users will never see this - bundle not downloaded!');
  }
}
