import { router, protectedProcedure, adminProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getCommunityService } from '../lib/core/community-service';

export const communityRouter = router({
  /**
   * Obter perfil do usuário
   */
  getUserProfile: protectedProcedure
    .input(z.object({ userId: z.string() }).optional())
    .query(async ({ input, ctx }) => {
      const userId = input?.userId || ctx.user.id;

      // Buscar do banco
      let profile = await ctx.db.query.userProfiles.findFirst({
        where: (up, { eq }) => eq(up.userId, userId),
      });

      if (!profile) {
        const communityService = getCommunityService();
        const newProfile = await communityService.createUserProfile(
          userId,
          ctx.user.organizationId
        );

        await ctx.db.insert(schema.userProfiles).values({
          userId,
          organizationId: ctx.user.organizationId,
          displayName: '',
          avatar: '',
          bio: '',
          followers: 0,
          following: 0,
          totalReviews: 0,
          totalPosts: 0,
          joinedAt: new Date(),
          verified: false,
        });

        profile = newProfile;
      }

      return profile;
    }),

  /**
   * Atualizar perfil
   */
  updateUserProfile: protectedProcedure
    .input(z.object({
      displayName: z.string().optional(),
      avatar: z.string().optional(),
      bio: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const communityService = getCommunityService();

      const profile = await communityService.updateUserProfile(ctx.user.id, {
        ...input,
      });

      // Atualizar no banco
      await ctx.db.update(schema.userProfiles)
        .set({
          displayName: input.displayName,
          avatar: input.avatar,
          bio: input.bio,
        })
        .where(eq(schema.userProfiles.userId, ctx.user.id));

      return profile;
    }),

  /**
   * Criar review
   */
  createReview: protectedProcedure
    .input(z.object({
      productId: z.string(),
      rating: z.number().min(1).max(5),
      title: z.string(),
      comment: z.string(),
      images: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const communityService = getCommunityService();

      const review = await communityService.createReview(
        input.productId,
        ctx.user.id,
        {
          rating: input.rating,
          title: input.title,
          comment: input.comment,
          images: input.images,
        }
      );

      // Salvar no banco
      await ctx.db.insert(schema.reviews).values({
        id: review.id,
        productId: input.productId,
        userId: ctx.user.id,
        organizationId: ctx.user.organizationId,
        rating: input.rating,
        title: input.title,
        comment: input.comment,
        images: input.images || [],
        verified: review.verified,
        helpful: 0,
        unhelpful: 0,
        status: 'pending',
        createdAt: review.createdAt,
      });

      // Atualizar contador de reviews do usuário
      await ctx.db.update(schema.userProfiles)
        .set({
          totalReviews: sql`totalReviews + 1`,
        })
        .where(eq(schema.userProfiles.userId, ctx.user.id));

      return review;
    }),

  /**
   * Obter reviews de produto
   */
  getProductReviews: protectedProcedure
    .input(z.object({
      productId: z.string(),
      limit: z.number().default(10),
      offset: z.number().default(0),
    }))
    .query(async ({ input, ctx }) => {
      const communityService = getCommunityService();

      const reviews = await communityService.getProductReviews(
        input.productId,
        input.limit
      );

      return reviews;
    }),

  /**
   * Marcar review como útil
   */
  markReviewHelpful: protectedProcedure
    .input(z.object({ reviewId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const communityService = getCommunityService();

      await communityService.markReviewHelpful(input.reviewId);

      // Atualizar no banco
      await ctx.db.update(schema.reviews)
        .set({
          helpful: sql`helpful + 1`,
        })
        .where(eq(schema.reviews.id, input.reviewId));

      return { success: true };
    }),

  /**
   * Criar post no fórum
   */
  createForumPost: protectedProcedure
    .input(z.object({
      category: z.string(),
      title: z.string(),
      content: z.string(),
      images: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const communityService = getCommunityService();

      const post = await communityService.createForumPost(
        ctx.user.organizationId,
        ctx.user.id,
        {
          category: input.category,
          title: input.title,
          content: input.content,
          images: input.images,
        }
      );

      // Salvar no banco
      await ctx.db.insert(schema.forumPosts).values({
        id: post.id,
        organizationId: ctx.user.organizationId,
        userId: ctx.user.id,
        category: input.category,
        title: input.title,
        content: input.content,
        images: input.images || [],
        views: 0,
        replies: 0,
        likes: 0,
        status: 'active',
        createdAt: post.createdAt,
      });

      // Atualizar contador de posts do usuário
      await ctx.db.update(schema.userProfiles)
        .set({
          totalPosts: sql`totalPosts + 1`,
        })
        .where(eq(schema.userProfiles.userId, ctx.user.id));

      return post;
    }),

  /**
   * Responder post no fórum
   */
  createForumReply: protectedProcedure
    .input(z.object({
      postId: z.string(),
      content: z.string(),
      images: z.array(z.string()).optional(),
      isAnswer: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const communityService = getCommunityService();

      const reply = await communityService.createForumReply(
        input.postId,
        ctx.user.id,
        {
          content: input.content,
          images: input.images,
          isAnswer: input.isAnswer,
        }
      );

      // Salvar no banco
      await ctx.db.insert(schema.forumReplies).values({
        id: reply.id,
        postId: input.postId,
        userId: ctx.user.id,
        organizationId: ctx.user.organizationId,
        content: input.content,
        images: input.images || [],
        likes: 0,
        isAnswer: input.isAnswer || false,
        createdAt: reply.createdAt,
      });

      // Incrementar contador de replies do post
      await ctx.db.update(schema.forumPosts)
        .set({
          replies: sql`replies + 1`,
        })
        .where(eq(schema.forumPosts.id, input.postId));

      return reply;
    }),

  /**
   * Obter posts do fórum
   */
  getForumPosts: protectedProcedure
    .input(z.object({
      category: z.string().optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input, ctx }) => {
      const communityService = getCommunityService();

      const posts = await communityService.getForumPosts(
        ctx.user.organizationId,
        input.category,
        input.limit
      );

      return posts;
    }),

  /**
   * Obter respostas de post
   */
  getForumReplies: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input, ctx }) => {
      const communityService = getCommunityService();

      const replies = await communityService.getForumReplies(input.postId);

      return replies;
    }),

  /**
   * Compartilhar produto
   */
  shareProduct: protectedProcedure
    .input(z.object({
      productId: z.string(),
      platform: z.enum(['facebook', 'twitter', 'instagram', 'whatsapp', 'email']),
      message: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const communityService = getCommunityService();

      const share = await communityService.shareProduct(
        ctx.user.id,
        input.productId,
        input.platform,
        input.message
      );

      // Salvar no banco
      await ctx.db.insert(schema.socialShares).values({
        id: share.id,
        userId: ctx.user.id,
        organizationId: ctx.user.organizationId,
        productId: input.productId,
        platform: input.platform,
        message: input.message || '',
        sharedAt: share.sharedAt,
      });

      return share;
    }),

  /**
   * Obter estatísticas de comunidade
   */
  getCommunityStats: protectedProcedure
    .query(async ({ ctx }) => {
      const communityService = getCommunityService();

      const stats = await communityService.getCommunityStats(ctx.user.organizationId);

      return stats;
    }),

  /**
   * Obter trending topics
   */
  getTrendingTopics: protectedProcedure
    .query(async ({ ctx }) => {
      const communityService = getCommunityService();

      const topics = await communityService.getTrendingTopics(ctx.user.organizationId);

      return topics;
    }),

  /**
   * Moderar review (admin)
   */
  moderateReview: adminProcedure
    .input(z.object({
      reviewId: z.string(),
      action: z.enum(['approve', 'reject', 'flag']),
    }))
    .mutation(async ({ input, ctx }) => {
      const communityService = getCommunityService();

      await communityService.moderateReview(input.reviewId, input.action);

      // Atualizar no banco
      const status = input.action === 'approve' ? 'approved' : 
                     input.action === 'reject' ? 'rejected' : 'flagged';

      await ctx.db.update(schema.reviews)
        .set({ status })
        .where(eq(schema.reviews.id, input.reviewId));

      return { success: true };
    }),

  /**
   * Moderar post (admin)
   */
  moderateForumPost: adminProcedure
    .input(z.object({
      postId: z.string(),
      action: z.enum(['approve', 'reject', 'pin', 'close']),
    }))
    .mutation(async ({ input, ctx }) => {
      const communityService = getCommunityService();

      await communityService.moderateForumPost(input.postId, input.action);

      // Atualizar no banco
      const status = input.action === 'close' ? 'closed' : 
                     input.action === 'pin' ? 'pinned' : 'active';

      await ctx.db.update(schema.forumPosts)
        .set({ status })
        .where(eq(schema.forumPosts.id, input.postId));

      return { success: true };
    }),
});
