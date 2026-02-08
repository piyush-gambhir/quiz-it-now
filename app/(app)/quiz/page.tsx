import { auth } from '@/auth';

import type { Metadata } from 'next';

import QuizzesPage from '@/components/quizzes-page';
import { QuizDocument } from '@/lib/types/quiz';
import { getRequestBaseUrl } from '@/lib/utils/request-url';

export const metadata: Metadata = {
    title: 'My Quizzes',
    description: 'View and manage all your AI-generated quizzes.',
};

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ page: string }>;
}) {
    const session = await auth();
    const { page } = await searchParams;
    const baseUrl = await getRequestBaseUrl();

    if (!session?.user?.id) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Please log in to view quizzes.</p>
            </div>
        );
    }

    const response = await fetch(
        `${baseUrl}/api/quiz?userId=${session.user.id}&page=${parseInt(page) || 1}&limit=20`,
        {
            cache: 'no-store',
        },
    );

    const data = await response.json();
    const userQuizzes = (data?.data?.quizzes || []) as QuizDocument[];

    return <QuizzesPage quizzes={userQuizzes} />;
}
