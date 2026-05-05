/**
 * Intelligent Goals Router v3.0.0
 * 
 * Expõe funcionalidades de objetivos inteligentes via tRPC
 */

import { z } from 'zod';
import { protectedProcedure, router } from '../../_core/trpc';
import { intelligentGoals } from '../../_core/v3/intelligentGoals';

export const intelligentGoalsRouter = router({
  /**
   * Gera objetivos inteligentes
   */
  generate: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        data: z.unknown(),
        timeframe: z.string(),
        ambition: z.enum(['low', 'medium', 'high']),
      })
    )
    .mutation(async ({ input }) => {
      return await intelligentGoals.generate({
        userId: input.userId,
        data: input.data,
        timeframe: input.timeframe,
        ambition: input.ambition,
      });
    }),

  /**
   * Rastreia objetivo
   */
  track: protectedProcedure
    .input(
      z.object({
        goalId: z.string(),
        progress: z.number(),
        feedback: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await intelligentGoals.track({
        goalId: input.goalId,
        progress: input.progress,
        feedback: input.feedback,
      });
    }),

  /**
   * Prevê sucesso do objetivo
   */
  predictSuccess: protectedProcedure
    .input(
      z.object({
        goalId: z.string(),
        factors: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .query(async ({ input }) => {
      return await intelligentGoals.predictSuccess({
        goalId: input.goalId,
        factors: input.factors,
      });
    }),

  /**
   * Gera marcos para objetivo
   */
  generateMilestones: protectedProcedure
    .input(
      z.object({
        goalId: z.string(),
        steps: z.number(),
        difficulty: z.enum(['easy', 'medium', 'hard']),
      })
    )
    .mutation(async ({ input }) => {
      return await intelligentGoals.generateMilestones({
        goalId: input.goalId,
        steps: input.steps,
        difficulty: input.difficulty,
      });
    }),

  /**
   * Executa ciclo completo
   */
  executeFullCycle: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        data: z.unknown(),
        timeframe: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await intelligentGoals.executeFullCycle({
        userId: input.userId,
        data: input.data,
        timeframe: input.timeframe,
      });
    }),
});

export default intelligentGoalsRouter;
