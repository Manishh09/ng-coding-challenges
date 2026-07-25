import { Injectable, inject } from '@angular/core';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { NotificationService } from '../notification/notification.service';
import { LIVE_EDITOR_PROVIDER } from '../live-editor/live-editor.token';
import { ChallengeStarterService } from '../live-editor/challenge-starter.service';

/**
 * Facade for launching the live coding editor.
 *
 * Resolves the challenge's self-contained starter project (via
 * {@link ChallengeStarterService}) and opens it in a new browser tab through the
 * active {@link LIVE_EDITOR_PROVIDER}. No external Git repository is involved.
 * Retains the name/method for backward compatibility with existing callers.
 */
@Injectable({
  providedIn: 'root'
})
export class StackblitzService {
  private readonly notificationService = inject(NotificationService);
  private readonly provider = inject(LIVE_EDITOR_PROVIDER);
  private readonly starterService = inject(ChallengeStarterService);

  /**
   * Warm the challenge's docs so the verbatim requirement can be embedded at
   * launch without an async gap. Call when the challenge page loads.
   */
  prefetchChallenge(challenge: Challenge): void {
    this.starterService.prefetch(challenge);
  }

  /**
   * Boots the challenge's starter project in the live editor (new tab).
   * @param challenge - The challenge to open
   * @throws Error if opening the editor fails
   */
  async openChallengeInStackblitz(challenge: Challenge): Promise<void> {
    if (!challenge?.id) {
      console.warn('StackBlitzService: Challenge data is missing.');
      this.notificationService.warning('Challenge is not available');
      return;
    }

    try {
      const project = this.starterService.getProject(challenge);
      this.provider.open(project, { newWindow: true });
      this.notificationService.success('Opening live editor…');
    } catch (error) {
      console.error('StackBlitzService: Failed to open the live editor:', error);
      this.notificationService.error('Failed to open the live editor. Please try again.');
      throw error;
    }
  }
}
