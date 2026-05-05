/**
 * PSD Payments Router - PSD Hub Integration
 * 
 * This router integrates with the remote PSD Hub for PSD2 payment processing
 * Handles payments, recurring donations, and payment status via centralized Hub
 */

import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { psdHubService } from "../services/psd-hub.service";
import { TRPCError } from "@trpc/server";

export const psdPaymentsHubRouter = router({
  /**
   * Create PSD2 payment via PSD Hub
   */
  createPayment: protectedProcedure
    .input(
      z.object({
        amount: z.number().positive("Valor deve ser positivo"),
        currency: z.string().length(3, "Moeda deve ter 3 caracteres").default("EUR"),
        description: z.string().min(1, "Descrição é obrigatória"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await psdHubService.psd2CreatePayment({
          amount: input.amount,
          currency: input.currency,
          description: input.description,
        });

        if (!response.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: response.error || "Erro ao criar pagamento PSD2",
          });
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error("[PSD2] Create payment error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao processar pagamento",
        });
      }
    }),

  /**
   * Create recurring donation via PSD Hub
   */
  createRecurringDonation: protectedProcedure
    .input(
      z.object({
        amount: z.number().positive("Valor deve ser positivo"),
        frequency: z.enum(["weekly", "monthly", "quarterly", "annual"]),
        description: z.string().min(1, "Descrição é obrigatória"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await psdHubService.psd2CreateRecurringDonation({
          amount: input.amount,
          frequency: input.frequency,
          description: input.description,
        });

        if (!response.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: response.error || "Erro ao criar doação recorrente",
          });
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error("[PSD2] Create recurring donation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao criar doação recorrente",
        });
      }
    }),

  /**
   * Get payment status from PSD Hub
   */
  getPaymentStatus: protectedProcedure
    .input(
      z.object({
        paymentId: z.string().min(1, "Payment ID é obrigatório"),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await psdHubService.psd2GetPaymentStatus(input.paymentId);

        if (!response.success) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: response.error || "Pagamento não encontrado",
          });
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.error("[PSD2] Get payment status error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar status do pagamento",
        });
      }
    }),

  /**
   * Get payment history from PSD Hub
   */
  getPaymentHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).default(20),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await psdHubService.psd2GetPaymentHistory(input.limit);

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
        console.error("[PSD2] Get payment history error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar histórico de pagamentos",
        });
      }
    }),

  /**
   * Get Hub status for PSD2 API
   */
  getHubStatus: publicProcedure.query(async () => {
    try {
      const response = await psdHubService.getApiStatus("psd2");

      return {
        success: response.success,
        status: response.data,
        error: response.error,
      };
    } catch (error) {
      console.error("[PSD2] Hub status error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao verificar status do Hub",
      });
    }
  }),

  /**
   * Clear cache for PSD2 requests
   */
  clearCache: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Apenas administradores podem limpar o cache",
      });
    }

    try {
      psdHubService.clearCacheEntry("/api/psd2");
      return {
        success: true,
        message: "Cache do PSD2 limpo com sucesso",
      };
    } catch (error) {
      console.error("[PSD2] Clear cache error:", error);
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
      console.error("[PSD2] Get cache stats error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter estatísticas de cache",
      });
    }
  }),
});
