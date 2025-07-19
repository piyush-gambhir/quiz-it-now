import { getQuizById } from '@/actions/quiz';

import TakeQuizPage from '@/components/TakeQuizPage';

export default async function page({
    params,
}: {
    params: { quiz_id: string };
}) {
    const { quiz_id } = params;
    const quiz = await getQuizById({
        quizId: quiz_id,
    });
    return <TakeQuizPage quizData={quiz} />;
}
