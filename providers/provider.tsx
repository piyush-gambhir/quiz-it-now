import { auth } from '@/auth';
import { NextAuthSessionProvider } from '@/providers/NextAuthSessionProvider';

import { Session } from 'next-auth';
import { ThemeProvider } from 'next-themes';
import React from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';

export async function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authSession = await auth();

  // Only render NextAuthSessionProvider if session is not null
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
