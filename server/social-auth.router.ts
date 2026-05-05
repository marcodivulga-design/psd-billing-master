import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";

export const socialAuthRouter = router({
  // Autenticar com Google
  authenticateGoogle: publicProcedure
    .input(
      z.object({
        googleId: z.string(),
        email: z.string().email(),
        name: z.string(),
        picture: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      try {
        // Aqui você criaria ou atualizaria o usuário no banco
        // await db.insert(users).values({...}).onDuplicateKeyUpdate({...})

        return {
          success: true,
          user: {
            id: 1,
            email: input.email,
            name: input.name,
            loginMethod: "google",
            role: "user",
          },
          token: "jwt_token_here",
        };
      } catch (error) {
        console.error("Erro ao autenticar com Google:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao autenticar com Google",
        });
      }
    }),

  // Autenticar com Facebook
  authenticateFacebook: publicProcedure
    .input(
      z.object({
        facebookId: z.string(),
        email: z.string().email().optional(),
        name: z.string(),
        picture: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      try {
        // Aqui você criaria ou atualizaria o usuário no banco
        // await db.insert(users).values({...}).onDuplicateKeyUpdate({...})

        return {
          success: true,
          user: {
            id: 1,
            email: input.email || `${input.facebookId}@facebook.com`,
            name: input.name,
            loginMethod: "facebook",
            role: "user",
          },
          token: "jwt_token_here",
        };
      } catch (error) {
        console.error("Erro ao autenticar com Facebook:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao autenticar com Facebook",
        });
      }
    }),

  // Verificar se email já existe
  checkEmailExists: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      try {
        // Aqui você verificaria no banco de dados
        // const user = await db.query.users.findFirst({where: eq(users.email, input.email)})

        return {
          exists: false,
          email: input.email,
        };
      } catch (error) {
        console.error("Erro ao verificar email:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao verificar email",
        });
      }
    }),

  // Obter configurações de OAuth
  getOAuthConfig: publicProcedure.query(async () => {
    return {
      google: {
        clientId: process.env.VITE_GOOGLE_CLIENT_ID || "",
        enabled: !!process.env.VITE_GOOGLE_CLIENT_ID,
      },
      facebook: {
        appId: process.env.VITE_FACEBOOK_APP_ID || "",
        enabled: !!process.env.VITE_FACEBOOK_APP_ID,
      },
      manus: {
        enabled: true,
      },
    };
  }),
});
