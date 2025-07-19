'use server';

import { getServerSession } from '@/lib/auth/get-session';

export async function generateQuiz({
    input,
    inputType,
    numberOfQuestions = 5,
    difficulty = 'Easy',
    model = 'nvidia/llama-3.1-nemotron-70b-instruct',
}: {
    input: any;
    inputType: 'text' | 'link' | 'file';
    numberOfQuestions: number;
    model?: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'God Mode';
}) {
    try {
        const session = await getServerSession();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL!}/api/quiz/generate/ai`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session?.user?.id,
                    input,
                    inputType,
                    numberOfQuestions,
                    model,
                    difficulty,
                }),
            },
        ).then((res) => res.json());
        if (!response.success) {
            throw new Error(response.error);
        }
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        console.error('Error generating questions:', error);
        return {
            success: false,
            error: error,
        };
    }
}

export async function getQuizzes({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) {
    try {
        const session = await getServerSession();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL!}/api/quiz?userId=${session?.user?.id}&page=${page}&limit=${limit}`,
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.message || 'Failed to fetch quizzes.');
        }
        const data = await response.json();
        return data.quizzes;
    } catch (error: any) {
        console.error('Error fetching quizzes:', error);
        return {
            success: false,
            message:
                error.message ||
                'An unexpected error occurred while fetching quizzes.',
        };
    }
}

export async function getQuizById({ quizId }: { quizId: string }) {
    try {
        const session = await getServerSession();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL!}/api/quiz/${quizId}?userId=${session?.user?.id}`,
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData?.message || 'Failed to fetch quiz details.',
            );
        }

        const data = await response.json();
        return data.data;
    } catch (error: any) {
        console.error('Error fetching quiz by ID:', error);
        return {
            success: false,
            message:
                error.message ||
                'An unexpected error occurred while fetching the quiz details.',
        };
    }
}
