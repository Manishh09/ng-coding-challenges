import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, map, catchError, shareReplay } from 'rxjs/operators';
import { ChallengeCategory, CategorySlug } from '@ng-coding-challenges/shared/models';
import { ConfigLoaderService } from '../config/config-loader.service';

/**
 * Service responsible for loading category data from JSON configuration.
 * Separated from state management for Single Responsibility Principle.
 * 
 * @example
 * ```typescript
 * constructor(private categoryLoader: CategoryDataLoaderService) {}
 * 
 * ngOnInit() {
 *   this.categoryLoader.loadCategoriesWithCounts()
 *     .subscribe(categories => console.log(categories));
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryDataLoaderService {
  private readonly configLoader = inject(ConfigLoaderService);

  /**
   * Loads all categories from JSON configuration with their challenge counts.
   * This is a cold observable - it will make HTTP requests on each subscription.
   * Use shareReplay(1) if you need to share the result across multiple subscribers.
   * 
   * @returns Observable of ChallengeCategory array with populated challengeCount
   */
  loadCategoriesWithCounts(): Observable<ChallengeCategory[]> {
    return this.configLoader.getCategories().pipe(
      switchMap(categories => {
        if (!categories || categories.length === 0) {
          return of([]);
        }

        // Load challenge counts for all categories in parallel
        const categoriesWithCounts$ = categories.map(cat =>
          this.configLoader.getChallengesByCategory(cat.slug as CategorySlug).pipe(
            map(challenges => ({
              id: cat.slug,
              name: cat.title,
              description: cat.description,
              icon: cat.icon,
              newBadgeCount: 0,
              challengeCount: challenges.length
            } as ChallengeCategory)),
            catchError(error => {
              console.error(`[CategoryDataLoaderService] Failed to load challenges for category ${cat.slug}:`, error);
              // Return category with 0 count on error
              return of({
                id: cat.slug,
                name: cat.title,
                description: cat.description,
                icon: cat.icon,
                newBadgeCount: 0,
                challengeCount: 0
              } as ChallengeCategory);
            })
          )
        );

        // Wait for all categories to load with their counts
        return categoriesWithCounts$.length > 0
          ? combineLatest(categoriesWithCounts$)
          : of([]);
      }),
      catchError(error => {
        console.error('[CategoryDataLoaderService] Failed to load categories:', error);
        return of([]); // Return empty array as fallback
      })
    );
  }

  /**
   * Loads categories with counts and caches the result.
   * Use this when you want to share the same data across multiple subscribers.
   * 
   * @returns Observable of ChallengeCategory array (cached)
   */
  loadCategoriesWithCountsCached(): Observable<ChallengeCategory[]> {
    return this.loadCategoriesWithCounts().pipe(
      shareReplay(1)
    );
  }
}
