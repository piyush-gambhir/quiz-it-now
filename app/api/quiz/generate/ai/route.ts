import { generateObject } from 'ai';
import { NextRequest } from 'next/server';
import { z } from 'zod';

import {
    generateQuizFormHTMLPrompt,
    generateQuizFormTextPrompt,
    generateQuizFromTranscriptPrompt,
} from '@/helpers/prompts/generateQuizPrompts';
import { getDefaultNvidiaModel, getNvidiaChatModel } from '@/lib/ai/nvidia';
import { DEFAULT_OPEN_SOURCE_MODELS } from '@/lib/ai/nvidia-models';
import {
    generatedQuizSchema,
    sanitizeGeneratedQuiz,
} from '@/lib/ai/quiz-object-schema';
import logger from '@/lib/logger/winston';
import { Quiz } from '@/lib/models';
import { connectToDatabase } from '@/lib/mongo/client';
import {
    QuizDifficulty,
    QuizFileInput,
    QuizGenerationRequest,
    QuizInputType,
} from '@/lib/types/quiz';
import {
    createErrorResponse,
    createSuccessResponse,
    toNextResponse,
} from '@/lib/utils/api-response';
import { generateUUIDv4 } from '@/utils/generate-uuid';

const MIN_WORD_COUNT = 250;

const fileInputSchema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    url: z.string().url(),
});

const generateQuizRequestSchema = z
    .object({
        userId: z.string().min(1).optional().default('anonymous'),
        input: z.union([z.string().min(1), fileInputSchema]),
        inputType: z.enum(['text', 'file', 'link']),
        numberOfQuestions: z.number().int().min(3).max(25).default(5),
        difficulty: z
            .enum(['Easy', 'Medium', 'Hard', 'God Mode'])
            .default('Medium'),
        model: z.string().min(1).optional(),
    })
    .superRefine((value, ctx) => {
        if (value.inputType === 'file' && typeof value.input === 'string') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'File input must include a file object.',
                path: ['input'],
            });
        }

        if (
            (value.inputType === 'text' || value.inputType === 'link') &&
            typeof value.input !== 'string'
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `${value.inputType} input must be a string.`,
                path: ['input'],
            });
        }
    });

type ValidGenerateQuizRequest = z.infer<typeof generateQuizRequestSchema>;

function getWordCount(value: string) {
    return value.trim().split(/\s+/).filter(Boolean).length;
}

function getScraperBaseUrl() {
    if (!process.env.DATA_SCRAPING_BACKEND_URL) {
        throw new Error('DATA_SCRAPING_BACKEND_URL is required.');
    }

    return process.env.DATA_SCRAPING_BACKEND_URL;
}

async function parseJsonResponse(response: Response) {
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to fetch external content.');
    }

    return response.json();
}

async function extractTextFromFile(fileInput: QuizFileInput) {
    if (fileInput.type.includes('pdf')) {
        const scraperUrl = new URL(
            '/data-scraper/api/v1/pdf/to_text',
            getScraperBaseUrl(),
        );
        const response = await fetch(scraperUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdf_url: fileInput.url }),
        });
        const data = await parseJsonResponse(response);

        if (!data.success || !data.data?.text) {
            throw new Error('Failed to process PDF file.');
        }

        return data.data.text as string;
    }

    const response = await fetch(fileInput.url);
    if (!response.ok) {
        throw new Error('Failed to fetch the uploaded file.');
    }

    return response.text();
}

async function extractTranscriptFromYoutube(url: string) {
    const endpoint = new URL(
        '/data-scraper/api/v1/youtube/transcript',
        getScraperBaseUrl(),
    );
    endpoint.searchParams.set('url', url);

    const response = await fetch(endpoint);
    const data = await parseJsonResponse(response);

    if (!data.success || !data.data?.transcript) {
        throw new Error('Failed to fetch YouTube transcript.');
    }

    return data.data.transcript as string;
}

async function extractHtmlFromLink(url: string) {
    const endpoint = new URL(
        '/data-scraper/api/v1/scrape/html',
        getScraperBaseUrl(),
    );
    endpoint.searchParams.set('url', url);
    endpoint.searchParams.set('clean', 'true');

    const response = await fetch(endpoint);
    const data = await parseJsonResponse(response);

    if (!data.success || !data.data?.html) {
        throw new Error('Failed to scrape the provided URL.');
    }

    return data.data.html as string;
}

