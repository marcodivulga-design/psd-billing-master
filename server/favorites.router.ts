import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const favoritesRouter = router({
  // Adicionar música aos favoritos
  add: protectedProcedure
    .input(z.object({ songId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Aqui você salvaria no banco de dados
      // await db.insert(favorites).values({...})
      return {
        success: true,
        message: "Adicionado aos favoritos",
      };
    }),

  // Remover música dos favoritos
  remove: protectedProcedure
    .input(z.object({ songId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Aqui você deletaria do banco de dados
      // await db.delete(favorites).where(...)
      return {
        success: true,
        message: "Removido dos favoritos",
      };
    }),

  // Obter todos os favoritos do usuário
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      // Aqui você buscaria do banco de dados
      // const favorites = await db.query.favorites.findMany({...})
      return [];
    }),

  // Verificar se uma música é favorita
  isFavorite: protectedProcedure
    .input(z.object({ songId: z.number() }))
    .query(async ({ input, ctx }) => {
      // Aqui você verificaria no banco de dados
      return false;
    }),

  // Obter contagem de favoritos
  getCount: protectedProcedure.query(async ({ ctx }) => {
    // Aqui você contaria no banco de dados
    return 0;
  }),
});
