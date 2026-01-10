import { Injectable, Signal, signal, computed, inject, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChallengeCategory } from '@ng-coding-challenges/shared/models';
import { CategoryDataLoaderService } from './category-data-loader.service';

@Injectable({
  providedIn: 'root',
})
export class ChallengeCategoryService {
  private readonly categoryLoader = inject(CategoryDataLoaderService);

  /**
   * Load categories from JSON configuration with challenge counts.
   * Falls back to empty array if JSON load fails.
   * Now delegated to CategoryDataLoaderService for separation of concerns.
   */
  private readonly categoriesFromJson = toSignal(
    this.categoryLoader.loadCategoriesWithCounts(),
    { initialValue: [] } // Empty array fallback
  );

  /**
   * Internal reactive state for all categories.
   * Now populated from JSON configuration.
   */
  private readonly _categories = signal<ChallengeCategory[]>([]);

  /**
   * Internal reactive state for the selected category ID.
   */
  private readonly _selectedCategoryId = signal<string>('');

  /**
   * Watch for changes in JSON-loaded categories and update the signal
   */
  constructor() {
    // Use effect to reactively sync JSON categories when they load
    effect(() => {
      const jsonCategories = this.categoriesFromJson();
      if (jsonCategories && jsonCategories.length > 0) {
        this._categories.set(jsonCategories);

        // Set first category as selected if none selected yet
        if (!this._selectedCategoryId() && jsonCategories.length > 0) {
          this._selectedCategoryId.set(jsonCategories[0].id);
        }
      }
    });
  }

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

  /**
   * Updates the challenge count for a specific category.
   * @param categoryId - Category ID to update
   * @param count - New challenge count
   */
  mapCategoryIdToCount(categoryId: string, count: number): void {
    this.updateCategoryById(categoryId, { challengeCount: count });
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

  /**
   * Updates all categories with their respective challenge counts.
   * @param countMap - Map of category ID to challenge count
   */
  updateAllChallengeCounts(countMap: Map<string, number>): void {
    const updatedCategories = this._categories().map(category => ({
      ...category,
      challengeCount: countMap.get(category.id) || 0
    }));
    this._categories.set(updatedCategories);
  }

}
