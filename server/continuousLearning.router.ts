/**
 * Continuous Learning Router v3.0.0
 * 
 * Expõe funcionalidades de aprendizado contínuo via tRPC
 */

import { z } from 'zod';
import { protectedProcedure, router } from '../../_core/trpc';
import { continuousLearning } from '../../_core/v3/continuousLearning';

export const continuousLearningRouter = router({
  /**
   * Melhora o modelo automaticamente
   */
  improve: protectedProcedure
    .input(
      z.object({
        model: z.string(),
        data: z.unknown(),
        feedback: z.unknown(),
        iterations: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await continuousLearning.improve({
        model: input.model,
        data: input.data,
        feedback: input.feedback,
        iterations: input.iterations,
      });
    }),

  /**
   * Adapta algoritmo ao contexto
   */
  adaptAlgorithm: protectedProcedure
    .input(
      z.object({
        algorithm: z.string(),
        context: z.unknown(),
        performance: z.record(z.string(), z.number()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await continuousLearning.adaptAlgorithm({
        algorithm: input.algorithm,
        context: input.context,
        performance: input.performance,
      });
    }),

  /**
   * Prevê comportamento do usuário
   */
  predictBehavior: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        timeframe: z.string(),
        confidence: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await continuousLearning.predictBehavior({
        userId: input.userId,
        timeframe: input.timeframe,
        confidence: input.confidence,
      });
    }),

  /**
   * Otimiza performance através de variações
   */
  optimize: protectedProcedure
    .input(
      z.object({
        metric: z.string(),
        variations: z.number(),
        duration: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await continuousLearning.optimize({
        metric: input.metric,
        variations: input.variations,
        duration: input.duration,
      });
    }),

  /**
   * Executa ciclo completo de aprendizado
   */
  executeFullCycle: protectedProcedure
    .input(
      z.object({
        model: z.string(),
        data: z.unknown(),
        feedback: z.unknown(),
        metric: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await continuousLearning.executeFullCycle({
        model: input.model,
        data: input.data,
        feedback: input.feedback,
        metric: input.metric,
      });
    }),
});

export default continuousLearningRouter;
