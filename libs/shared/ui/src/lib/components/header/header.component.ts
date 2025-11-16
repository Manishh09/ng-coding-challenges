import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgOptimizedImage } from "@angular/common";

/**
 * Header component with responsive design
 * Includes logo, navigation, theme toggle and mobile menu
 *
 * Features:
 * - Dynamic mobile menu state management
 * - Accessible ARIA attributes
 * - Optimized images with priority loading
 * - Theme toggle integration
 */
@Component({
  selector: 'ng-coding-challenges-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ThemeToggleComponent,
    MatTooltipModule,
    NgOptimizedImage
],
  standalone: true
})
export class HeaderComponent {
  /** Application name for accessibility and branding */
  appName = input<string>('');

  /** Control visibility of mobile menu button */
  showMobileMenu = input<boolean>(false);

  /** Logo image URL */
  logoUrl = input<string>('');

  /** Github  logo */
  githubLogoUrl = input<string>('');

  /** Mobile menu open state */
  readonly mobileMenuOpen = signal(false);

  /**
   * Toggle mobile menu state
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(value => !value);
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
