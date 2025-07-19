import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import {
    ChatMessage,
    getChatCompletion as getNvidiaChatCompletion,
} from '@/helpers/nvidia';
import {
    generateQuizFormHTMLPrompt,
    generateQuizFormTextPrompt,
    generateQuizFromTranscriptPrompt,
} from '@/helpers/prompts/generateQuizPrompts';

import logger from '@/lib/logger/winston';
import { db } from '@/lib/mongo/client';
import { generateUUIDv4 } from '@/lib/utils/generate-uuid';

const fileInputSchema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    url: z.string().url(),
});

const generateQuizRequestSchema = z.object({
    userId: z.string().min(1),
    input: z.union([z.string(), fileInputSchema, z.string().url()]),
    inputType: z.enum(['text', 'file', 'link']),
    numberOfQuestions: z.number().int().positive().default(5),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'God Mode']).default('Easy'),
    model: z.string().default('nvidia/llama-3.1-nemotron-70b-instruct'),
});

type GenerateQuizRequest = z.infer<typeof generateQuizRequestSchema>;

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

const formatJson = (
    jsonString: string,
): LLMResponse | { error: string } | null => {
    try {
        logger.debug('Starting JSON formatting');
        jsonString = jsonString.replace(/```json|```/g, '');

        const jsonRegex = /(\{[\s\S]*\})/;
        const jsonMatch = jsonRegex.exec(jsonString);
        if (!jsonMatch) {
            logger.warn('No valid JSON object found in response');
            return { error: 'No valid JSON object found in the response.' };
        }

        const cleanJsonString = jsonMatch[1].trim();
        logger.debug('Cleaned JSON string:', cleanJsonString);

        const jsonData = JSON.parse(cleanJsonString);
        logger.debug('Successfully parsed JSON data');

        if ('error' in jsonData) {
            logger.warn('Error found in JSON data:', jsonData.error);
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
                logger.warn(`Missing required field in JSON: ${field}`);
                return {
                    error: `Invalid JSON structure: Missing '${field}' field.`,
                };
            }
        }

        if (!Array.isArray(jsonData.questions)) {
            logger.warn('Questions field is not an array');
            return {
                error: "Invalid JSON format: 'questions' should be a list.",
            };
        }

        for (const item of jsonData.questions) {
            if (!item.id) {
                logger.debug('Generating missing question ID');
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
                logger.warn(`Invalid question type found: ${item.type}`);
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
                logger.warn('Question missing required fields');
                return {
                    error: `Invalid question structure: Missing required fields in question.`,
                };
            }
        }

        jsonData.questions.forEach((question: QuizQuestion) => {
            question.id = generateUUIDv4();
            logger.debug(`Generated UUID for question: ${question.id}`);
        });

        logger.info('Successfully formatted and validated JSON response');
        return jsonData as LLMResponse;
    } catch (e) {
        logger.error('Error while parsing JSON response:', e);
        return { error: 'Error while parsing JSON response.' };
    }
};

const generateLLMResponse = async (
    prompt: string,
    retries: number = 3,
): Promise<LLMResponse | { error: string } | null> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            logger.info(`Starting LLM generation attempt ${attempt}`);
            let fullResponse = '';

            const model = 'nvidia/llama-3.1-nemotron-70b-instruct';
            const messages: ChatMessage[] = [{ role: 'user', content: prompt }];

            logger.debug(`Using model: ${model}`);
            for await (const text of getNvidiaChatCompletion(model, messages)) {
                fullResponse += text;
            }

            logger.info(`LLM Response (Attempt ${attempt}): ${fullResponse}`);

            const formattedData = formatJson(fullResponse);
            if (formattedData && !('error' in formattedData)) {
                logger.info(
                    'Successfully generated and formatted LLM response',
                );
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
                    error: 'Failed to generate a valid response from the LLM.',
                };
            }
            logger.info(`Retrying in ${1000 * attempt}ms`);
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
    }

    logger.error('Failed to generate valid response after all retries');
    return {
        error: 'Failed to generate a valid response from the Hugging Face Inference API after multiple attempts.',
    };
};

