import LoginForm from '@/components/auth/sign-up-form';

export default function SignUpPage() {
    return (
        <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 sm:px-6 py-12">
            <LoginForm />
        </div>
    );
}
