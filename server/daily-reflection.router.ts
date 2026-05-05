import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { DailyReflectionService } from '../services/daily-reflection.service';

export const dailyReflectionRouter = router({
  /**
   * Get today's reflection
   */
  getToday: publicProcedure
    .query(async () => {
      try {
        return await DailyReflectionService.getTodayReflection();
      } catch (error) {
        console.error('Error getting today reflection:', error);
        throw error;
      }
    }),

  /**
   * Get reflection by date
   */
  getByDate: publicProcedure
    .input(z.object({
      date: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        return await DailyReflectionService.getReflectionByDate(input.date);
      } catch (error) {
        console.error('Error getting reflection by date:', error);
        throw error;
      }
    }),

  /**
   * Get all published reflections
   */
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().default(30),
    }))
    .query(async ({ input }) => {
      try {
        return await DailyReflectionService.getAllPublishedReflections(input.limit);
      } catch (error) {
        console.error('Error getting all reflections:', error);
        throw error;
      }
    }),

  /**
   * Create reflection (admin only)
   */
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      verse: z.string().optional(),
      verseText: z.string().optional(),
      prayer: z.string().optional(),
      author: z.string().optional(),
      date: z.string(),
      imageUrl: z.string().optional(),
      isPublished: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      try {
        return await DailyReflectionService.createReflection(input);
      } catch (error) {
        console.error('Error creating reflection:', error);
        throw error;
      }
    }),

  /**
   * Update reflection (admin only)
   */
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      verse: z.string().optional(),
      verseText: z.string().optional(),
      prayer: z.string().optional(),
      author: z.string().optional(),
      imageUrl: z.string().optional(),
      isPublished: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        return await DailyReflectionService.updateReflection(id, data);
      } catch (error) {
        console.error('Error updating reflection:', error);
        throw error;
      }
    }),

  /**
   * Delete reflection (admin only)
   */
  delete: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await DailyReflectionService.deleteReflection(input.id);
      } catch (error) {
        console.error('Error deleting reflection:', error);
        throw error;
      }
    }),
});
