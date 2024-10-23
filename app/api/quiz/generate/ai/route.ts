import { env } from '@/env';
import { HfInference } from '@huggingface/inference';

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/lib/mongo/client';
import { generateUUIDv4 } from '@/lib/utils/generateUUID';

// Define the shape of the request payload
interface GenerateQuizRequest {
  input: string;
  numberOfQuestions?: number;
  model?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'God Mode';
  userId: string;
}

// Define the shape of the quiz response
interface QuizResponse {
  model: string;
  quiz: {
    numberOfQuestions: number;
    title: string;
    description: string;
    difficulty: string;
    topic: string;
    tags: string[];
    questions: QuizQuestion[];
  };
}

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true/false' | 'fill-in-the-blank';
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  tags: string[];
}

// Define the shape of the LLM response
interface LLMResponse {
  title: string;
  description: string;
  difficulty: string;
  topic: string;
  tags: string[];
  questions: QuizQuestion[];
}

// Utility function to build the prompt
const buildPrompt = (
  text: string,
  numberOfQuestions: number,
  difficulty: string,
): string => {
  return `
    You are an AI assistant specialized in creating educational content. Your task is to generate a single, structured JSON object for a quiz based on the provided input text.

    **Instructions:**

    - **Quiz Generation**:
        - Generate a quiz with **exactly ${numberOfQuestions}** questions.
        - The questions should be based on the **key themes, details, and complexities** of the input text.
        - **Question Types**: Include a mix of the following question types:
            - **Multiple-choice (MCQ)**: One correct answer and three plausible distractors (total of four options).
            - **True/False**: Statements that are either true or false, with options "True" and "False".
            - **Fill-in-the-Blank**: Sentences with a missing word or phrase, provided with four options to choose from.
    - **Difficulty Level**:
        - The quiz should match the selected difficulty level: **${difficulty}**.
            - **Easy**: Basic facts and straightforward concepts.
            - **Medium**: Detailed understanding and slight inference.
            - **Hard**: Deep understanding and critical thinking.
            - **God Mode**: Complex analysis and synthesis of ideas.
    - **Metadata**:
        - Include the following at the top level of the JSON:
            - \`"title"\`: A concise, generated title based on the input content.
            - \`"description"\`: A brief description generated from the input content.
            - \`"difficulty"\`: The selected difficulty level ("${difficulty}").
            - \`"topic"\`: The main topic or subject area of the input content.
            - \`"tags"\`: A list of relevant tags related to the input content.
            - \`"questions"\`: An array containing the generated questions.

    **Rules:**

    - **Number of Questions**:
        - Use the **number of questions specified by the user**: **${numberOfQuestions}**.
        - Do not exceed this number, even if the input text is long.
    - **Input Length Validation**:
        - If the input text is **under 500 words**, do not generate a quiz. Instead, return the following JSON:
        \`\`\`json
        {"error": "Input text must be at least 500 words to generate a quiz."}
        \`\`\`
    - **Question Structure**:
        - Each question should include:
            - \`"id"\`: A unique identifier (use UUID v4).
            - \`"type"\`: One of \`"multiple-choice"\`, \`"true/false"\`, \`"fill-in-the-blank"\`.
            - \`"question"\`: The text of the question.
            - \`"options"\`: A list of options:
                - **For MCQ and Fill-in-the-Blank**: Four options to choose from.
                - **For True/False**: ["True", "False"].
            - \`"answer"\`: The correct answer text (must match one of the options).
            - \`"explanation"\`: A brief explanation for the answer.
            - \`"tags"\`: Relevant tags for the question.
    - **Output Format**:
        - **Return only a single JSON object** that encapsulates all metadata and questions.
        - The JSON structure should be as follows:
        \`\`\`json
        {
            "title": "Generated Title",
            "description": "Generated Description",
            "difficulty": "Medium",
            "topic": "Main Topic",
            "tags": ["Tag1", "Tag2"],
            "questions": [
                {
                    "id": "UUID v4",
                    "type": "multiple-choice",
                    "question": "Question 1?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "answer": "Option A",
                    "explanation": "Explanation for Option A.",
                    "tags": ["Tag1"]
                },
                ...
            ]
        }
        \`\`\`
        - Ensure the JSON is **valid** and properly formatted.
        - **Do not include any text outside of the JSON format.**

    **Input Text:**

    ${text}

    **Output only valid JSON. Do not include multiple JSON objects or any additional text. Ensure that all questions are contained within the "questions" array of the JSON object.**
  `;
};

