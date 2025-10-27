import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ChallengeCategory } from '@ng-coding-challenges/shared/models';
import { A11yModule } from "@angular/cdk/a11y";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-challenge-category-card',
  templateUrl: './challenge-category-card.component.html',
  styleUrls: ['./challenge-category-card.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatChipsModule, MatButtonModule, MatTooltipModule, A11yModule],
})
export class ChallengeCategoryCardComponent {


  readonly category = input.required<ChallengeCategory>();

  readonly selected = input<boolean>(false);

  readonly router = inject(Router);

  goToChallenges(challengeId: string): void {  // Navigation logic to go to the challenges of the selected category
    this.router.navigate(['/challenges', challengeId]);
  }
}
