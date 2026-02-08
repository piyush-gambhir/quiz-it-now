'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    Copy,
    HelpCircle,
    RotateCcw,
    Trophy,
    XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { QuizDocument } from '@/lib/types/quiz';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { toast } from '@/hooks/use-toast';

export default function InteractiveQuizPage({
    quizData,
}: {
    quizData: QuizDocument | null;
}) {
    const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>(
        {},
    );
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [timer, setTimer] = useState(60);
    const [isAnswered, setIsAnswered] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);

    const numberOfQuestions = quizData?.quiz?.questions?.length || 0;

    const handleStartQuiz = () => {
        setQuizStarted(true);
        setTimer(60);
    };

    const handleAnswerChange = useCallback(
        (questionId: string, answer: string) => {
            setUserAnswers((prev) => ({
                ...prev,
                [questionId]: answer,
            }));
            setIsAnswered(true);
        },
        [],
    );

    const handleNextQuestion = useCallback(() => {
        if (currentQuestionIndex < numberOfQuestions - 1) {
            setCurrentQuestionIndex((value) => value + 1);
            setIsAnswered(false);
            setShowExplanation(false);
            setTimer(60);
        } else {
            setShowResults(true);
        }
    }, [currentQuestionIndex, numberOfQuestions]);

    const handleRetry = () => {
        setUserAnswers({});
        setCurrentQuestionIndex(0);
        setShowResults(false);
        setShowExplanation(false);
        setTimer(60);
        setIsAnswered(false);
        setQuizStarted(false);
    };

    const calculateScore = () => {
        let correctAnswers = 0;
        quizData?.quiz?.questions?.forEach((question) => {
            if (userAnswers[question.id] === question.answer) {
                correctAnswers++;
            }
        });
        return correctAnswers;
    };

    const currentQuestion = quizData?.quiz?.questions?.[currentQuestionIndex];
    const progress =
        numberOfQuestions === 0
            ? 0
            : ((currentQuestionIndex + 1) / numberOfQuestions) * 100;

    useEffect(() => {
        if (!quizStarted || showResults || isAnswered) {
            return;
        }

        if (timer === 0) {
            handleNextQuestion();
            return;
        }

        const timeout = setTimeout(() => {
            setTimer((value) => Math.max(0, value - 1));
        }, 1000);

        return () => clearTimeout(timeout);
    }, [handleNextQuestion, isAnswered, quizStarted, showResults, timer]);

    // Keyboard navigation: 1-4 to select, Enter to advance
    useEffect(() => {
        if (!quizStarted || showResults) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // If typing in an input, skip
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            )
                return;

            // Number keys to select answer
            if (!isAnswered && currentQuestion) {
                const num = Number.parseInt(e.key, 10);
                if (num >= 1 && num <= currentQuestion.options.length) {
                    handleAnswerChange(
                        currentQuestion.id,
                        currentQuestion.options[num - 1],
                    );
                    return;
                }
            }

            // Enter to go to next question
            if (e.key === 'Enter' && isAnswered) {
                e.preventDefault();
                handleNextQuestion();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
        quizStarted,
        showResults,
        isAnswered,
        currentQuestion,
        handleAnswerChange,
        handleNextQuestion,
    ]);

    if (!quizData || !quizData.quiz || numberOfQuestions === 0) {
        return (
            <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
                <div className="rounded-md border border-dashed border-border p-8 sm:p-12 text-center">
                    <p className="font-medium">Quiz data is not available.</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Please go back and try another quiz.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            {/* Quiz info header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    {quizData.quiz.title}
                </h1>
                <p className="mt-2 text-muted-foreground">
                    {quizData.quiz.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>{quizData.quiz.topic}</span>
                    <span className="text-border">|</span>
                    <span>{quizData.quiz.difficulty}</span>
                    <span className="text-border">|</span>
                    <span>{numberOfQuestions} questions</span>
                </div>

                {quizData.quiz.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {quizData.quiz.tags.map((tag, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="font-normal"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {!quizStarted && (
                    <Button onClick={handleStartQuiz} className="mt-6 w-full">
                        Start Quiz
                    </Button>
                )}
            </div>

            {quizStarted && (
                <div className="space-y-6">
                    {!showResults ? (
                        <>
                            {/* Progress bar */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">
                                        Question {currentQuestionIndex + 1} of{' '}
                                        {numberOfQuestions}
                                    </span>
                                    <span className="flex items-center gap-1 font-medium text-muted-foreground">
                                        <Clock className="size-3.5" />
                                        {timer}s
                                    </span>
                                </div>
                                <Progress value={progress} className="h-1.5" />
                                <p className="hidden text-[11px] text-muted-foreground/60 sm:block">
                                    Press 1-
                                    {currentQuestion?.options.length ?? 4} to
                                    select · Enter to continue
                                </p>
                            </div>

                            {/* Question */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQuestionIndex}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.2 }}
                                    className="rounded-md border border-border p-4 sm:p-5"
                                >
                                    <h3 className="mb-4 text-base font-medium">
                                        {currentQuestion?.question}
                                    </h3>
                                    <RadioGroup
                                        onValueChange={(value) =>
                                            handleAnswerChange(
                                                currentQuestion?.id || '',
                                                value,
                                            )
                                        }
                                        className="space-y-2"
                                    >
                                        {currentQuestion?.options.map(
                                            (option, optionIndex) => (
                                                <div
                                                    key={optionIndex}
                                                    className="flex items-center gap-2.5"
                                                >
                                                    <RadioGroupItem
                                                        value={option}
                                                        id={`${currentQuestion?.id}-${optionIndex}`}
                                                        checked={
                                                            userAnswers[
                                                                currentQuestion?.id ||
                                                                    ''
                                                            ] === option
                                                        }
                                                        disabled={isAnswered}
                                                    />
                                                    <Label
                                                        htmlFor={`${currentQuestion?.id}-${optionIndex}`}
                                                        className={`flex flex-1 items-center justify-between rounded border px-3 py-2.5 text-sm transition-colors ${
                                                            isAnswered
                                                                ? option ===
                                                                  currentQuestion?.answer
                                                                    ? 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/30'
                                                                    : userAnswers[
                                                                            currentQuestion?.id ||
                                                                                ''
                                                                        ] ===
                                                                        option
                                                                      ? 'border-red-500/50 bg-red-50 dark:bg-red-950/30'
                                                                      : 'border-border'
                                                                : 'border-border hover:bg-muted/50 cursor-pointer'
                                                        }`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <kbd className="hidden sm:inline-flex size-5 items-center justify-center rounded border border-border bg-muted text-[10px] font-medium text-muted-foreground">
                                                                {optionIndex +
                                                                    1}
                                                            </kbd>
                                                            {option}
                                                        </span>
                                                        {isAnswered &&
                                                            (option ===
                                                            currentQuestion?.answer ? (
                                                                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                                            ) : (
                                                                userAnswers[
                                                                    currentQuestion?.id ||
                                                                        ''
                                                                ] ===
                                                                    option && (
                                                                    <XCircle className="size-4 text-red-600 dark:text-red-400" />
                                                                )
                                                            ))}
                                                    </Label>
                                                </div>
                                            ),
                                        )}
                                    </RadioGroup>
                                </motion.div>
                            </AnimatePresence>

                            {/* Actions */}
                            <div className="flex items-center justify-between">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setShowExplanation(!showExplanation)
                                    }
                                    disabled={!isAnswered}
                                >
                                    <HelpCircle className="mr-1.5 size-3.5" />
                                    {showExplanation ? 'Hide' : 'Explain'}
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleNextQuestion}
                                    disabled={!isAnswered}
                                >
                                    {currentQuestionIndex ===
                                    numberOfQuestions - 1
                                        ? 'Finish'
                                        : 'Next'}
                                    <ArrowRight className="ml-1.5 size-3.5" />
                                </Button>
                            </div>

                            {/* Explanation */}
                            <AnimatePresence>
                                {(showExplanation ||
                                    (isAnswered &&
                                        userAnswers[
                                            currentQuestion?.id || ''
                                        ] !== currentQuestion?.answer)) && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Alert className="border-border">
                                            <AlertTitle className="text-sm">
                                                Explanation
                                            </AlertTitle>
                                            <AlertDescription className="text-sm text-muted-foreground">
                                                {currentQuestion?.explanation}
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    ) : (
                        /* Results */
                        <div className="space-y-6">
                            {(() => {
                                const score = calculateScore();
                                const pct = Math.round(
                                    (score / numberOfQuestions) * 100,
                                );
                                const feedback =
                                    pct === 100
                                        ? {
                                              emoji: '🎉',
                                              message: 'Perfect score!',
                                              color: 'text-emerald-600 dark:text-emerald-400',
                                          }
                                        : pct >= 80
                                          ? {
                                                emoji: '🌟',
                                                message: 'Excellent work!',
                                                color: 'text-emerald-600 dark:text-emerald-400',
                                            }
                                          : pct >= 60
                                            ? {
                                                  emoji: '👍',
                                                  message: 'Good job!',
                                                  color: 'text-amber-600 dark:text-amber-400',
                                              }
                                            : pct >= 40
                                              ? {
                                                    emoji: '💪',
                                                    message: 'Keep practicing!',
                                                    color: 'text-amber-600 dark:text-amber-400',
                                                }
                                              : {
                                                    emoji: '📚',
                                                    message:
                                                        'Review and try again!',
                                                    color: 'text-red-600 dark:text-red-400',
                                                };

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="rounded-md border border-border p-6 sm:p-8 text-center"
                                    >
                                        <Trophy
                                            className={`mx-auto size-8 ${feedback.color}`}
                                        />
                                        <p className="mt-3 text-4xl font-bold tracking-tight">
                                            {score}{' '}
                                            <span className="text-lg font-normal text-muted-foreground">
                                                / {numberOfQuestions}
                                            </span>
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {pct}% correct
                                        </p>
                                        <p
                                            className={`mt-2 text-sm font-medium ${feedback.color}`}
                                        >
                                            {feedback.emoji} {feedback.message}
                                        </p>
                                    </motion.div>
                                );
                            })()}

                            <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                            >
                                {quizData.quiz.questions.map(
                                    (question, index) => (
                                        <AccordionItem
                                            key={question.id}
                                            value={`question-${index}`}
                                        >
                                            <AccordionTrigger className="text-sm">
                                                <span className="flex items-center gap-2">
                                                    {userAnswers[
                                                        question.id
                                                    ] === question.answer ? (
                                                        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                                    ) : (
                                                        <XCircle className="size-4 text-red-600 dark:text-red-400" />
                                                    )}
                                                    Q{index + 1}:{' '}
                                                    {question.question}
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-2 text-sm">
                                                    <p>
                                                        <span className="font-medium">
                                                            Your answer:
                                                        </span>{' '}
                                                        {userAnswers[
                                                            question.id
                                                        ] || 'Not answered'}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">
                                                            Correct:
                                                        </span>{' '}
                                                        <span className="text-primary">
                                                            {question.answer}
                                                        </span>
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        {question.explanation}
                                                    </p>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ),
                                )}
                            </Accordion>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Button
                                    onClick={handleRetry}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <RotateCcw className="mr-2 size-3.5" />
                                    Retry Quiz
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={async () => {
                                        const score = calculateScore();
                                        const pct = Math.round(
                                            (score / numberOfQuestions) * 100,
                                        );
                                        const text = `I scored ${score}/${numberOfQuestions} (${pct}%) on "${quizData.quiz.title}" — QuizItNow`;
                                        try {
                                            await navigator.clipboard.writeText(
                                                text,
                                            );
                                            toast({
                                                title: 'Score copied',
                                                description:
                                                    'Share your result with friends!',
                                            });
                                        } catch {
                                            toast({
                                                title: 'Copy failed',
                                                variant: 'destructive',
                                            });
                                        }
                                    }}
                                >
                                    <Copy className="mr-2 size-3.5" />
                                    Share Score
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
