"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {TextSearch } from "lucide-react";


const QuizMeCard = () => { 
    const router = useRouter();

    return (
        <Card className="hover:cursor-pointer hover:opacity-75 rounded-none"
        onClick={()=>{router.push("/quiz");}}>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-2xl ">Quiz Me </CardTitle>
                <TextSearch size={28} strokeWidth={2.5} />
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground ">
                    Test your knowledge with our quiz!
                </p>
            </CardContent>

        </Card>
    );
};

export default QuizMeCard;