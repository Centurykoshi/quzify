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
                        "You are a helpful AI that generates challenging multiple choice questions. Create questions where the correct answer is not obvious from the options. All options should be plausible and similar in format. Do not include extra details in any option that would give away the answer.",
                        new Array(input.amount).fill(
                            `Generate a challenging multiple choice question about ${input.topic}. Make sure:
                            1. The question is clear and specific
                            2. All 4 options are plausible and similar in format
                            3. The correct answer doesn't contain extra information that makes it obvious
                            4. Incorrect options are realistic distractors
                            5. Keep all answers concise (max 10 words each)`
                        ),
                        {
                            question: "A clear, specific question",
                            answer: "The correct answer (concise, max 10 words)",
                            option1: "First plausible option (max 10 words)",
                            option2: "Second plausible option (max 10 words)", 
                            option3: "Third plausible option (max 10 words)",
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

Please provide a ${detailLevel} explanation of why this answer is correct. ${input.isDetailed ? 'Include examples, context, and deeper insights.' : 'Keep it concise and clear.'}

IMPORTANT: Write in plain text only. Do not use any markdown formatting, asterisks (*), slashes (/), or special characters for emphasis. Use clear, simple sentences.`;
                } else {
                    prompt = `You are a helpful AI tutor. The student incorrectly answered "${input.userAnswer}" instead of the correct answer "${input.correctAnswer}" for the question: "${input.question}". 

Please provide a ${detailLevel} explanation of:
1. Why their answer "${input.userAnswer}" was incorrect
2. Why "${input.correctAnswer}" is the correct answer
${input.isDetailed ? '3. Include examples, context, and tips to avoid this mistake in the future.' : ''}

${input.isDetailed ? 'Provide a detailed explanation with examples.' : 'Keep the explanation concise but clear.'}

IMPORTANT: Write in plain text only. Do not use any markdown formatting, asterisks (*), slashes (/), or special characters for emphasis. Use clear, simple sentences.`;
                }

                let explanation = await generateText(prompt);
                
                // Clean up any remaining formatting characters
                explanation = explanation
                    .replace(/\*\*\*/g, '') // Remove triple asterisks
                    .replace(/\*\*/g, '')  // Remove double asterisks  
                    .replace(/\*/g, '')    // Remove single asterisks
                    .replace(/\/\/.*$/gm, '') // Remove comment lines starting with //
                    .replace(/#{1,6}\s*/g, '') // Remove markdown headers
                    .replace(/`{1,3}/g, '')    // Remove code formatting
                    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to plain text
                    .replace(/\s+/g, ' ')      // Normalize whitespace
                    .trim();
                return { explanation };
            } catch (error) {
                console.error("Error generating explanation:", error);
                // Fallback explanation if AI fails
                
            }
        })
});
