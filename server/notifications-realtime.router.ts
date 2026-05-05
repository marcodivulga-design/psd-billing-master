import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";

// Tipos para notificações
interface Notification {
  id: string;
  userId: number;
  type: "new_song" | "recommendation" | "friend_activity" | "system";
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

// Simulação de subscribers (em produção, usar Redis ou similar)
const subscribers = new Map<number, Set<(notification: Notification) => void>>();

export const notificationsRealtimeRouter = router({
  // Subscrever a notificações em tempo real
  subscribe: protectedProcedure.subscription(({ ctx }) => {
    return observable<Notification>((emit) => {
      const userId = ctx.user.id;

      // Adicionar subscriber
      if (!subscribers.has(userId)) {
        subscribers.set(userId, new Set());
      }

      const callback = (notification: Notification) => {
        emit.next(notification);
      };

      subscribers.get(userId)?.add(callback);

      // Cleanup ao desconectar
      return () => {
        subscribers.get(userId)?.delete(callback);
        if (subscribers.get(userId)?.size === 0) {
          subscribers.delete(userId);
        }
      };
    });
  }),

  // Enviar notificação
  send: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        type: z.enum(["new_song", "recommendation", "friend_activity", "system"]),
        title: z.string(),
        message: z.string(),
        data: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const notification: Notification = {
          id: Math.random().toString(36).substring(7),
          userId: input.userId,
          type: input.type,
          title: input.title,
          message: input.message,
          data: input.data,
          read: false,
          createdAt: new Date(),
        };

        // Enviar para subscribers
        const callbacks = subscribers.get(input.userId);
        if (callbacks) {
          callbacks.forEach((callback) => callback(notification));
        }

        // Aqui você salvaria no banco de dados
        // await db.insert(notifications).values(notification)

        return {
          success: true,
          notificationId: notification.id,
        };
      } catch (error) {
        console.error("Erro ao enviar notificação:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao enviar notificação",
        });
      }
    }),

  // Obter notificações não lidas
  getUnread: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Aqui você buscaria do banco de dados
      // const notifications = await db.query.notifications.findMany({
      //   where: {userId: ctx.user.id, read: false}
      // })

      return [];
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar notificações",
      });
    }
  }),

  // Marcar como lida
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Aqui você atualizaria no banco de dados
        // await db.update(notifications).set({read: true}).where(...)

        return { success: true };
      } catch (error) {
        console.error("Erro ao marcar como lida:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao marcar como lida",
        });
      }
    }),

  // Marcar todas como lidas
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      // Aqui você atualizaria no banco de dados
      // await db.update(notifications).set({read: true}).where({userId: ctx.user.id})

      return { success: true };
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao marcar todas como lidas",
      });
    }
  }),

  // Deletar notificação
  delete: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Aqui você deletaria do banco de dados
        // await db.delete(notifications).where(...)

        return { success: true };
      } catch (error) {
        console.error("Erro ao deletar notificação:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao deletar notificação",
        });
      }
    }),

  // Obter histórico de notificações
  getHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Aqui você buscaria do banco de dados
        // const notifications = await db.query.notifications.findMany({
        //   where: {userId: ctx.user.id},
        //   limit: input.limit,
        //   offset: input.offset
        // })

        return [];
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar histórico",
        });
      }
    }),

  // Obter configurações de notificação
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Aqui você buscaria as configurações do usuário
      return {
        newSongs: true,
        recommendations: true,
        friendActivity: true,
        systemNotifications: true,
        emailNotifications: false,
        pushNotifications: true,
      };
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar configurações",
      });
    }
  }),

  // Atualizar configurações de notificação
  updateSettings: protectedProcedure
    .input(
      z.object({
        newSongs: z.boolean().optional(),
        recommendations: z.boolean().optional(),
        friendActivity: z.boolean().optional(),
        systemNotifications: z.boolean().optional(),
        emailNotifications: z.boolean().optional(),
        pushNotifications: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Aqui você atualizaria as configurações no banco de dados
        // await db.update(notificationSettings).set(input).where(...)

        return { success: true };
      } catch (error) {
        console.error("Erro ao atualizar configurações:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao atualizar configurações",
        });
      }
    }),
});
