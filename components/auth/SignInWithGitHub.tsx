import { signIn } from '@/auth';

import { FaGithub } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

export default function SignInWithGitHub() {
    return (
        <form
            action={async () => {
                'use server';
                await signIn('github');
            }}
        >
            <Button variant="outline" className="w-full flex gap-x-2">
                <FaGithub />
                Sign up with GitHub
            </Button>
        </form>
    );
}
