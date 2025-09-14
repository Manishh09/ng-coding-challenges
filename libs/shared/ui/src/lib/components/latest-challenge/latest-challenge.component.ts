import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { ChallengesService, NavigationService } from '@ng-coding-challenges/shared/services';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'ng-coding-challenges-latest-challenge',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './latest-challenge.component.html',
  styleUrl: './latest-challenge.component.scss'
})
export class LatestChallengeComponent implements OnInit {
  latestChallenge?: Challenge;
  tryLatestChallenge = output<void>();

  private readonly challengesService = inject(ChallengesService);

  private readonly navigationService = inject(NavigationService);

  ngOnInit(): void {
    // Get all challenges and find the one with the highest ID (latest)
    const challenges = this.challengesService.getChallenges();
    if (challenges.length > 0) {
      this.latestChallenge = challenges.reduce((prev, current) => {
        return (prev.id > current.id) ? prev : current;
      });
    }
  }

  openURL(url: string): void {
   this.navigationService.openExternalLink(url);
  }

  onTryLatestChallenge(): void {
    this.tryLatestChallenge.emit();
  }
}
