import { ChangeDetectionStrategy, Component, computed, contentChildren, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Configurable loading spinner component
 * Supports customizing size, color, message and layout
 *
 * @example
 * ```html
 * <!-- Simple spinner -->
 * <ng-coding-challenges-loading-spinner />
 *
 * <!-- With message -->
 * <ng-coding-challenges-loading-spinner message="Loading challenges..." />
 *
 * <!-- With projected content -->
 * <ng-coding-challenges-loading-spinner>
 *   <p>Custom loading message</p>
 * </ng-coding-challenges-loading-spinner>
 * ```
 */
@Component({
  selector: 'ng-coding-challenges-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent {
  /** Spinner diameter in pixels */
  diameter = input<number>(40);

  /** Spinner stroke width in pixels */
  strokeWidth = input<number>(4);

  /** Material theme color for the spinner */
  color = input<'primary' | 'accent' | 'warn'>('primary');

  /** Optional loading message to display */
  message = input<string>('');

  /** Optional CSS class(es) for container styling */
  containerClass = input<string>('');

  /** Check if there's projected content */
  private readonly projectedContent = contentChildren<HTMLElement>('*', { descendants: true });

  /** Computed signal to check if content is projected */
  readonly hasContent = computed(() => this.projectedContent().length > 0);
}
