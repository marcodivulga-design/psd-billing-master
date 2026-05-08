import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getAIService } from '../lib/core/ai-advanced-service';

export const aiAdvancedRouter = router({
  /**
   * Prever churn do usuário
   */
  predictChurn: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const aiService = getAIService();
      
      // Buscar perfil do usuário do banco
      const userProfile = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, input.userId),
      });

      if (!userProfile) {
        throw new Error('User not found');
      }

      // Buscar histórico de compras
      const orders = await ctx.db.query.orders.findMany({
        where: (orders, { eq }) => eq(orders.userId, input.userId),
      });

      // Montar perfil para análise
      const profile = {
        userId: input.userId,
        organizationId: ctx.user.organizationId,
        behavior: {
          totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
          averageOrderValue: orders.length > 0 
            ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length 
            : 0,
          purchaseFrequency: orders.length / 12, // por mês
          lastPurchaseDate: orders.length > 0 
            ? new Date(Math.max(...orders.map(o => o.createdAt.getTime())))
            : new Date(),
          preferredCategories: ['knives', 'accessories'],
          preferredPriceRange: [50, 200] as [number, number],
        },
        preferences: {
          communicationChannel: 'email' as const,
          frequency: 'weekly' as const,
          interests: ['knives', 'craftsmanship'],
        },
      };

      // Executar análise preditiva
      const prediction = await aiService.predictChurn(profile);

      // Salvar resultado no banco
      await ctx.db.insert(schema.churnPredictions).values({
        userId: input.userId,
        organizationId: ctx.user.organizationId,
        churnProbability: prediction.churnProbability,
        nextPurchaseDate: prediction.nextPurchaseDate,
        estimatedLifetimeValue: prediction.estimatedLifetimeValue,
        recommendedProducts: prediction.recommendedProducts,
        recommendedOffer: prediction.recommendedOffer,
        createdAt: new Date(),
      });

      return prediction;
    }),

  /**
   * Personalizar conteúdo da página
   */
  personalizeContent: protectedProcedure
    .input(z.object({
      currentPage: z.string(),
      browsedProducts: z.array(z.string()),
      cartValue: z.number(),
      sessionDuration: z.number(),
      deviceType: z.enum(['mobile', 'desktop', 'tablet']),
    }))
    .query(async ({ input, ctx }) => {
      const aiService = getAIService();

      const timeOfDay = new Date().getHours() < 12 ? 'morning' : 
                        new Date().getHours() < 18 ? 'afternoon' : 
                        new Date().getHours() < 21 ? 'evening' : 'night';

      const personalization = await aiService.personalizeContent({
        userId: ctx.user.id,
        currentPage: input.currentPage,
        browsedProducts: input.browsedProducts,
        cartValue: input.cartValue,
        sessionDuration: input.sessionDuration,
        deviceType: input.deviceType,
        timeOfDay: timeOfDay as any,
      });

      // Salvar no banco para análise
      await ctx.db.insert(schema.personalizations).values({
        userId: ctx.user.id,
        organizationId: ctx.user.organizationId,
        page: input.currentPage,
        headline: personalization.headline,
        subheadline: personalization.subheadline,
        cta: personalization.cta,
        createdAt: new Date(),
      });

      return personalization;
    }),

  /**
   * Obter recomendações em tempo real
   */
  getRecommendations: protectedProcedure
    .input(z.object({
      productId: z.string(),
      limit: z.number().default(5),
    }))
    .query(async ({ input, ctx }) => {
      const aiService = getAIService();

      const recommendations = await aiService.getRealtimeRecommendations(
        ctx.user.id,
        input.productId,
        input.limit
      );

      // Salvar no banco
      await ctx.db.insert(schema.recommendations).values({
        userId: ctx.user.id,
        organizationId: ctx.user.organizationId,
        productId: input.productId,
        recommendedProducts: recommendations.map(r => r.productId),
        createdAt: new Date(),
      });

      return recommendations;
    }),

  /**
   * Analisar sentimento
   */
  analyzeSentiment: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const aiService = getAIService();

      const sentiment = await aiService.analyzeSentiment(input.text);

      // Salvar no banco
      await ctx.db.insert(schema.sentimentAnalysis).values({
        organizationId: ctx.user.organizationId,
        text: input.text,
        sentiment: sentiment.sentiment,
        score: sentiment.score,
        emotions: sentiment.emotions,
        actionRequired: sentiment.actionRequired,
        createdAt: new Date(),
      });

      return sentiment;
    }),

  /**
   * Gerar copywriting otimizado
   */
  generateOptimizedCopy: protectedProcedure
    .input(z.object({
      productName: z.string(),
      targetAudience: z.string(),
      tone: z.enum(['professional', 'casual', 'luxury', 'playful']),
    }))
    .mutation(async ({ input, ctx }) => {
      const aiService = getAIService();

      const copy = await aiService.generateOptimizedCopy(
        input.productName,
        input.targetAudience,
        input.tone
      );

      // Salvar no banco
      await ctx.db.insert(schema.generatedCopy).values({
        organizationId: ctx.user.organizationId,
        productName: input.productName,
        headline: copy.headline,
        description: copy.description,
        cta: copy.cta,
        createdAt: new Date(),
      });

      return copy;
    }),

  /**
   * Analisar concorrência
   */
  analyzeCompetition: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input, ctx }) => {
      const aiService = getAIService();

      const analysis = await aiService.analyzeCompetition(input.productId);

      // Salvar no banco
      await ctx.db.insert(schema.competitionAnalysis).values({
        organizationId: ctx.user.organizationId,
        productId: input.productId,
        competitorCount: analysis.competitorProducts.length,
        averagePrice: analysis.competitorProducts.reduce((sum, p) => sum + p.price, 0) / analysis.competitorProducts.length,
        priceStrategy: analysis.priceStrategy,
        createdAt: new Date(),
      });

      return analysis;
    }),

  /**
   * Segmentar clientes
   */
  segmentCustomers: protectedProcedure
    .query(async ({ ctx }) => {
      const aiService = getAIService();

      const segments = await aiService.segmentCustomers(ctx.user.organizationId);

      // Salvar no banco
      for (const segment of segments) {
        await ctx.db.insert(schema.customerSegments).values({
          organizationId: ctx.user.organizationId,
          name: segment.segment,
          size: segment.size,
          characteristics: segment.characteristics,
          recommendedStrategy: segment.recommendedStrategy,
          createdAt: new Date(),
        });
      }

      return segments;
    }),

  /**
   * Obter estatísticas de IA
   */
  getAIStats: protectedProcedure
    .query(async ({ ctx }) => {
      // Buscar estatísticas do banco
      const predictions = await ctx.db.query.churnPredictions.findMany({
        where: (cp, { eq }) => eq(cp.organizationId, ctx.user.organizationId),
      });

      const recommendations = await ctx.db.query.recommendations.findMany({
        where: (r, { eq }) => eq(r.organizationId, ctx.user.organizationId),
      });

      const sentiments = await ctx.db.query.sentimentAnalysis.findMany({
        where: (sa, { eq }) => eq(sa.organizationId, ctx.user.organizationId),
      });

      return {
        totalPredictions: predictions.length,
        averageChurnProbability: predictions.length > 0
          ? predictions.reduce((sum, p) => sum + p.churnProbability, 0) / predictions.length
          : 0,
        totalRecommendations: recommendations.length,
        sentimentAnalysis: {
          positive: sentiments.filter(s => s.sentiment === 'positive').length,
          negative: sentiments.filter(s => s.sentiment === 'negative').length,
          neutral: sentiments.filter(s => s.sentiment === 'neutral').length,
        },
      };
    }),
});
