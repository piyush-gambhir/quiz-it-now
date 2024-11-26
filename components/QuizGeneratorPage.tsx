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
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputType, setInputType] = useState<'text' | 'link' | 'file'>('text');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState<
    'Easy' | 'Medium' | 'Hard' | 'God Mode'
  >('Easy');

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();

  const session = useAuthSession();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileName = `uploads/${session?.data?.user?.id}/${Date.now()}-${selectedFile.name}`;
      setUploading(true);
      try {
        // Get the presigned post data, including contentType
        const presignedResponse = await fetch('/api/s3', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Specify the content type of the request body
          },
          body: JSON.stringify({
            key: fileName,
            contentType: selectedFile.type, // Include the file's Content-Type
          }),
        });

        if (!presignedResponse.ok) {
          const errorData = await presignedResponse.json();
          throw new Error(errorData.error || 'Failed to get upload URL');
        }

        const presignedData = await presignedResponse.json();

        // Create FormData and append fields from presigned post
        const formData = new FormData();
        Object.entries(presignedData.fields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        formData.append('file', selectedFile);

        // Upload to S3 using presigned post
        const uploadResponse = await fetch(presignedData.url, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Failed to upload file: ${errorText}`);
        }

        // Set file info after successful upload
        // Correctly construct the S3 URL
        const fileUrl = `${presignedData.url}/${encodeURIComponent(fileName)}`;
        setFile({
          name: selectedFile.name,
          url: fileUrl,
          type: selectedFile.type,
        });
      } catch (uploadError: any) {
        console.error('File upload error:', uploadError);
        setError('Failed to upload the file. Please try again.');
      } finally {
        setUploading(false);
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
          setError('Please upload a file before generating the quiz.');
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
        setError(
          generatedQuiz?.message ||
            'Failed to generate quiz. Please try again.',
        );
        return;
      }
      router.push(`/quiz/${generatedQuiz.data.quizId}`);
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

  const handleNumberOfQuestionsChange = (value: number) => {
    if (value < 1) {
      setNumberOfQuestions(1);
    } else if (value > 20) {
      setNumberOfQuestions(20);
    } else {
      setNumberOfQuestions(value);
    }
  };

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
            className="cursor-pointer border-0 p-3 w-full h-[200px] flex flex-col items-center justify-center"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            {file.name ? (
              <>
                <Paperclip className="size-4 mb-2" />
                <span>{file.name}</span>
              </>
            ) : (
              <span className="text-center">Click to upload a file</span>
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
    <div className="flex items-center justify-center min-h-screen">
      <LoadingModal isOpen={loading} message="Generating Questions" />
      <LoadingModal isOpen={uploading} message="Uploading File" />
      <main className="w-full max-w-5xl px-4">
        <form
          className="relative overflow-hidden rounded-lg border focus-within:ring-1 focus-within:ring-ring"
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
              <TooltipContent side="top">Switch to Text Input</TooltipContent>
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
              <TooltipContent side="top">Attach File</TooltipContent>
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
                onChange={(e) =>
                  handleNumberOfQuestionsChange(Number(e.target.value))
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
                    value as 'Easy' | 'Medium' | 'Hard' | 'God Mode',
                  )
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                  <SelectItem value="God Mode">God Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" size="sm" className="ml-auto gap-1.5">
              {loading ? 'Generating' : 'Generate'}
              {!loading && <CornerDownLeft className="size-3.5" />}
            </Button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}
      </main>
    </div>
  );
}
