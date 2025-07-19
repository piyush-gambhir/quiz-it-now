'use client';

import { CornerDownLeft, FileText, Link, Paperclip } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { generateQuiz } from '@/actions/quiz';

import { useAuthSession } from '@/hooks/auth/useSession';

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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import LoadingModal from '@/components/common/LoadingModal';

export default function QuizGeneratorPage() {
    const [text, setText] = useState('');
    const [file, setFile] = useState({
        name: '',
        url: '',
        type: '',
    });
    const [link, setLink] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [inputType, setInputType] = useState<'text' | 'link' | 'file'>(
        'text',
    );
    const [numberOfQuestions, setNumberOfQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState<
        'Easy' | 'Medium' | 'Hard' | 'God Mode'
    >('Easy');

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const router = useRouter();
    const { data: session } = useAuthSession();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile({
            name: selectedFile.name,
            url: URL.createObjectURL(selectedFile),
            type: selectedFile.type,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) {
            setError('Please log in to generate quizzes.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let inputData: string | { name: string; type: string; url: string };
            let inputTypeValue: 'text' | 'link' | 'file';

            switch (inputType) {
                case 'text':
                    if (!text.trim()) {
                        throw new Error(
                            'Please enter some text to generate a quiz.',
                        );
                    }
                    inputData = text;
                    inputTypeValue = 'text';
                    break;
                case 'file':
                    if (!file.name) {
                        throw new Error('Please select a file to upload.');
                    }
                    inputData = {
                        name: file.name,
                        type: file.type,
                        url: file.url,
                    };
                    inputTypeValue = 'file';
                    break;
                case 'link':
                    if (!link.trim()) {
                        throw new Error('Please enter a valid link.');
                    }
                    inputData = link;
                    inputTypeValue = 'link';
                    break;
                default:
                    throw new Error('Invalid input type.');
            }

            const result = await generateQuiz({
                input: inputData,
                inputType: inputTypeValue,
                numberOfQuestions,
                difficulty,
            });

            if (result.success && result.data?.quizId) {
                router.push(`/quiz/view/${result.data.quizId}`);
            } else {
                setError(result.error?.message || 'Failed to generate quiz.');
            }
        } catch (error: any) {
            console.error('Unexpected error generating questions:', error);
            setError(
                error.message ||
                    'An unexpected error occurred. Please try again later.',
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 400)}px`;
        }
    }, [text]);

    const renderInput = () => {
        switch (inputType) {
            case 'link':
                return (
                    <Input
                        id="link-input"
                        placeholder="Paste your link here..."
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="border-0 p-3 shadow-none focus-visible:ring-0 w-full h-[200px]"
                    />
                );
            case 'file':
                return (
                    <div
                        onClick={() =>
                            document.getElementById('file-input')?.click()
                        }
                        className="flex items-center justify-center w-full h-[200px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                    >
                        {file.name ? (
                            <span className="text-center">
                                Selected: {file.name}
                            </span>
                        ) : (
                            <span className="text-center">
                                Click to upload a file
                            </span>
                        )}
                        <input
                            id="file-input"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf,.docx,image/*,audio/*,video/*"
                            aria-label="Upload file"
                        />
                    </div>
                );
            default:
                return (
                    <Textarea
                        id="message"
                        placeholder="Type your message here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        ref={textareaRef}
                        className="resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                        style={{
                            minHeight: '200px',
                            maxHeight: '400px',
                            overflowY: text.length > 100 ? 'scroll' : 'hidden',
                        }}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <LoadingModal isOpen={loading} />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            Generate Quiz
                        </h1>
                        <p className="text-muted-foreground">
                            Create engaging quizzes from text, files, or links
                            using AI.
                        </p>
                    </div>

                    <form
                        className="bg-card rounded-lg border shadow-sm"
                        onSubmit={handleSubmit}
                    >
                        <Label htmlFor="message" className="sr-only">
                            Message
                        </Label>
                        {renderInput()}

                        <div className="flex items-center px-3 py-4 gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setInputType('text')}
                                        aria-label="Switch to Text Input"
                                    >
                                        <FileText className="size-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    Switch to Text Input
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setInputType('file')}
                                        aria-label="Attach File"
                                    >
                                        <Paperclip className="size-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    Attach File
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setInputType('link')}
                                        aria-label="Switch to Link Input"
                                    >
                                        <Link className="size-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    Switch to Link Input
                                </TooltipContent>
                            </Tooltip>

                            <div className="flex items-center gap-2 ml-4">
                                <Label
                                    htmlFor="num-questions"
                                    className="text-sm"
                                >
                                    Number of Questions:
                                </Label>
                                <Input
                                    type="number"
                                    id="num-questions"
                                    value={numberOfQuestions}
                                    onChange={(e) =>
                                        setNumberOfQuestions(
                                            parseInt(e.target.value) || 5,
                                        )
                                    }
                                    min="1"
                                    max="20"
                                    className="w-16"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="difficulty" className="text-sm">
                                    Difficulty:
                                </Label>
                                <Select
                                    value={difficulty}
                                    onValueChange={(value) =>
                                        setDifficulty(
                                            value as
                                                | 'Easy'
                                                | 'Medium'
                                                | 'Hard'
                                                | 'God Mode',
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Difficulty" />
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

                            <Button
                                type="submit"
                                size="sm"
                                className="ml-auto gap-1.5"
                                disabled={loading}
                            >
                                {loading ? 'Generating' : 'Generate'}
                                {!loading && (
                                    <CornerDownLeft className="size-3.5" />
                                )}
                            </Button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
