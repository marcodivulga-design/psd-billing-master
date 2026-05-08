import { router, protectedProcedure, publicProcedure } from './_core/trpc';
import { z } from 'zod';
import { AICustomerSupportService } from './lib/core/ai-customer-support-service';

const aiService = AICustomerSupportService.getInstance();

export const aiCustomerSupportRouter = router({
  // Iniciar nova conversa
  startConversation: protectedProcedure
    .input(z.object({
      channel: z.enum(['web', 'whatsapp', 'telegram', 'email']).default('web'),
    }))
    .mutation(async ({ input, ctx }) => {
      const conversation = await aiService.startConversation(
        ctx.user.id,
        ctx.user.organizationId || 'default',
        input.channel
      );

      return {
        success: true,
        conversationId: conversation.id,
        initialMessage: conversation.messages[0]?.content,
      };
    }),

  // Enviar mensagem
  sendMessage: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
      message: z.string().min(1).max(5000),
      channel: z.enum(['web', 'whatsapp', 'telegram', 'email']).default('web'),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { response, escalated } = await aiService.processUserMessage(
          input.conversationId,
          input.message,
          input.channel
        );

        return {
          success: true,
          response,
          escalated,
          timestamp: new Date(),
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  // Obter histórico de conversa
  getConversation: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
    }))
    .query(async ({ input }) => {
      const conversation = aiService.getConversation(input.conversationId);

      if (!conversation) {
        throw new Error('Conversa não encontrada');
      }

      return {
        success: true,
        conversation: {
          id: conversation.id,
          status: conversation.status,
          channel: conversation.channel,
          sentiment: conversation.sentiment,
          escalatedToHuman: conversation.escalatedToHuman,
          messages: conversation.messages.map(m => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
            sentiment: m.sentiment,
          })),
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
        },
      };
    }),

  // Listar conversas do usuário
  getUserConversations: protectedProcedure
    .query(async ({ ctx }) => {
      const conversations = aiService.getUserConversations(ctx.user.id);

      return {
        success: true,
        conversations: conversations.map(c => ({
          id: c.id,
          status: c.status,
          channel: c.channel,
          sentiment: c.sentiment,
          messageCount: c.messages.length,
          lastMessage: c.messages[c.messages.length - 1]?.content,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        })),
      };
    }),

  // Fechar conversa
  closeConversation: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
    }))
    .mutation(async ({ input }) => {
      aiService.closeConversation(input.conversationId);

      return {
        success: true,
        message: 'Conversa fechada com sucesso',
      };
    }),

  // Obter estatísticas de atendimento
  getStatistics: protectedProcedure
    .query(async ({ ctx }) => {
      const stats = aiService.getStatistics(ctx.user.organizationId || 'default');

      return {
        success: true,
        statistics: {
          totalConversations: stats.totalConversations,
          activeConversations: stats.activeConversations,
          resolvedConversations: stats.resolvedConversations,
          escalatedConversations: stats.escalatedConversations,
          avgSentiment: stats.avgSentiment,
          channelDistribution: stats.channelDistribution,
          avgMessagesPerConversation: Math.round(stats.avgMessagesPerConversation * 100) / 100,
        },
      };
    }),

  // Processar fila de mensagens
  processQueue: protectedProcedure
    .mutation(async () => {
      const processed = await aiService.processMessageQueue();

      return {
        success: true,
        messagesProcessed: processed,
      };
    }),

  // Enviar feedback sobre resposta
  sendFeedback: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
      messageId: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Aqui você poderia salvar o feedback em um banco de dados
      console.log(`📊 Feedback recebido:`, input);

      return {
        success: true,
        message: 'Obrigado pelo feedback!',
      };
    }),

  // Escalar para agente humano
  escalateToHuman: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const conversation = aiService.getConversation(input.conversationId);

      if (!conversation) {
        throw new Error('Conversa não encontrada');
      }

      conversation.status = 'escalated';
      conversation.escalatedToHuman = true;

      return {
        success: true,
        message: 'Sua conversa foi escalada para um agente humano. Você será atendido em breve.',
      };
    }),

  // Sugestões de resposta rápida
  getQuickReplies: publicProcedure
    .input(z.object({
      conversationId: z.string().optional(),
    }))
    .query(async () => {
      return {
        success: true,
        quickReplies: [
          '👍 Obrigado pela ajuda!',
          '❓ Posso ter mais informações?',
          '🔄 Como faço para...?',
          '⏰ Qual é o prazo?',
          '💰 Qual é o preço?',
          '🚚 Como é o envio?',
          '🔄 Posso devolver?',
          '📞 Falar com alguém?',
        ],
      };
    }),

  // Health check
  health: publicProcedure
    .query(async () => {
      return {
        success: true,
        status: 'operational',
        timestamp: new Date(),
      };
    }),
});
