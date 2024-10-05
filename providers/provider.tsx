import { auth } from '@/auth';
import { NextAuthSessionProvider } from '@/providers/NextAuthSessionProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

import React from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';

export async function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authSession = await auth();
  return (
    <NextAuthSessionProvider session={authSession}>
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
