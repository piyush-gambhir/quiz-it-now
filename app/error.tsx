'use client';

import { Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 sm:px-6">
            <div className="max-w-md text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10">
                    <span className="text-2xl font-bold text-destructive">
                        !
                    </span>
                </div>
                <h1 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
                    Something went wrong
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    An unexpected error occurred. Please try again or return
                    home.
                </p>
                {error?.digest && (
                    <p className="mt-2 font-mono text-xs text-muted-foreground/60">
                        Error ID: {error.digest}
                    </p>
                )}
                <div className="mt-6 flex items-center justify-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={reset}
                    >
                        <RefreshCw className="size-3.5" />
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button size="sm" className="gap-1.5">
                            <Home className="size-3.5" />
                            Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
