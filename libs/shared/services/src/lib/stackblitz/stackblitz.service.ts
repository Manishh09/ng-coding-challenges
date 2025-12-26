import { Injectable, inject } from '@angular/core';
import { Challenge } from '@ng-coding-challenges/shared/models';
import sdk from '@stackblitz/sdk';
import { NotificationService } from '../notification/notification.service';

const REPO = 'ng-quest-starter';
const OWNER = 'Manishh09';

@Injectable({
  providedIn: 'root'
})
export class StackblitzService {
  private readonly notificationService = inject(NotificationService);

  /**
   * Opens a GitHub repo in StackBlitz for the challenge branch
   * and opens the requirement file automatically
   * @param challenge - The challenge to open
   * @throws Error if opening StackBlitz fails
   */
  async openChallengeInStackblitz(challenge: Challenge): Promise<void> {
    if (!challenge?.gitHub) {
      console.warn('StackBlitzService: Challenge or gitHub property is missing.');
      this.notificationService.warning('Challenge GitHub link is not available');
      return;
    }

    try {
      // Extract branch name from challenge.gitHub URL
      // Example: 'https://github.com/Manishh09/ng-quest-starter/tree/challenge-01-product-list'
      const branch = challenge.gitHub.split('/').at(-1) || 'develop';

      // Path to requirement file inside branch
      const requirementFile = `src/docs/CH-${String(challenge.id).padStart(2, '0')}-REQUIREMENT.md`;

      // Construct GitHub URL for branch
      const githubBranchUrl = `${OWNER}/${REPO}/tree/${branch}`;

      // Open in StackBlitz
      await sdk.openGithubProject(
        githubBranchUrl, {
        openFile: requirementFile,
        newWindow: true
      });

      this.notificationService.success('Opening challenge in StackBlitz...');
    } catch (error) {
      console.error('StackBlitzService: Failed to open challenge in StackBlitz:', error);
      this.notificationService.error('Failed to open StackBlitz. Please try again.');
      throw error;
    }
  }
}
