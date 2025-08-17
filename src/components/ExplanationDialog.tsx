import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, Loader2 } from "lucide-react";

type Props = {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
};

const ExplanationDialog = ({ question, correctAnswer, userAnswer, isCorrect }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [explanation, setExplanation] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGetExplanation = () => {
    setIsLoading(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleGetExplanation}
          className="ml-2"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Explain
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Answer Explanation</DialogTitle>
          <DialogDescription>
            Understanding why this answer is {isCorrect ? 'correct' : 'incorrect'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700">Question:</p>
            <p className="text-gray-900">{question}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-medium text-green-00">Correct Answer:</p>
              <p className="text-green-900">{correctAnswer}</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${
              isCorrect 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`font-medium ${
                isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                Your Answer:
              </p>
              <p className={isCorrect ? 'text-green-900' : 'text-red-900'}>
                {userAnswer}
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-700 mb-2">Explanation:</p>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-blue-600">Generating explanation...</span>
              </div>
            ) : explanation ? (
              <p className="text-blue-900">{explanation}</p>
            ) : (
              <p className="text-blue-600">Click "Explain" to generate an explanation.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExplanationDialog;
