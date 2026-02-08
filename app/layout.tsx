import { Outfit } from '@/fonts/googleFonts';
import { Providers } from '@/providers/Providers';

import type { Metadata } from 'next';
import React from 'react';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

import './globals.css';

export const metadata: Metadata = {
    title: 'QuizItNow',
    description:
        'QuizItNow is a platform that allows you to create and customize quizzes effortlessly using AI with any input source.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(Outfit.variable, 'font-sans antialiased')}>
                <Providers>
                    <Header />
                    {children}
                    <Footer />
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
