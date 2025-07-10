import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationService } from '../../services/navigation/navigation.service';
import { NotificationService } from '../../services/notification/notification.service';

export interface ChallengeCardData {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  tags: string[];
  estimatedTime: number;
  isCompleted?: boolean;
  isFeatured?: boolean;
}

export interface Challenge {

  id: number;
  title: string;
  description: string;

  link: string;

  requirement: string;

  gitHub: string;
}

@Component({
  selector: 'ng-coding-challenges-challenge-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule,
    RouterLink
  ],
  templateUrl: './challenge-card.component.html',
  styleUrl: './challenge-card.component.scss'
})
export class ChallengeCardComponent {
  @Input({ required: true }) challenge!: Challenge;

  private navigationService = inject(NavigationService);
  private notificationService = inject(NotificationService);

  /**
   * Navigates to the challenge requirement document
   * @param requirementUrl - URL to the requirement document
   */
  async goToChallengeV2(requirementUrl: string): Promise<void> {
    try {
      const success = await this.navigationService.openExternalLink(requirementUrl);

      if (!success) {
        this.notificationService.error('Unable to open challenge requirement. Please check if popups are blocked.');
      }
    } catch (error) {
      console.error('Error navigating to challenge:', error);
      this.notificationService.error('An error occurred while opening the challenge requirement.');
    }
  }

  /**
   * Opens GitHub repository in a new tab
   * @param githubUrl - URL to the GitHub repository
   */
  async openGitHubV2(githubUrl: string): Promise<void> {
    try {
      const success = await this.navigationService.openExternalLinkV2(githubUrl);

      if (!success) {
        this.notificationService.error('Unable to open GitHub repository. Please check if popups are blocked.');
      }
    } catch (error) {
      console.error('Error opening GitHub:', error);
      this.notificationService.error('An error occurred while opening the GitHub repository.');
    }
  }

  /**
   * Opens GitHub repository in a new tab
   * @param githubUrl - URL to the GitHub repository
   */
  openGitHub(githubUrl: string): void {
    const success = this.navigationService.openExternalLink(githubUrl);

    if (!success) {
      this.notificationService.error(
        'Unable to open GitHub repository. Please check if popups are blocked.'
      );
    }
  }


  /**
   * Navigates to the challenge requirement document
   * @param requirementUrl - URL to the requirement document
   */
  goToChallenge(requirementUrl: string): void {
    const success = this.navigationService.openExternalLink(requirementUrl);

    if (!success) {
      this.notificationService.error(
        'Unable to open challenge requirement. Please check if popups are blocked.'
      );
    }
  }


  /**
   * Gets the domain name for display purposes
   * @param url - URL to extract domain from
   * @returns string - domain name
   */
  getDomain(url: string): string {
    return this.navigationService.getHostname(url);
  }
}