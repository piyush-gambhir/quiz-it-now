export async function POST(request: Request) {
  try {
    // Destructure input values from the incoming request
    const { input, inputType, numberOfQuestions } = await request.json();

    // Validate required fields
    if (!input || !inputType || !numberOfQuestions) {
      return new Response(
        JSON.stringify({
          error:
            'Missing required fields: input, inputType, or numberOfQuestions',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Make the API call to the external service
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

    // Parse and return the response data
    const data = await response.json();
    return new Response(JSON.stringify({ data: data || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Catch and return any errors that occur during the process
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
