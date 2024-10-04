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
    const response = await fetch('http://127.0.0.1:5000/generate_questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: input,
        input_type: inputType,
        number_of_questions: numberOfQuestions,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate questions');
    }

    const data = await response.json();
    return data.questions || [];
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

export async function getQuizById(quizId: string) {
  const response = await fetch(`/api/quiz/${quizId}`);
  return response.json();
}
