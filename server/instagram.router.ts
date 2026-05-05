import { router, publicProcedure } from "./_core/trpc";
import { InstagramAPI } from "../psd-core/shared/integrations/instagram-core";
import { z } from "zod";

export const instagramRouter = router({
  getProfile: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
      if (!accessToken) {
        throw new Error("INSTAGRAM_ACCESS_TOKEN não configurado.");
      }
      const instagramAPI = new InstagramAPI(accessToken);
      return instagramAPI.searchArtist(input.username);
    }),

  getEngagementMetrics: publicProcedure
    .input(z.object({ businessAccountId: z.string() }))
    .query(async ({ input }) => {
      const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
      if (!accessToken) {
        throw new Error("INSTAGRAM_ACCESS_TOKEN não configurado.");
      }
      const instagramAPI = new InstagramAPI(accessToken);
      return instagramAPI.getEngagementMetrics(input.businessAccountId);
    }),
});
