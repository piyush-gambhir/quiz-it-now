import { generateObject } from 'ai';
import { load } from 'cheerio';
import pdfParse from 'pdf-parse';
import { YoutubeTranscript } from 'youtube-transcript';
import { z } from 'zod';

import {
    generateQuizFormTextPrompt,
    generateQuizFromTranscriptPrompt,
} from '@/helpers/prompts/generate-quiz-prompts';
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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const MIN_WORD_COUNT = 250;
const DEFAULT_USER_AGENT =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

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

function normalizeText(value: string) {
    return value.replace(/\s+/g, ' ').trim();
}

function ensureMinWordCount(text: string) {
    if (getWordCount(text) < MIN_WORD_COUNT) {
        throw new Error(
            `Input text must be at least ${MIN_WORD_COUNT} words to generate a quiz.`,
        );
    }
}

function isYouTubeUrl(url: string) {
    return url.includes('youtube.com') || url.includes('youtu.be');
}

function isPdfUrl(url: string) {
    return url.toLowerCase().includes('.pdf');
}

async function extractTextFromPdfUrl(url: string) {
    const response = await fetch(url, {
        headers: { 'User-Agent': DEFAULT_USER_AGENT },
        cache: 'no-store',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch the PDF file.');
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const parsed = await pdfParse(buffer);
    return normalizeText(parsed.text || '');
}

async function extractTextFromFile(fileInput: QuizFileInput) {
    if (fileInput.type.includes('pdf')) {
        return extractTextFromPdfUrl(fileInput.url);
    }

    const response = await fetch(fileInput.url, {
        headers: { 'User-Agent': DEFAULT_USER_AGENT },
        cache: 'no-store',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch the uploaded file.');
    }

    return normalizeText(await response.text());
}

async function extractTranscriptFromYoutube(url: string) {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    return normalizeText(transcript.map((item) => item.text).join(' '));
}

async function extractTextFromLink(url: string) {
    const response = await fetch(url, {
        headers: { 'User-Agent': DEFAULT_USER_AGENT },
        cache: 'no-store',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch the provided URL.');
    }

    const html = await response.text();
    const $ = load(html);
    $('script, style, noscript').remove();
    const text = $('body').text();
    return normalizeText(text);
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
        ensureMinWordCount(text);

        return generateQuizFormTextPrompt(
            text,
            payload.numberOfQuestions,
            payload.difficulty,
        );
    }

    const inputUrl = payload.input as string;
    if (isYouTubeUrl(inputUrl)) {
        const transcript = await extractTranscriptFromYoutube(inputUrl);
        ensureMinWordCount(transcript);
        return generateQuizFromTranscriptPrompt(
            transcript,
            payload.numberOfQuestions,
            payload.difficulty,
        );
    }

    if (isPdfUrl(inputUrl)) {
        const pdfText = await extractTextFromPdfUrl(inputUrl);
        ensureMinWordCount(pdfText);
        return generateQuizFormTextPrompt(
            pdfText,
            payload.numberOfQuestions,
            payload.difficulty,
        );
    }

    const text = await extractTextFromLink(inputUrl);
    ensureMinWordCount(text);
    return generateQuizFormTextPrompt(
        text,
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

export async function POST(request: Request) {
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
