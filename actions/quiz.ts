// File: /actions/quiz.ts
'use server';

import { getServerSession } from '@/lib/auth/get-session';

// File: /actions/quiz.ts

// File: /actions/quiz.ts

// File: /actions/quiz.ts

// File: /actions/quiz.ts

// File: /actions/quiz.ts

export async function generateQuiz({
    input,
    inputType,
    numberOfQuestions = 5,
    difficulty = 'Easy',
    model = 'mistralai/Mixtral-8x7B-Instruct-v0.1',
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
        );

        const rawResponse = await response.text();
        console.log('Raw server response:', rawResponse);
        let data;
        try {
            data = JSON.parse(rawResponse);
        } catch (parseError) {
            console.error('Failed to parse JSON response:', parseError);
            throw new Error('Failed to parse server response.');
        }

        if (!response.ok) {
            throw new Error(data?.message || 'Failed to generate the quiz.');
        }
        return {
            success: true,
            data: data.data.quizId,
        };
    } catch (error: any) {
        console.error('Error generating questions:', error);
        return {
            success: false,
            message:
                error.message ||
                'An unexpected error occurred while generating the quiz.',
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

        return response.json();
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
