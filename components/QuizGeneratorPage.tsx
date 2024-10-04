'use client';

import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

// Mock function to simulate AI-generated questions
const generateQuestions = async (
  content: string,
  type: string,
): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return [
    'What is the main topic discussed in the content?',
    'Can you summarize the key points presented?',
    'What conclusions can be drawn from the information provided?',
  ];
};

type Props = {};

export default function QuizGeneratorPage({}: Props) {
  const [text, setText] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [audioLink, setAudioLink] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setQuestions([]);
    setError(null);

    let content = text;
    let type = 'text';

    if (videoLink) {
      content = videoLink;
      type = 'video';
    } else if (audioLink) {
      content = audioLink;
      type = 'audio';
    } else if (pdfFile) {
      content = pdfFile.name;
      type = 'pdf';
    }

    try {
      const generatedQuestions = await generateQuestions(content, type);
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
      setError('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto border-none shadow-none">
        <CardHeader className="">
          <CardTitle className="text-2xl">Quiz Generator</CardTitle>
          <CardDescription>
            Enter your content or provide a link to generate quiz questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <TabsContent value="text">
                <div className="space-y-2">
                  <Label htmlFor="text">Text Content</Label>
                  <Textarea
                    id="text"
                    placeholder="Enter your text content here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[200px] text-base"
                  />
                </div>
              </TabsContent>
              <TabsContent value="video">
                <div className="space-y-2">
                  <Label htmlFor="video">Video Link</Label>
                  <Input
                    id="video"
                    type="url"
                    placeholder="Enter video URL..."
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="audio">
                <div className="space-y-2">
                  <Label htmlFor="audio">Audio Link</Label>
                  <Input
                    id="audio"
                    type="url"
                    placeholder="Enter audio URL..."
                    value={audioLink}
                    onChange={(e) => setAudioLink(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="pdf">
                <div className="space-y-2">
                  <Label htmlFor="pdf">PDF File</Label>
                  <Input
                    id="pdf"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  />
                </div>
              </TabsContent>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Quiz'
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-8 w-full max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </main>
  );
}
