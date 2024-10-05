'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

interface QuizData {
  _id: string;
  quizId: string;
  userId: string;
  input: string;
  inputType: string;
  numberOfQuestions: number;
  questions: Question[];
  createdAt: string;
}

export default function TakeQuizPage({ quizData }: { quizData: QuizData }) {
  console.log(quizData);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quizData.questions.forEach((question) => {
      if (userAnswers[question.id] === question.answer) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Generated Quiz</CardTitle>
          <CardDescription>
            Based on the provided text about government funding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {quizData.questions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <h3 className="text-lg font-medium">
                Question {index + 1}: {question.question}
              </h3>
              <RadioGroup
                onValueChange={(value) =>
                  handleAnswerChange(question.id, value)
                }
                disabled={showResults}
              >
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option}
                      id={`${question.id}-${optionIndex}`}
                      checked={userAnswers[question.id] === option}
                    />
                    <Label htmlFor={`${question.id}-${optionIndex}`}>
                      {option}
                    </Label>
                    {showResults && option === question.answer && (
                      <CheckCircle2 className="text-green-500 ml-2" />
                    )}
                    {showResults &&
                      userAnswers[question.id] === option &&
                      option !== question.answer && (
                        <XCircle className="text-red-500 ml-2" />
                      )}
                  </div>
                ))}
              </RadioGroup>
              {showResults && (
                <p className="text-sm text-muted-foreground">
                  Correct answer: {question.answer}
                </p>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          {!showResults ? (
            <Button onClick={handleSubmit} className="w-full">
              Submit Answers
            </Button>
          ) : (
            <div className="w-full text-center">
              <p className="text-lg font-medium">
                Your Score: {calculateScore()} out of{' '}
                {quizData.questions.length}
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
