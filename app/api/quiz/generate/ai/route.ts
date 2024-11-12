import { env } from '@/env';
import { HfInference } from '@huggingface/inference';

import multer from 'multer';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/lib/mongo/client';
import { generateUUIDv4 } from '@/lib/utils/generateUUID';

interface GenerateQuizRequest {
  input: any;
  inputType?: 'text' | 'url' | 'file';
  numberOfQuestions?: number;
  model?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'God Mode';
  userId: string;
}

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

interface LLMResponse {
  title: string;
  description: string;
  difficulty: string;
  topic: string;
  tags: string[];
  questions: QuizQuestion[];
}

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

const formatJson = (
  jsonString: string,
): LLMResponse | { error: string } | null => {
  try {
    const jsonMatch = jsonString.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) {
      return { error: 'No valid JSON object found in the response.' };
    }

    const cleanJsonString = jsonMatch[1].trim();

    const jsonData = JSON.parse(cleanJsonString);

    if ('error' in jsonData) {
      return jsonData;
    }

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
        return { error: `Invalid JSON structure: Missing '${field}' field.` };
      }
    }

    if (!Array.isArray(jsonData.questions)) {
      return { error: "Invalid JSON format: 'questions' should be a list." };
    }

    for (const item of jsonData.questions) {
      if (!item.id) {
        item.id = uuidv4();
      }
    }

    return jsonData as LLMResponse;
  } catch (e) {
    return null;
  }
};

const generateLLMResponse = async (
  prompt: string,
  retries: number = 3,
): Promise<LLMResponse | { error: string } | null> => {
  const inference = new HfInference(env.HUGGINGFACE_API_KEY);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      let fullResponse = '';
      for await (const chunk of inference.chatCompletionStream({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: null,
      })) {
        fullResponse += chunk.choices[0]?.delta?.content || '';
      }

      const formattedData = formatJson(fullResponse);
      if (formattedData) {
        return formattedData;
      } else {
        throw new Error('Formatted data is null.');
      }
    } catch (error) {
      if (attempt === retries) {
        return {
          error:
            'Failed to generate a valid response from the Hugging Face Inference API after multiple attempts.',
        };
      }
    }
  }

  return null;
};

export async function POST(req: NextRequest) {
  try {
    const data: GenerateQuizRequest = await req.json();

    const input = data.input;
    const inputType = data.inputType || 'text';
    const numberOfQuestions = data.numberOfQuestions || 5;
    const model = data.model || 'mistralai/Mixtral-8x7B-Instruct-v0.1';
    const difficulty = data.difficulty || 'Easy';
    const userId = data.userId;

    if (!input) {
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

    if (inputType === 'file') {
      const file = input;
      
    }

    const prompt = buildPrompt(input, numberOfQuestions, difficulty);

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

    const quizData = {
      quizId: generateUUIDv4(),
      userId,
      input: {
        data: input,
        type: 'text',
      },
      model,
      quiz: {
        numberOfQuestions,
        ...llmResult,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const database = await db;
    const collection = database.collection('quizzes');
    await collection.insertOne(quizData);

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
