import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ChallengeCategoryService } from '@ng-coding-challenges/shared/services';
import { ChallengeCategoryCardComponent } from '../challenge-category-card/challenge-category-card.component';
import { MatIconModule } from '@angular/material/icon';
import { ChallengesService } from '@ng-coding-challenges/shared/services';
import { RouterLink } from '@angular/router';

/**
 * Component for displaying a list of challenge categories
 *
 * Features:
 * - Reactive category selection
 * - Challenge count per category
 * - Responsive grid layout
 */
@Component({
  selector: 'app-challenge-category-list',
  templateUrl: './challenge-category-list.component.html',
  styleUrls: ['./challenge-category-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ChallengeCategoryCardComponent,
    RouterLink,
  ],
})
export class ChallengeCategoryListComponent {
  //  Inject dependencies
  private readonly categoryService = inject(ChallengeCategoryService);
  private readonly challengeService = inject(ChallengesService);

  //  Signals exposed from services
  readonly categories = this.categoryService.categories;

  // Cache challenge count map outside reactive context
  private readonly challengeCountMap = toSignal(
    this.challengeService.getChallengeCountByCategory(),
    { initialValue: new Map<string, number>() }
  );

  // Computed signal for categories with challenge counts
  readonly categoriesWithCount = computed(() =>
    this.categories().map((category) => {
      const challengeCount = this.challengeCountMap().get(category.id) || 0;
      return {
        ...category,
        challengeCount,
      };
    })
  );

  /**
   * Check if a category is selected
   * Returns a computed signal for reactive comparison
   */
  isSelected(categoryId: string) {
    return computed(() => this.categoryService.getSelectedCategoryId() === categoryId);
  }
}
