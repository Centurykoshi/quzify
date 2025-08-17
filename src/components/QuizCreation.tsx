"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BookOpen, CopyCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { quizCreationSchema, type QuizCreationInput } from "@/schemas/forms/quiz";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

type Props = {
    topic: string;
}

const QuizCreation = ({ topic }: Props) => {
    const router = useRouter();
    const [showLoader, setShowLoader] = useState(false);
    const [finishedLoading, setFinishedLoading] = useState(false);
    const trpc = useTRPC();
    // Add this to your imports


    const form = useForm<QuizCreationInput>({
        resolver: zodResolver(quizCreationSchema),
        defaultValues: { topic: "", type: "mcq", amount: 1 },
    });

    const { mutateAsync: getQuestion, isPending } = useMutation(trpc.game.create.mutationOptions({
        onSuccess: (data) => {
            toast.success("Quiz created successfully!");
        },
        onError: (error) => {
            toast.error(`Error: ${error}`);
        }
    }));

    const generateQuestion = useMutation(trpc.questions.generate.mutationOptions({
    }));

    const saveQuestions = useMutation(trpc.game.saveQuestions.mutationOptions({})); 

    const onSubmit = async (data: QuizCreationInput) => {
        setShowLoader(true);
        try {
            // 1. Create the game first
            const result = await getQuestion(data);
            
            // 2. Generate questions using AI
            const questionsResult = await generateQuestion.mutateAsync({
                topic: data.topic,
                type: data.type,
                amount: data.amount
            });
            
            // 3. Save questions to the game
            if (questionsResult?.questions) {
                await saveQuestions.mutateAsync({
                    gameId: result.gameId,
                    questions: questionsResult.questions,
                    type: data.type
                });
            }
            
            setFinishedLoading(true);
            toast.success("Quiz created successfully!");
            setTimeout(() => {
                if (form.getValues("type") === "mcq") {
                    router.push(`/play/mcq/${result.gameId}`);
                } else if (form.getValues("type") === "open_ended") {
                    router.push(`/play/open-ended/${result.gameId}`);
                }
            }, 2000);
        } catch (error) {
            setShowLoader(false);
            console.error("Quiz creation error:", error);
            toast.error(`Error creating quiz: ${error}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <Card className="w-[80vw] max-w-2xl rounded-none">
                <CardHeader className="flex flex-col items-center justify-between space-y-0">
                    <CardTitle className="text-2xl">
                        Quiz Creation
                    </CardTitle>
                    <CardDescription>
                        Choose a topic
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="topic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Topic</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter a topic" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Please provide any topic you would like to be quizzed on here.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of Questions</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="How many questions?"
                                                type="number"
                                                {...field}
                                                onChange={(e) => {
                                                    form.setValue("amount", parseInt(e.target.value));
                                                }}
                                                min={1}
                                                max={20}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            You can choose how many questions you would like to be quizzed on here.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Quiz Type </FormLabel>
                            
                                <FormControl>
                      
                            <div className="flex justify-between">
                                <Button
                                    variant={form.getValues("type") === "mcq" ? "default" : "secondary"}
                                    className="w-1/2 rounded-none "
                                    onClick={() => form.setValue("type", "mcq")}
                                    type="button"
                                >
                                    <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                                </Button>
                                <Separator orientation="vertical" />
                                <Button
                                    variant={form.getValues("type") === "open_ended" ? "default" : "secondary"}
                                    className="w-1/2 rounded-none"
                                    onClick={() => form.setValue("type", "open_ended")}
                                    type="button"
                                >
                                    <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                                </Button>
                            </div>
                            </FormControl>
                            <FormDescription>
                                Choose Between Multiple choice or open-ended questions.
                            </FormDescription>
                            <FormMessage />
                                </FormItem>
    )}
    />


                            <Button disabled={isPending} type="submit" className="w-full">
                                Submit
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default QuizCreation;
