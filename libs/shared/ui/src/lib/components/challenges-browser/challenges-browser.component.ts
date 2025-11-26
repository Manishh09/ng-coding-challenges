import {
  Component,
  inject,
  signal,
  computed,
  Signal,
  effect,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  ChallengeCategoryService,
  ChallengesService,
} from '@ng-coding-challenges/shared/services';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { CategorySidebarComponent } from '../category-sidebar/category-sidebar.component';
import { ChallengeCardComponent } from '../challenge-card/challenge-card.component';
import { FooterComponent, FooterLink } from '../footer/footer.component';

@Component({
  selector: 'app-challenges-browser',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    SearchBarComponent,
    CategorySidebarComponent,
    ChallengeCardComponent,
    FooterComponent,
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

  // Search state
  readonly challengeSearchTerm = signal<string>('');

  // Category selection from service
  readonly selectedCategoryId: Signal<string> =
    this.categoryService.selectedCategoryId;

  // Challenges for selected category
  readonly categoryChallenges = computed(() => {
    const categoryId = this.selectedCategoryId();
    if (!categoryId) return [];
    return this.challengesService.getChallengesByCategory(categoryId);
  });

  // Filtered challenges based on search term
  readonly filteredChallenges = computed(() => {
    const challenges = this.categoryChallenges();
    const searchTerm = this.challengeSearchTerm().toLowerCase().trim();

    if (!searchTerm) {
      return challenges;
    }

    return challenges.filter(
      (challenge) =>
        challenge.title.toLowerCase().includes(searchTerm) ||
        challenge.description.toLowerCase().includes(searchTerm)
    );
  });

  // Top 2 challenges get "New" badges
  readonly newBadgeChallengeIds = computed(() => {
    const challenges = this.categoryChallenges();
    return challenges.slice(-2).map((c) => c.id);
  });

  // Computed category name for display
  readonly selectedCategoryName = computed(() => {
    const categoryId = this.selectedCategoryId();
    return this.categoryService.getCategoryNameById(categoryId) || 'Challenges';
  });

  // Result count display
  readonly resultCountText = computed(() => {
    const total = this.categoryChallenges().length;
    const filtered = this.filteredChallenges().length;
    const categoryName = this.selectedCategoryName();
    const searchTerm = this.challengeSearchTerm();

    if (searchTerm && filtered !== total) {
      return `${filtered} of ${total} challenges in ${categoryName}`;
    }
    return `${total} challenges in ${categoryName}`;
  });

  // Check if child route is active (challenge detail view)
  readonly isChildRouteActive = signal<boolean>(false);

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

    // Monitor route changes to detect child routes
    effect(() => {
      const hasChild = this.route.children.length > 0;
      this.isChildRouteActive.set(hasChild);
    });

    // Sync category from query params on init
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params['category']) {
          this.categoryService.setSelectedCategory(params['category']);
        }
        if (params['search']) {
          this.challengeSearchTerm.set(params['search']);
        }
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((value) => !value);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  onCategorySelect(categoryId: string): void {
    // Update query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: categoryId },
      queryParamsHandling: 'merge',
    });
  }

  onChallengeSearchChange(term: string): void {
    this.challengeSearchTerm.set(term);

    // Update query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: term || null },
      queryParamsHandling: 'merge',
    });
  }

  onChallengeSearchClear(): void {
    this.challengeSearchTerm.set('');

    // Remove search param
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: null },
      queryParamsHandling: 'merge',
    });
  }

  // Footer logic
  readonly appName = 'ngQuest';

  onFooterLinkClick(link: FooterLink): void {
    if (link.section) {
      if (link.section === 'challenges') {
        // Already on challenges, maybe reset filters?
        this.onChallengeSearchClear();
        return;
      }
      this.router.navigate(['/']);
      return;
    }
    if (link.url) {
      this.router.navigateByUrl(link.url);
    }
  }
}
