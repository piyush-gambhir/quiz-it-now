'use client';

import { FileText, Link2, Paperclip, Sparkles, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useAuthSession } from '@/hooks/auth/use-session';
import { QuizDocument } from '@/lib/types/quiz';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import LoadingModal from '@/components/common/loading-modal';

type InputType = 'text' | 'link' | 'file';
type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'God Mode';

const MAX_FILE_SIZE_MB = 25;

type UploadResponse = {
    url: string;
    fields: Record<string, string>;
    fileUrl: string;
};

type ModelOption = {
    model: string;
    name: string;
};

const FALLBACK_MODEL_OPTIONS: ModelOption[] = [
    {
        model: 'meta/llama-3.1-70b-instruct',
        name: 'Llama 3.1 70B Instruct (Meta)',
    },
    {
        model: 'meta/llama-3.1-8b-instruct',
        name: 'Llama 3.1 8B Instruct (Meta)',
    },
    {
        model: 'meta/llama-3.3-70b-instruct',
        name: 'Llama 3.3 70B Instruct (Meta)',
    },
    {
        model: 'mistralai/mistral-7b-instruct-v0.3',
        name: 'Mistral 7B Instruct v0.3',
    },
    {
        model: 'google/gemma-2-9b-it',
        name: 'Gemma 2 9B IT (Google)',
    },
    {
        model: 'qwen/qwen2.5-7b-instruct',
        name: 'Qwen 2.5 7B Instruct',
    },
    {
        model: 'nvidia/nemotron-mini-4b-instruct',
        name: 'Nemotron Mini 4B Instruct (NVIDIA)',
    },
];

