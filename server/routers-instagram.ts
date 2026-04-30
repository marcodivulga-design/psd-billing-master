import { z } from 'zod';
import { router, publicProcedure } from './trpc';
import { InstagramAPI } from './integrations/instagram-core';

const instagramApi = new InstagramAPI(process.env.INSTAGRAM_ACCESS_TOKEN || 'dummy_token');

export const instagramRouter = router({
  getProfile: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const profile = await instagramApi.searchArtist(input.username);
      if (!profile) {
        throw new Error('Perfil não encontrado ou erro na API do Instagram');
      }
      return profile;
    }),
  
  getEngagementMetrics: publicProcedure
    .input(z.object({ businessAccountId: z.string() }))
    .query(async ({ input }) => {
      const metrics = await instagramApi.getEngagementMetrics(input.businessAccountId);
      if (!metrics) {
        throw new Error('Métricas não encontradas ou erro na API do Instagram');
      }
      return metrics;
    }),
});
