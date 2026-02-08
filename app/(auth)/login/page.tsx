import LoginPage from '@/components/login-page';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Log In',
    description:
        'Sign in to your QuizItNow account to create and manage AI-powered quizzes.',
};

export default function Page() {
    return <LoginPage />;
}
