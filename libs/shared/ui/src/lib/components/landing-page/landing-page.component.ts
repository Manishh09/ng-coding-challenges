import { Component, Output, EventEmitter, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'ng-coding-challenges-landing-page',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  // Output Signals
  startPracticing = output<void>();
  exploreChallenges = output<void>();
  tryLatestChallenge = output<void>();

  // Input properties for dynamic content
  cardLogo = '/angular_gradient_logo.png';

  onStartPracticing(): void {
    this.startPracticing.emit();
  }

  onExploreChallenges(): void {
    this.exploreChallenges.emit();
  }

  onTryLatestChallenge(): void {
    this.tryLatestChallenge.emit();
  }
}
