import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SectionHeader Component
 * 
 * A reusable component for displaying consistent section headings throughout the application.
 * Follows accessibility best practices with configurable heading levels and semantic HTML.
 * 
 * @example
 * ```html
 * <ng-coding-challenges-section-header
 *   eyebrow="Why teams choose us"
 *   heading="Ship faster with focused practice"
 *   summary="Each challenge mirrors a production use-case"
 *   headingLevel="h2"
 *   [centered]="true"
 * />
 * ```
 */
@Component({
  selector: 'ng-coding-challenges-section-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'section-header',
    '[class.section-header--centered]': 'centered()',
  },
})
export class SectionHeaderComponent {
  /**
   * Eyebrow text - small text above the heading (optional)
   * Typically used for category labels or contextual information
   */
  readonly eyebrow = input<string>('');

  /**
   * Main heading text (required)
   * The primary message of the section
   */
  readonly heading = input.required<string>();

  /**
   * Summary/description text (optional)
   * Provides additional context below the heading
   */
  readonly summary = input<string>('');

  /**
   * Semantic heading level for accessibility
   * Ensures proper document outline and screen reader navigation
   * @default 'h2'
   */
  readonly headingLevel = input<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>('h2');

  /**
   * Center-align all text content
   * @default false
   */
  readonly centered = input<boolean>(false);

  /**
   * Maximum width for readability (in characters)
   * Prevents lines from becoming too long on wide screens
   * @default 65 (optimal reading width)
   */
  readonly maxWidth = input<number>(65);

  /**
   * Custom CSS class for additional styling
   */
  readonly customClass = input<string>('');
}
