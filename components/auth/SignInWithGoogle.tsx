import { signIn } from '@/auth';

import { FaGoogle } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

export default function SignInWithGoogle() {
    return (
        <form
            action={async () => {
                'use server';
                await signIn('google');
            }}
        >
            <Button
                variant="outline"
                className="w-full flex gap-x-2"
                type="submit"
            >
                <FaGoogle />
                Login with Google
            </Button>
        </form>
    );
}