// Utility function to format and validate JSON
const formatJson = (
  jsonString: string,
): LLMResponse | { error: string } | null => {
  try {
    // Attempt to find the single JSON object in the response
    const jsonMatch = jsonString.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) {
      console.error('No valid JSON object found in the response.');
      return { error: 'No valid JSON object found in the response.' };
    }

    const cleanJsonString = jsonMatch[1].trim(); // Extract and strip whitespace

    console.log(`Extracted JSON string: ${cleanJsonString}`);

    // Parse the cleaned JSON
    const jsonData = JSON.parse(cleanJsonString);

    // Check if it's an error response
    if ('error' in jsonData) {
      return jsonData;
    }

    // Validate required metadata fields
    const requiredMetadata = [
      'title',
      'description',
      'difficulty',
      'topic',
      'tags',
      'questions',
    ];
    for (const field of requiredMetadata) {
      if (!(field in jsonData)) {
        console.error(`Invalid JSON structure: Missing '${field}' field.`);
        return { error: `Invalid JSON structure: Missing '${field}' field.` };
      }
    }

    // Validate 'questions' field
    if (!Array.isArray(jsonData.questions)) {
      console.error("Invalid JSON format: 'questions' should be a list.");
      return { error: "Invalid JSON format: 'questions' should be a list." };
    }

    // Add a unique 'id' to each question if not already present
    for (const item of jsonData.questions) {
      if (!item.id) {
        item.id = uuidv4();
      }
    }

    return jsonData as LLMResponse;
  } catch (e) {
    console.error(`Error while parsing JSON: ${e}`);
    return null;
  }
};

// Function to generate LLM response with retries using Hugging Face Inference API
const generateLLMResponse = async (
  prompt: string,
  retries: number = 3,
): Promise<LLMResponse | { error: string } | null> => {
  const inference = new HfInference(env.HUGGINGFACE_API_KEY);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(
        `Attempt ${attempt}: Sending prompt to Hugging Face Inference API.`,
      );

      let fullResponse = '';
      for await (const chunk of inference.chatCompletionStream({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096,
      })) {
        fullResponse += chunk.choices[0]?.delta?.content || '';
      }

      console.log(`Raw Hugging Face API response: ${fullResponse}`);

      const formattedData = formatJson(fullResponse);
      if (formattedData) {
        return formattedData;
      } else {
        throw new Error('Formatted data is null.');
      }
    } catch (error) {
      console.error(`Error on attempt ${attempt}: ${(error as Error).message}`);
      if (attempt === retries) {
        return {
          error:
            'Failed to generate a valid response from the Hugging Face Inference API after multiple attempts.',
        };
      }
    }
  }

  console.error('All attempts to generate Hugging Face response failed.');
  return null;
};

// The main API handler
export async function POST(req: NextRequest) {
  try {
    const data: GenerateQuizRequest = await req.json();

    console.log(`Received request with payload: ${JSON.stringify(data)}`);

    // Validate input fields
    const {
      input,
      numberOfQuestions = 5,
      model = 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      difficulty = 'Easy',
      userId,
    } = data;

    if (!input || typeof input !== 'string') {
      console.error("Invalid or missing 'input' field.");
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: "Invalid or missing 'input' field.",
          data: null,
          error: {
            code: 400,
            message: "Invalid or missing 'input' field.",
          },
        },
        { status: 400 },
      );
    }

    if (typeof numberOfQuestions !== 'number' || numberOfQuestions <= 0) {
      console.error("Invalid 'numberOfQuestions' field.");
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: "Invalid 'numberOfQuestions' field.",
          data: null,
          error: {
            code: 400,
            message: "Invalid 'numberOfQuestions' field.",
          },
        },
        { status: 400 },
      );
    }

    // Build the prompt
    const prompt = buildPrompt(input, numberOfQuestions, difficulty);
    console.log(`Built prompt: ${prompt}`);

    // Generate LLM response using Hugging Face Inference API
    const llmResult = await generateLLMResponse(prompt);

    if (!llmResult) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 500,
          message:
            'Failed to generate or parse the response from the language model.',
          data: null,
          error: {
            code: 500,
            message:
              'Failed to generate or parse the response from the language model.',
          },
        },
        { status: 500 },
      );
    }

    if ('error' in llmResult) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: llmResult.error,
          data: null,
          error: {
            code: 400,
            message: llmResult.error,
          },
        },
        { status: 400 },
      );
    }

    // Construct the quiz data
    const quizData = {
      quizId: generateUUIDv4(),
      userId,
      input: {
        data: input,
        type: 'text', // Assuming input type is always text, adjust if needed
      },
      model,
      quiz: {
        numberOfQuestions,
        ...llmResult,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to MongoDB
    const database = await db;
    const collection = database.collection('quizzes');
    await collection.insertOne(quizData);

    console.log(
      `Successfully generated and saved quiz: ${JSON.stringify(quizData)}`,
    );

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: 'Quiz generated successfully',
        data: quizData,
        error: {
          code: null,
          message: null,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Unexpected error: ${(error as Error).message}`);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: 'An unexpected error occurred.',
        data: null,
        error: {
          code: 500,
          message: 'An unexpected error occurred.',
        },
      },
      { status: 500 },
    );
  }
}
