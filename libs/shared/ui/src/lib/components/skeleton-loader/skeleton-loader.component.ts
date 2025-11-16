import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Skeleton loader component for content placeholder states
 * Provides animated loading placeholders in various shapes and sizes
 *
 * @example
 * ```html
 * <!-- Text skeleton -->
 * <app-skeleton-loader variant="text" />
 *
 * <!-- Card skeleton -->
 * <app-skeleton-loader variant="card" height="200px" />
 *
 * <!-- Custom dimensions -->
 * <app-skeleton-loader variant="rectangle" width="100%" height="60px" />
 * ```
 */
@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonLoaderComponent {
  /**
   * Skeleton variant type
   * - text: Single line of text
   * - text-block: Multiple lines of text
   * - circle: Circular shape (avatar, icon)
   * - rectangle: Basic rectangular shape
   * - card: Full card layout with header and content
   * - button: Button-shaped skeleton
   */
  variant = input<'text' | 'text-block' | 'circle' | 'rectangle' | 'card' | 'button'>('text');

  /** Custom width (CSS value) */
  width = input<string>('100%');

  /** Custom height (CSS value) */
  height = input<string>('auto');

  /** Border radius (CSS value) */
  borderRadius = input<string>('');

  /** Number of lines for text-block variant */
  lines = input<number>(3);

  /** Animation speed: slow, normal, fast */
  speed = input<'slow' | 'normal' | 'fast'>('normal');

  /** Disable animation */
  noAnimation = input<boolean>(false);

  /**
   * Get CSS classes for skeleton
   */
  getClasses(): string {
    const classes = [
      'skeleton',
      `skeleton--${this.variant()}`,
      `skeleton--speed-${this.speed()}`
    ];

    if (this.noAnimation()) {
      classes.push('skeleton--no-animation');
    }

    return classes.join(' ');
  }

  /**
   * Get inline styles for skeleton
   */
  getStyles(): Record<string, string> {
    const styles: Record<string, string> = {};

    if (this.width()) {
      styles['width'] = this.width();
    }

    if (this.height() && this.height() !== 'auto') {
      styles['height'] = this.height();
    }

    if (this.borderRadius()) {
      styles['border-radius'] = this.borderRadius();
    }

    return styles;
  }

  /**
   * Generate array for text-block lines
   */
  getLinesArray(): number[] {
    return Array.from({ length: this.lines() }, (_, i) => i);
  }
}
