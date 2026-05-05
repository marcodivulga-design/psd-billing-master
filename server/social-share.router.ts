import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const socialShareRouter = router({
  // Gerar link de compartilhamento
  generateShareLink: protectedProcedure
    .input(
      z.object({
        songId: z.number(),
        platform: z.enum(["whatsapp", "instagram", "telegram", "facebook", "twitter"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const baseUrl = process.env.VITE_APP_URL || "http://localhost:3000";
        const shareToken = Math.random().toString(36).substring(7);

        // Gerar URL de compartilhamento
        const shareUrl = `${baseUrl}/share/${shareToken}?songId=${input.songId}`;

        // Mensagens personalizadas por plataforma
        const messages: Record<string, string> = {
          whatsapp: `🎵 Confira esta música no CELEBRA!\n\n${shareUrl}`,
          instagram: `Descobri esta música no CELEBRA! 🎵\n\n${shareUrl}`,
          telegram: `Confira esta música no CELEBRA:\n${shareUrl}`,
          facebook: `Veja que música legal encontrei no CELEBRA!\n${shareUrl}`,
          twitter: `Descobri no CELEBRA: 🎵 ${shareUrl}`,
        };

        // URLs de compartilhamento por plataforma
        const shareUrls: Record<string, string> = {
          whatsapp: `https://wa.me/?text=${encodeURIComponent(messages.whatsapp)}`,
          instagram: `https://www.instagram.com/share?url=${encodeURIComponent(shareUrl)}`,
          telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(messages.telegram)}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(messages.twitter)}`,
        };

        return {
          success: true,
          shareUrl,
          platformUrl: shareUrls[input.platform],
          message: messages[input.platform],
        };
      } catch (error) {
        console.error("Erro ao gerar link de compartilhamento:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao gerar link de compartilhamento",
        });
      }
    }),

  // Registrar compartilhamento
  trackShare: protectedProcedure
    .input(
      z.object({
        songId: z.number(),
        platform: z.enum(["whatsapp", "instagram", "telegram", "facebook", "twitter"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Aqui você salvaria no banco de dados
        // await db.insert(songShares).values({
        //   userId: ctx.user.id,
        //   songId: input.songId,
        //   platform: input.platform,
        //   sharedAt: new Date(),
        // })

        return {
          success: true,
          message: "Compartilhamento registrado",
        };
      } catch (error) {
        console.error("Erro ao registrar compartilhamento:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao registrar compartilhamento",
        });
      }
    }),

  // Obter estatísticas de compartilhamento
  getShareStats: protectedProcedure
    .input(z.object({ songId: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        // Aqui você buscaria do banco de dados
        // const stats = await db.query.songShares.findMany({
        //   where: { songId: input.songId }
        // })

        return {
          total: 0,
          byPlatform: {
            whatsapp: 0,
            instagram: 0,
            telegram: 0,
            facebook: 0,
            twitter: 0,
          },
        };
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar estatísticas",
        });
      }
    }),

  // Obter compartilhamentos do usuário
  getUserShares: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Aqui você buscaria do banco de dados
        // const shares = await db.query.songShares.findMany({
        //   where: { userId: ctx.user.id },
        //   limit: input.limit,
        //   offset: input.offset
        // })

        return [];
      } catch (error) {
        console.error("Erro ao buscar compartilhamentos:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar compartilhamentos",
        });
      }
    }),

  // Obter top músicas compartilhadas
  getTopSharedSongs: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input, ctx }) => {
      try {
        // Aqui você buscaria do banco de dados
        // const topShared = await db.query.songShares.findMany({
        //   groupBy: ['songId'],
        //   orderBy: [{ count: 'desc' }],
        //   limit: input.limit
        // })

        return [];
      } catch (error) {
        console.error("Erro ao buscar top compartilhadas:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar top compartilhadas",
        });
      }
    }),
});
