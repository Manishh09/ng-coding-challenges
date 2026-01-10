import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChallengesService, ChallengeCategoryService, StackblitzService } from '@ng-coding-challenges/shared/services';
import { ChallengeDetails, Challenge } from '@ng-coding-challenges/shared/models';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { BreadcrumbsComponent, BreadcrumbItem } from '../breadcrumbs/breadcrumbs.component';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LOADING_CONFIG } from '../../constants/loading.constants';
import { ChallengeDetailsRouteData } from '../../models/route-data.interface';

/**
 * Base GitHub repository URL for constructing full documentation links
 */
const BASE_REPOSITORY = 'https://github.com/Manishh09/ng-coding-challenges/blob/develop';

/**
 * Challenge Details Component
 *
 * Level 2 in routing hierarchy: /challenges/{category}/{challengeId}
 *
 * Features:
 * - Displays challenge overview, requirements, learning outcomes
 * - Provides navigation to workspace view
 * - Shows related resources and documentation
 * - Supports next/previous challenge navigation
 */
@Component({
  selector: 'ngc-ui-challenge-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDividerModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    BreadcrumbsComponent
  ],
  templateUrl: './challenge-details.component.html',
  styleUrl: './challenge-details.component.scss',
})
export class ChallengeDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly challengesService = inject(ChallengesService);
  private readonly categoryService = inject(ChallengeCategoryService);
  private readonly stackblitzService = inject(StackblitzService);

  // Loading state for StackBlitz launch
  readonly launching = signal<boolean>(false);

  // Get route data (contains resolved challenge data from resolver)
  private readonly routeData = toSignal(this.route.data);

  // Challenge details from resolver
  readonly challengeDetails = computed(() => {
    const data = this.routeData() as ChallengeDetailsRouteData | undefined;
    return data?.challenge || null;
  });

  // Get current challenge ID for reactive navigation queries
  private readonly currentChallengeId = computed(() => this.challengeDetails()?.id ?? 0);

  // Get category name for breadcrumbs
  readonly categoryName = computed(() => {
    const c = this.challengeDetails();
    if (!c) return '';
    return this.categoryService.getCategoryNameById(c.category) || c.category;
  });

  // Breadcrumb items
  readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const c = this.challengeDetails();
    if (!c) return [];

    return [
      { label: 'Challenges', route: '/challenges' },
      {
        label: this.categoryName(),
        route: `/challenges/${c.category}`
      },
      { label: c.title }
    ];
  });

  // Navigation helpers - properly converted to signals without memory leaks
  // Creates a single subscription that automatically switches based on challenge ID
  readonly nextChallenge = toSignal(
    toObservable(this.currentChallengeId).pipe(
      switchMap(id => id ? this.challengesService.getNextChallenge(id) : of(null))
    ),
    { initialValue: null }
  );

  readonly previousChallenge = toSignal(
    toObservable(this.currentChallengeId).pipe(
      switchMap(id => id ? this.challengesService.getPreviousChallenge(id) : of(null))
    ),
    { initialValue: null }
  );

  // Check if challenge exists
  readonly challengeNotFound = computed(() => {
    const challenge = this.challengeDetails();
    return !challenge;
  });

  /**
   * Navigate back to category challenge list
   */
  goBack(): void {
    const c = this.challengeDetails();
    if (c) {
      this.router.navigate(['/challenges', c.category]);
    } else {
      this.router.navigate(['/challenges']);
    }
  }

  /**
   * Navigate to challenge workspace demo
   * Level 3: /challenges/{category}/{challengeId}/workspace
   */
  launchWorkspace(): void {
    const c = this.challengeDetails();
    if (c) {
      // Use c.link which contains the correct slug from configuration
      this.router.navigate(['/challenges', c.category, c.link, 'workspace']);
    }
  }

  /**
   * Launch challenge in StackBlitz IDE
   */
  async launchStackBlitz(): Promise<void> {
    const c = this.challengeDetails();
    if (!c) return;

    this.launching.set(true);
    try {
      await this.stackblitzService.openChallengeInStackblitz({
        id: c.id,
        title: c.title,
        category: c.category,
        gitHub: c.gitHub,
        description: c.description || '',
        difficulty: c.difficulty || '',
        tags: c.tags || [],
        link: c.link || ''
      });
    } catch (error) {
      console.error('Failed to launch StackBlitz:', error);
    } finally {
      // Keep launching state for a moment to show feedback
      setTimeout(() => this.launching.set(false), LOADING_CONFIG.LONG_DELAY_MS);
    }
  }

  /**
   * Open challenge in playground editor
   * Navigates to /playground with category and challenge query params
   */
  openInPlayground(): void {
    const c = this.challengeDetails();
    if (!c) return;

    this.router.navigate(['/playground'], {
      queryParams: {
        category: c.category,
        challenge: c.link
      }
    });
  }

  openGitHub(): void {
    const c = this.challengeDetails();
    if (c?.gitHub) {
      const fullUrl = `${BASE_REPOSITORY}/${c.gitHub}`;
      window.open(fullUrl, '_blank');
    }
  }

  openRequirement(): void {
    const c = this.challengeDetails();
    if (c?.requirementDoc) {
      const fullUrl = `${BASE_REPOSITORY}/${c.requirementDoc}`;
      window.open(fullUrl, '_blank');
    }
  }

  openSolutionGuide(): void {
    const c = this.challengeDetails();
    if (c?.solutionGuide) {
      const fullUrl = `${BASE_REPOSITORY}/${c.solutionGuide}`;
      window.open(fullUrl, '_blank');
    }
  }

  navigateToNext(): void {
    const next = this.nextChallenge();
    if (next) {
      // Use next.link which contains the correct slug from configuration
      this.router.navigate(['/challenges', next.category, next.link]);
    }
  }

  navigateToPrevious(): void {
    const prev = this.previousChallenge();
    if (prev) {
      // Use prev.link which contains the correct slug from configuration
      this.router.navigate(['/challenges', prev.category, prev.link]);
    }
  }
}
