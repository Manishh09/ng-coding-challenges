import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingService } from '@ng-coding-challenges/shared/services';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

/**
 * Global Loading Overlay Component
 *
 * Displays a full-screen loading overlay during router navigation and resolver execution.
 * Integrates with LoadingService to show/hide automatically.
 *
 * Features:
 * - Full-screen backdrop with blur effect
 * - Centered loading spinner
 * - Smooth fade-in/fade-out animations
 * - Accessible with ARIA attributes
 * - High z-index to appear above all content
 *
 * Usage:
 * Place this component at the root level of your app (typically in app.component.html)
 *
 * @example
 * ```html
 * <!-- app.component.html -->
 * <ng-coding-challenges-global-loading-overlay />
 * <router-outlet />
 * ```
 */
@Component({
  selector: 'ng-coding-challenges-global-loading-overlay',
  standalone: true,
  imports: [LoadingSpinnerComponent],
  template: `
    @if (loadingService.isLoading()) {
      <div
        class="global-loading-overlay"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div class="loading-content">
          <ng-coding-challenges-loading-spinner
            [diameter]="50"
            [strokeWidth]="5"
            color="primary"
            message="Loading..."
            layout="column"
          />
        </div>
      </div>
    }
  `,
  styles: [`
    .global-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .loading-content {
      background: var(--surface-color, white);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      min-width: 200px;
      animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes scaleIn {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .loading-content {
        padding: 1.5rem;
        min-width: 150px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalLoadingOverlayComponent {
  protected readonly loadingService = inject(LoadingService);
}
