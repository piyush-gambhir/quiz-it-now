import { Inter } from '@/fonts/fonts';
import { Providers } from '@/providers/provider';

import type { Metadata } from 'next';
import Script from 'next/script';
import React from 'react';

import { cn } from '@/lib/utils/cn';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

import './globals.css';

export const metadata: Metadata = {
  title: 'Quiz Master',
  description:
    'Quiz Masteris a platform that allows you to create and customize quizzes effortlessly using AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={cn(Inter.className)}>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
