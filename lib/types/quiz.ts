export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard' | 'God Mode';
export type QuizInputType = 'text' | 'link' | 'file';
export type QuizQuestionType =
    | 'multiple-choice'
    | 'true/false'
    | 'fill-in-the-blank';

export interface QuizFileInput {
    name: string;
    type: string;
    url: string;
}

export type QuizInput = string | QuizFileInput;

export interface QuizQuestion {
    id: string;
    type: QuizQuestionType;
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    tags: string[];
}

export interface QuizData {
    title: string;
    description: string;
    difficulty: QuizDifficulty;
    topic: string;
    tags: string[];
    questions: QuizQuestion[];
}

export interface QuizDocument {
    _id?: string;
    quizId: string;
    userId: string;
    input: {
        data: QuizInput;
        type: QuizInputType;
    };
    aiModel: string;
    quiz: QuizData & {
        numberOfQuestions: number;
    };
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface QuizGenerationRequest {
    userId: string;
    input: QuizInput;
    inputType: QuizInputType;
    numberOfQuestions: number;
    model?: string;
    difficulty?: QuizDifficulty;
}
