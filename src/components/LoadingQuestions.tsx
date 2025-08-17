import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface LoadingQuestionsProps {
  finished: boolean;
}

const LoadingQuestions = ({ finished }: LoadingQuestionsProps) => {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <div className="flex flex-col items-center w-[70vw] max-w-[400px]">
        <div className="mt-4">
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Generating questions...</span>
          </div>
        </div>
        <Progress 
          value={finished ? 100 : 75} 
          className="w-full mt-4"
        />
        {finished && (
          <p className="mt-2 text-sm text-green-600">
            Quiz created! Redirecting...
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingQuestions;
