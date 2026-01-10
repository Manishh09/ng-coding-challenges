import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from "@angular/material/card";

/**
 * LatestCard Component
 *
 * A reusable card component for displaying latest content, updates, or challenges.
 * Features a category pill, title, description, and action button.
 *
 * Perfect for:
 * - Latest challenges/updates sections
 * - Blog post previews
 * - News/announcement cards
 * - Content showcase grids
 *
 * Features:
 * - Category pill with custom label
 * - Configurable button text and icon
 * - Responsive typography and spacing
 * - Accessibility with semantic HTML and ARIA
 * - Material Design button with ripple effect
 *
 * @example
 * ```html
 * <ngc-ui-latest-card
 *   categoryLabel="RxJS & API"
 *   title="Challenge 08: E-Commerce Checkout"
 *   description="Implement sequential API calls with concatMap"
 *   buttonText="Launch challenge"
 *   buttonIcon="rocket_launch"
 *   (actionClick)="handleLaunch()"
 * />
 * ```
 *
 * @ux Clear visual hierarchy with pill, heading, description, and prominent CTA
 * @accessibility Semantic HTML with article element and proper heading structure
 */
@Component({
  selector: 'ngc-ui-latest-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './latest-card.component.html',
  styleUrls: ['./latest-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestCardComponent {
  // ========== Inputs ==========

  /** Challenge ID to display (e.g., "Challenge 01") */
  readonly challengeId = input.required<number>();

  /** Category label to display in the pill badge */
  readonly categoryLabel = input.required<string>();

  /** Main title/heading for the content */
  readonly title = input.required<string>();

  /** Description or summary text */
  readonly description = input.required<string>();

  /** Text to display on the action button */
  readonly buttonText = input<string>('Launch');

  /** Material icon name to display in the button */
  readonly buttonIcon = input<string>('rocket_launch');

  /** Optional custom heading level for semantic HTML */
  readonly headingLevel = input<'h2' | 'h3' | 'h4'>('h3');

  /** Optional custom color for the button */
  readonly buttonColor = input<'primary' | 'accent' | 'warn'>('primary');

  // difficulty: DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  readonly difficulty = input<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Beginner');
  // ========== Outputs ==========

  /** Emits when the action button is clicked */
  readonly actionClick = output<void>();

  // ========== Methods ==========

  /**
   * Handle button click
   */
  onActionClick(event: Event): void {
    event.stopPropagation(); // Prevent event bubbling if card itself becomes clickable
    this.actionClick.emit();
  }
}
