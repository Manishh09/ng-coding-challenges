import { Injectable } from '@angular/core';
import { Challenge } from '@ng-coding-challenges/shared/models';
import sdk from '@stackblitz/sdk';

const REPO = 'ng-quest-starter';
const OWNER = 'Manishh09';

@Injectable({
  providedIn: 'root'
})
export class StackblitzService {

  /**
   * Opens a GitHub repo in StackBlitz for the challenge branch
   * and opens the requirement file automatically
   */
  async openChallengeInStackblitz(challenge: Challenge): Promise<void> {
    if (!challenge?.gitHub) {
      console.warn('Challenge or gitHub property is missing.');
      return;
    }

    // Extract branch name from challenge.gitHub URL
    // Example: 'https://github.com/Manishh09/ng-quest-starter/tree/challenge-01-product-list'
    const branch = challenge.gitHub.split('/').at(-1) || 'develop';

    // Path to requirement file inside branch
    const requirementFile = `src/docs/CH-${String(challenge.id).padStart(2, '0')}-REQUIREMENT.md`;

    // Construct GitHub URL for branch
    const githubBranchUrl = `${OWNER}/${REPO}/tree/${branch}`;

    // Open in StackBlitz
    sdk.openGithubProject(
      githubBranchUrl, {
      openFile: requirementFile,
      newWindow: true
    });

  }
}
