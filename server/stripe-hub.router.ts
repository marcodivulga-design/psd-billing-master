/**
 * Stripe Router - PSD Hub Integration
 * 
 * This router integrates with the remote PSD Hub for Stripe API calls
 * All Stripe payment operations are proxied through the centralized Hub
 */

import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { psdHubService } from "../services/psd-hub.service";
import { TRPCError } from "@trpc/server";

export const stripeHubRouter = router({
  /**
   * Create Stripe checkout session via PSD Hub
   */
  createCheckout: protectedProcedure
    .input(
      z.object({
        amount: z.number().positive("Valor deve ser positivo"),
        currency: z.string().length(3, "Moeda deve ter 3 caracteres"),
        description: z.string().min(1, "Descrição é obrigatória"),
        metadata: z.record(z.string(), z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await psdHubService.stripeCreateCheckout({
          amount: input.amount,
          currency: input.currency,
          description: input.description,
          metadata: {
            ...input.metadata,
            userId: "user",
            timestamp: new Date().toISOString(),
          },
        });

        if (!response.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: response.error || "Erro ao criar sessão de checkout",
          });
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error("[Stripe] Create checkout error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao criar sessão de pagamento",
        });
      }
    }),

  /**
   * Get payment history from Stripe via PSD Hub
   */
  getPaymentHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).default(20),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await psdHubService.stripeGetPayments(input.limit);

        if (!response.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: response.error || "Erro ao buscar histórico de pagamentos",
          });
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error("[Stripe] Get payment history error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar histórico de pagamentos",
        });
      }
    }),

  /**
   * Get subscription status from Stripe via PSD Hub
   */
  getSubscriptionStatus: protectedProcedure.query(async () => {
    try {
      const response = await psdHubService.stripeGetSubscription();

      if (!response.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: response.error || "Erro ao buscar status da assinatura",
        });
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("[Stripe] Get subscription status error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar status da assinatura",
      });
    }
  }),

  /**
   * Get invoice from Stripe via PSD Hub
   */
  getInvoice: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string().min(1, "Invoice ID é obrigatório"),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await psdHubService.stripeGetInvoice(input.invoiceId);

        if (!response.success) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: response.error || "Fatura não encontrada",
          });
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error("[Stripe] Get invoice error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar fatura",
        });
      }
    }),

  /**
   * Get Hub status for Stripe API
   */
  getHubStatus: publicProcedure.query(async () => {
    try {
      const response = await psdHubService.getApiStatus("stripe");

      return {
        success: response.success,
        status: response.data,
        error: response.error,
      };
    } catch (error) {
      console.error("[Stripe] Hub status error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao verificar status do Hub",
      });
    }
  }),

  /**
   * Clear cache for Stripe requests
   */
  clearCache: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Apenas administradores podem limpar o cache",
      });
    }

    try {
      psdHubService.clearCacheEntry("/api/stripe");
      return {
        success: true,
        message: "Cache do Stripe limpo com sucesso",
      };
    } catch (error) {
      console.error("[Stripe] Clear cache error:", error);
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
      console.error("[Stripe] Get cache stats error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter estatísticas de cache",
      });
    }
  }),
});
