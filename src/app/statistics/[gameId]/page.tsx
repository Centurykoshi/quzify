import AccuracyCard from "@/components/statistics/AccuracyCard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import ResultsCard from "@/components/statistics/ResultsCard";
import TimeTakenCard from "@/components/statistics/TimeTakenCard";
import QuestionsList from "@/components/statistics/QuestionList";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type props= { 
    params : Promise<{ 
        gameId: string; 
    }>
}

export default async function Page({ params }: props) {
    const { gameId } = await params;

    const session = await auth.api.getSession({
        headers : await headers(), 
    })

    if(!session?.user){ 
        return redirect("/");
    }

    const game = await prisma.game.findUnique({
        where : { 
            id : gameId
        }, 
        include : { questions : true}
    }); 

    if(!game){ 
        return redirect("/");
    }

    let accuracy : number = 0; 
  if (game.gameType === "mcq") {
    let totalCorrect = game.questions.reduce((acc, question) => {
      if (question.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);
    accuracy = (totalCorrect / game.questions.length) * 100;
  } else if (game.gameType === "open_ended") {
    let totalPercentage = game.questions.reduce((acc, question) => {
      return acc + (question.percentageCorrect ?? 0);
    }, 0);
    accuracy = totalPercentage / game.questions.length;
  }
  accuracy = Math.round(accuracy * 100) / 100;
  return (
    <>
      <div className=" mt-20 p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Summary</h2>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard" className="cursor-pointer flex items-center justify-center">
                    <Button className="text-xs cursor-pointer" variant={"outline"}>
                      <LayoutDashboard />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-7">
          <ResultsCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
          <TimeTakenCard
            timeEnded={new Date(game.timeEnded ?? 0)}
            timeStarted={new Date(game.timeStarted ?? 0)}
          />
        </div>
        <QuestionsList questions={game.questions} />
      </div>
    </>
  );
};


