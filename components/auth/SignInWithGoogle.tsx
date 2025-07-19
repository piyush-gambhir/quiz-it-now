'use client';

import { signIn } from 'next-auth/react';

import { FaGoogle } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

export default function SignInWithGoogle() {
    return (
        <Button
            variant="outline"
            className="w-full flex gap-x-2"
            onClick={() => signIn('google')}
        >
            <FaGoogle />
            Login with Google
        </Button>
    );
}
