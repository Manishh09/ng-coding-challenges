import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { ChallengesService } from '@ng-coding-challenges/shared/services';

@Component({
  selector: 'ng-coding-challenges-latest-challenge',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './latest-challenge.component.html',
  styleUrl: './latest-challenge.component.scss'
})
export class LatestChallengeComponent implements OnInit {
  latestChallenge?: Challenge;
  tryLatestChallenge = output<void>();

  private readonly challengesService = inject(ChallengesService);

  ngOnInit(): void {
    // Get all challenges and find the one with the highest ID (latest)
    const challenges = this.challengesService.getChallenges();
    if (challenges.length > 0) {
      this.latestChallenge = challenges.reduce((prev, current) => {
        return (prev.id > current.id) ? prev : current;
      });
    }
  }

  onTryLatestChallenge(): void {
    this.tryLatestChallenge.emit();
  }
}
