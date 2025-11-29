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

// Route Resolvers
export * from './lib/resolvers/challenge-details.resolver';
export * from './lib/resolvers/challenge-list.resolver';

// Utility Services
export * from './lib/navigation/navigation.service';
export * from './lib/notification/notification.service';
export * from './lib/stackblitz/stackblitz.service';
export * from './lib/loading/loading.service';

// Add future services here...
