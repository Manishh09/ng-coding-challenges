import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ChallengeCategoryService } from '@ng-coding-challenges/shared/services';
import { ChallengeCategoryCardComponent } from '../challenge-category-card/challenge-category-card.component';
import { MatIconModule } from '@angular/material/icon';
import { ChallengesService } from '@ng-coding-challenges/shared/services';
import { RouterLink } from '@angular/router';

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
  readonly selectedCategoryId = this.categoryService.getSelectedCategoryId();

  // Computed signal for categories with challenge counts
  readonly categoriesWithCount = computed(() =>
    this.categories().map((category) => ({
      ...category,
      challengeCount: this.challengeService.getChallengesByCategory(category.id)
        .length,
    }))
  );

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  isSelected = (categoryId: string) =>
    computed(() => this.selectedCategoryId === categoryId);
}
