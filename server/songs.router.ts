import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { songs } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const songsRouter = router({
  // Obter todas as músicas públicas
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().default(50).max(100),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      try {
        const result = await db
          .select()
          .from(songs)
          .where(eq(songs.isPublic, 1))
          .limit(input.limit)
          .offset(input.offset);

        return result;
      } catch (error) {
        console.error("Erro ao buscar músicas:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar músicas",
        });
      }
    }),

  // Obter música por ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      try {
        const result = await db
          .select()
          .from(songs)
          .where(eq(songs.id, input.id))
          .limit(1);

        if (result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Música não encontrada",
          });
        }

        return result[0];
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Erro ao buscar música:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar música",
        });
      }
    }),

  // Buscar músicas por título, artista ou tema
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().default(20).max(50),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      try {
        // Nota: Ajustar conforme o banco de dados suporta full-text search
        // Por enquanto, fazemos busca simples em memória
        const allSongs = await db
          .select()
          .from(songs)
          .where(eq(songs.isPublic, 1))
          .limit(100);

        const searchLower = input.query.toLowerCase();
        return allSongs
          .filter(
            (song) =>
              song.title.toLowerCase().includes(searchLower) ||
              song.artist?.toLowerCase().includes(searchLower) ||
              song.theme?.toLowerCase().includes(searchLower)
          )
          .slice(0, input.limit);
      } catch (error) {
        console.error("Erro ao buscar músicas:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar músicas",
        });
      }
    }),

  // Obter músicas por tema/gênero
  getByTheme: publicProcedure
    .input(
      z.object({
        theme: z.string(),
        limit: z.number().default(20).max(50),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      try {
        const result = await db
          .select()
          .from(songs)
          .where(eq(songs.isPublic, 1))
          .limit(input.limit);

        // Filtrar por tema em memória
        return result.filter((song) => song.theme === input.theme);
      } catch (error) {
        console.error("Erro ao buscar músicas por tema:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar músicas",
        });
      }
    }),

  // Obter estatísticas do catálogo
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Banco de dados não disponível",
      });
    }

    try {
      const allSongs = await db.select().from(songs);
      const publicSongs = allSongs.filter((s) => s.isPublic === 1);

      const themes = new Set(publicSongs.map((s) => s.theme).filter(Boolean));
      const artists = new Set(publicSongs.map((s) => s.artist).filter(Boolean));

      return {
        totalSongs: allSongs.length,
        publicSongs: publicSongs.length,
        themes: Array.from(themes),
        artists: Array.from(artists),
        recentSongs: publicSongs.slice(-5),
      };
    } catch (error) {
      console.error("Erro ao obter estatísticas:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter estatísticas",
      });
    }
  }),
});
