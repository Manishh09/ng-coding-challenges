import { ChangeDetectionStrategy, Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationService, NotificationService, ChallengesService } from '@ng-coding-challenges/shared/services';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { StackblitzService } from '@ng-coding-challenges/shared/services';

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
  ],
  templateUrl: './challenge-card.component.html',
  styleUrl: './challenge-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChallengeCardComponent implements OnInit {

  @Input({ required: true }) challenge!: Challenge;
  @Input() newBadgeChallengeIds: number[] = [];

  isLatestChallenge = false;
  hasNewBadge = false;

  private readonly router = inject(Router);
  private readonly challengesService = inject(ChallengesService);

  private readonly stackblitzService = inject(StackblitzService);

  ngOnInit(): void {
    // Check if this is the latest challenge
    const challenges = this.challengesService.getChallenges();
    if (challenges.length > 0) {
      const latestChallenge = challenges.reduce((prev, current) =>
        (prev.id > current.id) ? prev : current
      );
      this.isLatestChallenge = this.challenge.id === latestChallenge.id;
    }

    // Check if this challenge should have a new badge based on the provided array
    if (this.newBadgeChallengeIds && this.newBadgeChallengeIds.length > 0) {
      this.hasNewBadge = this.newBadgeChallengeIds.includes(this.challenge.id);
    } else {
      // If no specific IDs are provided, use the latest challenge logic
      this.hasNewBadge = this.isLatestChallenge;
    }
  }

  private readonly navigationService = inject(NavigationService);
  private readonly notificationService = inject(NotificationService);


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
  openURL(url: string, type: "github" | "requirement" | "solution"): void {
    const errorMessage = type === "github"
      ? 'Unable to open GitHub repository. Please check if popups are blocked.'
      : type === "requirement"
        ? 'Unable to open challenge requirement doc. Please check if popups are blocked.'
        : 'Unable to open solution guide. Please check if popups are blocked.';

    if (!url) {
      this.notificationService.error('No URL provided to open.');
      return;
    }

    const success = this.navigationService.openExternalLink(url);

    if (!success) {
      this.notificationService.error(errorMessage);
      ``
    }
  }

  async onTryChallenge(challenge: Challenge) {
    await this.stackblitzService.openChallengeInStackblitz(challenge);
  }

  viewOutput(link: string) {
    this.router.navigate([link]);
  }
}
