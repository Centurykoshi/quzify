import { z } from "zod";

export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userInput: z.string(),
});

export const endGameSchema = z.object({
  gameId: z.string(),
});
