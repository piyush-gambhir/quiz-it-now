import { auth } from '@/auth';

import TakeQuizPage from '@/components/take-quiz-page';
import { getRequestBaseUrl } from '@/lib/utils/request-url';

export default async function Page({
    params,
}: {
    params: Promise<{ quiz_id: string }>;
}) {
    const session = await auth();
    const { quiz_id } = await params;
    const baseUrl = await getRequestBaseUrl();

    if (!session?.user?.id) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Please log in to view this quiz.</p>
            </div>
        );
    }

    const response = await fetch(
        `${baseUrl}/api/quiz/${quiz_id}?userId=${session.user.id}`,
        {
            cache: 'no-store',
        },
    );

    if (!response.ok) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <p>Unable to load this quiz right now.</p>
            </div>
        );
    }

    const data = await response.json();
    const quiz = data?.data;

    return <TakeQuizPage quizData={quiz} />;
}
