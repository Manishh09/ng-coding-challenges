import { Injectable, Signal, signal } from '@angular/core';
import { ChallengeCategory } from '@ng-coding-challenges/shared/models';
 import { CHALLENGE_CATEGORIES } from './challenge-category.data';

@Injectable({
  providedIn: 'root',
})
export class ChallengeCategoryService {
  private readonly _categories = signal<ChallengeCategory[]>(CHALLENGE_CATEGORIES);

  private readonly _selectedCategoryId = signal<string>(this._categories().length > 0 ? this._categories()[0].id : '');

  readonly categories: Signal<ChallengeCategory[]> = this._categories;
  readonly selectedCategoryId: Signal<string> = this._selectedCategoryId;

  setSelectedCategory(categoryId: string): void {
    if (this._categories().some(c => c.id === categoryId)) {
      this._selectedCategoryId.set(categoryId);
    } else {
      console.warn(`Category ID '${categoryId}' not found.`);
    }
  }

  updateNewBadgeCount(categoryId: string, count: number): void {
    const cats = [...this._categories()];
    const index = cats.findIndex(c => c.id === categoryId);
    if (index !== -1) {
      cats[index] = { ...cats[index], newBadgeCount: count };
      this._categories.set(cats);
    }
  }

  getCategoryNameById(categoryId: string): string | null {
    const category = this._categories().find(c => c.id === categoryId);
    return category ? category.name : null;
  }
}
