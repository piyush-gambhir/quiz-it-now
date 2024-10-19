export async function GET() {
  try {
    const response = await fetch('http://127.0.0.1:8000/quiz-master/v1/models');

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          statusCode: response.status,
          message: 'Failed to fetch models',
          data: null,
          error: {
            code: response.status,
            message: response.statusText,
          },
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const responseData = await response.json();
    const models = responseData.data;
    return new Response(
      JSON.stringify({
        success: true,
        statusCode: 200,
        message: 'Models fetched successfully',
        data: {
          models: models,
        },
        error: {
          code: null,
          message: null,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        statusCode: 500,
        message: 'An unexpected error occurred',
        data: null,
        error: {
          code: 500,
          message: error.message || 'An unexpected error occurred',
        },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
