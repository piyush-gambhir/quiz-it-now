import Link from 'next/link';

import SignInWithGitHub from '@/components/auth/sign-in-with-git-hub';
import SignInWithGoogle from '@/components/auth/sign-in-with-google';

export default function LoginForm() {
    return (
        <div className="mx-auto w-full max-w-sm sm:max-w-md">
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded bg-primary text-sm font-bold text-primary-foreground">
                    Q
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Create your account
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                    Get started with Google or GitHub.
                </p>
            </div>

            <div className="rounded-md border border-border p-5 sm:p-6">
                <div className="grid gap-3">
                    <SignInWithGoogle />
                    <SignInWithGitHub />
                </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                    href="/login"
                    className="font-medium text-foreground underline underline-offset-4"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}
