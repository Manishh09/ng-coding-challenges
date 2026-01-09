/**
 * Calculates the depth of a route URL by counting segments
 * @param url - The URL to analyze (can include query params)
 * @returns The depth of the route (number of segments minus base)
 * @example
 * calculateRouteDepth('/challenges/rxjs-api') // returns 1
 * calculateRouteDepth('/challenges/rxjs-api/debounce-search') // returns 2
 */
export function calculateRouteDepth(url: string): number {
  const segments = url.split('?')[0].split('/').filter(Boolean);
  return segments.length > 0 ? segments.length - 1 : 0;
}

/**
 * Extracts route segments from a URL
 * @param url - The URL to parse (can include query params)
 * @returns Array of route segments (excluding empty strings)
 * @example
 * getRouteSegments('/challenges/rxjs-api/debounce-search?tab=solution')
 * // returns ['challenges', 'rxjs-api', 'debounce-search']
 */
export function getRouteSegments(url: string): string[] {
  return url.split('?')[0].split('/').filter(Boolean);
}

/**
 * Checks if a URL matches a specific route pattern
 * @param url - The URL to check
 * @param pattern - The pattern to match (use * as wildcard)
 * @returns True if the URL matches the pattern
 * @example
 * matchesRoute('/challenges/rxjs-api', '/challenges/*') // returns true
 * matchesRoute('/challenges', '/challenges/*') // returns false
 */
export function matchesRoute(url: string, pattern: string): boolean {
  const urlSegments = getRouteSegments(url);
  const patternSegments = pattern.split('/').filter(Boolean);

  if (urlSegments.length < patternSegments.length) return false;

  return patternSegments.every((segment, index) => {
    if (segment === '*') return true;
    return segment === urlSegments[index];
  });
}

/**
 * Extracts a route parameter from a URL by position
 * @param url - The URL to extract from
 * @param position - The zero-based position of the parameter
 * @returns The parameter value or undefined if not found
 * @example
 * getRouteParam('/challenges/rxjs-api/debounce', 1) // returns 'rxjs-api'
 * getRouteParam('/challenges/rxjs-api/debounce', 2) // returns 'debounce'
 */
export function getRouteParam(url: string, position: number): string | undefined {
  const segments = getRouteSegments(url);
  return segments[position];
}
