"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "./ui/button";
import { differenceInSeconds } from "date-fns";
import Link from "next/link";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import { cn, formatTimeDelta } from "@/lib/utils";
import { Game, Question } from "@/generated/prisma";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import MCQCounter from "./MCQcounter";
import QuizNavigation from "./QuizNavigation";

type Props = { 
    game: Game & { questions: Pick<Question, "id" | "options" | "question" | "answer">[] };
}

const MCQ = ({ game }: Props) => { 
    const [questionIndex, setQuestionIndex] = useState(0);
    const [hasEnded, setHasEnded] = useState(false);
    const [stats, setStats] = useState({
        correct_answers: 0,
        wrong_answers: 0,
    });
    const [selectedChoice, setSelectedChoice] = useState<number>(-1); 
    const [now, setNow] = useState(new Date());
    
    // Track answers for each question
    const [answers, setAnswers] = useState<Record<number, {
        userAnswer: string;
        isCorrect: boolean;
        isAnswered: boolean;
    }>>({});
    
    // Track if we've shown feedback for current question
    const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({}); 

    const currentQuestion = useMemo(() => {
        return game.questions[questionIndex]
    }, [game.questions, questionIndex]);

    const options = useMemo(() => {
        if (!currentQuestion) {
            console.log("No current question");
            return [];
        }
        if(!currentQuestion.options) {
            console.log("No options in current question:", currentQuestion);
            return [];
        }
        try {
            const parsed = JSON.parse(currentQuestion.options as string) as string[];
            console.log("Parsed options:", parsed);
            return parsed;
        } catch (error) {
            console.error("Error parsing options:", error, "Raw options:", currentQuestion.options);
            return [];
        }
    }, [currentQuestion]);

    // Get current question's answer status
    const currentAnswer = answers[questionIndex];
    const hasAnswered = currentAnswer?.isAnswered || false;
    const shouldShowFeedback = showFeedback[questionIndex] || false;

    // Update selected choice when navigating if question was already answered
    useEffect(() => {
        if (currentAnswer && options.length > 0) {
            const answerIndex = options.findIndex(option => option === currentAnswer.userAnswer);
            if (answerIndex !== -1) {
                setSelectedChoice(answerIndex);
            }
        } else {
            setSelectedChoice(-1);
        }
    }, [questionIndex, currentAnswer, options]);

    // tRPC mutations - using correct syntax for your setup
    const trpc = useTRPC();
    const checkAnswerMutation = useMutation(trpc.checkAnswer.checkAnswer.mutationOptions({})); 
    const endGameMutation = useMutation(trpc.checkAnswer.endGame.mutationOptions({}));

    // Timer effect
    useEffect(() => {
        const interval = setInterval(() => {
            if (!hasEnded) {
                setNow(new Date());
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [hasEnded]);

    // Submit answer for current question
    const handleSubmitAnswer = useCallback(() => {
        if (!currentQuestion || hasAnswered) return;

        const userAnswer = options[selectedChoice];
        
        checkAnswerMutation.mutate({
            questionId: currentQuestion.id,
            userInput: userAnswer,
        }, {
            onSuccess: (data: any) => {
                const isCorrect = 'isCorrect' in data ? data.isCorrect : false;
                
                // Store the answer
                setAnswers(prev => ({
                    ...prev,
                    [questionIndex]: {
                        userAnswer,
                        isCorrect,
                        isAnswered: true
                    }
                }));

                // Show feedback
                setShowFeedback(prev => ({
                    ...prev,
                    [questionIndex]: true
                }));
                
                // Update stats
                if (isCorrect) {
                    setStats((prev) => ({
                        ...prev,
                        correct_answers: prev.correct_answers + 1,
                    }));
                } else {
                    setStats((prev) => ({
                        ...prev,
                        wrong_answers: prev.wrong_answers + 1,
                    }));
                }
            },
            onError: (error: any) => {
                console.error("Error checking answer:", error);
            }
        });
    }, [checkAnswerMutation, currentQuestion, options, selectedChoice, questionIndex, hasAnswered]);

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

    // Handle navigation - only navigate, don't auto-submit
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

            if (key === "1") {
                setSelectedChoice(0);
            } else if (key === "2") {
                setSelectedChoice(1);
            } else if (key === "3") {
                setSelectedChoice(2);
            } else if (key === "4") {
                setSelectedChoice(3);
            } else if (key === "Enter") {
                if (!hasAnswered) {
                    handleSubmitAnswer();
                } else {
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
    }, [handleSubmitAnswer, handleNext, handlePrevious, hasAnswered]);

    if (hasEnded) {
        return (
            <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-300 rounded-md whitespace-nowrap">
                    You Completed in{" "}
                    {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
                </div>
                <Link
                    href={`/statistics/${game.id}`}
                    className={cn(buttonVariants({ size: "lg" }), "mt-2")}
                >
                    View Statistics
                    <BarChart className="w-4 h-4 ml-2" />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
            <div className="w-[95vw] sm:w-[90vw] md:w-[90vw] max-w-4xl max-h-[90vh] overflow-x-auto">
                <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
                <div className="flex flex-col">
                    <p className="text-sm sm:text-base">
                        <span className="text-lg sm:text-xl">Topic : </span> &nbsp;
                        <span className="px-2 py-1 text-white rounded-lg bg-slate-800 text-sm sm:text-base">
                            {game.topic}
                        </span>
                    </p>
                    <div className="flex self-start mt-2 sm:mt-3 text-sm sm:text-base">
                        <Timer className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                        {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
                    </div>
                </div>
                <div className="flex justify-end sm:justify-start">
                    <MCQCounter
                        correct_answers={stats.correct_answers}
                        wrong_answers={stats.wrong_answers}
                    />
                </div>
            </div>
            <Card className="w-full mt-4">
                <CardHeader className="flex flex-row items-center gap-3 p-4 sm:p-6">
                    <CardTitle className="text-center divide-y min-w-[20px] sm:min-w-[30px] mr-3 sm:mr-5 flex-shrink-0 ">
                        <div className="text-lg sm:text-xl lg:text-2xl">{questionIndex + 1}</div>
                        <div className="text-xs sm:text-sm lg:text-base">
                            {game.questions.length}
                        </div>
                    </CardTitle>
                    <CardDescription className="flex-grow text-sm sm:text-base lg:text-lg leading-relaxed">
                        {currentQuestion?.question}
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="flex flex-col items-center justify-center w-full mt-4 space-y-3 sm:space-y-4">
                {options.length === 0 ? (
                    <div className="p-4 text-center ">
                        <p>No options available for this question.</p>
                        <p className="text-sm mt-2">Debug info:</p>
                        <pre className="text-xs p-2 rounded mt-2">
                            {JSON.stringify({
                                hasCurrentQuestion: !!currentQuestion,
                                questionId: currentQuestion?.id,
                                rawOptions: currentQuestion?.options,
                                optionsType: typeof currentQuestion?.options
                            }, null, 2)}
                        </pre>
                    </div>
                ) : (
                    options.map((option, index) => {
                        const isSelected = selectedChoice === index;
                        const isCorrectOption = currentAnswer?.isAnswered && option === currentQuestion?.answer;
                        const isWrongOption = currentAnswer?.isAnswered && isSelected && !currentAnswer.isCorrect;
                        
                        return (
                            <Button
                                key={`option-${index}`}
                                variant={
                                    isCorrectOption && shouldShowFeedback
                                        ? "default"
                                        : isWrongOption && shouldShowFeedback
                                        ? "destructive"
                                        : isSelected
                                        ? "default"
                                        : "outline"
                                }
                                className={cn(
                                    "justify-start w-full py-6 sm:py-8 mb-3 sm:mb-4 cursor-pointer transition-all text-left",
                                    isCorrectOption && shouldShowFeedback && "bg-green-600 hover:bg-green-700",
                                    isWrongOption && shouldShowFeedback && "bg-red-600 hover:bg-red-700",
                                    !hasAnswered && !isSelected 
                                )}
                                onClick={() => {
                                    console.log(`Clicked option ${index}, hasAnswered: ${hasAnswered}`);
                                    if (!hasAnswered) {
                                        setSelectedChoice(index);
                                        console.log(`Selected choice set to: ${index}`);
                                    }
                                }}
                                disabled={hasAnswered}
                            >
                                <div className="flex items-start sm:items-center justify-start w-full">
                                    <div className="p-2 px-3 mr-3 sm:mr-5 border rounded-md flex-shrink-0 text-sm sm:text-base">
                                        {index + 1}
                                    </div>
                                    <div className="text-start text-sm sm:text-base leading-relaxed">{option}</div>
                                </div>
                            </Button>
                        );
                    })
                )}

                {/* Navigation */}
                <QuizNavigation
                    currentIndex={questionIndex}
                    totalQuestions={game.questions.length}
                    onPrevious={() => handleNavigation('previous')}
                    onNext={() => handleNavigation('next')}
                    onSubmit={handleSubmitAnswer}
                    canGoNext={hasAnswered || !currentQuestion}
                    canSubmit={!hasAnswered && selectedChoice >= 0}
                    isLoading={checkAnswerMutation.isPending}
                    hasAnswered={hasAnswered}
                    currentQuestion={currentQuestion ? {
                        question: currentQuestion.question,
                        answer: currentQuestion.answer
                    } : undefined}
                    userAnswer={currentAnswer?.userAnswer || ""}
                    isCorrect={currentAnswer?.isCorrect || false}
                />
            </div>
            </div>
        </div>
    );
};

export default MCQ;