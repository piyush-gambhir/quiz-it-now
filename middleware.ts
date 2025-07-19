import { DEFAULT_LANDING_PAGE, authRoutes, publicRoutes } from '@/routes';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getServerSession } from '@/lib/auth/get-session';

// Middleware function to handle route-based authentication using sessions
export async function middleware(req: NextRequest) {
    const { pathname, origin, search } = req.nextUrl;

    // Skip middleware checks for static files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') || // Skip authentication for all API routes
        pathname.includes('.') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    const isAuthRoute = authRoutes.includes(pathname);
    const isPublicRoute = publicRoutes.includes(pathname);

    // Retrieve the session to check authentication status
    let session;
    try {
        session = await getServerSession();
    } catch (error) {
        // If there's an error with session retrieval, treat as not logged in
        console.warn('Session retrieval error:', error);
        session = null;
    }

    const isLoggedIn = !!session;

    // Handle authentication routes (e.g., login, signup)
    if (isAuthRoute) {
        return isLoggedIn
            ? NextResponse.redirect(new URL(DEFAULT_LANDING_PAGE, origin))
            : NextResponse.next();
    }

    // Protect non-public routes by redirecting unauthenticated users to the login page
    if (!isLoggedIn && !isPublicRoute) {
        const callbackUrl = search ? `${pathname}${search}` : pathname;
        return NextResponse.redirect(
            new URL(
                `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
                origin,
            ),
        );
    }

    // Allow access if the route does not match any of the above conditions
    return NextResponse.next();
}

// Middleware matcher configuration to specify applicable paths
export const config = {
    matcher: ['/(api|trpc|.*)', '/', '/((?!.*\\..*|_next).*)'],
};
