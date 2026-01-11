import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

/**
 * FeatureCard Component
 * 
 * An interactive card component for showcasing features, tracks, or categories.
 * Designed as a clickable button with rich content and visual feedback.
 * 
 * Perfect for:
 * - Feature showcases
 * - Category navigation
 * - Learning track displays
 * - Product/service cards
 * 
 * Features:
 * - Full keyboard accessibility (Tab, Enter, Space)
 * - Material Ripple effect on interaction
 * - Responsive typography and spacing
 * - Icon with optional count badge
 * - Customizable CTA text
 * - ARIA labels for screen readers
 * 
 * @example
 * ```html
 * <ng-coding-challenges-feature-card
 *   icon="sync_alt"
 *   [count]="8"
 *   title="RxJS & API Integration"
 *   description="Master reactive programming with real-world API scenarios"
 *   ctaText="Explore track"
 *   (cardClick)="navigateToTrack($event)"
 * />
 * ```
 */
@Component({
  selector: 'ng-coding-challenges-feature-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatRippleModule],
  templateUrl: './feature-card.component.html',
  styleUrls: ['./feature-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'feature-card-wrapper',
  },
})
export class FeatureCardComponent {
  /**
   * Material icon name for the feature
   * @see https://fonts.google.com/icons
   */
  readonly icon = input.required<string>();

  /**
   * Optional count to display (e.g., number of challenges)
   * Shows as a badge next to the icon
   */
  readonly count = input<number>();

  /**
   * Feature title/heading
   */
  readonly title = input.required<string>();

  /**
   * Feature description text
   */
  readonly description = input.required<string>();

  /**
   * Call-to-action text
   * @default 'Explore track'
   */
  readonly ctaText = input<string>('Explore track');

  /**
   * Icon for the CTA button
   * @default 'chevron_right'
   */
  readonly ctaIcon = input<string>('chevron_right');

  /**
   * Disable the card interaction
   * @default false
   */
  readonly disabled = input<boolean>(false);

  /**
   * Custom CSS class for additional styling
   */
  readonly customClass = input<string>('');

  /**
   * Event emitted when the card is clicked
   * Use this to handle navigation or other actions
   */
  readonly cardClick = output<void>();

  /**
   * Handle card click with proper event delegation
   */
  onCardClick(): void {
    if (!this.disabled()) {
      this.cardClick.emit();
    }
  }

  /**
   * Accessible label for screen readers
   */
  get ariaLabel(): string {
    const countText = this.count() ? `, ${this.count()} items` : '';
    return `${this.title()}${countText}. ${this.description()}`;
  }

  /**
   * Format count with label
   */
  get countLabel(): string {
    const count = this.count();
    if (!count) return '';
    return `${count} ${count === 1 ? 'challenge' : 'challenges'}`;
  }
}
