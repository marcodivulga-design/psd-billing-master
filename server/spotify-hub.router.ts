/**
 * Spotify Router - PSD Hub Integration
 * 
 * This router integrates with the remote PSD Hub for Spotify API calls
 * All Spotify operations are proxied through the centralized Hub
 */

import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { psdHubService } from "../services/psd-hub.service";
import { TRPCError } from "@trpc/server";

export const spotifyHubRouter = router({
  /**
   * Search for tracks on Spotify via PSD Hub
   */
  searchTracks: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "Query é obrigatória"),
        type: z.enum(["track", "artist", "album"]).default("track"),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await psdHubService.spotifySearch(
          input.query,
          input.type,
          input.limit
        );

        if (!response.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: response.error || "Erro ao buscar no Spotify",
          });
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error("[Spotify] Search error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar no Spotify",
        });
      }
    }),

  /**
   * Get track details from Spotify via PSD Hub
   */
  getTrack: publicProcedure
    .input(
      z.object({
        trackId: z.string().min(1, "Track ID é obrigatório"),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await psdHubService.spotifyGetTrack(input.trackId);

        if (!response.success) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: response.error || "Track não encontrada",
          });
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error("[Spotify] Get track error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar track",
        });
      }
    }),

  /**
   * Get artist details from Spotify via PSD Hub
   */
  getArtist: publicProcedure
    .input(
      z.object({
        artistId: z.string().min(1, "Artist ID é obrigatório"),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await psdHubService.spotifyGetArtist(input.artistId);

        if (!response.success) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: response.error || "Artista não encontrado",
          });
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error("[Spotify] Get artist error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar artista",
        });
      }
    }),

  /**
   * Get playlist details from Spotify via PSD Hub
   */
  getPlaylist: publicProcedure
    .input(
      z.object({
        playlistId: z.string().min(1, "Playlist ID é obrigatório"),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await psdHubService.spotifyGetPlaylist(
          input.playlistId
        );

        if (!response.success) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: response.error || "Playlist não encontrada",
          });
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error("[Spotify] Get playlist error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar playlist",
        });
      }
    }),

  /**
   * Get recommendations from Spotify via PSD Hub
   */
  getRecommendations: publicProcedure
    .input(
      z.object({
        seedTracks: z.array(z.string()).min(1).max(5),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await psdHubService.spotifyGetRecommendations(
          input.seedTracks
        );

        if (!response.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: response.error || "Erro ao buscar recomendações",
          });
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error("[Spotify] Get recommendations error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar recomendações",
        });
      }
    }),

  /**
   * Get Hub status for Spotify API
   */
  getHubStatus: publicProcedure.query(async () => {
    try {
      const response = await psdHubService.getApiStatus("spotify");

      return {
        success: response.success,
        status: response.data,
        error: response.error,
      };
    } catch (error) {
      console.error("[Spotify] Hub status error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao verificar status do Hub",
      });
    }
  }),

  /**
   * Clear cache for Spotify requests
   */
  clearCache: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Apenas administradores podem limpar o cache",
      });
    }

    try {
      psdHubService.clearCacheEntry("/api/spotify");
      return {
        success: true,
        message: "Cache do Spotify limpo com sucesso",
      };
    } catch (error) {
      console.error("[Spotify] Clear cache error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao limpar cache",
      });
    }
  }),

  /**
   * Get cache statistics
   */
  getCacheStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Apenas administradores podem ver estatísticas de cache",
      });
    }

    try {
      const stats = psdHubService.getCacheStats();
      return {
        success: true,
        stats,
      };
    } catch (error) {
      console.error("[Spotify] Get cache stats error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter estatísticas de cache",
      });
    }
  }),
});
