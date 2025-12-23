import { ChangeDetectionStrategy, Component, inject, OnInit, input, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationService, NotificationService, ChallengesService } from '@ng-coding-challenges/shared/services';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { StackblitzService } from '@ng-coding-challenges/shared/services';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Component for displaying a challenge card with actions
 *
 * Features:
 * - Loading states for async operations
 * - Accessibility with ARIA labels
 * - Latest challenge highlighting
 * - Docs and resources menu
 */
@Component({
  selector: 'ng-coding-challenges-challenge-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './challenge-card.component.html',
  styleUrl: './challenge-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChallengeCardComponent implements OnInit {
  // Input properties
  readonly challenge = input.required<Challenge>();
  readonly newBadgeChallengeIds = input<number[]>([]);

  readonly categoryLabel = computed(() =>
    this.formatCategoryId(this.challenge().category)
  );
  readonly docsAvailable = computed(
    () =>
      !!this.challenge().requirement ||
      !!this.challenge().solutionGuide ||
      !!this.challenge().gitHub
  );

  // Extract challenge ID from title (e.g., "Challenge 01" from "Challenge 01: Fetch Products")
  readonly challengeIdText = computed(() => {
    const title = this.challenge().title;
    const match = title.match(/^(Challenge\s+\d+):/i);
    return match ? match[1] : `Challenge ${this.challenge().id.toString().padStart(2, '0')}`;
  });

  // Extract actual challenge name without the "Challenge XX:" prefix
  readonly challengeName = computed(() => {
    const title = this.challenge().title;
    const match = title.match(/^Challenge\s+\d+:\s*(.+)$/i);
    return match ? match[1].trim() : title;
  });

  // Reactive signal to check if current challenge is the latest challenge
  readonly isLatestChallenge = computed(() => {
    const latest = this.latestChallenge();
    const current = this.challenge();
    return !!latest && current.id === latest.id;
  });

  // Reactive signal for new badge visibility
  readonly hasNewBadge = computed(() => {
    const newBadgeIds = this.newBadgeChallengeIds();
    const currentId = this.challenge().id;
    if (newBadgeIds?.length) {
      return newBadgeIds.includes(currentId);
    }
    return this.isLatestChallenge();
  });

  // Loading state for StackBlitz launch
  readonly launching = signal(false);

  // ---- Injected Services ----
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly challengesService = inject(ChallengesService);
  private readonly navigationService = inject(NavigationService);
  private readonly notificationService = inject(NotificationService);
  private readonly stackblitzService = inject(StackblitzService);

  // Cache latest challenge outside reactive context
  private readonly latestChallenge = toSignal(
    this.challengesService.getLatestChallenge(),
    { initialValue: undefined }
  );

  ngOnInit(): void {
    // Initialization logic can go here if needed
  }


  /**
   * Opens an external URL in a new window/tab and handles potential failures.
   *
   * @param url - The URL to open externally
   * @param type - The type of link being opened, affects the error message shown on failure
   * @returns void
   *
   * @remarks
   * If the URL is empty/falsy, the method show a validation message
   * If the navigation service fails to open the link (e.g., due to popup blockers),
   * an appropriate error notification is displayed based on the link type.
   */
  openURL(url: string, type: 'github' | 'requirement' | 'solution'): void {
    if (!url) {
      this.notificationService.error('No URL provided to open.');
      return;
    }

    const errorMessages: Record<typeof type, string> = {
      github: 'Unable to open GitHub repository. Please check if popups are blocked.',
      requirement: 'Unable to open challenge requirement doc. Please check if popups are blocked.',
      solution: 'Unable to open solution guide. Please check if popups are blocked.',
    };

    const success = this.navigationService.openExternalLink(url);
    if (!success) {
      this.notificationService.error(errorMessages[type]);
    }
  }

  async onTryChallenge(challenge: Challenge): Promise<void> {
    this.launching.set(true);
    try {
      await this.stackblitzService.openChallengeInStackblitz(challenge);
    } catch (error) {
      this.notificationService.error('Failed to launch challenge. Please try again.');
      console.error('Error launching challenge:', error);
    } finally {
      this.launching.set(false);
    }
  }

  /**
   * Navigates to challenge details page
   * Route: /challenges/{category}/{challengeId}
   */
  viewDetails(): void {
    const challenge = this.challenge();
    const categoryId = challenge.category;
    this.router.navigate(['/challenges', categoryId, challenge.link]);
  }

  /**
   * Navigates directly to challenge workspace
   * Route: /challenges/{category}/{challengeId}/workspace
   */
  startChallenge(): void {
    const challenge = this.challenge();
    const categoryId = challenge.category;
    // Use challenge.link which contains the correct slug from configuration
    this.router.navigate(['/challenges', categoryId, challenge.link, 'workspace']);
  }

  viewOutput(link: string): void {
    this.router.navigate([link], { relativeTo: this.route });
  }

  private formatCategoryId(categoryId: string): string {
    return categoryId
      .split('-')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }
}
