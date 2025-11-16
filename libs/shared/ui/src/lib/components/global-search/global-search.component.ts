import {
  Component,
  signal,
  computed,
  inject,
  effect,
  ElementRef,
  viewChild,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChallengesService } from '@ng-coding-challenges/shared/services';
import { SearchResult } from '@ng-coding-challenges/shared/models';
import { HighlightTextPipe } from '../../pipes/highlight-text.pipe';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    HighlightTextPipe,
  ],
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.scss',
})
export class GlobalSearchComponent implements OnInit {
  private readonly challengesService = inject(ChallengesService);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<GlobalSearchComponent>);
  readonly data = inject(MAT_DIALOG_DATA, { optional: true });

  // Configuration
  private readonly INITIAL_RESULTS_COUNT = 3;
  private readonly MIN_SEARCH_LENGTH = 2;
  private readonly DEBOUNCE_TIME = 150;

  // Mobile detection from dialog data
  readonly isMobile = signal<boolean>(this.data?.isMobile ?? false);

  // Template refs
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // State
  readonly searchTerm = signal<string>('');
  readonly isOpen = signal<boolean>(false);
  readonly showAllResults = signal<boolean>(false);
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Computed values
  readonly allResults = computed(() => {
    const term = this.searchTerm();
    if (!term || term.trim().length < this.MIN_SEARCH_LENGTH) {
      return [];
    }
    return this.challengesService.searchAllChallenges(term, 20);
  });

  readonly displayedResults = computed(() => {
    const all = this.allResults();
    const showAll = this.showAllResults();
    return showAll ? all : all.slice(0, this.INITIAL_RESULTS_COUNT);
  });

  readonly remainingCount = computed(() => {
    const total = this.allResults().length;
    const displayed = this.displayedResults().length;
    return Math.max(0, total - displayed);
  });

  readonly hasMoreResults = computed(() => this.remainingCount() > 0);

  readonly hasResults = computed(() => this.allResults().length > 0);

  readonly showEmptyState = computed(() => {
    const term = this.searchTerm();
    const hasMinLength = term.trim().length >= this.MIN_SEARCH_LENGTH;
    return hasMinLength && !this.hasResults();
  });

  readonly isSearching = computed(() => {
    const term = this.searchTerm();
    return term.trim().length >= this.MIN_SEARCH_LENGTH;
  });

  constructor() {
    // Reset "show all" when search term changes
    effect(() => {
      this.searchTerm(); // Track dependency
      this.showAllResults.set(false);
    });
  }

  ngOnInit(): void {
    // Focus input after dialog animation
    setTimeout(() => this.focusSearch(), 150);
  }

  onSearchInput(value: string): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.searchTerm.set(value);
      this.isOpen.set(value.trim().length >= this.MIN_SEARCH_LENGTH);
    }, this.DEBOUNCE_TIME);
  }

  loadMore(): void {
    this.showAllResults.set(true);
  }

  selectResult(result: SearchResult): void {
    this.dialogRef.close();
    this.router.navigate(['/challenges', result.category, result.link]);
  }

  closeSearch(): void {
    this.dialogRef.close();
  }

  focusSearch(): void {
    const input = this.searchInput()?.nativeElement;
    if (input) {
      input.focus();
    }
  }

  getCategoryBadgeClass(category: string): string {
    const categoryMap: Record<string, string> = {
      'rxjs-api': 'badge-rxjs',
      'http': 'badge-http',
      'angular-core': 'badge-core',
      'angular-routing': 'badge-routing',
    };
    return categoryMap[category] || 'badge-default';
  }
}
