import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const playbackHistoryRouter = router({
  // Registrar reprodução de música
  recordPlayback: protectedProcedure
    .input(
      z.object({
        songId: z.number(),
        playlistId: z.number().optional(),
        duration: z.number(),
        completedPercentage: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Simulação de registro de reprodução
        const playbackRecord = {
          id: Math.random(),
          userId: ctx.user.id,
          songId: input.songId,
          playlistId: input.playlistId,
          duration: input.duration,
          completedPercentage: input.completedPercentage,
          playedAt: new Date(),
          timestamp: Date.now(),
        };

        // Aqui seria salvo no banco de dados
        console.log("Reprodução registrada:", playbackRecord);

        return {
          success: true,
          message: "Reprodução registrada com sucesso",
        };
      } catch (error) {
        console.error("Erro ao registrar reprodução:", error);
        throw error;
      }
    }),

  // Obter histórico de reprodução do usuário
  getPlaybackHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
        timeRange: z.enum(["day", "week", "month", "all"]).default("all"),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Simulação de histórico de reprodução
        const mockHistory = [
          {
            id: 1,
            songId: 1,
            songTitle: "Eis o Tempo de Conversão",
            artist: "Comunidade Católica",
            playedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
            duration: 240,
            completedPercentage: 100,
            youtubeUrl: "https://youtube.com/watch?v=example1",
          },
          {
            id: 2,
            songId: 2,
            songTitle: "Glória a Deus nas Alturas",
            artist: "Coral da Igreja",
            playedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
            duration: 180,
            completedPercentage: 95,
            youtubeUrl: "https://youtube.com/watch?v=example2",
          },
          {
            id: 3,
            songId: 3,
            songTitle: "Aleluia",
            artist: "Coro Gregoriano",
            playedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
            duration: 120,
            completedPercentage: 100,
            youtubeUrl: "https://youtube.com/watch?v=example3",
          },
        ];

        return {
          history: mockHistory.slice(input.offset, input.offset + input.limit),
          total: mockHistory.length,
          limit: input.limit,
          offset: input.offset,
        };
      } catch (error) {
        console.error("Erro ao obter histórico:", error);
        throw error;
      }
    }),

  // Obter estatísticas de reprodução
  getPlaybackStats: protectedProcedure
    .input(
      z.object({
        timeRange: z.enum(["day", "week", "month", "all"]).default("month"),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Simulação de estatísticas
        return {
          totalPlays: 156,
          totalMinutesListened: 4320,
          averagePlayDuration: 27.7,
          favoriteGenre: "Litúrgico",
          favoriteArtist: "Comunidade Católica",
          mostPlayedSong: {
            id: 1,
            title: "Eis o Tempo de Conversão",
            plays: 12,
          },
          topGenres: [
            { genre: "Litúrgico", plays: 89 },
            { genre: "Hino", plays: 45 },
            { genre: "Gregoriano", plays: 22 },
          ],
          topArtists: [
            { artist: "Comunidade Católica", plays: 67 },
            { artist: "Coral da Igreja", plays: 54 },
            { artist: "Coro Gregoriano", plays: 35 },
          ],
          playbackTrend: [
            { date: "2026-04-08", plays: 15 },
            { date: "2026-04-09", plays: 18 },
            { date: "2026-04-10", plays: 22 },
            { date: "2026-04-11", plays: 19 },
            { date: "2026-04-12", plays: 25 },
            { date: "2026-04-13", plays: 28 },
            { date: "2026-04-14", plays: 29 },
          ],
        };
      } catch (error) {
        console.error("Erro ao obter estatísticas:", error);
        throw error;
      }
    }),

  // Obter sugestões baseadas em histórico
  getSuggestionsFromHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Simulação de sugestões baseadas em histórico
        return [
          {
            id: 10,
            title: "Cântico de Louvor",
            artist: "Comunidade Católica",
            reason: "Baseado em: Eis o Tempo de Conversão",
            similarity: 0.92,
            youtubeUrl: "https://youtube.com/watch?v=example10",
          },
          {
            id: 11,
            title: "Hino de Ação de Graças",
            artist: "Coral da Igreja",
            reason: "Baseado em: Glória a Deus nas Alturas",
            similarity: 0.88,
            youtubeUrl: "https://youtube.com/watch?v=example11",
          },
          {
            id: 12,
            title: "Salmo 23",
            artist: "Coro Gregoriano",
            reason: "Baseado em: Aleluia",
            similarity: 0.85,
            youtubeUrl: "https://youtube.com/watch?v=example12",
          },
        ];
      } catch (error) {
        console.error("Erro ao obter sugestões:", error);
        throw error;
      }
    }),

  // Limpar histórico
  clearPlaybackHistory: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      // Simulação de limpeza de histórico
      return {
        success: true,
        message: "Histórico de reprodução limpo com sucesso",
      };
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
      throw error;
    }
  }),

  // Adicionar música aos favoritos
  addToFavorites: protectedProcedure
    .input(z.object({ songId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return {
          success: true,
          message: "Música adicionada aos favoritos",
        };
      } catch (error) {
        console.error("Erro ao adicionar aos favoritos:", error);
        throw error;
      }
    }),

  // Obter músicas favoritas
  getFavorites: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input, ctx }) => {
      try {
        // Simulação de favoritos
        return [
          {
            id: 1,
            title: "Eis o Tempo de Conversão",
            artist: "Comunidade Católica",
            addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            youtubeUrl: "https://youtube.com/watch?v=example1",
          },
          {
            id: 3,
            title: "Aleluia",
            artist: "Coro Gregoriano",
            addedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            youtubeUrl: "https://youtube.com/watch?v=example3",
          },
        ];
      } catch (error) {
        console.error("Erro ao obter favoritos:", error);
        throw error;
      }
    }),
});
