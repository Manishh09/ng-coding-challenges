import { Component, inject, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChallengesService } from '@ng-coding-challenges/shared/services';

@Component({
  selector: 'ng-coding-challenges-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  private challengesService = inject(ChallengesService);

  // Input properties for dynamic content
  heroIllustration = '/coding-window.webp';

  onGetStarted(): void {
    this.router.navigate(['/getting-started']);
  }

  onExploreChallenges(): void {
    this.router.navigate(['/challenges']);
  }

  goToLatestChallenge(): void {
    const latestChallenge = this.challengesService.getLatestChallenge();
    if (latestChallenge) {
      // Navigate to the latest challenge link
      this.router.navigate([`/challenges/${latestChallenge.category}/${latestChallenge.link}`]);
      return;
    }
    this.router.navigate(['/challenges']);

  }
}
