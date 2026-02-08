'use client';

import {
    Check,
    ChevronDown,
    ChevronUp,
    Copy,
    ExternalLink,
    Play,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { QuizDocument, QuizFileInput } from '@/lib/types/quiz';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { toast } from '@/hooks/use-toast';

function formatDate(dateValue: string | Date) {
    return new Date(dateValue).toLocaleString();
}

function isFileInput(value: unknown): value is QuizFileInput {
    return (
        typeof value === 'object' &&
        value !== null &&
        'name' in value &&
        'type' in value &&
        'url' in value
    );
}

function getInputPreview(quizData: QuizDocument) {
    const value = quizData.input.data;

    if (typeof value === 'string') {
        return value;
    }

    if (isFileInput(value)) {
        return `${value.name} (${value.type})`;
    }

    return JSON.stringify(value);
}

export default function ViewQuizPage({
    quizData,
}: Readonly<{ quizData: QuizDocument | null }>) {
    const [showFullInput, setShowFullInput] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!quizData) {
        return (
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="rounded-md border border-dashed border-border p-8 sm:p-12 text-center">
                    <p className="font-medium">Quiz not found.</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        This quiz may have been removed.
                    </p>
                </div>
            </div>
        );
    }

    const inputPreview = getInputPreview(quizData);
    const fileInput = isFileInput(quizData.input.data)
        ? quizData.input.data
        : null;

    const handleCopyLink = async () => {
        const url = `${window.location.origin}/quiz/${quizData.quizId}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast({
                title: 'Link copied',
                description: 'Quiz link copied to clipboard.',
            });
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast({
                title: 'Copy failed',
                description: 'Could not copy the link.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
            {/* Quiz header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    {quizData.quiz.title}
                </h1>
                <p className="mt-2 text-muted-foreground">
                    {quizData.quiz.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/quiz/${quizData.quizId}`}>
                        <Button size="sm" className="gap-1.5">
                            <Play className="size-3.5" />
                            Take Quiz
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={handleCopyLink}
                    >
                        {copied ? (
                            <Check className="size-3.5" />
                        ) : (
                            <Copy className="size-3.5" />
                        )}
                        {copied ? 'Copied!' : 'Copy Link'}
                    </Button>
                </div>
            </div>

            {/* Metadata grid */}
            <div className="mb-8 rounded-md border border-border p-4 sm:p-5">
                <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Difficulty
                        </p>
                        <p className="mt-1 font-medium">
                            {quizData.quiz.difficulty}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Topic
                        </p>
                        <p className="mt-1 font-medium">
                            {quizData.quiz.topic}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Questions
                        </p>
                        <p className="mt-1 font-medium">
                            {quizData.quiz.numberOfQuestions}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Model
                        </p>
                        <p className="mt-1 font-medium">{quizData.aiModel}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Input Type
                        </p>
                        <p className="mt-1 font-medium">
                            {quizData.input.type}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Created
                        </p>
                        <p className="mt-1 font-medium">
                            {formatDate(quizData.createdAt)}
                        </p>
                    </div>
                </div>

                {quizData.quiz.tags.length > 0 && (
                    <div className="mt-5 border-t border-border pt-4">
                        <div className="flex flex-wrap gap-1.5">
                            {quizData.quiz.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="font-normal"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Input preview */}
            <div className="mb-10 rounded-md border border-border p-4 sm:p-5">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Source Input
                </p>
                <div className="rounded bg-muted/30 p-3 text-sm">
                    {inputPreview.length > 220 ? (
                        <>
                            <p className={showFullInput ? '' : 'line-clamp-3'}>
                                {inputPreview}
                            </p>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFullInput((v) => !v)}
                                className="mt-2 h-7 text-xs"
                            >
                                {showFullInput ? (
                                    <>
                                        <ChevronUp className="mr-1.5 size-3" />
                                        Show less
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="mr-1.5 size-3" />
                                        Show more
                                    </>
                                )}
                            </Button>
                        </>
                    ) : (
                        <p>{inputPreview}</p>
                    )}
                </div>
                {fileInput && (
                    <Link
                        href={fileInput.url}
                        target="_blank"
                        className="mt-3 inline-flex items-center text-sm text-primary hover:underline"
                    >
                        Open uploaded file
                        <ExternalLink className="ml-1 size-3.5" />
                    </Link>
                )}
            </div>

            {/* Questions */}
            <div className="space-y-4">
                {quizData.quiz.questions.map((question, index) => (
                    <div
                        key={question.id}
                        className="rounded-md border border-border p-4 sm:p-5"
                    >
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Question {index + 1}
                                </p>
                                <p className="mt-1 font-medium">
                                    {question.question}
                                </p>
                            </div>
                            <Badge
                                variant="outline"
                                className="shrink-0 text-xs font-normal"
                            >
                                {question.type}
                            </Badge>
                        </div>

                        {question.options.length > 0 && (
                            <div className="mb-4 space-y-1.5">
                                {question.options.map((option) => (
                                    <div
                                        key={option}
                                        className="rounded bg-muted/30 px-3 py-2 text-sm"
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-2 border-t border-border pt-4 text-sm">
                            <p>
                                <span className="font-medium">Answer:</span>{' '}
                                <span className="text-primary">
                                    {question.answer}
                                </span>
                            </p>
                            <p className="text-muted-foreground">
                                {question.explanation}
                            </p>
                        </div>

                        {question.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {question.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-xs font-normal"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
