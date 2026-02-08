'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden border-b border-border/40">
            {/* Subtle radial gradient */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,var(--primary)/0.08,transparent)]" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 pt-24 md:pb-28 md:pt-32">
                <div className="mx-auto max-w-3xl text-center">
                    <Badge
                        variant="secondary"
                        className="mb-6 px-3 py-1 text-xs font-medium"
                    >
                        Powered by AI
                    </Badge>

                    <h1 className="text-3xl font-bold tracking-tight leading-[1.1] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                        Create quizzes from{' '}
                        <span className="text-primary">any content</span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
                        Paste text, upload a document, or drop a link. AI
                        generates ready-to-use quizzes in seconds.
                    </p>

                    <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <Link href="/quiz/generate" prefetch>
                            <Button size="lg" className="h-11 px-6 text-sm">
                                Start Creating
                                <ArrowRight className="ml-2 size-4" />
                            </Button>
                        </Link>
                        <Link href="/quiz">
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-11 px-6 text-sm"
                            >
                                View My Quizzes
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="mx-auto mt-16 grid max-w-xl grid-cols-3 divide-x divide-border text-center sm:mt-20">
                    <div className="px-4 sm:px-6">
                        <p className="text-xl font-bold tracking-tight sm:text-2xl">
                            Instant
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Generation
                        </p>
                    </div>
                    <div className="px-4 sm:px-6">
                        <p className="text-xl font-bold tracking-tight sm:text-2xl">
                            3+ Formats
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Input types
                        </p>
                    </div>
                    <div className="px-4 sm:px-6">
                        <p className="text-xl font-bold tracking-tight sm:text-2xl">
                            Free
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            To start
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
