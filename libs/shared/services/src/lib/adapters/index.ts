/**
 * Public API for adapters
 * Exports adapter interfaces and implementations
 */

export * from './challenge.adapter.interface';
export * from './challenge.adapter';

/**
 * Adapter Provider
 * Maps the abstract IChallengeAdapter to concrete ChallengeAdapter implementation
 * This enables dependency injection using the interface as the token
 */
import { Provider } from '@angular/core';
import { IChallengeAdapter } from './challenge.adapter.interface';
import { ChallengeAdapter } from './challenge.adapter';

/**
 * Provider for IChallengeAdapter
 * Use this in your providers array to enable IChallengeAdapter injection
 *
 * @example
 * ```typescript
 * // In app.config.ts or component
 * providers: [provideChallengeAdapter()]
 * ```
 */
export function provideChallengeAdapter(): Provider {
  return {
    provide: IChallengeAdapter,
    useClass: ChallengeAdapter
  };
}
