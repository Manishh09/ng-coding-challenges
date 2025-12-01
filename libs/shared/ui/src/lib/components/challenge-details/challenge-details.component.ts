import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { ChallengesService, ChallengeCategoryService } from '@ng-coding-challenges/shared/services';
import { ChallengeDetails } from '@ng-coding-challenges/shared/models';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreadcrumbsComponent, BreadcrumbItem } from '../breadcrumbs/breadcrumbs.component';

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
  selector: 'ng-coding-challenges-challenge-details',
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

  // Get route data (contains resolved challenge data from resolver)
  private readonly routeData = toSignal(this.route.data);

  // Challenge details from resolver
  readonly challengeDetails = computed(() => {
    const data = this.routeData() as { challenge?: ChallengeDetails };
    return data?.challenge || null;
  });

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

  // Navigation helpers - converted to signals from observables
  readonly nextChallenge = computed(() => {
    const current = this.challengeDetails();
    if (!current) return null;
    
    // Convert Observable to Signal by subscribing in effect
    const nextSignal = toSignal(this.challengesService.getNextChallenge(current.id));
    return nextSignal() || null;
  });

  readonly previousChallenge = computed(() => {
    const current = this.challengeDetails();
    if (!current) return null;
    
    // Convert Observable to Signal by subscribing in effect
    const prevSignal = toSignal(this.challengesService.getPreviousChallenge(current.id));
    return prevSignal() || null;
  });

  // Check if challenge exists
  readonly challengeNotFound = computed(() => {
    const challenge = this.challengeDetails();
    return !challenge;
  });

  /**
   * Creates a URL-friendly slug from challenge title
   */
  private createChallengeSlug(title: string): string {
    const withoutPrefix = title.replace(/^Challenge\s+\d+:\s*/i, '');
    return withoutPrefix
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

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
   * Navigate to challenge workspace
   * Level 3: /challenges/{category}/{challengeId}/workspace
   */
  launchChallenge(): void {
    const c = this.challengeDetails();
    if (c) {
      const slug = this.createChallengeSlug(c.title);
      this.router.navigate(['/challenges', c.category, slug, 'workspace']);
    }
  }

  openGitHub(): void {
    const c = this.challengeDetails();
    if (c?.gitHub) {
      window.open(c.gitHub, '_blank');
    }
  }

  openRequirement(): void {
    const c = this.challengeDetails();
    if (c?.requirement) {
      window.open(c.requirement, '_blank');
    }
  }

  openSolutionGuide(): void {
    const c = this.challengeDetails();
    if (c?.solutionGuide) {
      window.open(c.solutionGuide, '_blank');
    }
  }

  navigateToNext(): void {
    const next = this.nextChallenge();
    if (next) {
      const slug = this.createChallengeSlug(next.title);
      this.router.navigate(['/challenges', next.category, slug]);
    }
  }

  navigateToPrevious(): void {
    const prev = this.previousChallenge();
    if (prev) {
      const slug = this.createChallengeSlug(prev.title);
      this.router.navigate(['/challenges', prev.category, slug]);
    }
  }
}
