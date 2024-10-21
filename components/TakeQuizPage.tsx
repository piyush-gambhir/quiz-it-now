'use client';

import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  RotateCcw,
  Tag,
  Target,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Question {
  id: string;
  question: string;
  explanation: string;
  options: string[];
  answer: string;
}

interface QuizData {
  _id: string;
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
}

export default function InteractiveQuizPage({
  quizData,
}: {
  quizData: QuizData;
}) {
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [autoProgressTimer, setAutoProgressTimer] =
    useState<NodeJS.Timeout | null>(null);

  const numberOfQuestions = quizData?.quiz?.questions?.length || 0;

  useEffect(() => {
    if (quizStarted && !showResults && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      handleNextQuestion();
    }
  }, [timer, showResults, quizStarted]);

  useEffect(() => {
    if (autoProgressTimer) {
      return () => clearTimeout(autoProgressTimer);
    }
  }, [autoProgressTimer]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setIsAnswered(true);
    const isCorrect =
      answer === quizData?.quiz?.questions?.[currentQuestionIndex]?.answer;

    if (isCorrect) {
      setStreak((prevStreak) => {
        const newStreak = prevStreak + 1;
        setHighestStreak((prev) => Math.max(prev, newStreak));
        return newStreak;
      });
      if (streak + 1 >= 3) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      setAutoProgressTimer(setTimeout(() => handleNextQuestion(), 2000)); // Move to next question after 2 seconds if correct
    } else {
      setStreak(0);
      setShowExplanation(true);
      setAutoProgressTimer(setTimeout(() => handleNextQuestion(), 5000)); // Move to next question after 5 seconds if incorrect
    }
  };

  const handleNextQuestion = () => {
    if (autoProgressTimer) {
      clearTimeout(autoProgressTimer);
    }
    if (currentQuestionIndex < numberOfQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
      setIsAnswered(false);
      setTimer(60);
    } else {
      setShowResults(true);
    }
  };

  const handleRetry = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setShowExplanation(false);
    setTimer(60);
    setIsAnswered(false);
    setStreak(0);
    setQuizStarted(false);
    if (autoProgressTimer) {
      clearTimeout(autoProgressTimer);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quizData?.quiz?.questions?.forEach((question) => {
      if (userAnswers[question.id] === question.answer) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  const currentQuestion = quizData?.quiz?.questions?.[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / numberOfQuestions) * 100;

  if (!quizData || !quizData.quiz) {
    return <div>Error: Quiz data is not available.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full mx-auto mb-8 border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl">{quizData.quiz.title}</CardTitle>
          <CardDescription className="text-lg">
            {quizData.quiz.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              <span className="font-medium">Topic:</span>
              <span className="ml-2">{quizData.quiz.topic}</span>
            </div>
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              <span className="font-medium">Difficulty:</span>
              <span className="ml-2">{quizData.quiz.difficulty}</span>
            </div>
            <div className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">Questions:</span>
              <span className="ml-2">{numberOfQuestions}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="font-medium mr-2">Tags:</span>
            {quizData.quiz.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        {!quizStarted && (
          <CardFooter>
            <Button onClick={handleStartQuiz} className="w-full">
              Start Quiz
            </Button>
          </CardFooter>
        )}
      </Card>

      {quizStarted && (
        <Card className="w-full mx-auto shadow-none border-none">
          <CardContent className="space-y-6 pt-6">
            {!showResults ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Question {currentQuestionIndex + 1} of {numberOfQuestions}
                  </span>
                  <span className="text-sm font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {timer}s
                  </span>
                </div>
                <Progress value={progress} className="w-full" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-medium">
                      {currentQuestion?.question}
                    </h3>
                    <RadioGroup
                      onValueChange={(value) =>
                        handleAnswerChange(currentQuestion?.id || '', value)
                      }
                      className="space-y-2"
                    >
                      {currentQuestion?.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${currentQuestion?.id}-${optionIndex}`}
                            checked={
                              userAnswers[currentQuestion?.id || ''] === option
                            }
                            disabled={isAnswered}
                          />
                          <Label
                            htmlFor={`${currentQuestion?.id}-${optionIndex}`}
                            className={`flex-1 p-2 rounded-md ${
                              isAnswered
                                ? option === currentQuestion?.answer
                                  ? 'bg-green-100 dark:bg-green-900'
                                  : userAnswers[currentQuestion?.id || ''] ===
                                      option
                                    ? 'bg-red-100 dark:bg-red-900'
                                    : ''
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            {option}
                            {isAnswered &&
                              (option === currentQuestion?.answer ? (
                                <CheckCircle2 className="inline-block ml-2 text-green-500" />
                              ) : (
                                userAnswers[currentQuestion?.id || ''] ===
                                  option && (
                                  <XCircle className="inline-block ml-2 text-red-500" />
                                )
                              ))}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </motion.div>
                </AnimatePresence>
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowExplanation(!showExplanation)}
                    disabled={!isAnswered}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    {showExplanation ? 'Hide' : 'Show'} Explanation
                  </Button>
                  <div className="flex items-center space-x-2 hidden">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium">Streak: {streak}</span>
                  </div>
                  <Button onClick={handleNextQuestion} disabled={!isAnswered}>
                    {currentQuestionIndex === numberOfQuestions - 1
                      ? 'Finish'
                      : 'Next'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <AnimatePresence>
                  {(showExplanation ||
                    (isAnswered &&
                      userAnswers[currentQuestion?.id || ''] !==
                        currentQuestion?.answer)) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert>
                        <AlertTitle>Explanation</AlertTitle>
                        <AlertDescription>
                          {currentQuestion?.explanation}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center">Quiz Results</h3>
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2">
                    {calculateScore()} / {numberOfQuestions}
                  </p>
                  <p className="text-lg">
                    {(calculateScore() / numberOfQuestions) * 100}% Correct
                  </p>
                  <p className="text-md mt-2">
                    Highest Streak: {highestStreak}
                  </p>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {quizData.quiz.questions.map((question, index) => (
                    <AccordionItem
                      key={question.id}
                      value={`question-${index}`}
                    >
                      <AccordionTrigger>
                        Question {index + 1}: {question.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p>Your answer: {userAnswers[question.id]}</p>
                          <p>Correct answer: {question.answer}</p>
                          <p>Explanation: {question.explanation}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {showResults && (
              <Button onClick={handleRetry} className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry Quiz
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
