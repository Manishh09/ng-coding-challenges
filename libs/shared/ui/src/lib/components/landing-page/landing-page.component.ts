import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChallengesService } from '@ng-coding-challenges/shared/services';

// ============================
// Route Constants
// ============================
const ROUTES = {
  gettingStarted: '/getting-started',
  challenges: '/challenges',
};

@Component({
  selector: 'ng-coding-challenges-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // better performance
})
export class LandingPageComponent {
  // ========== Dependencies ==========
  private readonly router = inject(Router);
  private readonly challengesService = inject(ChallengesService);

  // ========== Static UI Properties ==========
  readonly heroIllustration = '/coding-window.webp';
  readonly heroAltText = 'Developer coding illustration'; // for accessibility

  // ========== Event Handlers ==========
  onGetStarted(): void {
    this.router.navigate([ROUTES.gettingStarted]);
  }

  // Navigate to challenges list
  onExploreChallenges(): void {
    this.router.navigate([ROUTES.challenges]);
  }

  // Navigate to the latest challenge or challenges list
  goToLatestChallenge(): void {
    const latestChallenge = this.challengesService.getLatestChallenge();

    if (!latestChallenge) {
      // Optionally log or track this event
      // console.warn('No latest challenge found. Redirecting to challenges list.');
      this.router.navigate([ROUTES.challenges]);
      return;
    }

    // Construct dynamic route safely
    const { category, link } = latestChallenge;
    this.router.navigate([`${ROUTES.challenges}/${category}/${link}`]);
  }
}
