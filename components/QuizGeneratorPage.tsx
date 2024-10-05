'use client';

import { CornerDownLeft, FileText, Link, Paperclip } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { generateQuiz } from '@/actions/quiz';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import LoadingModal from '@/components/common/LoadingModal';

export default function QuizGeneratorPage() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputType, setInputType] = useState('text');
  const [numberOfQuestions, setNumberOfQuestions] = useState(3);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setQuestions([]);
    setError(null);

    try {
      const generatedQuestions = await generateQuiz({
        input: text,
        inputType: inputType,
        numberOfQuestions: numberOfQuestions,
      });
      if (Array.isArray(generatedQuestions)) {
        setQuestions(generatedQuestions);
        router.push('/questions');
      }
    } catch (error) {
      setError('Failed to generate questions. Please try again.');
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 400)}px`;
    }
  }, [text]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <LoadingModal isOpen={loading} message="Generating Questions" />
      <main className="w-full max-w-4xl px-4">
        <form
          className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
          onSubmit={handleSubmit}
        >
          <Label htmlFor="message" className="sr-only">
            Message
          </Label>
          {inputType === 'link' ? (
            <Input
              id="link-input"
              placeholder="Paste your link here..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border-0 p-3 shadow-none focus-visible:ring-0 w-full h-[200px]"
            />
          ) : inputType === 'file' ? (
            <div className="border-0 p-3 w-full h-[200px] flex items-center justify-center bg-gray-100">
              {file ? (
                <span>{file.name}</span>
              ) : (
                <Label htmlFor="file-input" className="text-center">
                  Click to upload a file
                </Label>
              )}
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,image/*,audio/*,video/*"
              />
            </div>
          ) : (
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              ref={textareaRef}
              className="resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              style={{
                maxHeight: '400px',
                overflowY: text.length > 100 ? 'scroll' : 'hidden',
              }}
            />
          )}

          <div className="flex items-center p-3 pt-0 gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setInputType('text')}
                >
                  <FileText className="size-4" />
                  <span className="sr-only">Switch to Text Input</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Switch to Text Input</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setInputType('file')}
                >
                  <Paperclip className="size-4" />
                  <span className="sr-only">Attach File</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach File</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setInputType('link')}
                >
                  <Link className="size-4" />
                  <span className="sr-only">Switch to Link Input</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Switch to Link Input</TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-2 ml-4">
              <Label htmlFor="num-questions" className="text-sm">
                Number of Questions:
              </Label>
              <Input
                type="number"
                id="num-questions"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                min="1"
                max="20"
                className="w-16"
              />
            </div>

            <Button type="submit" size="sm" className="ml-auto gap-1.5">
              {loading ? 'Generating' : 'Generate'}
              {!loading && <CornerDownLeft className="size-3.5" />}
            </Button>
          </div>
        </form>

        {error && <div className="text-red-500 mt-4">{error}</div>}
        {questions.length > 0 && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">Generated Questions:</h2>
            <ul className="list-disc pl-5">
              {questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
