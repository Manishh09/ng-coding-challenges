import { Injectable, Signal, signal, computed } from '@angular/core';
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
   * Internal reactive state for category search/filter term.
   */
  private readonly _categorySearchTerm = signal<string>('');

  /**
  * Public readonly signals for reactive consumption in components.
  */
  readonly categories: Signal<ChallengeCategory[]> = this._categories;

  /**
   * Public readonly signal for selected category ID.
   */
  readonly selectedCategoryId: Signal<string> = this._selectedCategoryId.asReadonly();

  /**
   * Public readonly signal for category search term.
   */
  readonly categorySearchTerm: Signal<string> = this._categorySearchTerm.asReadonly();

  /**
   * Filtered categories based on search term.
   */
  readonly filteredCategories: Signal<ChallengeCategory[]> = computed(() => {
    const searchTerm = this._categorySearchTerm().toLowerCase().trim();
    if (!searchTerm) {
      return this._categories();
    }
    return this._categories().filter(category =>
      category.name.toLowerCase().includes(searchTerm) ||
      category.id.toLowerCase().includes(searchTerm) ||
      category.description?.toLowerCase().includes(searchTerm)
    );
  });

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

  /**
   * Updates the category search term for filtering.
   */
  setCategorySearchTerm(term: string): void {
    this._categorySearchTerm.set(term);
  }

  /**
   * Clears the category search term.
   */
  clearCategorySearch(): void {
    this._categorySearchTerm.set('');
  }

}
