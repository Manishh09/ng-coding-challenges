import {
  Component,
  inject,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '@ng-coding-challenges/shared/services';

/**
 * Theme toggle button component
 * Toggles between light and dark mode using angular.dev theme system
 */
@Component({
  selector: 'ng-coding-challenges-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  standalone: true,
})
export class ThemeToggleComponent {
  /** Theme service for managing theme state */
  readonly themeService = inject(ThemeService);

  /** Computed icon based on current theme */
  readonly themeIcon = computed(() =>
    this.themeService.isDarkMode() ? 'light_mode' : 'dark_mode'
  );

  /** Computed tooltip text based on current theme */
  readonly tooltipText = computed(
    () => `Switch to ${this.themeService.isDarkMode() ? 'light' : 'dark'} theme`
  );
}
