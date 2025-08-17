import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { quizCreationSchema } from "@/schemas/forms/quiz";

export const gameRouter = createTRPCRouter({
    // Create game and save questions to database
    create: baseProcedure
        .input(quizCreationSchema)
        .mutation(async({input, ctx})=> { 
            const { topic, type, amount } = input;

            // Check if user is logged in
            if (!ctx.userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to create a game.',
                });
            }

            try {
                // 1. Create the game record
                const game = await prisma.game.create({
                    data: {
                        gameType: type,
                        timeStarted: new Date(),
                        userId: ctx.userId, // Use actual logged-in user ID
                        topic,
                    },
                });

                // 2. Track topic popularity
                await prisma.topic_count.upsert({
                    where: { topic },
                    create: { topic, count: 1 },
                    update: { count: { increment: 1 } },
                });

                return { gameId: game.id };

            } catch (error) {
                console.error("Error creating game:", error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to create game',
                });
            }
        }),

    // Save generated questions to a game
    saveQuestions: baseProcedure
        .input(z.object({
            gameId: z.string(),
            questions: z.array(z.any()), // We'll type this better later
            type: z.enum(["mcq", "open_ended"]),
        }))
        .mutation(async ({ input }) => {
            try {
                if (input.type === "mcq") {
                    // Process MCQ questions with shuffled options
                    const manyData = input.questions.map((question: any) => {
                        const options = [
                            question.option1,
                            question.option2,
                            question.option3,
                            question.answer,
                        ].sort(() => Math.random() - 0.5);

                        return {
                            question: question.question,
                            answer: question.answer,
                            options: JSON.stringify(options),
                            gameId: input.gameId,
                            questionType: "mcq" as const,
                        };
                    });

                    await prisma.question.createMany({
                        data: manyData,
                    });

                } else if (input.type === "open_ended") {
                    // Process open-ended questions
                    await prisma.question.createMany({
                        data: input.questions.map((question: any) => ({
                            question: question.question,
                            answer: question.answer,
                            gameId: input.gameId,
                            questionType: "open_ended" as const,
                        })),
                    });
                }

                return { success: true };

            } catch (error) {
                console.error("Error saving questions:", error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to save questions',
                });
            }
        }),

    // Get game by ID with questions
    getById: baseProcedure
        .input(z.object({ gameId: z.string() }))
        .query(async ({ input, ctx }) => {
            // Check if user is logged in
            if (!ctx.userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to view games.',
                });
            }

            const game = await prisma.game.findUnique({
                where: { 
                    id: input.gameId,
                    userId: ctx.userId // Only allow users to view their own games
                },
                include: { questions: true },
            });

            if (!game) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Game not found.',
                });
            }

            return { game };
        })
});
