'use client';

import { Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function LogoutPage() {
    useEffect(() => {
        const timer = setTimeout(() => {
            void signOut({
                callbackUrl: '/login',
                redirect: true,
            });
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
            <Loader2
                className="mb-8 h-14 w-14 animate-spin text-primary"
                aria-hidden="true"
            />
            <h1 className="mb-3 text-center text-3xl font-bold md:text-4xl">
                Signing Out
            </h1>
            <p className="max-w-md text-center text-muted-foreground">
                Please wait while we securely sign you out.
            </p>
        </div>
    );
}
