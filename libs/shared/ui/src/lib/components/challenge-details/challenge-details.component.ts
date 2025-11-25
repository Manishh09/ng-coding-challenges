import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ChallengesService, ChallengeCategoryService } from '@ng-coding-challenges/shared/services';
import { Challenge } from '@ng-coding-challenges/shared/models';
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
    return p?.['id'] ? Number(p['id']) : null;
  });

  // Fetch challenge data
  readonly challenge = computed(() => {
    const id = this.challengeId();
    if (!id) return null;
    return this.challengesService.getChallengeById(id);
  });

  // Get category name for breadcrumbs
  readonly categoryName = computed(() => {
    const c = this.challenge();
    if (!c) return '';
    return this.categoryService.getCategoryNameById(c.category) || c.category;
  });

  // Breadcrumb items
  readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const c = this.challenge();
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

  // Mock data for missing fields (Temporary until real data is populated)
  readonly challengeDetails = computed(() => {
    const c = this.challenge();
    if (!c) return null;

    return {
      ...c,
      longDescription: c.longDescription || `Welcome to the "${c.title}"! This challenge is designed to test your understanding of Angular's core concepts. You'll be building a functional application where state is managed efficiently. The goal is to create a dynamic and responsive UI that reflects state changes immediately.`,
      learningOutcomes: c.learningOutcomes || [
        'Understand and use Angular Signals for state management.',
        'Create reactive UIs that automatically update on state changes.',
        'Differentiate between signals, computed signals, and effects.',
        'Practice building components with a signal-based architecture.'
      ],
      techStack: c.techStack || ['Angular v17+', 'TypeScript 5.2+', 'Standalone Components'],
      difficulty: c.difficulty || 'Beginner',
      tags: c.tags || ['Angular', 'Signals', 'RxJS'],
      author: c.author || {
        name: 'Alex Johnson',
        avatar: 'assets/avatars/alex.jpg' // Placeholder
      }
    };
  });

  goBack(): void {
    const c = this.challenge();
    if (c) {
      this.router.navigate(['/challenges'], { queryParams: { category: c.category } });
    } else {
      this.router.navigate(['/challenges']);
    }
  }

  launchChallenge(): void {
    const c = this.challenge();
    if (c?.link) {
      window.open(c.link, '_blank');
    }
  }
}