export async function POST(req: NextRequest) {
    try {
        logger.info('Received POST request for quiz generation');
        const data: GenerateQuizRequest = await req.json();

        try {
            logger.debug('Validating request data with Zod schema');
            generateQuizRequestSchema.parse(data); // This will throw an error if validation fails
        } catch (error) {
            if (error instanceof z.ZodError) {
                logger.warn('Validation error:', error.errors[0].message);
                return NextResponse.json(
                    {
                        success: false,

                        error: {
                            message: error.errors[0].message,
                            type: 'VALIDATION_ERROR',
                            code: 'VALIDATION_ERROR',
                            params: null,
                        },
                    },
                    { status: 400 },
                );
            }
        }

        const {
            userId,
            input,
            inputType,
            numberOfQuestions,
            difficulty,
            model,
        } = data;

        logger.info(
            `Received quiz generation request: ${JSON.stringify(data)}`,
        );

        let processedText = '';
        let processedHtml = '';
        let processedTranscript = '';
        if (inputType === 'text') {
            logger.debug('Processing text input');
            processedText = input as string;
        } else if (inputType === 'file') {
            logger.debug('Processing file input');
            const fileInput = input as z.infer<typeof fileInputSchema>;
            try {
                if (fileInput.type.includes('pdf')) {
                    logger.debug('Processing PDF file');
                    const pdf_to_text_url = new URL(
                        `${process.env.DATA_SCRAPING_BACKEND_URL}/data-scraper/api/v1/pdf/to_text`,
                    );
                    const pdfResponse = await fetch(pdf_to_text_url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            pdf_url: fileInput.url,
                        }),
                    });

                    if (!pdfResponse.ok) {
                        throw new Error('Failed to convert PDF to text.');
                    }

                    const pdfData = await pdfResponse.json();
                    if (!pdfData.success) {
                        throw new Error(
                            pdfData.error || 'Failed to process PDF file.',
                        );
                    }

                    processedText = pdfData.data.text;
                    logger.debug('Successfully processed PDF content');
                } else {
                    logger.info(
                        `Fetching file content from URL: ${fileInput.url}`,
                    );
                    const fileResponse = await fetch(fileInput.url);
                    if (!fileResponse.ok) {
                        throw new Error(
                            'Failed to fetch the file from the provided URL.',
                        );
                    }
                    const fileContent = await fileResponse.text();
                    processedText = fileContent;
                    logger.debug('Successfully processed file content');
                }
            } catch (fileError: any) {
                logger.error('File processing error:', fileError);
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            message:
                                fileError.message ||
                                'Failed to process the file input.',
                            type: 'VALIDATION_ERROR',
                            code: 'FILE_INPUT_ERROR',
                            params: null,
                        },
                    },
                    { status: 400 },
                );
            }
        } else if (inputType === 'link') {
            const inputUrl = input as string;
            if (inputUrl.includes('youtube.com/watch?v=')) {
                logger.debug('Processing YouTube link');
                try {
                    const get_youtube_transcript_url = new URL(
                        `${process.env.DATA_SCRAPING_BACKEND_URL}/data-scraper/api/v1/youtube/transcript`,
                    );
                    get_youtube_transcript_url.searchParams.set(
                        'url',
                        inputUrl,
                    );
                    const response = await fetch(
                        get_youtube_transcript_url,
                    ).then((res) => res.json());
                    if (!response.success) {
                        throw new Error(response.error);
                    }
                    const transcript = response.data.transcript;
                    processedTranscript += transcript;
                    logger.debug('Successfully fetched YouTube transcript');
                } catch (error: any) {
                    logger.error('YouTube transcript fetch error:', error);
                    return NextResponse.json(
                        {
                            success: false,
                            error: {
                                message:
                                    error.message ||
                                    'Failed to fetch the YouTube transcript.',
                                type: 'API_ERROR',
                                code: 'YOUTUBE_TRANSCRIPT_API_ERROR',
                                params: null,
                            },
                        },
                        { status: 400 },
                    );
                }
            } else {
                logger.debug('Processing web page link');
                try {
                    const scrape_html_url = new URL(
                        `${process.env.DATA_SCRAPING_BACKEND_URL}/data-scraper/api/v1/scrape/html`,
                    );
                    scrape_html_url.searchParams.set('url', inputUrl);
                    scrape_html_url.searchParams.set('clean', 'true');
                    const response = await fetch(scrape_html_url);

                    if (!response.ok) {
                        throw new Error(
                            'Failed to fetch content from the scraping service.',
                        );
                    }

                    const data = await response.json();
                    if (!data.success) {
                        throw new Error(
                            data.error.message ||
                                'Failed to scrape content from the provided link.',
                        );
                    }

                    processedHtml = data.data.html;
                    logger.debug('Successfully scraped web page content');
                } catch (error: any) {
                    logger.error('Web scraping error:', error);
                    return NextResponse.json(
                        {
                            success: false,
                            error: {
                                message: error.error.message,
                                type: 'API_ERROR',
                                code: 'SCRAPING_API_ERROR',
                                params: null,
                            },
                        },
                        { status: 400 },
                    );
                }
            }
        } else {
            logger.warn(`Unsupported 'inputType': ${inputType}`);
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: `Unsupported 'inputType': ${inputType}`,
                        type: 'VALIDATION_ERROR',
                        code: 'UNSUPPORTED_INPUT_TYPE',
                        params: null,
                    },
                },
                { status: 400 },
            );
        }

        let prompt = '';
        if (processedHtml) {
            logger.debug('Generating prompt from HTML content');
            prompt = generateQuizFormHTMLPrompt(
                processedHtml,
                numberOfQuestions,
                difficulty,
            );
        } else if (processedTranscript) {
            logger.debug('Generating prompt from transcript');
            prompt = generateQuizFromTranscriptPrompt(
                processedTranscript,
                numberOfQuestions,
                difficulty,
            );
        } else {
            const wordCount = processedText.split(/\s+/).length;
            logger.info(`Processed text word count: ${wordCount}`);
            if (wordCount < 250) {
                logger.warn(
                    'Input text does not meet the minimum word count requirement.',
                );
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            message:
                                'Input text must be at least 250 words to generate a quiz.',
                            type: 'VALIDATION_ERROR',
                            code: 'MINIMUM_WORD_COUNT_ERROR',
                            params: null,
                        },
                    },
                    { status: 400 },
                );
            }
            logger.debug('Generating prompt from text content');
            prompt = generateQuizFormTextPrompt(
                processedText,
                numberOfQuestions,
                difficulty,
            );
        }

        logger.info('Prompt for LLM generation:', prompt);

        const llmResult = await generateLLMResponse(prompt);

        if (!llmResult) {
            logger.error('LLM failed to generate a response.');
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message:
                            'Failed to generate or parse the response from the language model.',
                        type: 'LLM_ERROR',
                        code: 'LLM_GENERATION_ERROR',
                        params: null,
                    },
                },
                { status: 500 },
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
            logger.debug('Connecting to database');
            const database = await db;
            const collection = database.collection('quizzes');
            await collection.insertOne(quizData);
            logger.info(`Quiz saved to database with ID: ${quizData.quizId}`);
        } catch (dbError: any) {
            logger.error('Database insertion error:', dbError);
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        type: 'DATABASE_ERROR',
                        code: 'DATABASE_INSERTION_ERROR',
                        params: null,
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
                message: 'Quiz generated successfully.',
                data: quizData,
            },
            { status: 200 },
        );
    } catch (error: any) {
        logger.error('Unexpected server error:', error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'An unexpected error occurred.',
                    type: 'SERVER_ERROR',
                    code: 'SERVER_ERROR',
                    params: null,
                },
            },
            { status: 500 },
        );
    }
}
