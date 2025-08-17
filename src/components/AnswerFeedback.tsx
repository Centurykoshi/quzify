import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ExplanationDialog from "./ExplanationDialog";

type Props = {
  isAnswered: boolean;
  isCorrect?: boolean;
  correctAnswer: string;
  userAnswer: string;
  question: string;
  showFeedback: boolean;
};

const AnswerFeedback = ({ 
  isAnswered, 
  isCorrect, 
  correctAnswer, 
  userAnswer, 
  question,
  showFeedback 
}: Props) => {
  if (!isAnswered || !showFeedback) return null;

  const isCorrectAnswer = isCorrect === true;

  return (
    <Card className={cn(
      "mt-4 border-2",
      isCorrectAnswer 
        ? "border-green-200 bg-green-50" 
        : "border-red-200 bg-red-50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {isCorrectAnswer ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            
            <div className="space-y-2">
              <div className={cn(
                "font-medium",
                isCorrectAnswer ? "text-green-800" : "text-red-800"
              )}>
                {isCorrectAnswer ? "Correct!" : "Incorrect"}
              </div>
              
              {!isCorrectAnswer && (
                <div className="space-y-1">
                  <div className="text-sm text-red-700">
                    Your answer: <span className="font-medium">{userAnswer}</span>
                  </div>
                  <div className="text-sm text-green-700">
                    Correct answer: <span className="font-medium">{correctAnswer}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <ExplanationDialog
            question={question}
            correctAnswer={correctAnswer}
            userAnswer={userAnswer}
            isCorrect={isCorrectAnswer}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerFeedback;
