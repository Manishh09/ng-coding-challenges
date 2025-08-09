import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeCardComponent } from '../challenge-card/challenge-card.component';
import { ChallengesService } from '@ng-coding-challenges/shared/services';
import { Challenge } from '@ng-coding-challenges/shared/models';
 
@Component({
  selector: 'ng-coding-challenges-challenge-list',
  templateUrl: './challenge-list.component.html',
  styleUrl: './challenge-list.component.scss',
  standalone: true,
  imports: [CommonModule, ChallengeCardComponent]
})
export class ChallengeListComponent implements OnInit {
  @Input() challenges: Challenge[] = [];
  @Input() title: string = 'Available Challenges';

  private challengesService = inject(ChallengesService);

  ngOnInit(): void {
    // If no challenges are provided as input, get them from the service
    if (this.challenges.length === 0) {
      this.challenges = this.challengesService.getChallenges();
    }
  }
}
