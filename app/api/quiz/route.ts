import { db } from '@/lib/mongo/client';

export async function GET(request: Request) {
  try {
  
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const page = parseInt(url.searchParams.get('page') ?? '1'); // Default to page 1
    const limit = parseInt(url.searchParams.get('limit') ?? '10'); // Default to 10 items per page

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
      return new Response(
        JSON.stringify({
          error:
            'Invalid pagination parameters. Page and limit must be positive integers.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Calculate the number of documents to skip based on the page and limit
    const skip = (page - 1) * limit;

    // Connect to the database and select the quizzes collection
    const database = await db;
    const collection = database.collection('quizzes');

    // Fetch the total count of quizzes for this user
    const totalQuizzes = await collection.countDocuments({ userId });

    // Fetch the quizzes for the given userId, with pagination
    const userQuizzes = await collection
      .find({ userId })
      .skip(skip)
      .limit(limit)
      .toArray();

    // If no quizzes are found, return a 404 response
    if (userQuizzes.length === 0) {
      return new Response(
        JSON.stringify({
          error: `No quizzes found for userId: ${userId} on page ${page}`,
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Return the list of quizzes along with pagination details
    return new Response(
      JSON.stringify({
        quizzes: userQuizzes,
        totalQuizzes,
        currentPage: page,
        totalPages: Math.ceil(totalQuizzes / limit),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    // Return a standard error response for unexpected server errors
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
