import { HfInference } from '@huggingface/inference';

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import logger from '@/lib/logger/winston';
import { db } from '@/lib/mongo/client';
import { generateUUIDv4 } from '@/lib/utils/generateUUID';

interface GenerateQuizRequest {
    input: string | FileInput;
    inputType: 'text' | 'link' | 'file';
    numberOfQuestions: number;
    model?: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'God Mode';
    userId: string;
}

interface FileInput {
    name: string;
    type: string;
    url: string;
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
    You are an AI assistant specialized in creating educational content. Your task is to generate a single, well-structured JSON object for a quiz based on the provided input text.

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
        {"error": "Input text must be at least 500 words to generate a quiz."}
    - **Question Structure**:
        - Each question should include:
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
        {
            "title": "Generated Title",
            "description": "Generated Description",
            "difficulty": "Medium",
            "topic": "Main Topic",
            "tags": ["Tag1", "Tag2"],
            "questions": [
                {
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
        - Ensure the JSON is **valid** and properly formatted.
        - **Do not include any text outside of the JSON format.**
        - **Do not include multiple JSON objects or any additional text. Ensure that all questions are contained within the "questions" array of the JSON object.**

    **Input Text:**

    ${text}

    **Output only valid JSON. Do not include multiple JSON objects or any additional text. Ensure that all questions are contained within the "questions" array of the JSON object.**
  `;
};
const formatJson = (
    jsonString: string,
): LLMResponse | { error: string } | null => {
    try {
        jsonString = jsonString.replace(/```json|```/g, '');

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
                return {
                    error: `Invalid JSON structure: Missing '${field}' field.`,
                };
            }
        }

        if (!Array.isArray(jsonData.questions)) {
            return {
                error: "Invalid JSON format: 'questions' should be a list.",
            };
        }

        for (const item of jsonData.questions) {
            if (!item.id) {
                item.id = uuidv4();
            }
            if (
                !item.type ||
                ![
                    'multiple-choice',
                    'true/false',
                    'fill-in-the-blank',
                ].includes(item.type)
            ) {
                return {
                    error: `Invalid question type: '${item.type}' is not allowed.`,
                };
            }
            if (
                !item.question ||
                !item.options ||
                !item.answer ||
                !item.explanation ||
                !item.tags
            ) {
                return {
                    error: `Invalid question structure: Missing required fields in question.`,
                };
            }
        }

        jsonData.questions.forEach((question: QuizQuestion) => {
            question.id = generateUUIDv4();
        });

        return jsonData as LLMResponse;
    } catch (e) {
        return { error: 'Error while parsing JSON response.' };
    }
};

const generateLLMResponse = async (
    prompt: string,
    retries: number = 3,
): Promise<LLMResponse | { error: string } | null> => {
    const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            let fullResponse = '';

            const inferenceResponse = inference.chatCompletionStream({
                model: 'meta-llama/Llama-3.2-3B-Instruct',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                max_tokens: 2048,
            });

            for await (const chunk of inferenceResponse) {
                if (chunk.choices && chunk.choices.length > 0) {
                    const newContent = chunk.choices[0].delta.content;
                    fullResponse += newContent;
                }
            }

            logger.info(`LLM Response (Attempt ${attempt}): ${fullResponse}`);

            const formattedData = formatJson(fullResponse);
            if (formattedData && !('error' in formattedData)) {
                return formattedData;
            } else if (formattedData && 'error' in formattedData) {
                logger.error(
                    `LLM Error (Attempt ${attempt}): ${formattedData.error}`,
                );
                return formattedData;
            } else {
                throw new Error('Formatted data is null or contains errors.');
            }
        } catch (error: any) {
            logger.error(
                `LLM Generation Error (Attempt ${attempt}): ${error.message}`,
            );
            if (attempt === retries) {
                return {
                    error: 'Failed to generate a valid response from the Hugging Face Inference API after multiple attempts.',
                };
            }
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
    }

    return {
        error: 'Failed to generate a valid response from the Hugging Face Inference API after multiple attempts.',
    };
};

export async function POST(req: NextRequest) {
    try {
        const data: GenerateQuizRequest = await req.json();

        const {
            userId,
            input,
            inputType,
            numberOfQuestions,
            difficulty,
            model = 'meta-llama/Llama-3.2-3B-Instruct',
        } = data;
        logger.info(
            `Received quiz generation request: ${JSON.stringify(data)}`,
        );

        // Validate userId
        if (!userId || typeof userId !== 'string') {
            logger.warn("Invalid or missing 'userId' field.");
            return NextResponse.json(
                {
                    success: false,
                    statusCode: 400,
                    message: "Invalid or missing 'userId' field.",
                    data: null,
                    error: {
                        code: 400,
                        message: "Invalid or missing 'userId' field.",
                    },
                },
                { status: 400 },
            );
        }

        // Validate numberOfQuestions
        if (
            typeof numberOfQuestions !== 'number' ||
            !Number.isInteger(numberOfQuestions) ||
            numberOfQuestions <= 0
        ) {
            logger.warn("Invalid 'numberOfQuestions' field.");
            return NextResponse.json(
                {
                    success: false,
                    statusCode: 400,
                    message:
                        "Invalid 'numberOfQuestions' field. It must be a positive integer.",
                    data: null,
                    error: {
                        code: 400,
                        message:
                            "Invalid 'numberOfQuestions' field. It must be a positive integer.",
                    },
                },
                { status: 400 },
            );
        }

        // Validate difficulty
        const validDifficulties = ['Easy', 'Medium', 'Hard', 'God Mode'];
        if (!validDifficulties.includes(difficulty)) {
            logger.warn("Invalid 'difficulty' field.");
            return NextResponse.json(
                {
                    success: false,
                    statusCode: 400,
                    message: `Invalid 'difficulty' field. Must be one of ${validDifficulties.join(
                        ', ',
                    )}.`,
                    data: null,
                    error: {
                        code: 400,
                        message: `Invalid 'difficulty' field. Must be one of ${validDifficulties.join(
                            ', ',
                        )}.`,
                    },
                },
                { status: 400 },
            );
        }

        let processedText = '';
        if (inputType === 'text') {
            if (typeof input !== 'string') {
                logger.warn("Invalid 'input' field for 'text' inputType.");
                return NextResponse.json(
                    {
                        success: false,
                        statusCode: 400,
                        message:
                            "Invalid 'input' field. Expected a string for 'text' inputType.",
                        data: null,
                        error: {
                            code: 400,
                            message:
                                "Invalid 'input' field. Expected a string for 'text' inputType.",
                        },
                    },
                    { status: 400 },
                );
            }
            processedText = input;
        } else if (inputType === 'file') {
            if (typeof input !== 'object' || !('url' in input)) {
                logger.warn("Invalid 'input' field for 'file' inputType.");
                return NextResponse.json(
                    {
                        success: false,
                        statusCode: 400,
                        message:
                            "Invalid 'input' field. Expected an object with 'name', 'type', and 'url' for 'file' inputType.",
                        data: null,
                        error: {
                            code: 400,
                            message:
                                "Invalid 'input' field. Expected an object with 'name', 'type', and 'url' for 'file' inputType.",
                        },
                    },
                    { status: 400 },
                );
            }

            const fileInput = input as FileInput;

            if (
                !fileInput.name ||
                !fileInput.type ||
                !fileInput.url ||
                typeof fileInput.name !== 'string' ||
                typeof fileInput.type !== 'string' ||
                typeof fileInput.url !== 'string'
            ) {
                logger.warn("Invalid 'file' input data.");
                return NextResponse.json(
                    {
                        success: false,
                        statusCode: 400,
                        message:
                            "Invalid 'file' input. 'name', 'type', and 'url' must be non-empty strings.",
                        data: null,
                        error: {
                            code: 400,
                            message:
                                "Invalid 'file' input. 'name', 'type', and 'url' must be non-empty strings.",
                        },
                    },
                    { status: 400 },
                );
            }

            // Fetch the file content from the URL
            try {
                logger.info(`Fetching file content from URL: ${fileInput.url}`);
                const fileResponse = await fetch(fileInput.url);
                if (!fileResponse.ok) {
                    throw new Error(
                        'Failed to fetch the file from the provided URL.',
                    );
                }
                const fileContent = await fileResponse.text();
                processedText = fileContent;
            } catch (fileError: any) {
                logger.error('Error processing file input:', fileError);
                return NextResponse.json(
                    {
                        success: false,
                        statusCode: 400,
                        message:
                            fileError.message ||
                            'Failed to process the file input.',
                        data: null,
                        error: {
                            code: 400,
                            message:
                                fileError.message ||
                                'Failed to process the file input.',
                        },
                    },
                    { status: 400 },
                );
            }
        } else if (inputType === 'link') {
            if (typeof input !== 'string') {
                logger.warn("Invalid 'input' field for 'link' inputType.");
                return NextResponse.json(
                    {
                        success: false,
                        statusCode: 400,
                        message:
                            "Invalid 'input' field. Expected a string URL for 'link' inputType.",
                        data: null,
                        error: {
                            code: 400,
                            message:
                                "Invalid 'input' field. Expected a string URL for 'link' inputType.",
                        },
                    },
                    { status: 400 },
                );
            }

            // Fetch the content from the link
            try {
                logger.info(`Fetching content from link: ${input}`);
                const linkResponse = await fetch(input);
                if (!linkResponse.ok) {
                    throw new Error(
                        'Failed to fetch content from the provided link.',
                    );
                }
                const linkContent = await linkResponse.text();
                processedText = linkContent;
            } catch (linkError: any) {
                logger.error('Error processing link input:', linkError);
                return NextResponse.json(
                    {
                        success: false,
                        statusCode: 400,
                        message:
                            linkError.message ||
                            'Failed to process the link input.',
                        data: null,
                        error: {
                            code: 400,
                            message:
                                linkError.message ||
                                'Failed to process the link input.',
                        },
                    },
                    { status: 400 },
                );
            }
        } else {
            logger.warn(`Unsupported 'inputType': ${inputType}`);
            return NextResponse.json(
                {
                    success: false,
                    statusCode: 400,
                    message: `Unsupported 'inputType': ${inputType}`,
                    data: null,
                    error: {
                        code: 400,
                        message: `Unsupported 'inputType': ${inputType}`,
                    },
                },
                { status: 400 },
            );
        }

        // Validate word count (500 words)
        const wordCount = processedText.split(/\s+/).length;
        logger.info(`Processed text word count: ${wordCount}`);
        if (wordCount < 500) {
            logger.warn(
                'Input text does not meet the minimum word count requirement.',
            );
            return NextResponse.json(
                {
                    success: false,
                    statusCode: 400,
                    message:
                        'Input text must be at least 500 words to generate a quiz.',
                    data: null,
                    error: {
                        code: 400,
                        message:
                            'Input text must be at least 500 words to generate a quiz.',
                    },
                },
                { status: 400 },
            );
        }

        const prompt = buildPrompt(
            processedText,
            numberOfQuestions,
            difficulty,
        );
        logger.info('Prompt for LLM generation:', prompt);

        const llmResult = await generateLLMResponse(prompt);

        if (!llmResult) {
            logger.error('LLM failed to generate a response.');
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
            logger.error(`LLM Error: ${llmResult.error}`);
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
                type: inputType,
            },
            model,
            quiz: {
                numberOfQuestions,
                ...llmResult,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        try {
            const database = await db;
            const collection = database.collection('quizzes');
            await collection.insertOne(quizData);
            logger.info(`Quiz saved to database with ID: ${quizData.quizId}`);
        } catch (dbError: any) {
            logger.error('Database insertion error:', dbError);
            return NextResponse.json(
                {
                    success: false,
                    statusCode: 500,
                    message: 'Failed to save quiz to the database.',
                    data: null,
                    error: {
                        code: 500,
                        message: 'Failed to save quiz to the database.',
                    },
                },
                { status: 500 },
            );
        }

        logger.info(`Quiz generated successfully with ID: ${quizData.quizId}`);
        return NextResponse.json(
            {
                success: true,
                statusCode: 200,
                message: 'Quiz generated successfully.',
                data: quizData,
                error: {
                    code: null,
                    message: null,
                },
            },
            { status: 200 },
        );
    } catch (error: any) {
        logger.error('Unexpected server error:', error);
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
