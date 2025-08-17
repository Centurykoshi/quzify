
import { createTRPCRouter } from '../init';
import { gameRouter } from '@/modules/game/server/game';
import { questionsRouter } from '@/modules/questions/server/questions';
import { checkAnswerRouter } from '@/modules/checkAnswer/server/checkAnswer';

export const appRouter = createTRPCRouter({
  game: gameRouter,
  questions: questionsRouter,
  checkAnswer: checkAnswerRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;