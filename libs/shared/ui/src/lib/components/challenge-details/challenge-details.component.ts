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
  private readonly routeParams = toSignal(this.route.params);

  // Challenge details from resolver (preferred) or fallback to service lookup
  readonly challengeDetails = computed(() => {
    const data = this.routeData() as { challenge?: ChallengeDetails };
    
    // If resolver provided the data, use it
    if (data?.challenge) {
      return data.challenge;
    }

    // Fallback: manual lookup (for backwards compatibility)
    const params = this.routeParams();
    const categoryId = (data as { categoryId?: string })?.categoryId || '';
    const challengeSlug = params?.['challengeId'] || '';
    
    if (!challengeSlug || !categoryId) return null;

    const challenges = this.challengesService.getChallengesByCategory(categoryId);
    const challenge = Array.from(challenges).find(c => 
      this.createChallengeSlug(c.title) === challengeSlug
    );

    if (!challenge) return null;
    
    return this.challengesService.getChallengeDetailsById(challenge.id);
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

  // Navigation helpers
  readonly nextChallenge = computed(() => {
    const current = this.challengeDetails();
    return current ? this.challengesService.getNextChallenge(current.id) : null;
  });

  readonly previousChallenge = computed(() => {
    const current = this.challengeDetails();
    return current ? this.challengesService.getPreviousChallenge(current.id) : null;
  });

  // Check if challenge exists
  readonly challengeNotFound = computed(() => {
    const params = this.routeParams();
    const challengeSlug = params?.['challengeId'] || '';
    const challenge = this.challengeDetails();
    return challengeSlug !== '' && !challenge;
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
