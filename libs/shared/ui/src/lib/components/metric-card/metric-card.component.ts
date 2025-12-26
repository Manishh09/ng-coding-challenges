import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

/**
 * MetricCard Component
 * 
 * A reusable card component for displaying key metrics, statistics, or features.
 * Perfect for dashboards, landing pages, and feature showcases.
 * 
 * Features:
 * - Material Design icon support
 * - Responsive typography
 * - Accessible markup with ARIA labels
 * - Smooth hover animations
 * - Customizable theming
 * 
 * @example
 * ```html
 * <ng-coding-challenges-metric-card
 *   icon="bolt"
 *   value="50+"
 *   label="Challenges"
 *   helper="Build UI & data flows that mirror real Angular projects"
 *   [iconColor]="'primary'"
 * />
 * ```
 */
@Component({
  selector: 'ng-coding-challenges-metric-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'metric-card-wrapper',
    role: 'article',
  },
})
export class MetricCardComponent {
  /**
   * Material icon name to display
   * @see https://fonts.google.com/icons
   * @example 'bolt', 'hub', 'schedule', 'workspace_premium'
   */
  readonly icon = input.required<string>();

  /**
   * Main metric value to display prominently
   * Can be numeric (e.g., "50+") or text (e.g., "15-45 min")
   */
  readonly value = input.required<string>();

  /**
   * Label for the metric
   * Describes what the value represents
   */
  readonly label = input.required<string>();

  /**
   * Helper text providing additional context
   * Displayed below the label in smaller text
   */
  readonly helper = input<string>('');

  /**
   * Icon color variant
   * Maps to CSS custom properties for consistent theming
   * @default 'primary'
   */
  readonly iconColor = input<'primary' | 'secondary' | 'accent' | 'success'>('primary');

  /**
   * Enable interactive hover effects
   * When true, card will have enhanced hover states
   * @default true
   */
  readonly interactive = input<boolean>(true);

  /**
   * Show background decoration
   * Adds a subtle gradient background to the icon area
   * @default true
   */
  readonly showIconBackground = input<boolean>(true);

  /**
   * Custom CSS class for additional styling
   */
  readonly customClass = input<string>('');

  /**
   * Accessible label for screen readers
   * Auto-generated from value and label if not provided
   */
  get ariaLabel(): string {
    return `${this.value()}: ${this.label()}`;
  }
}
