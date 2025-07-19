// File: /components/QuizGeneratorPage.tsx
'use client';

import { CornerDownLeft, FileText, Link, Paperclip } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { generateQuiz } from '@/actions/quiz';

import { putToS3 } from '@/lib/aws/s3/put-to-s3';
import { generateUUIDv4 } from '@/lib/utils/generateUUID';

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

// File: /components/QuizGeneratorPage.tsx

// File: /components/QuizGeneratorPage.tsx

// File: /components/QuizGeneratorPage.tsx

export default function QuizGeneratorPage() {
    const [text, setText] = useState('');
    const [file, setFile] = useState({
        name: '',
        url: '',
        type: '',
    });
    const [link, setLink] = useState('');
    const [questions, setQuestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inputType, setInputType] = useState<'text' | 'link' | 'file'>(
        'text',
    );
    const [numberOfQuestions, setNumberOfQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState<
        'Easy' | 'Medium' | 'Hard' | 'God Mode'
    >('Easy');

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const router = useRouter();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const fileName = `uploads/${Date.now()}-${file.name}`;
            try {
                await putToS3(
                    'quiz-it-now-s3',
                    fileName,
                    Buffer.from(await file.arrayBuffer()),
                );
                setFile({
                    name: file.name,
                    url: fileName,
                    type: file.type,
                });
            } catch (uploadError: any) {
                console.error('File upload error:', uploadError);
                setError('Failed to upload the file. Please try again.');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let inputData;
            if (inputType === 'text') {
                inputData = text;
            } else if (inputType === 'file') {
                if (!file.url) {
                    setError(
                        'Please upload a file before generating the quiz.',
                    );
                    setLoading(false);
                    return;
                }
                inputData = file;
            } else if (inputType === 'link') {
                inputData = link;
            }

            const generatedQuiz = await generateQuiz({
                input: inputData,
                inputType,
                numberOfQuestions,
                difficulty,
            });

            if (!generatedQuiz?.success) {
                // If the response indicates failure, set the error message
                setError(
                    generatedQuiz?.message ||
                        'Failed to generate quiz. Please try again.',
                );
                return;
            }

            // Navigate to the quiz details page on success
            router.push(`/quiz/${generatedQuiz.data}`);
        } catch (error: any) {
            // Catch any unexpected errors and display a message
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
                        className="cursor-pointer border-0 p-3 w-full h-[200px] flex items-center justify-center "
                        onClick={() =>
                            document.getElementById('file-input')?.click()
                        }
                    >
                        {file.name ? (
                            <span>{file.name}</span>
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
        <div className="flex items-center justify-center min-h-screen ">
            <LoadingModal isOpen={loading} message="Generating Questions" />
            <main className="w-full max-w-5xl px-4">
                <form
                    className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
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
                            <Label htmlFor="num-questions" className="text-sm">
                                Number of Questions:
                            </Label>
                            <Input
                                type="number"
                                id="num-questions"
                                value={numberOfQuestions}
                                onChange={(e) =>
                                    setNumberOfQuestions(Number(e.target.value))
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
                                    <SelectItem value="Easy">Easy</SelectItem>
                                    <SelectItem value="Medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="Hard">Hard</SelectItem>
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

                {questions.length > 0 && (
                    <div className="mt-4 p-4  rounded-lg shadow-md">
                        <h2 className="text-lg font-bold mb-2">
                            Generated Questions:
                        </h2>
                        <ul className="list-disc pl-5">
                            {questions.map((question) => (
                                <li key={generateUUIDv4()}>{question}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}
