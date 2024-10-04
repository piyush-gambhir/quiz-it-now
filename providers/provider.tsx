'use client';

import { ThemeProvider } from '@/providers/ThemeProvider';

import React from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
