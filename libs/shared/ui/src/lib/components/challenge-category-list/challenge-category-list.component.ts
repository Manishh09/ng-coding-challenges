import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ChallengeCategoryService } from '@ng-coding-challenges/shared/services';
import { ChallengeCategoryCardComponent } from '../challenge-category-card/challenge-category-card.component';
import { MatIconModule } from '@angular/material/icon';
import { ɵɵRouterLink } from "@angular/router/testing";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-challenge-category-list',
  templateUrl: './challenge-category-list.component.html',
  styleUrls: ['./challenge-category-list.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, ChallengeCategoryCardComponent, ɵɵRouterLink]
})
export class ChallengeCategoryListComponent {

  private readonly categoryService = inject(ChallengeCategoryService);

  categories = this.categoryService.categories;
  selectedCategoryId = this.categoryService.selectedCategoryId;




  selectCategory(categoryId: string): void {
    this.categoryService.setSelectedCategory(categoryId);
  }

  isSelected = (categoryId: string) =>
    computed(() => this.selectedCategoryId() === categoryId);
}
