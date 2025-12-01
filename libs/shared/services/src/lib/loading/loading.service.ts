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
   * Automatically updates global loading state
   *
   * @param operationName - Descriptive name for the operation
   * @returns Unique operation ID to use with stopOperation
   */
  startOperation(operationName: string): string {
    const operationId = `${operationName}_${Date.now()}_${Math.random()}`;
    const operations = new Set(this.activeOperations());
    operations.add(operationId);
    this.activeOperations.set(operations);
    this.activeOperationsCount.set(operations.size);
    this.updateLoadingState();
    return operationId;
  }

  /**
   * Stop a tracked operation
   * Automatically updates global loading state
   *
   * @param operationId - The ID returned from startOperation
   */
  stopOperation(operationId: string): void {
    const operations = new Set(this.activeOperations());
    operations.delete(operationId);
    this.activeOperations.set(operations);
    this.activeOperationsCount.set(operations.size);
    this.updateLoadingState();
  }

  /**
   * Clear all active operations
   * Useful for cleanup or error recovery
   */
  clearAllOperations(): void {
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
   * @returns MonoTypeOperatorFunction that manages loading state
   *
   * @example
   * ```typescript
   * this.http.get('/api/data').pipe(
   *   loadingService.withLoadingOperator('fetchData')
   * ).subscribe();
   * ```
   */
  withLoadingOperator<T>(operationName: string): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) => {
      const operationId = this.startOperation(operationName);
      return source.pipe(
        finalize(() => this.stopOperation(operationId))
      );
    };
  }
}
