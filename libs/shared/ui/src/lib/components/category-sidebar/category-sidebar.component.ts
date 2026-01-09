import { Component, inject, output, input, Signal, computed, viewChild, ElementRef, signal, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { ChallengeCategoryService } from '@ng-coding-challenges/shared/services';
import { ChallengeCategory } from '@ng-coding-challenges/shared/models';
import { getCategoryIcon } from '../../utils';

@Component({
  selector: 'ngc-ui-category-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
],
  templateUrl: './category-sidebar.component.html',
  styleUrl: './category-sidebar.component.scss',
})
export class CategorySidebarComponent {
  private readonly categoryService = inject(ChallengeCategoryService);

  // Inputs
  isOpen = input<boolean>(true);
  isMobile = input<boolean>(false);
  displayMode = input<'drawer' | 'inline'>('drawer'); // 'drawer' for dropdown panel, 'inline' for toolbar embedding

  // Outputs
  categorySelect = output<string>();
  closeDrawer = output<void>();

  // View references for carousel
  readonly pillsContainer = viewChild<ElementRef<HTMLDivElement>>('pillsContainer');

  // Carousel navigation state
  readonly showLeftArrow = signal<boolean>(false);
  readonly showRightArrow = signal<boolean>(false);

  // Signals from service
  readonly filteredCategories: Signal<ChallengeCategory[]> =
    this.categoryService.filteredCategories;
  readonly selectedCategoryId: Signal<string> =
    this.categoryService.selectedCategoryId;

  // Computed signal for showing empty state
  readonly hasNoResults: Signal<boolean> = computed(
    () => this.filteredCategories().length === 0
  );

  // Show arrows only if more than 4 categories (future-proofing)
  readonly shouldShowArrows = computed(() => this.filteredCategories().length > 4);

  // Computed for inline mode
  readonly isInlineMode = computed(() => this.displayMode() === 'inline');

  constructor() {
    // Update arrow visibility when panel opens or in inline mode
    effect(() => {
      if ((this.isOpen() && this.isMobile()) || this.isInlineMode()) {
        setTimeout(() => this.updateArrowVisibility(), 100);
      }
    });
  }

  selectCategory(categoryId: string): void {
    this.categoryService.setSelectedCategory(categoryId);
    this.categorySelect.emit(categoryId);

    // Auto-close drawer on mobile after selection (drawer mode only)
    if (this.isMobile() && !this.isInlineMode()) {
      this.closeDrawer.emit();
    }

    // Scroll selected pill into view in inline mode
    if (this.isInlineMode()) {
      setTimeout(() => this.scrollSelectedPillIntoView(categoryId), 150);
    }
  }

  isSelected(categoryId: string): boolean {
    return this.selectedCategoryId() === categoryId;
  }

  onBackdropClick(): void {
    if (this.isMobile()) {
      this.closeDrawer.emit();
    }
  }

  getCategoryIcon(categoryId: string): string {
    return getCategoryIcon(categoryId);
  }

  /**
   * Scroll carousel left by calculated amount
   */
  scrollLeft(): void {
    const ref = this.pillsContainer();
    if (!ref) return;

    const container = ref.nativeElement;
    const scrollAmount = this.calculateScrollAmount(container);

    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    setTimeout(() => this.updateArrowVisibility(), 350);
  }

  /**
   * Scroll carousel right by calculated amount
   */
  scrollRight(): void {
    const ref = this.pillsContainer();
    if (!ref) return;

    const container = ref.nativeElement;
    const scrollAmount = this.calculateScrollAmount(container);

    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(() => this.updateArrowVisibility(), 350);
  }

  /**
   * Update arrow visibility based on scroll position
   */
  updateArrowVisibility(): void {
    const ref = this.pillsContainer();
    if (!ref) return;

    const container = ref.nativeElement;
    const { scrollLeft, scrollWidth, clientWidth } = container;

    this.showLeftArrow.set(scrollLeft > 10);
    this.showRightArrow.set(scrollLeft < scrollWidth - clientWidth - 10);
  }

  /**
   * Calculate optimal scroll amount to show next pill
   */
  private calculateScrollAmount(container: HTMLElement): number {
    // Scroll by approximately 250px or container width, whichever is smaller
    return Math.min(250, container.clientWidth * 0.8);
  }

  /**
   * Handle scroll event for arrow visibility updates
   */
  onPillsScroll(): void {
    this.updateArrowVisibility();
  }

  /**
   * Scroll selected pill into view (for inline mode)
   */
  private scrollSelectedPillIntoView(categoryId: string): void {
    const ref = this.pillsContainer();
    if (!ref) return;

    const container = ref.nativeElement;
    const selectedButton = container.querySelector(`[aria-selected="true"]`) as HTMLElement;

    if (selectedButton) {
      selectedButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }

  /**
   * Keyboard navigation for pills panel
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyboardNavigation(event: KeyboardEvent): void {
    // Handle for mobile pills panel (drawer mode) or inline mode
    const shouldHandle = (this.isMobile() && !this.isInlineMode() && this.isOpen()) || this.isInlineMode();
    if (!shouldHandle) return;

    const categories = this.filteredCategories();
    if (categories.length === 0) return;

    const currentIndex = categories.findIndex(cat => this.isSelected(cat.id));

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex > 0) {
          this.selectCategory(categories[currentIndex - 1].id);
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex < categories.length - 1) {
          this.selectCategory(categories[currentIndex + 1].id);
        }
        break;

      case 'Escape':
        if (!this.isInlineMode()) {
          event.preventDefault();
          this.closeDrawer.emit();
        }
        break;
    }
  }
}
