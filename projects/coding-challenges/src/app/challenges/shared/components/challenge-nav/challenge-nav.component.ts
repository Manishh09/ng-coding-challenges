import { Component, inject, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChallengesService, StackblitzService } from '@ng-coding-challenges/shared/services';
import { Challenge } from '@ng-coding-challenges/shared/models';

@Component({
  selector: 'app-challenge-nav',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './challenge-nav.component.html',
  styleUrls: ['./challenge-nav.component.scss']
})
export class ChallengeNavComponent {
  private router = inject(Router);

  private stackblitzService = inject(StackblitzService);

  private challengeService = inject(ChallengesService);


  /**
   * Navigate to the home page
   */
  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Navigate to challenges and show the challenges list
   * Uses a custom event to communicate with the app component
   */
  navigateToChallenges(): void {
    // Navigate to home first
    this.router.navigate(['/challenges']);

    // Then trigger showing challenges list with a slight delay to ensure navigation completes
    setTimeout(() => {
      // Dispatch a custom event to communicate with app component
      window.dispatchEvent(new CustomEvent('showChallenges', { detail: true }));
    }, 100);
  }

  /**
   * Launches the current challenge in Stackblitz.
   *
   * This method:
   * 1. Gets the current route from the router
   * 2. Determines the current challenge based on the URL
   * 3. Opens the challenge in Stackblitz if found
   *
   * @throws Logs an error to console if the current challenge cannot be determined
   */
  launchChallenge(): void {
    const currentRoute = this.router.url;

    // Get the current challenge based on the URL
    const currentChallenge: Challenge = this.challengeService.getCurrentChallengeIdFromURL(currentRoute) as Challenge;

    if (!currentChallenge) {
      console.error('Current challenge not found');
      return;
    }

    this.stackblitzService.openChallengeInStackblitz(currentChallenge);
    ;
  }
}
