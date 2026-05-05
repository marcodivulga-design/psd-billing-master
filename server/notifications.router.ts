import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { pushNotificationService } from "../services/push-notification.service";

export const notificationsRouter = router({
  /**
   * Send notification for new celebration
   */
  notifyCelebration: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        celebrationId: z.string().optional(),
        targetRole: z.enum(["admin", "user", "all"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Only admins can send notifications
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Only admins can send notifications");
      }

      const result = await pushNotificationService.handleTrigger({
        type: "celebration",
        targetRole: input.targetRole || "all",
        payload: {
          title: input.title,
          body: input.body,
          icon: "🙏",
          data: {
            celebrationId: input.celebrationId || "",
          },
        },
      });

      return {
        success: true,
        sentCount: typeof result === "number" ? result : 1,
        message: `Notificação enviada para ${typeof result === "number" ? result : 1} usuário(s)`,
      };
    }),

  /**
   * Send notification for pastoral message
   */
  notifyPastoralMessage: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        messageId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Only priests (admins) can send pastoral messages
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Only priests can send pastoral messages");
      }

      const result = await pushNotificationService.handleTrigger({
        type: "pastoral_message",
        payload: {
          title: input.title,
          body: input.body,
          icon: "📢",
          data: {
            messageId: input.messageId || "",
          },
        },
      });

      return {
        success: true,
        sentCount: typeof result === "number" ? result : 1,
        message: `Mensagem pastoral enviada para ${typeof result === "number" ? result : 1} usuário(s)`,
      };
    }),

  /**
   * Send notification for event
   */
  notifyEvent: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        eventId: z.string().optional(),
        targetRole: z.enum(["admin", "user", "all"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Only admins can send event notifications
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Only admins can send notifications");
      }

      const result = await pushNotificationService.handleTrigger({
        type: "event",
        targetRole: input.targetRole || "all",
        payload: {
          title: input.title,
          body: input.body,
          icon: "📅",
          data: {
            eventId: input.eventId || "",
          },
        },
      });

      return {
        success: true,
        sentCount: typeof result === "number" ? result : 1,
        message: `Notificação de evento enviada para ${typeof result === "number" ? result : 1} usuário(s)`,
      };
    }),

  /**
   * Send notification for news
   */
  notifyNews: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        newsId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Only admins can send news notifications
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Only admins can send notifications");
      }

      const result = await pushNotificationService.handleTrigger({
        type: "news",
        payload: {
          title: input.title,
          body: input.body,
          icon: "📰",
          data: {
            newsId: input.newsId || "",
          },
        },
      });

      return {
        success: true,
        sentCount: typeof result === "number" ? result : 1,
        message: `Notícia enviada para ${typeof result === "number" ? result : 1} usuário(s)`,
      };
    }),

  /**
   * Send custom notification
   */
  sendCustom: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        targetRole: z.enum(["admin", "user", "all"]).optional(),
        userId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Only admins can send custom notifications
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Only admins can send notifications");
      }

      let result: boolean | number = false;

      if (input.userId) {
        result = await pushNotificationService.sendToUser(input.userId, {
          title: input.title,
          body: input.body,
        });
      } else if (input.targetRole === "all") {
        result = await pushNotificationService.sendToAll({
          title: input.title,
          body: input.body,
        });
      } else if (input.targetRole) {
        result = await pushNotificationService.sendToRole(input.targetRole, {
          title: input.title,
          body: input.body,
        });
      }

      return {
        success: true,
        sentCount: typeof result === "number" ? result : 1,
        message: `Notificação customizada enviada`,
      };
    }),

  /**
   * Get notification preferences for current user
   */
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    return {
      userId: ctx.user.id,
      preferences: {
        celebrations: true,
        pastorals: true,
        events: true,
        news: true,
        email: false,
        sms: false,
      },
    };
  }),

  /**
   * Update notification preferences
   */
  updatePreferences: protectedProcedure
    .input(
      z.object({
        celebrations: z.boolean().optional(),
        pastorals: z.boolean().optional(),
        events: z.boolean().optional(),
        news: z.boolean().optional(),
        email: z.boolean().optional(),
        sms: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // In a real implementation, this would update the database
      console.log(`Updated notification preferences for user ${ctx.user.id}:`, input);

      return {
        success: true,
        message: "Preferências de notificação atualizadas com sucesso",
      };
    }),
});
