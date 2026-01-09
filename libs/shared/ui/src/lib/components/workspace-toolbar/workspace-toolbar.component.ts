import { Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StackblitzService, ChallengesService, ChallengeCategoryService } from '@ng-coding-challenges/shared/services';
import { LOADING_CONFIG } from '../../constants/loading.constants';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { toChallengeCategoryId, toDifficultyLevel } from '../../utils/type-guards';

/**
 * Base GitHub repository URL for constructing full documentation links
 */
const BASE_REPOSITORY = 'https://github.com/Manishh09/ng-coding-challenges/blob/develop';

/**
 * Workspace Toolbar Component - Self-Contained
 *
 * A fully autonomous component that manages its own data fetching and state.
 * Reads route parameters directly and fetches challenge data independently.
 *
 * Features:
 * - Self-contained: No input properties required
 * - Reads route params from ActivatedRoute
 * - Fetches own challenge data
 * - Back navigation to challenge details
 * - Challenge title and category display
 * - Solution guide access
 * - StackBlitz IDE launch
 * - Responsive design with adaptive button labels
 * - Accessible ARIA labels
 *
 * Architecture:
 * - Follows Single Responsibility Principle
 * - Loose coupling with parent components
 * - Fully reusable in any routing context
 *
 * Usage:
 * ```html
 * <ngc-ui-workspace-toolbar />
 * ```
 */
@Component({
  selector: 'ngc-ui-workspace-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './workspace-toolbar.component.html',
  styleUrl: './workspace-toolbar.component.scss'
})
export class WorkspaceToolbarComponent {
  private readonly router = inject(Router);
  private readonly challengesService = inject(ChallengesService);
  private readonly categoryService = inject(ChallengeCategoryService);
  private readonly stackblitzService = inject(StackblitzService);
  private readonly destroyRef = inject(DestroyRef);

  // Loading state for StackBlitz launch
  readonly launching = signal<boolean>(false);

  /**
   * Helper method to extract route params from URL
   * URL structure: /challenges/{category}/{challengeSlug}/workspace
   * Example: http://localhost:4200/challenges/rxjs-api/client-side-search/workspace
   *
   * After split and filter: ['challenges', 'rxjs-api', 'client-side-search', 'workspace']
   * Index:                   0            1           2                     3
   *
   * @returns Object with category (index 1) and challengeSlug (index 2)
   */
  private getRouteParams(): { category: string; challengeSlug: string } {
    const url = this.router.url;
    const segments = url.split('/').filter(segment => segment && segment.trim() !== '');
    const cleanSegments = segments.map(segment => segment.split('?')[0]);

    return {
      category: cleanSegments[1] || '',
      challengeSlug: cleanSegments[2] || ''
    };
  }

  /**
   * Extract route parameters from URL and route data
   * Route structure: /challenges/{category}/{challengeSlug}/workspace
   * Params come from parent route paramMap and current route data
   */
  private readonly routeParams = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.getRouteParams()),
      takeUntilDestroyed(this.destroyRef)
    ),
    { initialValue: this.getRouteParams() } // Call on initialization
  );

  /**
   * Fetch complete challenge data based on route params
   * Handles both initial load and navigation events
   */
  readonly challenge = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
      switchMap(() => {
        // Read params directly from route, not from signal
        const params = this.getRouteParams();
        const { category, challengeSlug } = params;

        if (!category || !challengeSlug) {
          return of(null);
        }

        // Use type-safe conversion with validation
        const validCategory = toChallengeCategoryId(category);
        return this.challengesService.getChallengeDetailsBySlug(challengeSlug, validCategory);
      }),
      takeUntilDestroyed(this.destroyRef)
    ),
    { initialValue: null }
  );

  // Computed properties derived from challenge data
  readonly challengeTitle = computed(() => {
    const c = this.challenge();
    if (c?.title) return c.title;

    // Fallback: format slug into readable title
    const slug = this.routeParams().challengeSlug;
    return this.formatChallengeSlug(slug);
  });

  readonly categoryId = computed(() => this.routeParams().category || '');
  readonly challengeSlug = computed(() => this.routeParams().challengeSlug || '');

  readonly categoryName = computed(() => {
    const catId = this.categoryId();
    return catId ? this.categoryService.getCategoryNameById(catId) : '';
  });

  readonly solutionGuide = computed(() => this.challenge()?.solutionGuide);
  readonly gitHub = computed(() => this.challenge()?.gitHub);
  readonly challengeId = computed(() => this.challenge()?.id);
  readonly difficulty = computed(() => this.challenge()?.difficulty);
  readonly tags = computed(() => this.challenge()?.tags);
  readonly description = computed(() => this.challenge()?.description);

  /**
   * Format challenge slug into readable title
   * Example: 'fetch-products' -> 'Fetch Products'
   */
  private formatChallengeSlug(slug: string): string {
    if (!slug) return 'Challenge Workspace';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  /**
   * Navigate back to challenge details page
   * Route: /challenges/{category}/{challengeSlug}
   */
  navigateBack(): void {
    const category = this.categoryId();
    const slug = this.challengeSlug();

    if (category && slug) {
      this.router.navigate(['/challenges', category, slug]);
    } else {
      // Fallback to challenges home if data is missing
      this.router.navigate(['/challenges']);
    }
  }

  /**
   * Open solution guide in a new tab
   * Constructs full GitHub URL from relative path
   */
  openSolution(): void {
    const solutionPath = this.solutionGuide();
    if (solutionPath) {
      const fullUrl = `${BASE_REPOSITORY}/${solutionPath}`;
      window.open(fullUrl, '_blank');
    }
  }

  /**
   * Launch challenge in StackBlitz IDE
   * Uses StackblitzService to open challenge in new window
   */
  async launchStackBlitz(): Promise<void> {
    const gitHubPath = this.gitHub();
    const id = this.challengeId();
    const title = this.challengeTitle();
    const category = this.categoryId();
    const difficulty = this.difficulty();

    if (!gitHubPath || !id) return;

    this.launching.set(true);
    try {
      await this.stackblitzService.openChallengeInStackblitz({
        id,
        title,
        category: toChallengeCategoryId(category), // Type-safe conversion
        gitHub: gitHubPath,
        description: this.description() || '',
        difficulty: toDifficultyLevel(difficulty, 'Beginner'), // Type-safe conversion with fallback
        tags: this.tags() || [],
        link: this.challengeSlug()
      });
    } catch (error) {
      console.error('[WorkspaceToolbar] Failed to launch StackBlitz:', error);
    } finally {
      // Keep launching state for a moment to show feedback
      setTimeout(() => this.launching.set(false), LOADING_CONFIG.LONG_DELAY_MS);
    }
  }
}
