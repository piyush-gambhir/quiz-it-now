import { auth } from '@/auth';
import { NextAuthSessionProvider } from '@/providers/next-auth-session-provider';
import { ThemeProvider } from '@/providers/theme-provider';

import { Session } from 'next-auth';
import React from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';

export async function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const authSession = await auth();

    return (
        <NextAuthSessionProvider session={authSession as Session}>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                <TooltipProvider>{children}</TooltipProvider>
            </ThemeProvider>
        </NextAuthSessionProvider>
    );
}
