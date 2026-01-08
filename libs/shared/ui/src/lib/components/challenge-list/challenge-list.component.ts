import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeCardComponent } from '../challenge-card/challenge-card.component';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ChallengeCategoryService } from '@ng-coding-challenges/shared/services';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { ChallengeListRouteData } from '../../models/route-data.interface';
/**
 * Component for displaying a list of challenges for a specific category
 *
 * Features:
 * - Reactive route parameter handling
 * - Loading states with skeleton loaders
 * - New badge highlighting
 * - Clean separation: only shows list, no nested routing
 */
@Component({
  selector: 'ng-coding-challenges-challenge-list',
  templateUrl: './challenge-list.component.html',
  styleUrl: './challenge-list.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,

  imports: [
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    ChallengeCardComponent,
    SkeletonLoaderComponent,
  ],
})
export class ChallengeListComponent {

  //  Dependencies
  private readonly challengeCategoryService = inject(ChallengeCategoryService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  // Reactive source for route data (contains resolved challenges from resolver)
  private readonly routeData = toSignal(
    this.activatedRoute.data.pipe(
      takeUntilDestroyed()
    ),
    { initialValue: {} }
  );

  //  Derived signal: selected category ID
  readonly categoryId = computed(() => {
    const data = this.routeData() as ChallengeListRouteData | undefined;
    return data?.categoryId || '';
  });

  //  Derived signal: list of challenges (from resolver)
  readonly challenges = computed<Challenge[]>(() => {
    const data = this.routeData() as ChallengeListRouteData | undefined;
    return data?.challenges ? Array.from(data.challenges) : [];
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

  /**
   * Loading state signal - improves UX with skeleton loaders
   *
   * Shows loading when:
   * - Route data hasn't been populated yet (initial load)
   * - Challenges array is empty AND categoryId is present (resolver still running)
   *
   * This provides visual feedback during the resolver execution phase,
   * creating a smoother, more responsive user experience.
   */
  readonly loading = computed(() => {
    const data = this.routeData() as ChallengeListRouteData | undefined;
    const hasCategory = !!this.categoryId();
    const hasChallenges = this.challenges().length > 0;

    // Show loading if:
    // 1. No data yet (initial state)
    // 2. Has category but no challenges (resolver still loading)
    return !data || (hasCategory && !hasChallenges);
  });

  constructor() {
    // Reactive side effect to update selected category
    effect(() => {
      const id = this.categoryId();
      if (id) {
        this.challengeCategoryService.setSelectedCategory(id);
      }
    });
  }
}
