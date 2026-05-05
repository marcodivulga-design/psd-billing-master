import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const checkoutSessionSchema = z.object({
  priceId: z.string(),
  churchId: z.number(),
  returnUrl: z.string(),
});

const paymentHistorySchema = z.object({
  userId: z.number(),
  limit: z.number().default(20),
  offset: z.number().default(0),
});

export const stripeRouter = router({
  // Create checkout session
  createCheckoutSession: protectedProcedure
    .input(checkoutSessionSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("User not authenticated");

      try {
        // In production, this would call Stripe API
        // For now, return a mock checkout URL
        const checkoutUrl = `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substr(2, 9)}`;

        return {
          success: true,
          checkoutUrl,
          sessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
        };
      } catch (error) {
        console.error("[Stripe] Failed to create checkout session:", error);
        throw new Error("Failed to create checkout session");
      }
    }),

  // Get payment history for user
  getPaymentHistory: protectedProcedure
    .input(paymentHistorySchema)
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        // In production, would query payments table
        // For now, return empty array
        return [];
      } catch (error) {
        console.error("[Stripe] Failed to get payment history:", error);
        return [];
      }
    }),

  // Get subscription status
  getSubscriptionStatus: protectedProcedure
    .input(z.object({ churchId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        // In production, would query subscriptions table
        // For now, return null
        return null;
      } catch (error) {
        console.error("[Stripe] Failed to get subscription status:", error);
        return null;
      }
    }),

  // Cancel subscription
  cancelSubscription: protectedProcedure
    .input(z.object({ subscriptionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // In production, would call Stripe API to cancel
        return { success: true };
      } catch (error) {
        console.error("[Stripe] Failed to cancel subscription:", error);
        throw new Error("Failed to cancel subscription");
      }
    }),

  // Update payment method
  updatePaymentMethod: protectedProcedure
    .input(
      z.object({
        paymentMethodId: z.string(),
        churchId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // In production, would call Stripe API
        return { success: true };
      } catch (error) {
        console.error("[Stripe] Failed to update payment method:", error);
        throw new Error("Failed to update payment method");
      }
    }),

  // Get invoice
  getInvoice: protectedProcedure
    .input(z.object({ invoiceId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        // In production, would fetch from Stripe
        return null;
      } catch (error) {
        console.error("[Stripe] Failed to get invoice:", error);
        return null;
      }
    }),

  // Download invoice
  downloadInvoice: protectedProcedure
    .input(z.object({ invoiceId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        // In production, would generate PDF from Stripe invoice
        return {
          success: true,
          url: `https://example.com/invoices/${input.invoiceId}.pdf`,
        };
      } catch (error) {
        console.error("[Stripe] Failed to download invoice:", error);
        throw new Error("Failed to download invoice");
      }
    }),

  // Get billing portal URL
  getBillingPortalUrl: protectedProcedure
    .input(z.object({ churchId: z.number(), returnUrl: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // In production, would create Stripe billing portal session
        const portalUrl = `https://billing.stripe.com/p/session/${Math.random().toString(36).substr(2, 9)}`;
        return {
          success: true,
          portalUrl,
        };
      } catch (error) {
        console.error("[Stripe] Failed to get billing portal URL:", error);
        throw new Error("Failed to get billing portal URL");
      }
    }),

  // Get available plans
  getPlans: publicProcedure.query(async () => {
    return [
      {
        id: "price_free",
        name: "Gratuito",
        price: 0,
        currency: "BRL",
        interval: "month",
        features: ["Até 5 ministérios", "Até 100 músicas", "Suporte básico"],
      },
      {
        id: "price_basic",
        name: "Básico",
        price: 29.9,
        currency: "BRL",
        interval: "month",
        features: ["Até 10 ministérios", "Até 500 músicas", "Suporte por email"],
      },
      {
        id: "price_pro",
        name: "Profissional",
        price: 79.9,
        currency: "BRL",
        interval: "month",
        features: [
          "Ministérios ilimitados",
          "Músicas ilimitadas",
          "Suporte prioritário",
          "Análise avançada",
        ],
      },
    ];
  }),

  // Verify webhook signature
  verifyWebhookSignature: publicProcedure
    .input(
      z.object({
        payload: z.string(),
        signature: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // In production, would verify with Stripe
        return { valid: true };
      } catch (error) {
        console.error("[Stripe] Failed to verify webhook signature:", error);
        return { valid: false };
      }
    }),
});
