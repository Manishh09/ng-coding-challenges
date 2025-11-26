import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ChallengesService, ChallengeCategoryService } from '@ng-coding-challenges/shared/services';
import { ChallengeDetails } from '@ng-coding-challenges/shared/models';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreadcrumbsComponent, BreadcrumbItem } from '../breadcrumbs/breadcrumbs.component';

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

  // Get route params
  private readonly params = toSignal(this.route.params);

  // Computed challenge ID from params
  readonly challengeId = computed(() => {
    const p = this.params();
    const idParam = p?.['id'];
    return idParam ? Number(idParam) : null;
  });

  // Fetch DETAILED challenge data (not just basic Challenge)
  readonly challengeDetails = computed(() => {
    const id = this.challengeId();
    if (!id) return null;

    // This now returns ChallengeDetails with all the extended properties
    return this.challengesService.getChallengeDetailsById(id);
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
        route: '/challenges',
        queryParams: { category: c.category }
      },
      { label: c.title }
    ];
  });

  // Navigation helpers
  readonly nextChallenge = computed(() => {
    const id = this.challengeId();
    return id ? this.challengesService.getNextChallenge(id) : null;
  });

  readonly previousChallenge = computed(() => {
    const id = this.challengeId();
    return id ? this.challengesService.getPreviousChallenge(id) : null;
  });

  // Check if challenge exists
  readonly challengeNotFound = computed(() => {
    const id = this.challengeId();
    const challenge = this.challengeDetails();
    return id !== null && !challenge;
  });

  goBack(): void {
    const c = this.challengeDetails();
    if (c) {
      this.router.navigate(['/challenges'], {
        queryParams: { category: c.category }
      });
    } else {
      this.router.navigate(['/challenges']);
    }
  }

  launchChallenge(): void {
    const c = this.challengeDetails();
    if (c?.link) {
      // If link is a full URL, open in new tab
      if (c.link.startsWith('http')) {
        window.open(c.link, '_blank');
      } else {
        // If it's a route, navigate internally
        this.router.navigate([c.link]);
      }
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
      this.router.navigate(['/challenges', next.category, next.id]);
    }
  }

  navigateToPrevious(): void {
    const prev = this.previousChallenge();
    if (prev) {
      this.router.navigate(['/challenges', prev.category, prev.id]);
    }
  }
}
