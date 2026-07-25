/*
 * Public API Surface of shared-services
 */

// Add exports for shared services here
// Ensure the correct path to the challenges.service file

// Theming
export * from './lib/theme/theme.service';


// Data Services
export * from './lib/challenges/challenges.service';
export * from './lib/challenges/challenge-category.service';
export * from './lib/challenges/category-data-loader.service';
export * from './lib/challenges/challenge-data.service';
export * from './lib/challenges/challenge-search.service';
export * from './lib/challenges/challenge-navigation.service';
export * from './lib/challenges/challenge-aggregation.service';

// Configuration Services
export * from './lib/config/config-loader.service';

// Adapters (Adapter Pattern for data transformation)
export * from './lib/adapters';

// Route Resolvers
export * from './lib/resolvers/challenge-details.resolver';
export * from './lib/resolvers/challenge-list.resolver';

// Utility Services
export * from './lib/navigation/navigation.service';
export * from './lib/notification/notification.service';
export * from './lib/stackblitz/stackblitz.service';
export * from './lib/loading/loading.service';

// Live Editor (provider-agnostic; boots self-contained projects — no external repo)
export * from './lib/live-editor/live-editor.types';
export * from './lib/live-editor/live-editor.token';
export * from './lib/live-editor/stackblitz-live-editor.provider';
export * from './lib/live-editor/challenge-starter.service';

// Interceptors
export * from './lib/interceptors/router-loading.interceptor';

// Add future services here...
