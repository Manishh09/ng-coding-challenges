import { ChangeDetectionStrategy, Component, inject, OnInit, input, computed } from '@angular/core';
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

/**
 * Component for displaying a challenge card with actions
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
    MatMenuModule
  ],
  templateUrl: './challenge-card.component.html',
  styleUrl: './challenge-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChallengeCardComponent implements OnInit {
  // Input properties
  readonly challenge = input.required<Challenge>();
  readonly newBadgeChallengeIds = input<number[]>([]);

  // Reactive signal to check if current challenge is the latest challenge
  readonly isLatestChallenge = computed(() => {
    const latest = this.challengesService.getLatestChallenge();
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

  // ---- Injected Services ----
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly challengesService = inject(ChallengesService);
  private readonly navigationService = inject(NavigationService);
  private readonly notificationService = inject(NotificationService);
  private readonly stackblitzService = inject(StackblitzService);

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
    await this.stackblitzService.openChallengeInStackblitz(challenge);
  }

  viewOutput(link: string): void {
    this.router.navigate([link], { relativeTo: this.route });
  }
}
