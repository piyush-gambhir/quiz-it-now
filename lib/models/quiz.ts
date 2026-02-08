import mongoose, { Document, Schema } from 'mongoose';

interface IQuizQuestion {
    id: string;
    type: 'multiple-choice' | 'true/false' | 'fill-in-the-blank';
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    tags: string[];
}

interface IQuizData {
    numberOfQuestions: number;
    title: string;
    description: string;
    difficulty: string;
    topic: string;
    tags: string[];
    questions: IQuizQuestion[];
}

export interface IQuiz extends Document {
    quizId: string;
    userId: string;
    input: {
        data: any;
        type: string;
    };
    aiModel: string;
    quiz: IQuizData;
    createdAt: Date;
    updatedAt: Date;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>(
    {
        id: { type: String, required: true },
        type: {
            type: String,
            enum: ['multiple-choice', 'true/false', 'fill-in-the-blank'],
            required: true,
        },
        question: { type: String, required: true },
        options: { type: [String], required: true },
        answer: { type: String, required: true },
        explanation: { type: String, required: true },
        tags: { type: [String], required: true },
    },
    { _id: false },
);

const QuizDataSchema = new Schema<IQuizData>(
    {
        numberOfQuestions: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        difficulty: { type: String, required: true },
        topic: { type: String, required: true },
        tags: { type: [String], required: true },
        questions: { type: [QuizQuestionSchema], required: true },
    },
    { _id: false },
);

const QuizSchema = new Schema<IQuiz>(
    {
        quizId: { type: String, required: true, unique: true, index: true },
        userId: { type: String, required: true, index: true },
        input: {
            data: { type: Schema.Types.Mixed, required: true },
            type: { type: String, required: true },
        },
        aiModel: { type: String, required: true },
        quiz: { type: QuizDataSchema, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

// Create compound index for efficient queries
QuizSchema.index({ userId: 1, createdAt: -1 });

export const Quiz =
    mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);
