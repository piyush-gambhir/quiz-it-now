import { Inter } from '@/fonts/fonts';
import { Providers } from '@/providers/provider';

import type { Metadata } from 'next';

import { cn } from '@/lib/utils/cn';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js Typescript Boilerplate',
  description: 'Next.JS Boilerplate with TypeScript and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'flex flex-col min-h-screen justify-between',
          Inter.className,
        )}
      >
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
