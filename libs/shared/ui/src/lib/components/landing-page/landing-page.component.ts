import { Component, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LatestChallengeComponent } from '../latest-challenge/latest-challenge.component';
import { f } from "../../../../../../../node_modules/@angular/material/icon-module.d-COXCrhrh";
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ng-coding-challenges-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterModule,
    LatestChallengeComponent,
    MatIconModule
],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  // Output Signals
  startPracticing = output<void>();
  exploreChallenges = output<void>();
  tryLatestChallenge = output<void>();

  // Input properties for dynamic content
  logo = '/coding-window.webp';

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
