import SignUpPage from '@/components/sign-up-page';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up',
    description:
        'Create a free QuizItNow account and start generating AI-powered quizzes instantly.',
};

export default function Page() {
    return <SignUpPage />;
}
