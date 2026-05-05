/**
 * YouTube Router - PSD Hub Integration
 * 
 * This router integrates with the remote PSD Hub for YouTube API calls
 * All YouTube operations are proxied through the centralized Hub
 */

import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { psdHubService } from "../services/psd-hub.service";
import { TRPCError } from "@trpc/server";

export const youtubeHubRouter = router({
  /**
   * Search for videos on YouTube via PSD Hub
   */
  searchVideos: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "Query é obrigatória"),
        type: z.enum(["video", "playlist", "channel"]).default("video"),
        maxResults: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await psdHubService.youtubeSearch(
          input.query,
          input.type,
          input.maxResults
        );

        if (!response.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: response.error || "Erro ao buscar no YouTube",
          });
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error("[YouTube] Search error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar no YouTube",
        });
      }
    }),

  /**
   * Get video details from YouTube via PSD Hub
   */
  getVideo: publicProcedure
    .input(
      z.object({
        videoId: z.string().min(1, "Video ID é obrigatório"),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await psdHubService.youtubeGetVideo(input.videoId);

        if (!response.success) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: response.error || "Vídeo não encontrado",
          });
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error("[YouTube] Get video error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar vídeo",
        });
      }
    }),

  /**
   * Get channel details from YouTube via PSD Hub
   */
  getChannel: publicProcedure
    .input(
      z.object({
        channelId: z.string().min(1, "Channel ID é obrigatório"),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await psdHubService.youtubeGetChannel(
          input.channelId
        );

        if (!response.success) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: response.error || "Canal não encontrado",
          });
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error("[YouTube] Get channel error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar canal",
        });
      }
    }),

  /**
   * Get playlist details from YouTube via PSD Hub
   */
  getPlaylist: publicProcedure
    .input(
      z.object({
        playlistId: z.string().min(1, "Playlist ID é obrigatório"),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await psdHubService.youtubeGetPlaylist(
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
        console.error("[YouTube] Get playlist error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar playlist",
        });
      }
    }),

  /**
   * Get Hub status for YouTube API
   */
  getHubStatus: publicProcedure.query(async () => {
    try {
      const response = await psdHubService.getApiStatus("youtube");

      return {
        success: response.success,
        status: response.data,
        error: response.error,
      };
    } catch (error) {
      console.error("[YouTube] Hub status error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao verificar status do Hub",
      });
    }
  }),

  /**
   * Clear cache for YouTube requests
   */
  clearCache: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Apenas administradores podem limpar o cache",
      });
    }

    try {
      psdHubService.clearCacheEntry("/api/youtube");
      return {
        success: true,
        message: "Cache do YouTube limpo com sucesso",
      };
    } catch (error) {
      console.error("[YouTube] Clear cache error:", error);
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
      console.error("[YouTube] Get cache stats error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter estatísticas de cache",
      });
    }
  }),
});
