"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import { differenceInSeconds } from "date-fns";
import Link from "next/link";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import { cn, formatTimeDelta } from "@/lib/utils";
import { Game, Question } from "@/generated/prisma";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import QuizNavigation from "./QuizNavigation";

type Props = { 
    game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
}

const OpenEnded = ({ game }: Props) => { 
    const [questionIndex, setQuestionIndex] = useState(0);
    const [hasEnded, setHasEnded] = useState(false);
    const [userAnswer, setUserAnswer] = useState<string>(""); 
    const [now, setNow] = useState(new Date());
    const [averagePercentage, setAveragePercentage] = useState(0);
    
    // Track answers for each question
    const [answers, setAnswers] = useState<Record<number, {
        userAnswer: string;
        percentageSimilar: number;
        isAnswered: boolean;
    }>>({});

    const currentQuestion = useMemo(() => {
        return game.questions[questionIndex]
    }, [game.questions, questionIndex]);

    // Get current question's answer status
    const currentAnswer = answers[questionIndex];
    const hasAnswered = currentAnswer?.isAnswered || false;

    // Update user answer when navigating if question was already answered
    useEffect(() => {
        if (currentAnswer) {
            setUserAnswer(currentAnswer.userAnswer);
        } else {
            setUserAnswer("");
        }
    }, [questionIndex, currentAnswer]);

    // tRPC mutations
    const trpc = useTRPC();
    const checkAnswerMutation = useMutation(trpc.checkAnswer.checkAnswer.mutationOptions({})); 
    const endGameMutation = useMutation(trpc.checkAnswer.endGame.mutationOptions({}));

    // Timer effect
    useEffect(() => {
        if (!hasEnded) {
            const interval = setInterval(() => {
                setNow(new Date());
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [hasEnded]);

    // Submit answer for current question
    const handleSubmitAnswer = useCallback(() => {
        if (!currentQuestion || hasAnswered || !userAnswer.trim()) return;

        checkAnswerMutation.mutate({
            questionId: currentQuestion.id,
            userInput: userAnswer.trim(),
        }, {
            onSuccess: (data: any) => {
                const percentageSimilar = 'percentageSimilar' in data ? data.percentageSimilar : 0;
                
                // Store the answer
                setAnswers(prev => ({
                    ...prev,
                    [questionIndex]: {
                        userAnswer: userAnswer.trim(),
                        percentageSimilar,
                        isAnswered: true
                    }
                }));

                // Update average percentage
                setAveragePercentage((prev) => {
                    return (prev * questionIndex + percentageSimilar) / (questionIndex + 1);
                });

                // Show toast with similarity percentage
                console.log(`Answer similarity: ${percentageSimilar}%`);
            },
            onError: (error: any) => {
                console.error("Error checking answer:", error);
            }
        });
    }, [checkAnswerMutation, currentQuestion, userAnswer, questionIndex, hasAnswered]);

    // Navigate to next question
    const handleNext = useCallback(() => {
        if (questionIndex === game.questions.length - 1) {
            // Last question - end the game
            endGameMutation.mutate({ gameId: game.id });
            setHasEnded(true);
        } else {
            // Go to next question
            setQuestionIndex(prev => prev + 1);
        }
    }, [questionIndex, game.questions.length, game.id, endGameMutation]);

    // Navigate to previous question
    const handlePrevious = useCallback(() => {
        if (questionIndex > 0) {
            setQuestionIndex(prev => prev - 1);
        }
    }, [questionIndex]);

    // Handle navigation
    const handleNavigation = useCallback((direction: 'next' | 'previous') => {
        if (direction === 'next') {
            // Only allow next if answered
            if (hasAnswered) {
                handleNext();
            }
        } else {
            handlePrevious();
        }
    }, [hasAnswered, handleNext, handlePrevious]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;

            if (key === "Enter" && event.ctrlKey) {
                // Ctrl+Enter to submit
                if (!hasAnswered && userAnswer.trim()) {
                    handleSubmitAnswer();
                }
            } else if (key === "Enter") {
                // Enter to go next if answered
                if (hasAnswered) {
                    handleNext();
                }
            } else if (key === "ArrowLeft") {
                handlePrevious();
            } else if (key === "ArrowRight") {
                if (hasAnswered) {
                    handleNext();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleSubmitAnswer, handleNext, handlePrevious, hasAnswered, userAnswer]);

    if (hasEnded) {
        return (
            <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 px-4 text-center">
                <div className="px-4 py-3 mt-2 font-semibold text-white bg-green-500 rounded-md text-sm sm:text-base">
                    You Completed in{" "}
                    {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
                </div>
                <Link
                    href={`/statistics/${game.id}`}
                    className={cn(buttonVariants({ size: "lg" }), "mt-4 text-sm sm:text-base")}
                >
                    View Statistics
                    <BarChart className="w-4 h-4 ml-2" />
                </Link>
            </div>
        );
    }

    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:w-[90vw] md:w-[80vw] max-w-4xl top-1/2 left-1/2 px-2 sm:px-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
                <div className="flex flex-col">
                    <p className="text-sm sm:text-base">
                        <span className="text-slate-400 text-sm sm:text-base">Topic</span> &nbsp;
                        <span className="px-2 py-1 text-white rounded-lg bg-slate-800 text-sm sm:text-base">
                            {game.topic}
                        </span>
                    </p>
                    <div className="flex self-start mt-2 sm:mt-3 text-slate-400 text-sm sm:text-base">
                        <Timer className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                        {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
                    </div>
                </div>
                <div className="flex items-center justify-end sm:justify-start">
                    <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                            {Math.round(averagePercentage)}%
                        </div>
                        <div className="text-xs sm:text-sm text-slate-400">
                            Average
                        </div>
                    </div>
                </div>
            </div>
            <Card className="w-full mt-4">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 p-4 sm:p-6">
                    <CardTitle className="text-center divide-y divide-zinc-600/50 min-w-[50px] sm:min-w-[60px] sm:mr-5">
                        <div className="text-xl sm:text-2xl">{questionIndex + 1}</div>
                        <div className="text-sm sm:text-base text-slate-400">
                            {game.questions.length}
                        </div>
                    </CardTitle>
                    <CardDescription className="flex-grow text-base sm:text-lg leading-relaxed">
                        {currentQuestion?.question}
                    </CardDescription>
                </CardHeader>
            </Card>
            
            <div className="flex flex-col items-center justify-center w-full mt-4 space-y-4">
                {/* Answer Input */}
                <div className="w-full">
                    <Textarea
                        value={userAnswer}
                        onChange={(e) => !hasAnswered && setUserAnswer(e.target.value)}
                        placeholder={hasAnswered ? "Answer submitted" : "Type your answer here... (Press Ctrl+Enter to submit)"}
                        className="w-full min-h-[120px] sm:min-h-[100px] resize-none text-sm sm:text-base"
                        disabled={hasAnswered}
                    />
                </div>

                {/* Answer Feedback */}
                {hasAnswered && currentAnswer && (
                    <div className="w-full p-3 sm:p-4 rounded-lg border bg-blue-50 dark:bg-blue-950">
                        <div className="mb-2 text-blue-700 dark:text-blue-300">
                            <span className="font-semibold text-sm sm:text-base">
                                Similarity: {currentAnswer.percentageSimilar}%
                            </span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p><strong>Your answer:</strong> {currentAnswer.userAnswer}</p>
                            <p><strong>Expected answer:</strong> {currentQuestion?.answer}</p>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <QuizNavigation
                    currentIndex={questionIndex}
                    totalQuestions={game.questions.length}
                    onPrevious={() => handleNavigation('previous')}
                    onNext={() => handleNavigation('next')}
                    onSubmit={handleSubmitAnswer}
                    canGoNext={hasAnswered || !currentQuestion}
                    canSubmit={!hasAnswered && userAnswer.trim().length > 0}
                    isLoading={checkAnswerMutation.isPending}
                    hasAnswered={hasAnswered}
                    currentQuestion={currentQuestion ? {
                        question: currentQuestion.question,
                        answer: currentQuestion.answer
                    } : undefined}
                    userAnswer={currentAnswer?.userAnswer || ""}
                    isCorrect={currentAnswer ? currentAnswer.percentageSimilar >= 50 : false}
                />
            </div>
        </div>
    );
};

export default OpenEnded;
