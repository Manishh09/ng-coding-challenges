import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { take } from 'rxjs/operators';
import {
  ChallengeCategoryService,
  ChallengesService,
  NotificationService,
} from '@ng-coding-challenges/shared/services';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { HeroStatsComponent } from '../hero-stats/hero-stats.component';
import { LatestCardComponent } from '../latest-card/latest-card.component';
import { ChallengeDifficulty } from '@ng-coding-challenges/shared/models';
import { getCategoryIcon } from '../../utils/category-utils';

type LandingMetric = {
  icon: string;
  value: string;
  label: string;
  helper: string;
};

type FeaturedTrack = {
  id: string;
  title: string;
  description: string;
  icon: string;
  count: number;
  route: readonly string[];
};

type SpotlightChallenge = {
  id: number;
  title: string;
  description: string;
  categoryId: string;
  categoryLabel: string;
  difficulty: ChallengeDifficulty;
  route: readonly string[];
};

// ============================
// Route Constants
// ============================
const ROUTES = {
  gettingStarted: '/getting-started',
  challenges: '/challenges',
};

@Component({
  selector: 'ngc-ui-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    SectionHeaderComponent,
    HeroStatsComponent,
    LatestCardComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // better performance
})
export class LandingPageComponent {
  // ========== Dependencies ==========
  private readonly router = inject(Router);
  private readonly challengesService = inject(ChallengesService);
  private readonly categoryService = inject(ChallengeCategoryService);
  private readonly notificationService = inject(NotificationService);

  // ========== Inputs ==========
  /** Hero illustration image path (configurable) */
  readonly heroIllustration = input<string>('/angular_mascot_coder.webp');

  /** Hero illustration alt text for accessibility */
  readonly heroAltText = input<string>('Developer coding illustration');

  // ========== Derived Data ==========
  private readonly challengeList = toSignal(
    this.challengesService.getChallenges(),
    { initialValue: [] }
  );
  private readonly groupedChallenges = toSignal(
    this.challengesService.getChallengesGroupedByCategory(),
    { initialValue: new Map() }
  );
  private readonly categoryCatalog = this.categoryService.categories();

  readonly totalChallenges = computed(() => this.challengeList().length);
  readonly totalCategories = computed(() => this.groupedChallenges().size);

  readonly heroHighlights: readonly string[] = [
    'Real-world Angular scenarios',
    'Guided solutions with clear requirements',
    'Instant StackBlitz workspaces',
  ];

  // Convert to computed signals to react to async data changes
  readonly metrics = computed(() => this.createMetrics());
  readonly heroStatItems = computed(() => this.metrics().slice(0, 1));
  readonly featuredTracks = computed(() => this.computeFeaturedTracks());
  readonly latestChallenges = computed(() => this.computeLatestChallenges());
  readonly heroSpotlight = computed(() => this.latestChallenges().at(0) ?? null);

  // ========== Event Handlers ==========
  onGetStarted(): void {
    this.router.navigate([ROUTES.gettingStarted]);
  }

  // Navigate to challenges list
  onExploreChallenges(): void {
    this.router.navigate([ROUTES.challenges]);
  }

  // Navigate to the latest challenge or challenges list
  goToLatestChallenge(): void {
    const latestChallenge = this.challengesService.getLatestChallenge();

    if (!latestChallenge) {
      // Show user-friendly notification
      this.notificationService.info('No challenges available yet. Check back soon!');
      this.router.navigate([ROUTES.challenges]);
      return;
    }

    // Use take(1) to automatically complete the subscription after first emission
    latestChallenge.pipe(take(1)).subscribe({
      next: latest => {
        if (latest) {
          // Construct dynamic route safely
          const { category, link } = latest;
          this.router.navigate([`${ROUTES.challenges}/${category}/${link}`]);
        } else {
          this.notificationService.info('No challenges available yet. Check back soon!');
          this.router.navigate([ROUTES.challenges]);
        }
      },
      error: error => {
        console.error('Error fetching latest challenge:', error);
        this.notificationService.error('Failed to load latest challenge');
        this.router.navigate([ROUTES.challenges]);
      },
    });
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate([ROUTES.challenges, categoryId]);
  }

  launchChallenge(route: readonly string[]): void {
    this.router.navigate([...route]);
  }

  // ========== Helpers ==========
  private createMetrics(): LandingMetric[] {
    return [
      {
        icon: 'bolt',
        value: `${this.totalChallenges()}`,
        label: 'Hands-on challenges',
        helper: 'Build UI & data flows that mirror real Angular projects.',
      },
      {
        icon: 'hub',
        value: `${this.totalCategories()}`,
        label: 'Learning paths',
        helper: 'RxJS, routing, core concepts — with more tracks on the way.',
      },
      {
        icon: 'schedule',
        value: '15–45 min',
        label: 'Average sprint',
        helper: 'Short, focused practice blocks for busy teams.',
      },
      {
        icon: 'workspace_premium',
        value: 'Guided solutions',
        label: 'Learn the “why”',
        helper: 'Requirement docs and solution guides for every challenge.',
      },
    ];
  }

  private computeFeaturedTracks(): FeaturedTrack[] {
    const entries = Array.from(this.groupedChallenges().entries());
    return entries
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3)
      .map(([id, items]) => {
        const meta = this.getCategoryMeta(id);
        return {
          id,
          title: meta.title,
          description: meta.description,
          icon: meta.icon,
          count: items.length,
          route: [ROUTES.challenges, id] as const,
        };
      });
  }

  private computeLatestChallenges(): SpotlightChallenge[] {
    return [...this.challengeList()]
      .slice(-3)
      .reverse()
      .map((challenge) => ({
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        categoryId: challenge.category,
        difficulty: challenge.difficulty,
        categoryLabel: this.getCategoryMeta(challenge.category).title,
        route: [
          ROUTES.challenges,
          challenge.category,
          challenge.link,
        ] as const,
      }));
  }

  private getCategoryMeta(categoryId: string) {
    const entry = this.categoryCatalog.find((c) => c.id === categoryId);
    return {
      title: entry?.name ?? this.formatCategoryId(categoryId),
      description:
        entry?.description ?? `Discover Angular ${this.formatCategoryId(categoryId)} challenges.`,
      icon: entry?.icon ?? getCategoryIcon(categoryId),
    };
  }

  private formatCategoryId(categoryId: string): string {
    return categoryId
      .split('-')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }
}
