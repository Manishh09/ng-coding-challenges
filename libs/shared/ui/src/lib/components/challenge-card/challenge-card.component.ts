import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationService, NotificationService } from '@ng-coding-challenges/shared/services';
import { Challenge } from '@ng-coding-challenges/shared/models';

/**
 * Component for displaying a challenge card with actions
 */
@Component({
  selector: 'ng-coding-challenges-challenge-card',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './challenge-card.component.html',
  styleUrl: './challenge-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChallengeCardComponent {
  @Input({ required: true }) challenge!: Challenge;

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
    }
  }
}
