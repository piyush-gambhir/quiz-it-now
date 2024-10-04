'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import FileInputField from '@/components/common/FileInputField';
import TextInputField from '@/components/common/TextInputField';

// Mock function to simulate AI-generated questions (same as before)
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

export default function QuizGeneratorForm() {
  const [text, setText] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [audioLink, setAudioLink] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setQuestions([]);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="text">Text Content</Label>
        <Textarea
          id="text"
          placeholder="Enter text content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <TextInputField
        id="video"
        label="Video Link"
        placeholder="Enter video URL..."
        value={videoLink}
        onChange={(e) => setVideoLink(e.target.value)}
        type="url"
      />
      <TextInputField
        id="audio"
        label="Audio Link"
        placeholder="Enter audio URL..."
        value={audioLink}
        onChange={(e) => setAudioLink(e.target.value)}
        type="url"
      />
      <FileInputField
        id="pdf"
        label="PDF File"
        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
      />
      <Button type="submit" disabled={loading}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          'Generate Quiz'
        )}
      </Button>
    </form>
  );
}
