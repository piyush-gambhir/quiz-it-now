'use client';

import { signIn } from 'next-auth/react';

import { FaGoogle } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

export default function SignInWithGoogle() {
    return (
        <Button
            variant="outline"
            className="h-11 w-full gap-2.5"
            onClick={() => signIn('google')}
        >
            <FaGoogle className="size-4" />
            Continue with Google
        </Button>
    );
}
