import { Inter } from '@/fonts/fonts';
import { Providers } from '@/providers/provider';

import type { Metadata } from 'next';

import { cn } from '@/lib/utils/cn';

import './globals.css';

export const metadata: Metadata = {
  title: 'QuizMaster Pro',
  description:
    'QuizMaster Pro is a platform that allows you to create and customize quizzes effortlessly using AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(Inter.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
