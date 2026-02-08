'use client';

import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 sm:px-6">
            <div className="max-w-md text-center">
                <p className="text-7xl font-bold tracking-tighter text-primary sm:text-8xl">
                    404
                </p>
                <h1 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
                    Page not found
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    The page you&apos;re looking for doesn&apos;t exist or has
                    been moved.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                        className="gap-1.5"
                    >
                        <ArrowLeft className="size-3.5" />
                        Go Back
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
