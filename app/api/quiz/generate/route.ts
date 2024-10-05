import { db } from '@/lib/mongo/client';
import { generateUUIDv4 } from '@/lib/utils/generateUUID';

export async function POST(request: Request) {
  try {
    const { userId, input, inputType, numberOfQuestions } =
      await request.json();

    if (!input || !inputType || !numberOfQuestions) {
      return new Response(
        JSON.stringify({
          error:
            'Missing required fields: input, inputType, or numberOfQuestions',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Make the API call to the external service to generate quiz questions
    const response = await fetch('http://127.0.0.1:5000/generate_questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input,
        input_type: inputType,
        number_of_questions: numberOfQuestions,
      }),
    });

    // Check if the response from the external service is okay
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate questions: ${errorText}`);
    }

    // Parse the response data
    const data = await response.json();
    console.log(data);
    // Connect to the database
    const database = await db;
    const collection = database.collection('quizzes'); // Use your collection name here

    // Generate a unique ID for the quiz
    const quizId = generateUUIDv4();

    // Prepare the quiz data to be stored in the collection
    const quizData = {
      quizId,
      userId,
      input,
      inputType,
      numberOfQuestions,
      questions: data || [],
      createdAt: new Date(),
    };

    // Insert the quiz data into the MongoDB collection
    await collection.insertOne(quizData);

    // Return the inserted data along with the generated ID
    return new Response(
      JSON.stringify({
        message: 'Quiz generated successfully.',
        quizId,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    // Catch and return any errors that occur during the process
    return new Response(
      JSON.stringify({
        error: error.message ?? 'An unexpected error occurred',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
