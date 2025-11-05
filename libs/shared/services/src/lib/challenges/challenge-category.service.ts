import { Injectable, Signal, signal } from '@angular/core';
import { ChallengeCategory } from '@ng-coding-challenges/shared/models';
import { CHALLENGE_CATEGORIES } from './challenge-category.data';

@Injectable({
  providedIn: 'root',
})
export class ChallengeCategoryService {

  /**
   * Internal reactive state for all categories.
   */
  private readonly _categories = signal<ChallengeCategory[]>(CHALLENGE_CATEGORIES);

  /**
   * Internal reactive state for the selected category ID.
   */
  private readonly _selectedCategoryId = signal<string>(this._categories().length ? this._categories()[0].id : '');

  /**
  * Public readonly signals for reactive consumption in components.
  */
  readonly categories: Signal<ChallengeCategory[]> = this._categories;

  /**
   * Updates the currently selected category if the provided ID exists.
   */
  setSelectedCategory(categoryId: string): void {
    const exists = this._categories().some(c => c.id === categoryId);
    if (exists) {
      this._selectedCategoryId.set(categoryId);
    } else {
      console.warn(`Category ID '${categoryId}' not found.`);
    }
  }

  /**
   * Updates the new badge count for a given category.
   */
   updateNewBadgeCount(categoryId: string, count: number): void {
    this.updateCategoryById(categoryId, { newBadgeCount: count });
  }

   /**
   * Centralized immutable update logic for any category field(s).
   */
  private updateCategoryById(categoryId: string, updates: Partial<ChallengeCategory>): void {
    const updated = this._categories().map(c =>
      c.id === categoryId ? { ...c, ...updates } : c
    );
    this._categories.set(updated);
  }

   /**
   * Retrieves a category name by ID.
   */
  getCategoryNameById(categoryId: string): string | undefined  {
    const category = this._categories().find(c => c.id === categoryId);
    return category?.name;
  }

  mapCategoryIdToCount(categoryId: string, count: number): void {
    const categories = [...this._categories()];
    const index = categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
      categories[index] = { ...categories[index], challengeCount: count };
      this._categories.set(categories);
    }
  }

  getSelectedCategoryId(): string {
    return this._selectedCategoryId();
  }

}
