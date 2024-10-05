'use server';
export async function generateQuiz({
  input,
  inputType,
  numberOfQuestions,
}: {
  input: any;
  inputType: any;
  numberOfQuestions: number;
}) {
  try {
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

export async function getQuizById(quizId: string) {
  const response = await fetch(`/api/quiz/${quizId}`);
  return response.json();
}
