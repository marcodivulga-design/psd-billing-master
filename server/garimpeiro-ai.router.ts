/**
 * Garimpeiro AI Router
 * API tRPC para Sistema Inteligente de Coleta de Músicas Litúrgicas
 * 
 * Endpoints:
 * - collectMusics: Executa coleta completa
 * - getCollectedMusics: Retorna músicas coletadas
 * - filterMusics: Filtra por critérios
 * - recommendForMass: Recomenda para missa
 * - getStats: Obtém estatísticas
 * - exportToJSON: Exporta dados
 */

import { router, publicProcedure, adminProcedure } from "../trpc";
import { z } from "zod";
import { garimpeirAI } from "../services/garimpeiro-ai.service";
import { TRPCError } from "@trpc/server";

export const garimpeirAIRouter = router({
  /**
   * Executa coleta completa de múltiplas fontes
   * Apenas admins podem executar
   */
  collectMusics: adminProcedure.mutation(async () => {
    try {
      const stats = await garimpeirAI.collectMusics();
      return {
        success: true,
        stats,
        message: `Coleta concluída: ${stats.totalValidated} músicas coletadas`,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Erro ao coletar músicas",
      });
    }
  }),

  /**
   * Retorna todas as músicas coletadas
   */
  getCollectedMusics: publicProcedure
    .input(
      z.object({
        limit: z.number().default(50).max(500),
        offset: z.number().default(0),
      })
    )
    .query(({ input }) => {
      try {
        const musics = garimpeirAI.getCollectedMusics();
        const total = musics.length;
        const paginated = musics.slice(input.offset, input.offset + input.limit);

        return {
          total,
          limit: input.limit,
          offset: input.offset,
          musics: paginated,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao obter músicas coletadas",
        });
      }
    }),

  /**
   * Filtra músicas por critérios
   */
  filterMusics: publicProcedure
    .input(
      z.object({
        type: z.enum(["liturgica", "louvor", "coral", "instrumental"]).optional(),
        massMoment: z
          .enum([
            "entrada",
            "ato_penitencial",
            "gloria",
            "salmo",
            "ofertorio",
            "santo",
            "comunhao",
            "final",
          ])
          .optional(),
        liturgicalTime: z
          .enum([
            "comum",
            "advento",
            "natal",
            "quaresma",
            "pascoa",
            "pentecostes",
            "mariano",
            "funerario",
            "batizado",
          ])
          .optional(),
        difficulty: z.number().min(1).max(5).optional(),
        limit: z.number().default(50).max(500),
        offset: z.number().default(0),
      })
    )
    .query(({ input }) => {
      try {
        const filtered = garimpeirAI.filterMusics({
          type: input.type,
          massMoment: input.massMoment,
          liturgicalTime: input.liturgicalTime,
          difficulty: input.difficulty,
        });

        const total = filtered.length;
        const paginated = filtered.slice(input.offset, input.offset + input.limit);

        return {
          total,
          limit: input.limit,
          offset: input.offset,
          musics: paginated,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao filtrar músicas",
        });
      }
    }),

  /**
   * Recomenda músicas para uma missa
   */
  recommendForMass: publicProcedure
    .input(
      z.object({
        liturgicalTime: z
          .enum([
            "comum",
            "advento",
            "natal",
            "quaresma",
            "pascoa",
            "pentecostes",
            "mariano",
            "funerario",
            "batizado",
          ])
          .default("comum"),
        year: z.enum(["A", "B", "C"]).default("A"),
        quantity: z.number().min(1).max(10).default(3),
      })
    )
    .query(({ input }) => {
      try {
        const recommendations = garimpeirAI.recommendForMass({
          liturgicalTime: input.liturgicalTime,
          year: input.year,
          quantity: input.quantity,
        });

        return {
          liturgicalTime: input.liturgicalTime,
          year: input.year,
          quantity: recommendations.length,
          musics: recommendations,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao recomendar músicas",
        });
      }
    }),

  /**
   * Obtém estatísticas de coleta
   */
  getStats: publicProcedure.query(() => {
    try {
      return garimpeirAI.getStats();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter estatísticas",
      });
    }
  }),

  /**
   * Busca músicas por título ou artista
   */
  searchMusics: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().default(20).max(100),
      })
    )
    .query(({ input }) => {
      try {
        const musics = garimpeirAI.getCollectedMusics();
        const lowerQuery = input.query.toLowerCase();

        const results = musics
          .filter(
            (music) =>
              music.title.toLowerCase().includes(lowerQuery) ||
              music.artist.toLowerCase().includes(lowerQuery) ||
              music.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
          )
          .slice(0, input.limit);

        return {
          query: input.query,
          total: results.length,
          musics: results,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar músicas",
        });
      }
    }),

  /**
   * Obtém músicas por momento da missa
   */
  getMusicsByMassMoment: publicProcedure
    .input(
      z.object({
        massMoment: z.enum([
          "entrada",
          "ato_penitencial",
          "gloria",
          "salmo",
          "ofertorio",
          "santo",
          "comunhao",
          "final",
        ]),
        limit: z.number().default(20).max(100),
      })
    )
    .query(({ input }) => {
      try {
        const musics = garimpeirAI.filterMusics({
          massMoment: input.massMoment,
        });

        return {
          massMoment: input.massMoment,
          total: musics.length,
          musics: musics.slice(0, input.limit),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao obter músicas por momento",
        });
      }
    }),

  /**
   * Obtém músicas por tempo litúrgico
   */
  getMusicsByLiturgicalTime: publicProcedure
    .input(
      z.object({
        liturgicalTime: z.enum([
          "comum",
          "advento",
          "natal",
          "quaresma",
          "pascoa",
          "pentecostes",
          "mariano",
          "funerario",
          "batizado",
        ]),
        limit: z.number().default(20).max(100),
      })
    )
    .query(({ input }) => {
      try {
        const musics = garimpeirAI.filterMusics({
          liturgicalTime: input.liturgicalTime,
        });

        return {
          liturgicalTime: input.liturgicalTime,
          total: musics.length,
          musics: musics.slice(0, input.limit),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao obter músicas por tempo litúrgico",
        });
      }
    }),

  /**
   * Obtém estatísticas por tipo
   */
  getStatsByType: publicProcedure.query(() => {
    try {
      const stats = garimpeirAI.getStats();
      const musics = garimpeirAI.getCollectedMusics();

      const typeStats = {
        liturgica: musics.filter((m) => m.type === "liturgica").length,
        louvor: musics.filter((m) => m.type === "louvor").length,
        coral: musics.filter((m) => m.type === "coral").length,
        instrumental: musics.filter((m) => m.type === "instrumental").length,
      };

      return {
        ...stats,
        typeStats,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter estatísticas por tipo",
      });
    }
  }),

  /**
   * Exporta dados para JSON
   * Apenas admins podem exportar
   */
  exportToJSON: adminProcedure.query(() => {
    try {
      const jsonData = garimpeirAI.exportToJSON();
      return {
        success: true,
        data: jsonData,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao exportar dados",
      });
    }
  }),

  /**
   * Obtém sugestões para uma missa completa
   * Retorna músicas para todos os momentos
   */
  getMissSuggestions: publicProcedure
    .input(
      z.object({
        liturgicalTime: z
          .enum([
            "comum",
            "advento",
            "natal",
            "quaresma",
            "pascoa",
            "pentecostes",
            "mariano",
            "funerario",
            "batizado",
          ])
          .default("comum"),
        year: z.enum(["A", "B", "C"]).default("A"),
      })
    )
    .query(({ input }) => {
      try {
        const moments = [
          "entrada",
          "ato_penitencial",
          "gloria",
          "salmo",
          "ofertorio",
          "santo",
          "comunhao",
          "final",
        ];

        const suggestions: Record<string, any> = {};

        for (const moment of moments) {
          const musics = garimpeirAI.filterMusics({
            massMoment: moment as any,
            liturgicalTime: input.liturgicalTime,
          });

          suggestions[moment] = musics.slice(0, 3); // Top 3 por momento
        }

        return {
          liturgicalTime: input.liturgicalTime,
          year: input.year,
          suggestions,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao obter sugestões para missa",
        });
      }
    }),
});
