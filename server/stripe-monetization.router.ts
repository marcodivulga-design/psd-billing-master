import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const stripeMonetizationRouter = router({
  // Obter planos disponíveis
  getPlans: protectedProcedure.query(async ({ ctx }) => {
    try {
      return [
        {
          id: "plan_free",
          name: "Gratuito",
          price: 0,
          currency: "BRL",
          features: [
            "Acesso a 860+ músicas",
            "Reprodução com anúncios",
            "Recomendações básicas",
            "Histórico limitado",
            "Sem downloads offline",
          ],
          limitations: {
            offlineSongs: 0,
            storageSize: 0,
            skipLimit: 5,
            adFreeDays: 0,
          },
        },
        {
          id: "plan_pro",
          name: "Pro",
          price: 9.99,
          currency: "BRL",
          billingPeriod: "monthly",
          features: [
            "Sem anúncios",
            "Reprodução ilimitada",
            "Recomendações personalizadas",
            "Downloads offline (até 100 músicas)",
            "Compartilhamento em tempo real",
            "Playlists colaborativas",
            "Suporte prioritário",
          ],
          limitations: {
            offlineSongs: 100,
            storageSize: 1024,
            skipLimit: null,
            adFreeDays: 30,
          },
        },
        {
          id: "plan_premium",
          name: "Premium",
          price: 19.99,
          currency: "BRL",
          billingPeriod: "monthly",
          features: [
            "Tudo do Pro",
            "Downloads offline ilimitados",
            "Armazenamento expandido (5GB)",
            "Acesso a conteúdo exclusivo",
            "Análise avançada de uso",
            "API para integrações",
            "Suporte VIP 24/7",
            "Badges e status premium",
          ],
          limitations: {
            offlineSongs: 1000,
            storageSize: 5120,
            skipLimit: null,
            adFreeDays: 30,
          },
        },
      ];
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar planos",
      });
    }
  }),

  // Criar sessão de checkout
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
        successUrl: z.string(),
        cancelUrl: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Aqui você criaria uma sessão de checkout com Stripe
        // const session = await stripe.checkout.sessions.create({
        //   customer_email: ctx.user.email,
        //   line_items: [{
        //     price: input.planId,
        //     quantity: 1,
        //   }],
        //   mode: 'subscription',
        //   success_url: input.successUrl,
        //   cancel_url: input.cancelUrl,
        // })

        return {
          success: true,
          sessionId: "cs_test_123",
          checkoutUrl: "https://checkout.stripe.com/pay/cs_test_123",
        };
      } catch (error) {
        console.error("Erro ao criar sessão:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao criar sessão de checkout",
        });
      }
    }),

  // Obter informações de assinatura
  getSubscriptionInfo: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Aqui você buscaria a assinatura do usuário no Stripe
      return {
        currentPlan: "plan_free",
        status: "active",
        startDate: null,
        renewalDate: null,
        autoRenew: false,
        paymentMethod: null,
      };
    } catch (error) {
      console.error("Erro ao buscar assinatura:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar assinatura",
      });
    }
  }),

  // Cancelar assinatura
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      // Aqui você cancelaria a assinatura no Stripe
      // await stripe.subscriptions.del(subscriptionId)

      return {
        success: true,
        message: "Assinatura cancelada",
        refundStatus: "processed",
      };
    } catch (error) {
      console.error("Erro ao cancelar assinatura:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao cancelar assinatura",
      });
    }
  }),

  // Atualizar plano
  updatePlan: protectedProcedure
    .input(z.object({ newPlanId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Aqui você atualizaria o plano no Stripe
        return {
          success: true,
          message: "Plano atualizado com sucesso",
          newPlan: input.newPlanId,
        };
      } catch (error) {
        console.error("Erro ao atualizar plano:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao atualizar plano",
        });
      }
    }),

  // Obter histórico de faturas
  getInvoiceHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Aqui você buscaria o histórico de faturas do Stripe
        return [];
      } catch (error) {
        console.error("Erro ao buscar faturas:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar faturas",
        });
      }
    }),

  // Obter método de pagamento
  getPaymentMethod: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Aqui você buscaria o método de pagamento do usuário
      return {
        type: "card",
        last4: "4242",
        expiryMonth: 12,
        expiryYear: 2025,
        brand: "visa",
      };
    } catch (error) {
      console.error("Erro ao buscar método de pagamento:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar método de pagamento",
      });
    }
  }),

  // Atualizar método de pagamento
  updatePaymentMethod: protectedProcedure
    .input(z.object({ paymentMethodId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Aqui você atualizaria o método de pagamento no Stripe
        return {
          success: true,
          message: "Método de pagamento atualizado",
        };
      } catch (error) {
        console.error("Erro ao atualizar método de pagamento:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao atualizar método de pagamento",
        });
      }
    }),

  // Aplicar cupom de desconto
  applyCoupon: protectedProcedure
    .input(z.object({ couponCode: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Aqui você validaria e aplicaria o cupom no Stripe
        return {
          success: true,
          message: "Cupom aplicado com sucesso",
          discount: 50,
          discountPercentage: 10,
        };
      } catch (error) {
        console.error("Erro ao aplicar cupom:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Cupom inválido",
        });
      }
    }),

  // Obter estatísticas de receita (admin)
  getRevenueStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Aqui você buscaria estatísticas de receita (apenas para admins)
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return {
        totalRevenue: 15000,
        monthlyRecurring: 5000,
        activeSubscriptions: 250,
        churnRate: 0.05,
        averageRevenuePerUser: 60,
        topPlan: "plan_pro",
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar estatísticas",
      });
    }
  }),

  // Webhook para eventos do Stripe
  handleStripeWebhook: protectedProcedure
    .input(
      z.object({
        event: z.object({
          type: z.string(),
          data: z.record(z.any()),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Aqui você processaria eventos do Stripe
        // Exemplos: payment_intent.succeeded, customer.subscription.updated, etc.

        return {
          success: true,
          message: "Evento processado",
        };
      } catch (error) {
        console.error("Erro ao processar webhook:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao processar webhook",
        });
      }
    }),
});
