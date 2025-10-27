import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ChallengeCategoryService } from '@ng-coding-challenges/shared/services';
import { ChallengeCategoryCardComponent } from '../challenge-category-card/challenge-category-card.component';
import { MatIconModule } from '@angular/material/icon';
import { ɵɵRouterLink } from "@angular/router/testing";
import { ActivatedRoute } from '@angular/router';
import { ChallengesService } from '@ng-coding-challenges/shared/services';

@Component({
  selector: 'app-challenge-category-list',
  templateUrl: './challenge-category-list.component.html',
  styleUrls: ['./challenge-category-list.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, ChallengeCategoryCardComponent, ɵɵRouterLink]
})
export class ChallengeCategoryListComponent {

  private readonly categoryService = inject(ChallengeCategoryService);
  private readonly challengeService = inject(ChallengesService);

  categories = this.categoryService.categories;
  selectedCategoryId = this.categoryService.selectedCategoryId;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    for (const category of this.categories()) {
      // map count for each category of challenges
      const count = this.challengeService.getChallengesByCategory(category.id).length;
      this.categoryService.mapCategoryIdToCount(category.id, count);
    }
  }

  selectCategory(categoryId: string): void {
    this.categoryService.setSelectedCategory(categoryId);
  }

  isSelected = (categoryId: string) =>
    computed(() => this.selectedCategoryId() === categoryId);

  getChallengesCount(categoryId: string): number {
    return this.challengeService.getChallengesByCategory(categoryId).length;
  }
}