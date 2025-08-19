import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

type Props = {
  correct_answers: number;
  wrong_answers: number;
};

const MCQCounter = ({ correct_answers, wrong_answers }: Props) => {
  return (
    <Card className="flex flex-row items-center justify-center px-4 py-2 gap-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-6 w-6 text-green-300" />
        <span className="text-xl font-semibold">{correct_answers}</span>
      </div>

      <div className="h-6 w-px bg-border" />

      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold">{wrong_answers}</span>
        <XCircle className="h-6 w-6 text-red-300" />
      </div>
    </Card>
  );
};

export default MCQCounter;