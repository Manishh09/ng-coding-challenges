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
   * Opens an external URL with error handling
   * @param url - URL to open
   * @param errorMessage - Custom error message to show if opening fails
   */
  private async openExternalUrl(url: string, errorMessage: string): Promise<void> {
    try {
      const success = await this.navigationService.openExternalLink(url);
      
      if (!success) {
        this.notificationService.error(errorMessage);
      }
    } catch (error) {
      console.error('Error opening external URL:', error);
      this.notificationService.error('An error occurred while opening the external link.');
    }
  }

  /**
   * Opens GitHub repository in a new tab
   * @param githubUrl - URL to the GitHub repository
   */
  openGitHub(githubUrl: string): void {
    if (!githubUrl) return;
    
    this.openExternalUrl(
      githubUrl, 
      'Unable to open GitHub repository. Please check if popups are blocked.'
    );
  }

  /**
   * Navigates to the challenge requirement document
   * @param requirementUrl - URL to the requirement document
   */
  goToChallenge(requirementUrl: string): void {
    if (!requirementUrl) return;
    
    this.openExternalUrl(
      requirementUrl, 
      'Unable to open challenge requirement. Please check if popups are blocked.'
    );
  }

  // No additional methods needed
}
