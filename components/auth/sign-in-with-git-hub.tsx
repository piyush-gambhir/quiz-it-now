'use client';

import { signIn } from 'next-auth/react';

import { FaGithub } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

export default function SignInWithGitHub() {
    return (
        <Button
            variant="outline"
            className="h-11 w-full gap-2.5"
            onClick={() => signIn('github')}
        >
            <FaGithub className="size-4" />
            Continue with GitHub
        </Button>
    );
}
