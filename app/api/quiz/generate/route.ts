import { db } from '@/lib/mongo/client';
import { generateUUIDv4 } from '@/lib/utils/generateUUID';

export async function POST(request: Request) {
  try {
    const { userId, input, inputType, numberOfQuestions } =
      await request.json();

    if (!input || !inputType || !numberOfQuestions) {
      return new Response(
        JSON.stringify({
          success: false,
          statusCode: 400,
          message: 'Missing required fields',
          data: null,
          error: {
            code: 400,
            message: 'Missing required fields',
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Make the API call to the external service to generate quiz questions
    const response = await fetch(
      'http://127.0.0.1:8000/quiz-master/v1/generate_quiz',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_name: 'llama3.2',
          input: input,
          input_type: inputType,
          number_of_questions: numberOfQuestions,
        }),
      },
    );

    // Check if the response from the external service is okay
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate questions: ${errorText}`);
    }

    const aiResponse = await response.json();

    const database = await db;
    const collection = database.collection('quizzes'); // Use your collection name here

    const quizId = generateUUIDv4();

    const quizData = {
      quizId,
      userId,
      input: {
        data: input,
        type: inputType,
      },
      model: aiResponse?.data?.model ?? null,
      quiz: aiResponse?.data?.quiz ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.insertOne(quizData);

    return new Response(
      JSON.stringify({
        success: true,
        statusCode: 200,
        message: 'Quiz generated successfully',
        data: quizData,
        error: {
          code: null,
          message: null,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    // Catch and return any errors that occur during the process
    return new Response(
      JSON.stringify({
        success: false,
        statusCode: 500,
        message: 'Failed to generate quiz',
        data: null,
        error: {
          code: 500,
          message: error?.message,
        },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

