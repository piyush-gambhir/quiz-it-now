'use client';

// Import useRouter from Next.js
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

const LoadingModal = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4">Generating Questions...</h2>
        <p className="text-gray-600">
          Please wait while we process your request.
        </p>
      </div>
    </div>
  );
};

export default function QuizGeneratorPage() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputType, setInputType] = useState('text'); // "text", "file", "link"
  const [numberOfQuestions, setNumberOfQuestions] = useState(3);
  const textareaRef = useRef(null);

  const router = useRouter(); // Initialize useRouter for navigation

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQuestions([]);
    setError(null);

    let content = text;
    let type = 'text';

    if (inputType === 'link') {
      content = link;
      type = 'link';
    } else if (inputType === 'file' && file) {
      content = file.name;
      type = 'file';
    }

    try {
      const generatedQuestions = await generateQuiz({
        input: content,
        inputType: type,
        numberOfQuestions: numberOfQuestions,
      });
      setQuestions(generatedQuestions);

      // Redirect to a new page upon successful question generation
      router.push('/questions'); // Replace '/questions' with your desired route
    } catch (error) {
      setError('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Adjust the height of the Textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 400)}px`;
    }
  }, [text]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <LoadingModal isVisible={loading} />{' '}
      {/* Show the loading modal if loading */}
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
              className="border-0 p-3 shadow-none focus-visible:ring-0 w-full h-[200px]" // Match textarea dimensions
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
                onChange={(e) => setNumberOfQuestions(e.target.value)}
                min="1"
                max="20"
                className="w-16"
              />
            </div>

            <Button type="submit" size="sm" className="ml-auto gap-1.5">
              {loading ? 'Generating...' : 'Send Message'}
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
