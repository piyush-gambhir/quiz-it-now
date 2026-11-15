import { DEFAULT_LANDING_PAGE, authRoutes, publicRoutes } from '@/routes';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getServerSession } from '@/lib/auth/get-session';

export async function proxy(req: NextRequest) {
    const { pathname, origin, search } = req.nextUrl;

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    const isAuthRoute = authRoutes.includes(pathname);
    const isPublicRoute = publicRoutes.includes(pathname);

    const session = await getServerSession();
    const isLoggedIn = !!session;

    if (isAuthRoute) {
        return isLoggedIn
            ? NextResponse.redirect(new URL(DEFAULT_LANDING_PAGE, origin))
            : NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
        const callbackUrl = search ? `${pathname}${search}` : pathname;
        return NextResponse.redirect(
            new URL(
                `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
                origin,
            ),
        );
    }

    return NextResponse.next();
}

export const proxyConfig = {
    matcher: ['/(api|trpc|.*)', '/', '/((?!.*\\..*|_next).*)'],
};
