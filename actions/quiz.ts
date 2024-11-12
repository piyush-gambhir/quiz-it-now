'use server';

import { getServerSession } from '@/lib/auth/get-session';

export async function generateQuiz({
  input,
  inputType,
  numberOfQuestions = 5,
  model = 'mistralai/Mixtral-8x7B-Instruct-v0.1',
}: {
  input: any;
  inputType: any;
  numberOfQuestions: number;
  model?: string;
}) {
  try {
    const session = await getServerSession();
    const formData = new FormData();
    formData.append('userId', session?.user?.id || '');
    formData.append('inputType', inputType);
    formData.append('numberOfQuestions', numberOfQuestions.toString());
    formData.append('model', model);
    formData.append('file', input);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL!}/api/quiz/generate/ai`,
      {
        method: 'POST',
        body: formData,
      },
    );

    return response.json().then((data) => data.data);
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

export async function getQuizzes({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const session = await getServerSession();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL!}/api/quiz?userId=${session?.user?.id}&page=${page}&limit=${limit}`,
  );
  return response.json();
}

export async function getQuizById({ quizId }: { quizId: string }) {
  const session = await getServerSession();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL!}/api/quiz/${quizId}?userId=${session?.user?.id}`,
  );
  return response.json().then((data) => data.data);
}
