'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Question = {
  id: string;
  type: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  tags: string[];
};

type Quiz = {
  quizId: string;
  userId: string;
  input: {
    data: string;
    type: string;
  };
  model: string;
  quiz: {
    numberOfQuestions: number;
    title: string;
    description: string;
    difficulty: string;
    topic: string;
    tags: string[];
    questions: Question[];
  };
  createdAt: string;
  updatedAt: string;
};

export default function ViewQuizPage({
  quizData,
}: Readonly<{ quizData: Quiz }>) {
  const [showFullInput, setShowFullInput] = useState(false);

  const toggleInputDisplay = () => {
    setShowFullInput(!showFullInput);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{quizData.quiz.title}</CardTitle>
          <CardDescription>{quizData.quiz.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Difficulty:</span>{' '}
              {quizData.quiz.difficulty}
            </div>
            <div>
              <span className="font-semibold">Topic:</span>{' '}
              {quizData.quiz.topic}
            </div>
            <div>
              <span className="font-semibold">Number of Questions:</span>{' '}
              {quizData.quiz.numberOfQuestions}
            </div>
            <div>
              <span className="font-semibold">Model:</span> {quizData.model}
            </div>
            <div>
              <span className="font-semibold">Input Type:</span>{' '}
              {quizData.input.type}
            </div>
            <div>
              <span className="font-semibold">Created At:</span>{' '}
              {formatDate(quizData.createdAt)}
            </div>
            <div>
              <span className="font-semibold">Updated At:</span>{' '}
              {formatDate(quizData.updatedAt)}
            </div>
          </div>
          <div className="mt-4">
            <span className="font-semibold">Quiz Tags:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {quizData.quiz.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <span className="font-semibold">Input Data:</span>
            <div className="mt-2">
              {quizData.input.data.length > 200 ? (
                <>
                  <p className={`${showFullInput ? '' : 'line-clamp-3'}`}>
                    {quizData.input.data}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleInputDisplay}
                    className="mt-2"
                  >
                    {showFullInput ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Show More
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <p>{quizData.input.data}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {quizData.quiz.questions.map((question, index) => (
        <Card key={question.id} className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Question {index + 1}</CardTitle>
            <CardDescription>{question.question}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="font-semibold">Type:</span> {question.type}
            </div>
            {question.options.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold">Options:</span>
                <ul className="list-disc list-inside ml-4">
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex}>{option}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mb-4">
              <span className="font-semibold">Correct Answer:</span>{' '}
              {question.answer}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Explanation:</span>{' '}
              {question.explanation}
            </div>
            <div>
              <span className="font-semibold">Tags:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {question.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