function getWordCount(text: string) {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

function isValidHttpUrl(value: string) {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function sanitizeFilename(value: string) {
    return value.replace(/[^a-zA-Z0-9_.-]/g, '-').toLowerCase();
}

export default function QuizGeneratorPage() {
    const [text, setText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [link, setLink] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(
        'Generating your quiz...',
    );
    const [inputType, setInputType] = useState<InputType>('text');
    const [numberOfQuestions, setNumberOfQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
    const [availableModels, setAvailableModels] = useState<ModelOption[]>([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [modelsLoading, setModelsLoading] = useState(true);
    const [generatedQuiz, setGeneratedQuiz] = useState<QuizDocument | null>(
        null,
    );

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();
    const { data: session, status } = useAuthSession();

    useEffect(() => {
        const controller = new AbortController();

        async function loadModels() {
            try {
                const response = await fetch('/api/models', {
                    method: 'GET',
                    signal: controller.signal,
                    cache: 'no-store',
                });

                if (!response.ok) {
                    return;
                }

                const payload = (await response.json()) as {
                    data?: {
                        models?: ModelOption[];
                        defaultModel?: string;
                    };
                };

                const models = payload.data?.models ?? [];
                const defaultModel = payload.data?.defaultModel;

                if (models.length > 0) {
                    setAvailableModels(models);
                    setSelectedModel(defaultModel || models[0].model);
                    return;
                }

                setAvailableModels(FALLBACK_MODEL_OPTIONS);
                setSelectedModel(
                    defaultModel || FALLBACK_MODEL_OPTIONS[0].model,
                );
            } catch {
                setAvailableModels(FALLBACK_MODEL_OPTIONS);
                setSelectedModel(FALLBACK_MODEL_OPTIONS[0].model);
            } finally {
                setModelsLoading(false);
            }
        }

        void loadModels();

        return () => controller.abort();
    }, []);

    const textWordCount = useMemo(() => getWordCount(text), [text]);

    const isValidInput = useMemo(() => {
        if (inputType === 'text') {
            return text.trim().length > 0;
        }

        if (inputType === 'link') {
            return isValidHttpUrl(link.trim());
        }

        return Boolean(selectedFile);
    }, [inputType, link, selectedFile, text]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (!file) {
            setSelectedFile(null);
            return;
        }

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError(
                `File size must be less than ${MAX_FILE_SIZE_MB}MB. Please choose a smaller file.`,
            );
            event.target.value = '';
            setSelectedFile(null);
            return;
        }

        setError(null);
        setSelectedFile(file);
    };

    const uploadFileToS3 = async (file: File) => {
        const userId = session?.user?.id || 'anonymous';
        const key = `uploads/${userId}/${Date.now()}-${sanitizeFilename(file.name)}`;

        setLoadingMessage('Uploading file...');

        const presignedResponse = await fetch('/api/s3', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                key,
                contentType: file.type || 'application/octet-stream',
            }),
        });

        if (!presignedResponse.ok) {
            throw new Error('Failed to get upload URL.');
        }

        const presignedData =
            (await presignedResponse.json()) as UploadResponse;
        const formData = new FormData();

        Object.entries(presignedData.fields).forEach(([field, value]) => {
            formData.append(field, value);
        });
        formData.append('file', file);

        const uploadResponse = await fetch(presignedData.url, {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) {
            throw new Error('File upload failed.');
        }

        return {
            name: file.name,
            type: file.type || 'application/octet-stream',
            url: presignedData.fileUrl,
        };
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!isValidInput) {
            setError('Please provide valid input before generating the quiz.');
            return;
        }

        const isAuthenticated = status === 'authenticated' && session?.user?.id;

        // File upload requires authentication (needs S3 + userId)
        if (inputType === 'file' && !isAuthenticated) {
            setError(
                'Please log in to upload files. You can use text or link input without an account.',
            );
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedQuiz(null);
        setLoadingMessage('Generating your quiz...');

        try {
            let inputData: string | { name: string; type: string; url: string };
            let resolvedInputType: InputType;

            if (inputType === 'text') {
                inputData = text.trim();
                resolvedInputType = 'text';
            } else if (inputType === 'link') {
                const trimmedLink = link.trim();
                if (!isValidHttpUrl(trimmedLink)) {
                    throw new Error('Please enter a valid URL.');
                }
                inputData = trimmedLink;
                resolvedInputType = 'link';
            } else {
                if (!selectedFile) {
                    throw new Error('Please choose a file to upload.');
                }
                inputData = await uploadFileToS3(selectedFile);
                resolvedInputType = 'file';
            }

            setLoadingMessage('Generating your quiz...');

            const response = await fetch('/api/quiz/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: isAuthenticated ? session.user.id : 'anonymous',
                    input: inputData,
                    inputType: resolvedInputType,
                    numberOfQuestions,
                    difficulty,
                    model: selectedModel || undefined,
                }),
            });

            const result = await response.json();

            if (response.ok && result?.success && result?.data) {
                if (isAuthenticated && result.data.quizId) {
                    router.push(`/quiz/view/${result.data.quizId}`);
                } else {
                    // Anonymous: show quiz inline
                    setGeneratedQuiz(result.data as QuizDocument);
                }
                return;
            }

            setError(
                result?.error?.message ||
                    result?.message ||
                    'Failed to generate quiz.',
            );
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : 'An unexpected error occurred. Please try again.',
            );
        } finally {
            setLoading(false);
            setLoadingMessage('Generating your quiz...');
        }
    };

    return (
        <div className="min-h-screen">
            <LoadingModal isOpen={loading} message={loadingMessage} />

            <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 md:py-14">
                {/* Page header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Create a Quiz
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Provide content and configure your quiz settings
                            below.
                        </p>
                    </div>
                    <Badge
                        variant="secondary"
                        className="hidden sm:flex gap-1 font-normal"
                    >
                        <Sparkles className="size-3" />
                        AI-Powered
                    </Badge>
                </div>

                {status !== 'authenticated' && (
                    <div className="mb-6 flex items-center gap-3 rounded-md border border-border bg-muted/30 px-4 py-3 text-sm">
                        <span className="text-muted-foreground">
                            You&apos;re not signed in. Quizzes won&apos;t be
                            saved.
                        </span>
                        <Link href="/login" className="ml-auto shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                            >
                                Sign in
                            </Button>
                        </Link>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Step 1 — Content source */}
                    <section>
                        <div className="mb-4 flex items-center gap-2">
                            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                                1
                            </span>
                            <h2 className="text-sm font-semibold">
                                Content Source
                            </h2>
                        </div>

                        {/* Source type selector */}
                        <div className="mb-4 flex gap-2">
                            {[
                                {
                                    value: 'text' as InputType,
                                    icon: FileText,
                                    label: 'Text',
                                },
                                {
                                    value: 'file' as InputType,
                                    icon: Paperclip,
                                    label: 'File',
                                },
                                {
                                    value: 'link' as InputType,
                                    icon: Link2,
                                    label: 'Link',
                                },
                            ].map(({ value, icon: Icon, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setInputType(value)}
                                    className={`flex items-center gap-1.5 rounded border px-3.5 py-2 text-sm font-medium transition-colors ${
                                        inputType === value
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground'
                                    }`}
                                >
                                    <Icon className="size-3.5" />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Text input */}
                        {inputType === 'text' && (
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Paste or type your content here..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    ref={textareaRef}
                                    className="min-h-48 resize-y"
                                    onInput={(e) => {
                                        const el = e.currentTarget;
                                        el.style.height = 'auto';
                                        el.style.height = `${Math.max(192, el.scrollHeight)}px`;
                                    }}
                                />
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>
                                        {textWordCount} words
                                        {textWordCount > 0 &&
                                            textWordCount < 250 && (
                                                <span className="ml-1 text-amber-600 dark:text-amber-400">
                                                    (low — 250+ recommended)
                                                </span>
                                            )}
                                    </span>
                                    <span>250+ recommended</span>
                                </div>
                            </div>
                        )}

                        {/* File input */}
                        {inputType === 'file' && (
                            <div>
                                {status !== 'authenticated' ? (
                                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border py-12 text-center">
                                        <Upload className="mb-3 size-5 text-muted-foreground" />
                                        <p className="text-sm font-medium">
                                            Sign in to upload files
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            File uploads require an account. Use
                                            text or link input instead.
                                        </p>
                                        <Link href="/login" className="mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-xs"
                                            >
                                                Sign in
                                            </Button>
                                        </Link>
                                    </div>
                                ) : selectedFile ? (
                                    <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 items-center justify-center rounded bg-primary/10">
                                                <Paperclip className="size-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {selectedFile.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(
                                                        selectedFile.size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(2)}{' '}
                                                    MB
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-7"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                if (fileInputRef.current)
                                                    fileInputRef.current.value =
                                                        '';
                                            }}
                                        >
                                            <X className="size-3.5" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="group flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border py-12 transition-colors hover:border-primary/40 hover:bg-muted/20"
                                    >
                                        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
                                            <Upload className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                                        </div>
                                        <p className="text-sm font-medium">
                                            Drop a file or{' '}
                                            <span className="text-primary">
                                                browse
                                            </span>
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            PDF, TXT, MD, CSV &mdash; up to{' '}
                                            {MAX_FILE_SIZE_MB} MB
                                        </p>
                                    </div>
                                )}
                                {status === 'authenticated' && (
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,.txt,.md,.csv"
                                    />
                                )}
                            </div>
                        )}

                        {/* Link input */}
                        {inputType === 'link' && (
                            <div className="space-y-1.5">
                                <Input
                                    placeholder="https://example.com/article"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="h-11"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Article, blog post, or any public webpage.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Step 2 — Settings */}
                    <section>
                        <div className="mb-4 flex items-center gap-2">
                            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                                2
                            </span>
                            <h2 className="text-sm font-semibold">
                                Quiz Settings
                            </h2>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="num-questions"
                                    className="text-xs font-medium text-muted-foreground"
                                >
                                    Questions
                                </Label>
                                <Select
                                    value={numberOfQuestions.toString()}
                                    onValueChange={(v) =>
                                        setNumberOfQuestions(
                                            Number.parseInt(v, 10),
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="num-questions"
                                        className="h-10"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[5, 10, 15, 20].map((c) => (
                                            <SelectItem
                                                key={c}
                                                value={c.toString()}
                                            >
                                                {c}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="difficulty"
                                    className="text-xs font-medium text-muted-foreground"
                                >
                                    Difficulty
                                </Label>
                                <Select
                                    value={difficulty}
                                    onValueChange={(v) =>
                                        setDifficulty(v as Difficulty)
                                    }
                                >
                                    <SelectTrigger
                                        id="difficulty"
                                        className="h-10"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Easy">
                                            Easy
                                        </SelectItem>
                                        <SelectItem value="Medium">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="Hard">
                                            Hard
                                        </SelectItem>
                                        <SelectItem value="God Mode">
                                            God Mode
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="model"
                                    className="text-xs font-medium text-muted-foreground"
                                >
                                    AI Model
                                </Label>
                                <Select
                                    value={selectedModel}
                                    onValueChange={setSelectedModel}
                                    disabled={
                                        modelsLoading ||
                                        availableModels.length === 0
                                    }
                                >
                                    <SelectTrigger id="model" className="h-10">
                                        <SelectValue
                                            placeholder={
                                                modelsLoading
                                                    ? 'Loading...'
                                                    : 'Select'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableModels.map((o) => (
                                            <SelectItem
                                                key={o.model}
                                                value={o.model}
                                            >
                                                {o.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </section>

                    {/* Error */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="h-11 w-full gap-2"
                        disabled={loading || !isValidInput}
                    >
                        {loading ? (
                            'Processing...'
                        ) : (
                            <>
                                <Sparkles className="size-4" />
                                Generate Quiz
                            </>
                        )}
                    </Button>
                </form>

                {/* Inline quiz result for anonymous users */}
                {generatedQuiz && (
                    <div className="mt-10 border-t border-border pt-10">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">
                                    {generatedQuiz.quiz.title}
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {generatedQuiz.quiz.description}
                                </p>
                            </div>
                        </div>

                        {status !== 'authenticated' && (
                            <div className="mb-6 flex items-center gap-3 rounded-md border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
                                <Sparkles className="size-4 shrink-0 text-primary" />
                                <span className="text-muted-foreground">
                                    This quiz is not saved.{' '}
                                    <Link
                                        href="/register"
                                        className="font-medium text-primary hover:underline"
                                    >
                                        Create an account
                                    </Link>{' '}
                                    to save and revisit your quizzes.
                                </span>
                            </div>
                        )}

                        <div className="mb-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3 sm:gap-4">
                            <div className="rounded-md border border-border px-4 py-3">
                                <p className="text-xs text-muted-foreground">
                                    Difficulty
                                </p>
                                <p className="mt-0.5 font-medium">
                                    {generatedQuiz.quiz.difficulty}
                                </p>
                            </div>
                            <div className="rounded-md border border-border px-4 py-3">
                                <p className="text-xs text-muted-foreground">
                                    Topic
                                </p>
                                <p className="mt-0.5 font-medium">
                                    {generatedQuiz.quiz.topic}
                                </p>
                            </div>
                            <div className="rounded-md border border-border px-4 py-3">
                                <p className="text-xs text-muted-foreground">
                                    Questions
                                </p>
                                <p className="mt-0.5 font-medium">
                                    {generatedQuiz.quiz.numberOfQuestions}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {generatedQuiz.quiz.questions.map(
                                (question, index) => (
                                    <div
                                        key={question.id}
                                        className="rounded-md border border-border p-5"
                                    >
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <p className="text-sm font-medium">
                                                <span className="mr-2 text-muted-foreground">
                                                    {index + 1}.
                                                </span>
                                                {question.question}
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className="shrink-0 text-[11px] font-normal"
                                            >
                                                {question.type}
                                            </Badge>
                                        </div>

                                        {question.options.length > 0 && (
                                            <div className="mb-3 space-y-1.5">
                                                {question.options.map(
                                                    (option) => (
                                                        <div
                                                            key={option}
                                                            className="rounded border border-border bg-muted/20 px-3 py-2 text-sm"
                                                        >
                                                            {option}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}

                                        <div className="space-y-1.5 border-t border-border pt-3 text-sm">
                                            <p>
                                                <span className="font-medium">
                                                    Answer:
                                                </span>{' '}
                                                <span className="text-primary">
                                                    {question.answer}
                                                </span>
                                            </p>
                                            <p className="text-muted-foreground">
                                                {question.explanation}
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setGeneratedQuiz(null);
                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth',
                                    });
                                }}
                            >
                                Generate Another
                            </Button>
                            {status !== 'authenticated' && (
                                <Link href="/register" className="flex-1">
                                    <Button className="w-full gap-1.5">
                                        Sign up to save quizzes
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
