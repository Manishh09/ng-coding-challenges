import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

/**
 * Error boundary component for graceful error handling and recovery
 * Displays user-friendly error messages with retry functionality
 *
 * @example
 * ```html
 * <app-error-boundary
 *   [hasError]="errorOccurred()"
 *   [errorMessage]="errorDetails()"
 *   (retry)="handleRetry()"
 * >
 *   <your-content-here />
 * </app-error-boundary>
 * ```
 */
@Component({
  selector: 'app-error-boundary',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './error-boundary.component.html',
  styleUrls: ['./error-boundary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorBoundaryComponent {
  /** Whether an error has occurred */
  hasError = input<boolean>(false);

  /** Custom error message to display */
  errorMessage = input<string>('');

  /** Error title (defaults to "Something went wrong") */
  errorTitle = input<string>('Something went wrong');

  /** Error icon (Material icon name) */
  errorIcon = input<string>('error_outline');

  /** Show retry button */
  showRetry = input<boolean>(true);

  /** Show reload page button */
  showReload = input<boolean>(false);

  /** Custom retry button text */
  retryText = input<string>('Try again');

  /** Custom reload button text */
  reloadText = input<string>('Reload page');

  /** Emitted when retry button is clicked */
  retry = output<void>();

  /** Emitted when reload button is clicked */
  reload = output<void>();

  /** Internal error details for debugging (not shown to user) */
  errorDetails = signal<string>('');

  /**
   * Get the default error message based on error context
   */
  getDefaultMessage(): string {
    if (this.errorMessage()) {
      return this.errorMessage();
    }

    return 'We encountered an unexpected error. Please try again or reload the page.';
  }

  /**
   * Handle retry button click
   */
  onRetry(): void {
    this.retry.emit();
  }

  /**
   * Handle reload button click
   */
  onReload(): void {
    this.reload.emit();
    // Default behavior: reload the page if no custom handler
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  /**
   * Set internal error details for debugging
   * @param details - Error details string
   */
  setErrorDetails(details: string): void {
    this.errorDetails.set(details);
  }
}
