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

// Configuration Services
export * from './lib/config/config-loader.service';

// Adapters (Adapter Pattern for data transformation)
export * from './lib/adapters';

// Type Mappers (Deprecated - Use Adapters instead)
export * from './lib/mappers/challenge-type-mapper';

// Route Resolvers
export * from './lib/resolvers/challenge-details.resolver';
export * from './lib/resolvers/challenge-list.resolver';

// Utility Services
export * from './lib/navigation/navigation.service';
export * from './lib/notification/notification.service';
export * from './lib/stackblitz/stackblitz.service';
export * from './lib/loading/loading.service';

// Interceptors
export * from './lib/interceptors/router-loading.interceptor';

// Add future services here...
