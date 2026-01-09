import { Injectable, signal } from '@angular/core';
import { Observable, finalize, MonoTypeOperatorFunction } from 'rxjs';

/**
 * Global loading state management service
 * Provides centralized loading state with support for multiple concurrent operations
 *
 * @example
 * ```typescript
 * // Show global loading
 * loadingService.show();
 *
 * // Hide global loading
 * loadingService.hide();
 *
 * // Track specific operation
 * const loadingId = loadingService.startOperation('fetchChallenges');
 * // ... async operation
 * loadingService.stopOperation(loadingId);
 *
 * // Use RxJS operator for automatic tracking
 * this.http.get('/api/data').pipe(
 *   loadingService.withLoadingOperator('fetchData')
 * ).subscribe();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  /** Default timeout for operations (30 seconds) */
  private readonly DEFAULT_TIMEOUT_MS = 30000;

  /** Map of operation IDs to their timeout handles */
  private readonly operationTimeouts = new Map<string, number>();

  /** Global loading state - true when any operation is loading */
  private readonly loadingState = signal(false);

  /** Set of active operation IDs for concurrent operation tracking */
  private readonly activeOperations = signal(new Set<string>());

  /** Public readonly signal for global loading state */
  readonly isLoading = this.loadingState.asReadonly();

  /** Public readonly signal for active operations count */
  readonly activeOperationsCount = signal(0);

  /**
   * Show global loading indicator
   * Use for simple operations that don't need tracking
   */
  show(): void {
    this.loadingState.set(true);
  }

  /**
   * Hide global loading indicator
   * Use for simple operations that don't need tracking
   */
  hide(): void {
    this.loadingState.set(false);
  }

  /**
   * Start a tracked operation and return its unique ID
   * Automatically updates global loading state and sets a timeout for auto-cleanup
   *
   * @param operationName - Descriptive name for the operation
   * @param timeoutMs - Optional timeout in milliseconds (default: 30000ms)
   * @returns Unique operation ID to use with stopOperation
   */
  startOperation(operationName: string, timeoutMs: number = this.DEFAULT_TIMEOUT_MS): string {
    const operationId = `${operationName}_${Date.now()}_${Math.random()}`;
    const operations = new Set(this.activeOperations());
    operations.add(operationId);
    this.activeOperations.set(operations);
    this.activeOperationsCount.set(operations.size);
    this.updateLoadingState();

    // Set timeout for auto-cleanup to prevent memory leaks
    const timeoutId = window.setTimeout(() => {
      console.warn(`[LoadingService] Operation '${operationName}' timed out after ${timeoutMs}ms. Auto-cleaning up.`);
      this.stopOperation(operationId);
    }, timeoutMs);

    this.operationTimeouts.set(operationId, timeoutId);
    return operationId;
  }

  /**
   * Stop a tracked operation
   * Automatically updates global loading state and clears timeout
   *
   * @param operationId - The ID returned from startOperation
   */
  stopOperation(operationId: string): void {
    // Clear the timeout
    const timeoutId = this.operationTimeouts.get(operationId);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      this.operationTimeouts.delete(operationId);
    }

    const operations = new Set(this.activeOperations());
    operations.delete(operationId);
    this.activeOperations.set(operations);
    this.activeOperationsCount.set(operations.size);
    this.updateLoadingState();
  }

  /**
   * Clear all active operations and their timeouts
   * Useful for cleanup or error recovery
   */
  clearAllOperations(): void {
    // Clear all timeouts
    this.operationTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.operationTimeouts.clear();

    this.activeOperations.set(new Set());
    this.activeOperationsCount.set(0);
    this.updateLoadingState();
  }

  /**
   * Check if a specific operation type is active
   *
   * @param operationName - The operation name to check
   * @returns true if any operation with that name is active
   */
  isOperationActive(operationName: string): boolean {
    const operations = Array.from(this.activeOperations());
    return operations.some(op => op.startsWith(operationName));
  }

  /**
   * Update global loading state based on active operations
   */
  private updateLoadingState(): void {
    this.loadingState.set(this.activeOperations().size > 0);
  }

  /**
   * Wrap an async function with automatic loading state management
   *
   * @param operationName - Descriptive name for the operation
   * @param fn - Async function to execute
   * @returns Promise with the function result
   */
  async withLoading<T>(operationName: string, fn: () => Promise<T>): Promise<T> {
    const operationId = this.startOperation(operationName);
    try {
      return await fn();
    } finally {
      this.stopOperation(operationId);
    }
  }

  /**
   * RxJS operator for automatic loading state management
   * Automatically starts loading when observable is subscribed and stops when completed/errored
   *
   * @param operationName - Descriptive name for the operation
   * @param timeoutMs - Optional timeout in milliseconds (default: 30000ms)
   * @returns MonoTypeOperatorFunction that manages loading state
   *
   * @example
   * ```typescript
   * this.http.get('/api/data').pipe(
   *   loadingService.withLoadingOperator('fetchData')
   * ).subscribe();
   * ```
   */
  withLoadingOperator<T>(operationName: string, timeoutMs?: number): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) => {
      const operationId = this.startOperation(operationName, timeoutMs);
      return source.pipe(
        finalize(() => this.stopOperation(operationId))
      );
    };
  }
}
