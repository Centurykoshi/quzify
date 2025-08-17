import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Brain, BookOpen } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

type Props = {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoNext: boolean;
  canSubmit: boolean;
  isLoading?: boolean;
  hasAnswered: boolean;
  currentQuestion?: {
    question: string;
    answer: string;
  };
  userAnswer?: string;
  isCorrect?: boolean;
};

const QuizNavigation = ({ 
  currentIndex, 
  totalQuestions, 
  onPrevious, 
  onNext, 
  onSubmit,
  canGoNext, 
  canSubmit,
  isLoading = false,
  hasAnswered,
  currentQuestion,
  userAnswer = "",
  isCorrect = false
}: Props) => {
  const canGoPrevious = currentIndex > 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const [explanation, setExplanation] = useState("");
  
  // Reset explanation when question changes
  useEffect(() => {
    setExplanation("");
  }, [currentIndex]);
  
  // tRPC setup for generating explanations
  const trpc = useTRPC();
  const generateExplanationMutation = useMutation(trpc.questions.generateExplanation.mutationOptions({}));

  const handleExplanation = async (isDetailed: boolean) => {
    if (!currentQuestion) {
      console.log("No current question available");
      return;
    }
    
    console.log("Generating explanation with:", {
      question: currentQuestion.question,
      correctAnswer: currentQuestion.answer,
      userAnswer: userAnswer,
      isCorrect: isCorrect,
      isDetailed: isDetailed
    });
    
    try {
      const result = await generateExplanationMutation.mutateAsync({
        question: currentQuestion.question,
        correctAnswer: currentQuestion.answer,
        userAnswer: userAnswer,
        isCorrect: isCorrect,
        isDetailed: isDetailed
      });
      
      console.log("Explanation result:", result);
      
      if (result && result.explanation) {
        setExplanation(result.explanation);
      } else {
        console.error("Result or explanation is undefined:", result);
        setExplanation("Sorry, I couldn't generate an explanation at this time. Please try again.");
      }
    } catch (error) {
      console.error("Error generating explanation:", error);
      setExplanation("Sorry, I couldn't generate an explanation at this time. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full mt-6 space-y-4">
      {/* Navigation Buttons - All same size and aligned */}
      <div className="flex justify-center items-center w-full gap-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious || isLoading}
          className="flex items-center space-x-2 px-6 py-3 min-w-[120px]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        
        {/* Submit Answer Button in the middle */}
        {!hasAnswered ? (
          <Button
            onClick={onSubmit}
            disabled={!canSubmit || isLoading}
            className="flex items-center space-x-2 px-6 py-3 min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              'Submit Answer'
            )}
          </Button>
        ) : (
          <div className="min-w-[120px]"></div>
        )}
        
        <Button
          variant={isLastQuestion ? "default" : "outline"}
          onClick={onNext}
          disabled={!canGoNext || isLoading}
          className="flex items-center space-x-2 px-6 py-3 min-w-[120px]"
        >
          <span>
            {!canGoNext && !isLastQuestion ? "Answer First" : 
             isLastQuestion ? "Finish Quiz" : "Next"}
          </span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Question counter below all buttons */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {currentIndex + 1} of {totalQuestions}
      </div>
      
      {/* AI Explanation Options - Show after answer is submitted */}
      {hasAnswered && (
        <div className="flex flex-col items-center space-y-3 w-full">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExplanation(false)}
              disabled={generateExplanationMutation.isPending}
              className="flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explain</span>
            </Button>
        
          </div>
          
          {/* Explanation Display */}
          {(explanation || generateExplanationMutation.isPending) && (
            <div className="w-full max-w-2xl p-4 rounded-none border">
              {generateExplanationMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating explanation...</span>
                </div>
              ) : (
                <p className=" whitespace-pre-wrap">{explanation}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizNavigation;
