import {
  Component,
  inject,
  signal,
  computed,
  Signal,
  DestroyRef,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  ChallengeCategoryService,
  ChallengesService,
} from '@ng-coding-challenges/shared/services';
import { CategorySidebarComponent } from '../category-sidebar/category-sidebar.component';
import { WorkspaceToolbarComponent } from '../workspace-toolbar/workspace-toolbar.component';
import { filter, map } from 'rxjs';
import { CHALLENGE_CATEGORY_IDS } from '../../constants/constants';

/**
 * Challenges Browser Component - Pure Shell/Layout Component
 *
 * Responsibilities:
 * - Provides sidebar navigation for categories
 * - Manages responsive layout (mobile/tablet/desktop)
 * - Adapts UI based on route depth (shows/hides sidebar)
 * - Conditionally displays workspace toolbar for workspace routes
 * - Delegates content rendering to child routes via <router-outlet>
 *
 * Does NOT:
 * - Render challenge lists (delegated to ChallengeListComponent)
 * - Render challenge details (delegated to ChallengeDetailsComponent)
 * - Handle challenge data fetching (done by resolvers and child components)
 * - Manage workspace-specific logic (handled by WorkspaceToolbarComponent)
 *
 * Routing Architecture:
 * - Level 1: /challenges/{category} - Shows ChallengeListComponent
 * - Level 2: /challenges/{category}/{challengeId} - Shows ChallengeDetailsComponent
 * - Level 3: /challenges/{category}/{challengeId}/workspace - Shows workspace component + toolbar
 */
@Component({
  selector: 'app-challenges-browser',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    CategorySidebarComponent,
    WorkspaceToolbarComponent,
  ],
  templateUrl: './challenges-browser.component.html',
  styleUrl: './challenges-browser.component.scss',
})
export class ChallengesBrowserComponent {
  private readonly categoryService = inject(ChallengeCategoryService);
  private readonly challengesService = inject(ChallengesService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  // Responsive state
  readonly isMobileView = signal<boolean>(false);
  readonly isSidebarOpen = signal<boolean>(false);

  // Category selection from service (for sidebar)
  readonly selectedCategoryId: Signal<string> =
    this.categoryService.selectedCategoryId;

  // Computed category name for header display
  readonly selectedCategoryName = computed(() => {
    const categoryId = this.selectedCategoryId();
    return this.categoryService.getCategoryNameById(categoryId) || 'Challenges';
  });

  // Cache for challenge counts by category (initialized once, updated reactively)
  private readonly challengeCountByCategory = toSignal(
    this.challengesService.getChallengeCountByCategory(),
    { initialValue: new Map<string, number>() }
  );

  // Get challenge count for result display
  readonly resultCountText = computed(() => {
    const categoryId = this.selectedCategoryId();
    if (!categoryId) return '0 challenges';

    const count = this.challengeCountByCategory().get(categoryId) || 0;
    const categoryName = this.selectedCategoryName();

    return `${count} challenges in ${categoryName}`;
  });

  // Check if child route is active (challenge detail or workspace view)
  readonly isChildRouteActive = signal<boolean>(false);

  /**
   * Calculate route depth from URL
   * Helper function for consistent depth calculation
   */
  private calculateRouteDepth(): number {
    const url = this.router.url.split('?')[0]; // Remove query params
    const segments = url.split('/').filter(s => s);

    // /challenges = 1 segment (depth 0)
    // /challenges/rxjs-api = 2 segments (depth 1)
    // /challenges/rxjs-api/fetch-products = 3 segments (depth 2)
    // /challenges/rxjs-api/fetch-products/workspace = 4 segments (depth 3)
    return segments.length - 1; // Subtract 'challenges' base
  }

  // Track current route depth for adaptive UI
  // Depth 0: /challenges or /challenges/all
  // Depth 1: /challenges/rxjs-api (category list)
  // Depth 2: /challenges/rxjs-api/fetch-products (details)
  // Depth 3: /challenges/rxjs-api/fetch-products/workspace (workspace)
  readonly routeDepth = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.calculateRouteDepth()),
      takeUntilDestroyed(this.destroyRef)
    ),
    { initialValue: this.calculateRouteDepth() } // Use current URL for initial value
  );

  // Show sidebar only in list view (depth 0 or 1)
  readonly shouldShowSidebar = computed(() => {
    const depth = this.routeDepth();
    return depth <= 1;
  });

  /**
   * Workspace route data - extracted from deepest route for conditional toolbar display
   */
  readonly workspaceData = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.route.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        return route?.snapshot?.data || {};
      }),
      takeUntilDestroyed(this.destroyRef)
    ),
    {
      initialValue: (() => {
        let route = this.route.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        return route?.snapshot?.data || {};
      })()
    }
  );

  /**
   * Check if current route is a workspace route
   * Used to conditionally show workspace toolbar
   */
  readonly isWorkspaceRoute = computed(() => {
    const data = this.workspaceData();
    return data['layoutType'] === 'challenge-workspace';
  });

  /**
   * Dynamic container class based on route data
   * Reads layoutType from route data for explicit layout declaration
   * Provides single source of truth for container styling
   *
   * @returns Container class name (e.g., 'landing-page-container', 'challenge-details-container', 'challenge-workspace-container')
   */
  readonly containerClass = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        // Traverse to the deepest activated route to get its data
        let route = this.route.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }

        // Get layoutType from route data (explicit declaration)
        const layoutType = route?.snapshot?.data?.['layoutType'];

        // Return container class with proper suffix
        return layoutType ? `${layoutType}-container` : 'landing-page-container';
      }),
      takeUntilDestroyed(this.destroyRef)
    ),
    {
      // Calculate initial value from current route
      initialValue: (() => {
        let route = this.route.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        const layoutType = route?.snapshot?.data?.['layoutType'];
        return layoutType ? `${layoutType}-container` : 'landing-page-container';
      })()
    }
  );

  constructor() {
    // Monitor breakpoint changes for responsive behavior
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, '(max-width: 767px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.isMobileView.set(result.matches);
        // Auto-close sidebar on mobile
        if (result.matches) {
          this.isSidebarOpen.set(false);
        } else {
          this.isSidebarOpen.set(true);
        }
      });

    // Sync category from route/query params on init
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params['category']) {
          this.categoryService.setSelectedCategory(params['category']);
        }
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((value) => !value);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  /**
   * Handle category selection from sidebar
   * Navigates to the selected category route
   * Validates that the category exists before navigation
   */
  onCategorySelect(categoryId: string): void {
    // Validate category exists in route configuration
    const validCategories = CHALLENGE_CATEGORY_IDS;

    if (!validCategories.includes(categoryId as typeof CHALLENGE_CATEGORY_IDS[number])) {
      console.warn(`[ChallengesBrowser] Category '${categoryId}' does not have a route configured`);
      return;
    }

    this.router.navigate([categoryId], { relativeTo: this.route });
  }
}
