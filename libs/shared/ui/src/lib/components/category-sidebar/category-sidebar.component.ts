import { Component, inject, output, input, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRippleModule } from '@angular/material/core';
import { ChallengeCategoryService } from '@ng-coding-challenges/shared/services';
import { ChallengeCategory } from '@ng-coding-challenges/shared/models';

@Component({
  selector: 'app-category-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatRippleModule,
  ],
  templateUrl: './category-sidebar.component.html',
  styleUrl: './category-sidebar.component.scss',
})
export class CategorySidebarComponent {
  private readonly categoryService = inject(ChallengeCategoryService);

  // Inputs
  isOpen = input<boolean>(true);
  isMobile = input<boolean>(false);

  // Outputs
  categorySelect = output<string>();
  closeDrawer = output<void>();

  // Signals from service
  readonly filteredCategories: Signal<ChallengeCategory[]> =
    this.categoryService.filteredCategories;
  readonly selectedCategoryId: Signal<string> =
    this.categoryService.selectedCategoryId;

  // Computed signal for showing empty state
  readonly hasNoResults: Signal<boolean> = computed(
    () => this.filteredCategories().length === 0
  );

  selectCategory(categoryId: string): void {
    this.categoryService.setSelectedCategory(categoryId);
    this.categorySelect.emit(categoryId);

    // Auto-close drawer on mobile after selection
    if (this.isMobile()) {
      this.closeDrawer.emit();
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
    const iconMap: Record<string, string> = {
      'rxjs-api': 'api',
      'http': 'http',
      'angular-core': 'settings',
      'angular-routing': 'route',
    };
    return iconMap[categoryId] || 'folder';
  }
}
