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
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
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
import { debounceTime, filter, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SEARCH_CONFIG } from '../../constants/search.constants';
import { LOADING_CONFIG } from '../../constants/loading.constants';
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

  // Configuration from constants
  private readonly INITIAL_RESULTS_COUNT = SEARCH_CONFIG.INITIAL_RESULTS_COUNT;
  private readonly MIN_SEARCH_LENGTH = SEARCH_CONFIG.MIN_SEARCH_LENGTH;
  private readonly DEBOUNCE_TIME = SEARCH_CONFIG.DEBOUNCE_TIME;

  // Mobile detection from dialog data
  readonly isMobile = signal<boolean>(this.data?.isMobile ?? false);

  // Template refs
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // State
  readonly searchTerm = signal<string>('');
  readonly isOpen = signal<boolean>(false);
  readonly showAllResults = signal<boolean>(false);

  // Search results using proper reactive pattern (no memory leaks)
  readonly searchResults = toSignal(
    toObservable(this.searchTerm).pipe(
      debounceTime(this.DEBOUNCE_TIME),
      filter(term => term.trim().length >= this.MIN_SEARCH_LENGTH),
      switchMap(term =>
        this.challengesService.searchAllChallenges(term, SEARCH_CONFIG.MAX_RESULTS).pipe(
          catchError(() => of([]))
        )
      )
    ),
    { initialValue: [] }
  );

  // Computed values
  readonly allResults = computed(() => {
    const term = this.searchTerm();
    if (!term || term.trim().length < this.MIN_SEARCH_LENGTH) {
      return [];
    }
    return this.searchResults();
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
    setTimeout(() => this.focusSearch(), LOADING_CONFIG.FOCUS_DELAY_MS);
  }

  onSearchInput(value: string): void {
    // Update signal directly - debouncing handled by toSignal pipe
    this.searchTerm.set(value);
    this.isOpen.set(value.trim().length >= this.MIN_SEARCH_LENGTH);
  }

  loadMore(): void {
    this.showAllResults.set(true);
  }

  selectResult(result: SearchResult): void {
    this.dialogRef.close();
    this.router.navigate(['/challenges', result.category, result.id]);
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
