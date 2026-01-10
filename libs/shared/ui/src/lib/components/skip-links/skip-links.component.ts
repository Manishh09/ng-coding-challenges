import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Skip link for keyboard navigation accessibility
 * Allows users to bypass repetitive navigation and jump to main content
 *
 * @example
 * ```html
 * <!-- Place at the very top of your app -->
 * <ngc-ui-skip-links />
 *
 * <!-- Or with custom links -->
 * <ngc-ui-skip-links [links]="customSkipLinks" />
 *
 * <!-- Mark your main content -->
 * <main id="main-content">...</main>
 * ```
 */
@Component({
  selector: 'ngc-ui-skip-links',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skip-links.component.html',
  styleUrls: ['./skip-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkipLinksComponent {
  /**
   * Skip link configuration
   */
  readonly links = input<SkipLink[]>([
    { text: 'Skip to main content', target: '#main-content' },
    { text: 'Skip to navigation', target: '#main-navigation' },
    { text: 'Skip to footer', target: '#site-footer' }
  ]);
}

/**
 * Skip link interface
 */
export interface SkipLink {
  /** Link text displayed to user */
  text: string;
  /** Target element ID (including #) */
  target: string;
}
