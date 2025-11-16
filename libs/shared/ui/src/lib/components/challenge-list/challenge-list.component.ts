import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeCardComponent } from '../challenge-card/challenge-card.component';
import { ChallengesService } from '@ng-coding-challenges/shared/services';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ChallengeCategoryService } from '@ng-coding-challenges/shared/services';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

/**
 * Component for displaying a list of challenges for a specific category
 *
 * Features:
 * - Reactive route parameter handling
 * - Loading states with skeleton loaders
 * - New badge highlighting
 * - Nested routing support
 */
@Component({
  selector: 'ng-coding-challenges-challenge-list',
  templateUrl: './challenge-list.component.html',
  styleUrl: './challenge-list.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,

  imports: [
    RouterOutlet,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    ChallengeCardComponent,
    SkeletonLoaderComponent
  ],
})
export class ChallengeListComponent {

  //  Dependencies
  private readonly challengeCategoryService = inject(ChallengeCategoryService);
  private readonly challengesService = inject(ChallengesService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  // Reactive source for categoryId from route
  private readonly routeCategoryId = toSignal(
    this.activatedRoute.parent!.url.pipe(
      takeUntilDestroyed()
    ),
    { initialValue: [] }
  );

  //  Derived signal: selected category ID
  readonly categoryId = computed(() => {
    const segments = this.routeCategoryId();
    return segments.length ? segments[0].path : '';
  });

  //  Derived signal: list of challenges for this category
  readonly challenges = computed<Challenge[]>(() => {
    const id = this.categoryId();
    if (!id) return [];
    return Array.from(this.challengesService.getChallengesByCategory(id));
  });

  // Derived signal: new badge challenge IDs (top 2)
  readonly newBadgeChallengeIds = computed<number[]>(() => {
    const sorted = [...this.challenges()].sort((a, b) => b.id - a.id);
    if (sorted.length >= 2) return [sorted[0].id, sorted[1].id];
    if (sorted.length === 1) return [sorted[0].id];
    return [];
  });

  // Derived signal: title
  readonly title = computed(() => {
    const categoryName = this.challengeCategoryService.getCategoryNameById(this.categoryId());
    return categoryName ? `${categoryName} - Challenges` : 'Available Challenges';
  });

  // Loading state
  readonly loading = signal(false);

  constructor() {
    // Reactive side effect to update selected category
    effect(() => {
      const id = this.categoryId();
      if (id) {
        this.loading.set(true);
        this.challengeCategoryService.setSelectedCategory(id);
        // Simulate async loading (remove if you have real async data fetching)
        setTimeout(() => this.loading.set(false), 300);
      }
    });
  }

  // Check if there is an active child route
  hasActiveChildRoute(): boolean {
    return this.activatedRoute.children.some(child => child.outlet === 'primary');
  }
}
