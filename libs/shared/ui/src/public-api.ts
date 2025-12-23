/*
 * Public API Surface of @ng-coding-challenges/shared/ui
 */

/**
 * Layout Components
 * Components for overall page structure and layout
 */
export * from './lib/components/header/header.component';
export * from './lib/components/footer/footer.component';
export * from './lib/components/landing-page/landing-page.component';

/**
 * UI Components
 * Reusable UI elements for building interfaces
 */
export * from './lib/components/challenge-card/challenge-card.component';
export * from './lib/components/challenge-list/challenge-list.component';
export * from './lib/components/challenge-category-list/challenge-category-list.component';
export * from './lib/components/challenge-category-card/challenge-category-card.component';

export * from './lib/components/search-bar/search-bar.component';
export * from './lib/components/category-sidebar/category-sidebar.component';
export * from './lib/components/challenges-browser/challenges-browser.component';
export * from './lib/components/challenge-details/challenge-details.component';
export * from './lib/components/breadcrumbs/breadcrumbs.component';
export * from './lib/components/workspace-toolbar/workspace-toolbar.component';
export * from './lib/components/global-search/global-search.component';
export * from './lib/components/challenge-not-found/challenge-not-found.component';

export * from './lib/components/loading-spinner/loading-spinner.component';
export * from './lib/components/global-loading-overlay/global-loading-overlay.component';
export * from './lib/components/theme-toggle/theme-toggle.component';
export * from './lib/components/skeleton-loader/skeleton-loader.component';
export * from './lib/components/error-boundary/error-boundary.component';
export * from './lib/components/skip-links/skip-links.component';

/**
 * Reusable Landing Page Components
 * Composable UI components extracted from landing page patterns
 */
export * from './lib/components/section-header/section-header.component';
export * from './lib/components/metric-card/metric-card.component';
export * from './lib/components/feature-card/feature-card.component';
export * from './lib/components/latest-card/latest-card.component';
export * from './lib/components/hero-stats/hero-stats.component';

/**
 * Pipes
 * Reusable transformation pipes
 */
export * from './lib/pipes/highlight-text.pipe';

/**
 * Constants
 * Application-wide constants for consistency
 */
export * from './lib/constants/search.constants';
export * from './lib/constants/loading.constants';

/**
 * Type Definitions
 * Type-safe interfaces and types
 */
export * from './lib/models/route-data.interface';

/**
 * Design System Tokens
 * Constants for spacing, colors, breakpoints, etc.
 */
export * from './lib/tokens/breakpoints';
export * from './lib/tokens/design-tokens';
