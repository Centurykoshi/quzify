"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { HistoryIcon } from "lucide-react";

export default function HistoryCard() { 

    const router = useRouter();

    return(

        <Card className="hover:cursor-pointer hover:opacity-75 rounded-none"
        onClick={()=> router.push("/history")}>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl"> History </CardTitle>
                <HistoryIcon size={28} strokeWidth={2} />
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground">
                    View your quiz history and progress.
                </p>
            </CardContent>

        </Card>

    ); 

}; 