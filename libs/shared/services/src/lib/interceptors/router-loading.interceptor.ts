import { inject, Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoadingService } from '../loading/loading.service';

/**
 * Router Loading Interceptor
 *
 * Automatically shows/hides global loading state during route navigation and resolver execution.
 * This provides visual feedback when route resolvers are fetching data before component activation.
 *
 * Architecture:
 * - Listens to Angular Router navigation events
 * - Tracks loading state using LoadingService
 * - Automatically manages loading for routes with resolvers
 * - Provides seamless UX during asynchronous route transitions
 *
 * Setup:
 * Call `initializeRouterLoadingInterceptor()` in your app initialization
 * (typically in app.config.ts or main.ts)
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideRouter(routes),
 *     {
 *       provide: APP_INITIALIZER,
 *       useFactory: () => {
 *         const interceptor = inject(RouterLoadingInterceptorService);
 *         return () => interceptor.initialize();
 *       },
 *       multi: true
 *     }
 *   ]
 * };
 * ```
 */
export function initializeRouterLoadingInterceptor(): void {
  const router = inject(Router);
  const loadingService = inject(LoadingService);

  let navigationOperationId: string | null = null;

  // Subscribe to router events to track navigation lifecycle
  router.events
    .pipe(
      filter(event =>
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      )
    )
    .subscribe(event => {
      if (event instanceof NavigationStart) {
        // Navigation started - show loading
        // This includes resolver execution time
        navigationOperationId = loadingService.startOperation('router-navigation');
      } else {
        // Navigation completed/cancelled/failed - hide loading
        if (navigationOperationId) {
          loadingService.stopOperation(navigationOperationId);
          navigationOperationId = null;
        }
      }
    });
}

/**
 * Service-based Router Loading Interceptor
 * Alternative approach if you prefer using a service instead of a function
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideRouter(routes),
 *     RouterLoadingInterceptorService,
 *     {
 *       provide: APP_INITIALIZER,
 *       useFactory: (service: RouterLoadingInterceptorService) => () => service.initialize(),
 *       deps: [RouterLoadingInterceptorService],
 *       multi: true
 *     }
 *   ]
 * };
 * ```
 */
@Injectable({ providedIn: 'root' })
export class RouterLoadingInterceptorService {
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);
  private navigationOperationId: string | null = null;

  /**
   * Initialize the router loading interceptor
   * Subscribe to router events and manage loading state
   */
  initialize(): void {
    this.router.events
      .pipe(
        filter(event =>
          event instanceof NavigationStart ||
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        )
      )
      .subscribe(event => {
        this.handleRouterEvent(event);
      });
  }

  /**
   * Handle router navigation events
   */
  private handleRouterEvent(
    event: NavigationStart | NavigationEnd | NavigationCancel | NavigationError
  ): void {
    if (event instanceof NavigationStart) {
      // Navigation started (includes resolver execution)
      this.navigationOperationId = this.loadingService.startOperation('router-navigation');
    } else {
      // Navigation completed/cancelled/failed
      if (this.navigationOperationId) {
        this.loadingService.stopOperation(this.navigationOperationId);
        this.navigationOperationId = null;
      }
    }
  }

  /**
   * Check if router navigation is currently loading
   */
  isNavigating(): boolean {
    return this.loadingService.isOperationActive('router-navigation');
  }
}