async function buildPrompt(payload: ValidGenerateQuizRequest) {
    if (payload.inputType === 'text') {
        const input = payload.input as string;
        return generateQuizFormTextPrompt(
            input,
            payload.numberOfQuestions,
            payload.difficulty,
        );
    }

    if (payload.inputType === 'file') {
        const fileInput = payload.input as QuizFileInput;
        const text = await extractTextFromFile(fileInput);

        if (getWordCount(text) < MIN_WORD_COUNT) {
            throw new Error(
                `Input text must be at least ${MIN_WORD_COUNT} words to generate a quiz.`,
            );
        }

        return generateQuizFormTextPrompt(
            text,
            payload.numberOfQuestions,
            payload.difficulty,
        );
    }

    const inputUrl = payload.input as string;
    if (inputUrl.includes('youtube.com/watch?v=')) {
        const transcript = await extractTranscriptFromYoutube(inputUrl);
        return generateQuizFromTranscriptPrompt(
            transcript,
            payload.numberOfQuestions,
            payload.difficulty,
        );
    }

    const html = await extractHtmlFromLink(inputUrl);
    return generateQuizFormHTMLPrompt(
        html,
        payload.numberOfQuestions,
        payload.difficulty,
    );
}

async function generateQuizFromPrompt(
    prompt: string,
    modelCandidates: string[],
    difficulty: QuizDifficulty,
    numberOfQuestions: number,
) {
    let lastError: unknown = null;

    for (const model of modelCandidates) {
        for (let attempt = 1; attempt <= 2; attempt += 1) {
            try {
                const { object } = await generateObject({
                    model: getNvidiaChatModel(model),
                    schema: generatedQuizSchema,
                    prompt,
                    temperature: 0.3,
                });

                const quiz = sanitizeGeneratedQuiz(
                    object,
                    difficulty,
                    numberOfQuestions,
                );

                if (quiz.questions.length === numberOfQuestions) {
                    return { quiz, model };
                }

                throw new Error(
                    `Model returned ${quiz.questions.length} questions, expected ${numberOfQuestions}.`,
                );
            } catch (error) {
                lastError = error;
                logger.warn(
                    `Quiz generation failed for model "${model}" (attempt ${attempt}): ${error}`,
                );
            }
        }
    }

    throw lastError instanceof Error
        ? lastError
        : new Error('Failed to generate quiz.');
}

function validateWordCountForTextInput(payload: QuizGenerationRequest) {
    if (payload.inputType !== 'text') {
        return;
    }

    const text = payload.input as string;
    if (getWordCount(text) < MIN_WORD_COUNT) {
        throw new Error(
            `Input text must be at least ${MIN_WORD_COUNT} words to generate a quiz.`,
        );
    }
}

function getResolvedModel(model?: string) {
    return model?.trim() || getDefaultNvidiaModel();
}

function getModelCandidates(model?: string) {
    const preferred = getResolvedModel(model);
    const fallbacks = DEFAULT_OPEN_SOURCE_MODELS.map((item) => item.id);
    return [...new Set([preferred, ...fallbacks])];
}

function toValidationError(message: string) {
    return toNextResponse(createErrorResponse(message, 400));
}

function toDatabaseErrorResponse(error: Error) {
    if (error.message.includes('MONGODB_URI')) {
        return toNextResponse(
            createErrorResponse(
                'Database is not configured. Set MONGODB_URI and try again.',
                500,
            ),
        );
    }

    return toNextResponse(
        createErrorResponse(
            'Could not save quiz to the database. Please try again.',
            500,
        ),
    );
}

export async function POST(request: NextRequest) {
    try {
        const rawBody: QuizGenerationRequest = await request.json();
        const payload = generateQuizRequestSchema.parse(rawBody);

        validateWordCountForTextInput(payload);

        const prompt = await buildPrompt(payload);
        const modelCandidates = getModelCandidates(payload.model);

        const { quiz: generatedQuiz, model: usedModel } =
            await generateQuizFromPrompt(
                prompt,
                modelCandidates,
                payload.difficulty,
                payload.numberOfQuestions,
            );

        const quizData = {
            quizId: generateUUIDv4(),
            userId: payload.userId,
            input: {
                data: payload.input,
                type: payload.inputType as QuizInputType,
            },
            aiModel: usedModel,
            quiz: {
                numberOfQuestions: payload.numberOfQuestions,
                ...generatedQuiz,
                questions: generatedQuiz.questions.map((question) => ({
                    ...question,
                    id: generateUUIDv4(),
                })),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Only persist to database for authenticated users
        if (payload.userId !== 'anonymous') {
            try {
                await connectToDatabase();
                await Quiz.create(quizData);
            } catch (dbError) {
                const error =
                    dbError instanceof Error
                        ? dbError
                        : new Error('Unknown database error');
                logger.error(
                    `Failed to store generated quiz: ${error.message}`,
                );
                return toDatabaseErrorResponse(error);
            }
        }

        return toNextResponse(
            createSuccessResponse('Quiz generated successfully.', quizData),
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return toValidationError(
                error.issues[0]?.message || 'Invalid input',
            );
        }

        if (error instanceof Error) {
            const isValidationError =
                error.message.includes('words') ||
                error.message.includes('input');
            return toNextResponse(
                createErrorResponse(
                    error.message,
                    isValidationError ? 400 : 500,
                ),
            );
        }

        logger.error(`Unexpected quiz generation error: ${error}`);
        return toNextResponse(
            createErrorResponse('An unexpected error occurred.', 500),
        );
    }
}
