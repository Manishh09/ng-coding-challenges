import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Challenge, ChallengeCardComponent } from '../challenge-card/challenge-card.component';
import { ChallengesService } from '../../../../../services/src/lib/challenges/challenges.service';

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
