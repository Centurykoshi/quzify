import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { strict_output, generateText } from "@/lib/gemini";
import { questionGenerationSchema } from "@/schemas/forms/quiz";

export const questionsRouter = createTRPCRouter({
    // Just generate questions - no database operations
    generate: baseProcedure
        .input(questionGenerationSchema)
        .mutation(async ({ input }) => {
            try {
                if (input.type === "mcq") {
                    const questions = await strict_output(
                        "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words",
                        new Array(input.amount).fill(
                            `You are to generate a random hard mcq question about ${input.topic}`
                        ),
                        {
                            question: "question",
                            answer: "answer with max length of 15 words",
                            option1: "option1 with max length of 15 words",
                            option2: "option2 with max length of 15 words",
                            option3: "option3 with max length of 15 words",
                        }
                    );
                    return { questions };
                } else if (input.type === "open_ended") {
                    const questions = await strict_output(
                        "You are a helpful AI that is able to generate pair of question and answers, the length of each answer should not be more than 15 words",
                        new Array(input.amount).fill(
                            `You are to generate a random hard open-ended question about ${input.topic}`
                        ),
                        {
                            question: "question",
                            answer: "answer with max length of 15 words",
                        }
                    );
                    return { questions };
                }
            } catch (error) {
                console.error("Error generating questions:", error);
                throw new Error("Failed to generate questions");
            }
        }),

    // Generate explanation for an answer
    generateExplanation: baseProcedure
        .input(z.object({
            question: z.string(),
            correctAnswer: z.string(),
            userAnswer: z.string(),
            isCorrect: z.boolean(),
            isDetailed: z.boolean().optional().default(false)
        }))
        .mutation(async ({ input }) => {
            try {
                const detailLevel = input.isDetailed ? "detailed" : "brief";
                
                let prompt: string;
                if (input.isCorrect) {
                    prompt = `You are a helpful AI tutor. The student correctly answered "${input.correctAnswer}" for the question: "${input.question}". 

Please provide a ${detailLevel} explanation of why this answer is correct. ${input.isDetailed ? 'Include examples, context, and deeper insights.' : 'Keep it concise and clear.'}`;
                } else {
                    prompt = `You are a helpful AI tutor. The student incorrectly answered "${input.userAnswer}" instead of the correct answer "${input.correctAnswer}" for the question: "${input.question}". 

Please provide a ${detailLevel} explanation of:
1. Why their answer "${input.userAnswer}" was incorrect
2. Why "${input.correctAnswer}" is the correct answer
${input.isDetailed ? '3. Include examples, context, and tips to avoid this mistake in the future.' : ''}

${input.isDetailed ? 'Provide a detailed explanation with examples.' : 'Keep the explanation concise but clear.'}`;
                }

                const explanation = await generateText(prompt);
                return { explanation };
            } catch (error) {
                console.error("Error generating explanation:", error);
                // Fallback explanation if AI fails
                
            }
        })
});
