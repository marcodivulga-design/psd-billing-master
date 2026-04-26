import { router, publicProcedure } from './trpc.ts';
import { getAllPlans, getPlanBySlug } from './plans.ts';
import { z } from 'zod';

export const plansRouter = router({
  list: publicProcedure.query(async () => {
    return await getAllPlans();
  }),
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await getPlanBySlug(input.slug);
    }),
});
