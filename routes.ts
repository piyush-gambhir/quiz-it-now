/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 */
export const publicRoutes: string[] = [
    '/',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy',
    '/about',
    '/contact-us',
    '/quiz/generate',
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 */
export const authRoutes: string[] = ['/login', '/register'];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const apiAuthPrefix: string = '/api/auth';

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LANDING_PAGE: string = '/';
