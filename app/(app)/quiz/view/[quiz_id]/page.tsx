import { getQuizById } from '@/actions/quiz';

import ViewQuizPage from '@/components/ViewQuizPage';

export default async function page({
    params,
}: {
    params: { quiz_id: string };
}) {
    const { quiz_id } = params;
    const quiz = await getQuizById({
        quizId: quiz_id,
    });
    return <ViewQuizPage quizData={quiz} />;
}
