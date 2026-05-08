import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getGamificationService } from '../lib/core/gamification-service';

export const gamificationRouter = router({
  /**
   * Obter conta de loyalty do usuário
   */
  getLoyaltyAccount: protectedProcedure
    .query(async ({ ctx }) => {
      // Buscar do banco
      let account = await ctx.db.query.loyaltyAccounts.findFirst({
        where: (la, { eq }) => eq(la.userId, ctx.user.id),
      });

      if (!account) {
        // Criar se não existir
        const gamificationService = getGamificationService();
        const newAccount = await gamificationService.createLoyaltyAccount(
          ctx.user.id,
          ctx.user.organizationId
        );

        await ctx.db.insert(schema.loyaltyAccounts).values({
          userId: ctx.user.id,
          organizationId: ctx.user.organizationId,
          points: 0,
          tier: 'bronze',
          totalSpent: 0,
          totalPoints: 0,
          joinedAt: new Date(),
          lastActivityAt: new Date(),
        });

        account = newAccount;
      }

      return account;
    }),

  /**
   * Adicionar pontos
   */
  addPoints: protectedProcedure
    .input(z.object({
      points: z.number().positive(),
      reason: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const gamificationService = getGamificationService();

      const account = await gamificationService.addPoints(
        ctx.user.id,
        input.points,
        input.reason
      );

      // Atualizar no banco
      await ctx.db.update(schema.loyaltyAccounts)
        .set({
          points: account.points,
          totalPoints: account.totalPoints,
          tier: account.tier,
          lastActivityAt: new Date(),
        })
        .where(eq(schema.loyaltyAccounts.userId, ctx.user.id));

      // Registrar transação
      await ctx.db.insert(schema.pointTransactions).values({
        userId: ctx.user.id,
        organizationId: ctx.user.organizationId,
        points: input.points,
        reason: input.reason,
        type: 'earned',
        createdAt: new Date(),
      });

      return account;
    }),

  /**
   * Usar pontos
   */
  redeemPoints: protectedProcedure
    .input(z.object({ points: z.number().positive() }))
    .mutation(async ({ input, ctx }) => {
      const gamificationService = getGamificationService();

      const result = await gamificationService.redeemPoints(ctx.user.id, input.points);

      if (result.success) {
        // Atualizar no banco
        await ctx.db.update(schema.loyaltyAccounts)
          .set({
            points: sql`points - ${input.points}`,
            lastActivityAt: new Date(),
          })
          .where(eq(schema.loyaltyAccounts.userId, ctx.user.id));

        // Registrar transação
        await ctx.db.insert(schema.pointTransactions).values({
          userId: ctx.user.id,
          organizationId: ctx.user.organizationId,
          points: input.points,
          reason: 'Redemption',
          type: 'redeemed',
          createdAt: new Date(),
        });
      }

      return result;
    }),

  /**
   * Desbloquear badge
   */
  unlockBadge: protectedProcedure
    .input(z.object({ badgeId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const gamificationService = getGamificationService();

      const badge = await gamificationService.unlockBadge(ctx.user.id, input.badgeId);

      // Salvar no banco
      await ctx.db.insert(schema.userBadges).values({
        userId: ctx.user.id,
        organizationId: ctx.user.organizationId,
        badgeId: input.badgeId,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        unlockedAt: badge.unlockedAt || new Date(),
      });

      // Notificar usuário
      // await notificationService.notifyBadge(ctx.user.id, badge);

      return badge;
    }),

  /**
   * Gerar código de referral
   */
  generateReferralCode: protectedProcedure
    .mutation(async ({ ctx }) => {
      const gamificationService = getGamificationService();

      const code = await gamificationService.generateReferralCode(
        ctx.user.id,
        ctx.user.organizationId
      );

      // Salvar no banco
      await ctx.db.insert(schema.referralCodes).values({
        code: code.code,
        userId: ctx.user.id,
        organizationId: ctx.user.organizationId,
        createdAt: code.createdAt,
        expiresAt: code.expiresAt,
        usedCount: 0,
        maxUses: code.maxUses,
        referrerPoints: code.reward.referrerPoints,
        refereeDiscount: code.reward.refereeDiscount,
      });

      return code;
    }),

  /**
   * Usar código de referral
   */
  useReferralCode: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const gamificationService = getGamificationService();

      const reward = await gamificationService.validateReferralCode(input.code, ctx.user.id);

      if (reward) {
        // Salvar no banco
        await ctx.db.insert(schema.referralRewards).values({
          referrerId: reward.referrerId,
          refereeId: reward.refereeId,
          organizationId: ctx.user.organizationId,
          referralCode: reward.referralCode,
          points: reward.points,
          discount: reward.discount,
          claimedAt: reward.claimedAt,
        });

        // Adicionar pontos ao referrer
        await ctx.db.update(schema.loyaltyAccounts)
          .set({
            points: sql`points + ${reward.points}`,
          })
          .where(eq(schema.loyaltyAccounts.userId, reward.referrerId));

        // Adicionar desconto ao referee
        // await discountService.applyDiscount(ctx.user.id, reward.discount);
      }

      return reward;
    }),

  /**
   * Obter leaderboard
   */
  getLeaderboard: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input, ctx }) => {
      const gamificationService = getGamificationService();

      const leaderboard = await gamificationService.getLeaderboard(
        ctx.user.organizationId,
        input.limit
      );

      return leaderboard;
    }),

  /**
   * Obter achievements do usuário
   */
  getUserAchievements: protectedProcedure
    .query(async ({ ctx }) => {
      const gamificationService = getGamificationService();

      const achievements = await gamificationService.getUserAchievements(ctx.user.id);

      return achievements;
    }),

  /**
   * Obter badges do usuário
   */
  getUserBadges: protectedProcedure
    .query(async ({ ctx }) => {
      // Buscar do banco
      const badges = await ctx.db.query.userBadges.findMany({
        where: (ub, { eq }) => eq(ub.userId, ctx.user.id),
      });

      return badges;
    }),

  /**
   * Obter estatísticas de loyalty
   */
  getLoyaltyStats: protectedProcedure
    .query(async ({ ctx }) => {
      const gamificationService = getGamificationService();

      const stats = await gamificationService.getLoyaltyStats(ctx.user.organizationId);

      return stats;
    }),

  /**
   * Obter histórico de pontos
   */
  getPointsHistory: protectedProcedure
    .input(z.object({
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input, ctx }) => {
      const transactions = await ctx.db.query.pointTransactions.findMany({
        where: (pt, { eq }) => eq(pt.userId, ctx.user.id),
        orderBy: (pt, { desc }) => desc(pt.createdAt),
        limit: input.limit,
        offset: input.offset,
      });

      return transactions;
    }),

  /**
   * Obter referrals do usuário
   */
  getMyReferrals: protectedProcedure
    .query(async ({ ctx }) => {
      const referrals = await ctx.db.query.referralRewards.findMany({
        where: (rr, { eq }) => eq(rr.referrerId, ctx.user.id),
      });

      return referrals;
    }),
});
