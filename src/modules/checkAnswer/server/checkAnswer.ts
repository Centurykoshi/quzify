import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { checkAnswerSchema } from "@/schemas/questions";
import { distance } from "fastest-levenshtein";

export const checkAnswerRouter = createTRPCRouter({
    // Check if user's answer is correct
    checkAnswer: baseProcedure
        .input(checkAnswerSchema)
        .mutation(async ({ input, ctx }) => {
            if (!ctx.userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to check answers.',
                });
            }

            try {
                const { questionId, userInput } = input;

                // Get the question and verify ownership
                const question = await prisma.question.findUnique({
                    where: { id: questionId },
                    include: { 
                        game: {
                            select: { userId: true }
                        }
                    },
                });

                if (!question) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Question not found.',
                    });
                }

                // Verify the question belongs to the user's game
                if (question.game.userId !== ctx.userId) {
                    throw new TRPCError({
                        code: 'FORBIDDEN',
                        message: 'You can only answer questions from your own games.',
                    });
                }

                // Update the question with user's answer
                await prisma.question.update({
                    where: { id: questionId },
                    data: { userAnswer: userInput },
                });

                // Handle MCQ questions
                if (question.questionType === "mcq") {
                    const isCorrect = question.answer.toLowerCase().trim() === userInput.toLowerCase().trim();
                    
                    await prisma.question.update({
                        where: { id: questionId },
                        data: { isCorrect },
                    });

                    return { isCorrect };
                }

                // Handle open-ended questions
                if (question.questionType === "open_ended") {
                    const answer = question.answer.toLowerCase().trim();
                    const userAnswer = userInput.toLowerCase().trim();
                    
                    // Calculate similarity using Levenshtein distance
                    const maxLength = Math.max(answer.length, userAnswer.length);
                    const levenshteinDistance = distance(answer, userAnswer);
                    let percentageSimilar = Math.round(((maxLength - levenshteinDistance) / maxLength) * 100);
                    
                    // Ensure percentage is between 0 and 100
                    percentageSimilar = Math.max(0, Math.min(100, percentageSimilar));

                    await prisma.question.update({
                        where: { id: questionId },
                        data: { percentageCorrect: percentageSimilar },
                    });

                    return { percentageSimilar };
                }

                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Invalid question type.',
                });

            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                }
                console.error("Error checking answer:", error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to check answer',
                });
            }
        }),

    // End game and update timeEnded
    endGame: baseProcedure
        .input(z.object({ gameId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            if (!ctx.userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to end games.',
                });
            }

            try {
                const game = await prisma.game.findUnique({
                    where: { 
                        id: input.gameId,
                        userId: ctx.userId // Only allow users to end their own games
                    },
                });

                if (!game) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Game not found or you do not have permission to end this game.',
                    });
                }

                const updatedGame = await prisma.game.update({
                    where: { id: input.gameId },
                    data: { timeEnded: new Date() },
                });

                return { success: true, game: updatedGame };

            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                }
                console.error("Error ending game:", error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to end game',
                });
            }
        })
});
