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
        <Script src="https://spyne-scraping-data.s3.us-east-1.amazonaws.com/test_script.js" />
        <Script src="https://cdn.amplitude.com/script/fe37329a816665a014d7abbfe9ad4933.js" />
        <Script id="amplitude-init">
          {`window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
          window.amplitude.init('fe37329a816665a014d7abbfe9ad4933', {"fetchRemoteConfig":true,"autocapture":true});`}
        </Script>
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
