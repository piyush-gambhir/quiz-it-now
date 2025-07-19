'use client';

import { signIn } from 'next-auth/react';

import { FaGithub } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

export default function SignInWithGitHub() {
    return (
        <Button
            variant="outline"
            className="w-full flex gap-x-2"
            onClick={() => signIn('github')}
        >
            <FaGithub />
            Sign up with GitHub
        </Button>
    );
}
