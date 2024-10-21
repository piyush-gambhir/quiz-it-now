import { db } from '@/lib/mongo/client';

export async function GET(
  request: Request,
  { params }: { params: { quizId: string } },
) {
  try {
    const { quizId } = params;
    if (!quizId) {
      return new Response(
        JSON.stringify({ error: 'quizId parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Connect to the database
    const database = await db;
    const collection = database.collection('quizzes'); // Use your collection name here

    // Fetch the quiz from the MongoDB collection using the `quizId`
    const response = await collection.findOne({
      quizId: quizId,
      userId: userId,
    });

    if (!response) {
      return new Response(
        JSON.stringify({
          success: false,
          statusCode: 404,
          message: `No quiz found with quizId: ${quizId}`,
          data: null,
          error: {
            code: 404,
            message: `No quiz found with quizId: ${quizId}`,
          },
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Return the quiz data as a JSON response
    return new Response(
      JSON.stringify({
        success: true,
        statusCode: 200,
        message: 'Quiz fetched successfully',
        data: response,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    // Handle any errors that occur during the process
    return new Response(
      JSON.stringify({
        success: false,
        statusCode: 500,
        message: 'Failed to fetch quiz',
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
