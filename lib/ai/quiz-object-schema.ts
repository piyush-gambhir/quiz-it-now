import { z } from 'zod';

import { QuizDifficulty, QuizQuestionType } from '@/lib/types/quiz';

const questionTypeEnum = z.enum([
    'multiple-choice',
    'true/false',
    'fill-in-the-blank',
]);

const difficultyEnum = z.enum(['Easy', 'Medium', 'Hard', 'God Mode']);

export const generatedQuestionSchema = z.object({
    type: questionTypeEnum,
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2).max(4),
    answer: z.string().min(1),
    explanation: z.string().min(1),
    tags: z.array(z.string().min(1)).default([]),
});

export const generatedQuizSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    difficulty: difficultyEnum,
    topic: z.string().min(1),
    tags: z.array(z.string().min(1)).default([]),
    questions: z.array(generatedQuestionSchema).min(1),
});

type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>;
type GeneratedQuiz = z.infer<typeof generatedQuizSchema>;

function normalizeTrueFalseOptions(options: string[]) {
    const normalized = options.map((option) => option.trim().toLowerCase());
    const hasTrue = normalized.includes('true');
    const hasFalse = normalized.includes('false');

    if (hasTrue && hasFalse) {
        return ['True', 'False'];
    }

    return options;
}

function ensureAnswerInOptions(options: string[], answer: string) {
    if (options.includes(answer)) {
        return options;
    }

    return [...options.slice(0, 3), answer];
}

export function sanitizeGeneratedQuiz(
    quiz: GeneratedQuiz,
    difficulty: QuizDifficulty,
    numberOfQuestions: number,
) {
    const questions = quiz.questions.slice(0, numberOfQuestions).map((q) => {
        const options =
            q.type === 'true/false'
                ? normalizeTrueFalseOptions(q.options)
                : q.options;

        return {
            ...q,
            options: ensureAnswerInOptions(options, q.answer),
            tags: q.tags.length > 0 ? q.tags : ['general'],
        };
    });

    return {
        ...quiz,
        difficulty,
        questions,
        tags: quiz.tags.length > 0 ? quiz.tags : ['general'],
    };
}

export type GeneratedQuizOutput = ReturnType<typeof sanitizeGeneratedQuiz>;
export type GeneratedQuestionOutput = GeneratedQuestion & {
    type: QuizQuestionType;
};
