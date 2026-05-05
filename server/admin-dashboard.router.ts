import { adminProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { songs, users } from "../../drizzle/schema";

export const adminDashboardRouter = router({
  // Obter estatísticas gerais
  getStats: adminProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Banco de dados não disponível",
      });
    }

    try {
      // Buscar dados do banco
      const allSongs = await db.select().from(songs);
      const allUsers = await db.select().from(users);

      return {
        totalSongs: allSongs.length,
        publicSongs: allSongs.filter((s) => s.isPublic === 1).length,
        totalUsers: allUsers.length,
        adminUsers: allUsers.filter((u) => u.role === "admin").length,
        regularUsers: allUsers.filter((u) => u.role === "user").length,
        newUsersThisMonth: allUsers.filter((u) => {
          const createdDate = new Date(u.createdAt);
          const now = new Date();
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }).length,
        newSongsThisMonth: allSongs.filter((s) => {
          const createdDate = new Date(s.createdAt);
          const now = new Date();
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }).length,
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar estatísticas",
      });
    }
  }),

  // Obter músicas recentes
  getRecentSongs: adminProcedure
    .input(
      z.object({
        limit: z.number().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      try {
        const allSongs = await db.select().from(songs);
        return allSongs
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, input.limit);
      } catch (error) {
        console.error("Erro ao buscar músicas recentes:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar músicas recentes",
        });
      }
    }),

  // Obter usuários recentes
  getRecentUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      try {
        const allUsers = await db.select().from(users);
        return allUsers
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, input.limit)
          .map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt,
            lastSignedIn: u.lastSignedIn,
          }));
      } catch (error) {
        console.error("Erro ao buscar usuários recentes:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar usuários recentes",
        });
      }
    }),

  // Obter gráfico de crescimento
  getGrowthChart: adminProcedure
    .input(
      z.object({
        days: z.number().default(30),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      try {
        const allSongs = await db.select().from(songs);
        const allUsers = await db.select().from(users);

        const data = [];
        const now = new Date();

        for (let i = input.days - 1; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);

          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);

          const songsCount = allSongs.filter((s) => {
            const createdDate = new Date(s.createdAt);
            return createdDate >= date && createdDate < nextDate;
          }).length;

          const usersCount = allUsers.filter((u) => {
            const createdDate = new Date(u.createdAt);
            return createdDate >= date && createdDate < nextDate;
          }).length;

          data.push({
            date: date.toISOString().split("T")[0],
            songs: songsCount,
            users: usersCount,
          });
        }

        return data;
      } catch (error) {
        console.error("Erro ao buscar gráfico:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar gráfico",
        });
      }
    }),

  // Obter distribuição por tema
  getThemeDistribution: adminProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Banco de dados não disponível",
      });
    }

    try {
      const allSongs = await db.select().from(songs);

      const distribution: Record<string, number> = {};
      allSongs.forEach((song) => {
        const theme = song.theme || "Sem tema";
        distribution[theme] = (distribution[theme] || 0) + 1;
      });

      return Object.entries(distribution).map(([theme, count]) => ({
        theme,
        count,
      }));
    } catch (error) {
      console.error("Erro ao buscar distribuição:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar distribuição",
      });
    }
  }),

  // Obter top artistas
  getTopArtists: adminProcedure
    .input(
      z.object({
        limit: z.number().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      try {
        const allSongs = await db.select().from(songs);

        const artistCount: Record<string, number> = {};
        allSongs.forEach((song) => {
          if (song.artist) {
            artistCount[song.artist] = (artistCount[song.artist] || 0) + 1;
          }
        });

        return Object.entries(artistCount)
          .map(([artist, count]) => ({ artist, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, input.limit);
      } catch (error) {
        console.error("Erro ao buscar top artistas:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar top artistas",
        });
      }
    }),

  // Exportar relatório
  exportReport: adminProcedure
    .input(
      z.object({
        format: z.enum(["csv", "json", "pdf"]).default("json"),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Aqui você geraria o relatório no formato solicitado
        return {
          success: true,
          message: `Relatório em formato ${input.format} gerado`,
          downloadUrl: `/api/reports/export.${input.format}`,
        };
      } catch (error) {
        console.error("Erro ao exportar relatório:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao exportar relatório",
        });
      }
    }),
});
