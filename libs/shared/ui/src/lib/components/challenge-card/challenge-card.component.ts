import { ChangeDetectionStrategy, Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChallengesService } from '@ng-coding-challenges/shared/services';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { MatMenuModule } from '@angular/material/menu';

/**
 * Component for displaying a challenge card with actions
 *
 * Features:
 * - Accessibility with ARIA labels
 * - Latest challenge highlighting
 */
@Component({
  selector: 'ng-coding-challenges-challenge-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './challenge-card.component.html',
  styleUrl: './challenge-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChallengeCardComponent {
  // Input properties
  readonly challenge = input.required<Challenge>();
  readonly newBadgeChallengeIds = input<number[]>([]);

  readonly categoryLabel = computed(() =>
    this.formatCategoryId(this.challenge().category)
  );

  // Reactive signal to check if current challenge is the latest challenge
  readonly isLatestChallenge = computed(() => {
    const latest = this.challengesService.getLatestChallenge();
    const current = this.challenge();
    return !!latest && current.id === latest.id;
  });

  // Reactive signal for new badge visibility
  readonly hasNewBadge = computed(() => {
    const newBadgeIds = this.newBadgeChallengeIds();
    const currentId = this.challenge().id;
    if (newBadgeIds?.length) {
      return newBadgeIds.includes(currentId);
    }
    return this.isLatestChallenge();
  });

  // ---- Injected Services ----
  private readonly challengesService = inject(ChallengesService);

  private formatCategoryId(categoryId: string): string {
    return categoryId
      .split('-')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }
}
