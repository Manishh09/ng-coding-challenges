import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatChipsModule, MatButtonModule, MatTooltipModule, A11yModule],
})
export class ChallengeCategoryCardComponent {

  // Input properties
  readonly category = input.required<ChallengeCategory>();
  readonly selected = input(false);

  // Dependencies
  private readonly router = inject(Router);

  // Navigation with clear naming and typed argument
  onNavigateToCategory(categoryId: string): void {
    if (!categoryId) return;
    this.router.navigate(['/challenges', categoryId]);
  }
}
