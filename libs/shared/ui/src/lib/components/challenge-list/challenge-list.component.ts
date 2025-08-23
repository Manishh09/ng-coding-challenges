import { Component, Input, OnInit, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeCardComponent } from '../challenge-card/challenge-card.component';
import { ChallengesService } from '@ng-coding-challenges/shared/services';
import { Challenge } from '@ng-coding-challenges/shared/models';

@Component({
  selector: 'ng-coding-challenges-challenge-list',
  templateUrl: './challenge-list.component.html',
  styleUrl: './challenge-list.component.scss',
  standalone: true,
  imports: [CommonModule, ChallengeCardComponent],
})
export class ChallengeListComponent implements OnInit {
  challenges: Challenge[] = [];

  protected title = 'Available Challenges';

  private readonly challengesService = inject(ChallengesService);

  ngOnInit(): void {
    this.challenges = this.challengesService.getChallenges();
  }
}
