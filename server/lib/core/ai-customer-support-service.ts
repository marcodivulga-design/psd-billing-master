/**
 * PSD AI Customer Support Service - Atendimento Inteligente 24/7
 * Integra OpenAI, análise de sentimento, roteamento inteligente e multi-canal
 */

import { invokeLLM } from '../../_core/llm';

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  channel: 'web' | 'whatsapp' | 'telegram' | 'email';
  sentiment?: 'positive' | 'neutral' | 'negative';
  confidence?: number;
}

export interface Conversation {
  id: string;
  userId: string;
  organizationId: string;
  status: 'active' | 'resolved' | 'escalated' | 'closed';
  channel: 'web' | 'whatsapp' | 'telegram' | 'email';
  messages: ChatMessage[];
  sentiment: 'positive' | 'neutral' | 'negative';
  escalatedToHuman: boolean;
  humanAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    product?: string;
    issue?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    tags?: string[];
  };
}

export class AICustomerSupportService {
  private static instance: AICustomerSupportService;
  private conversations: Map<string, Conversation> = new Map();
  private messageQueue: ChatMessage[] = [];

  private constructor() {}

  public static getInstance(): AICustomerSupportService {
    if (!AICustomerSupportService.instance) {
      AICustomerSupportService.instance = new AICustomerSupportService();
    }
    return AICustomerSupportService.instance;
  }

  /**
   * Inicia uma nova conversa
   */
  public async startConversation(
    userId: string,
    organizationId: string,
    channel: 'web' | 'whatsapp' | 'telegram' | 'email' = 'web'
  ): Promise<Conversation> {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const conversation: Conversation = {
      id: conversationId,
      userId,
      organizationId,
      status: 'active',
      channel,
      messages: [],
      sentiment: 'neutral',
      escalatedToHuman: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {},
    };

    this.conversations.set(conversationId, conversation);

    // Mensagem de boas-vindas
    const welcomeMessage = await this.generateWelcomeMessage(channel);
    await this.addMessage(conversationId, 'assistant', welcomeMessage, channel);

    return conversation;
  }

  /**
   * Processa mensagem do usuário
   */
  public async processUserMessage(
    conversationId: string,
    userMessage: string,
    channel: 'web' | 'whatsapp' | 'telegram' | 'email' = 'web'
  ): Promise<{ response: string; escalated: boolean }> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversa ${conversationId} não encontrada`);
    }

    // Adicionar mensagem do usuário
    await this.addMessage(conversationId, 'user', userMessage, channel);

    // Analisar sentimento
    const sentiment = await this.analyzeSentiment(userMessage);
    conversation.sentiment = sentiment;

    // Se sentimento muito negativo, considerar escalar
    if (sentiment === 'negative' && conversation.messages.length > 3) {
      const shouldEscalate = await this.shouldEscalateToHuman(conversation);
      if (shouldEscalate) {
        conversation.status = 'escalated';
        conversation.escalatedToHuman = true;
        const escalationMessage = await this.generateEscalationMessage(channel);
        await this.addMessage(conversationId, 'assistant', escalationMessage, channel);
        return { response: escalationMessage, escalated: true };
      }
    }

    // Gerar resposta com IA
    const response = await this.generateAIResponse(conversation, userMessage);
    await this.addMessage(conversationId, 'assistant', response, channel);

    return { response, escalated: false };
  }

  /**
   * Gera resposta com IA
   */
  private async generateAIResponse(conversation: Conversation, userMessage: string): Promise<string> {
    const conversationHistory = conversation.messages
      .slice(-10) // Últimas 10 mensagens para contexto
      .map(m => ({
        role: m.role,
        content: m.content,
      }));

    const systemPrompt = `Você é um assistente de atendimento ao cliente da ${conversation.organizationId}.
Seja amigável, profissional e eficiente.
Sempre tente resolver o problema do cliente.
Se não conseguir resolver, ofereça escalar para um agente humano.
Responda em português brasileiro.`;

    try {
      const response = await invokeLLM({
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage },
        ],
      });

      return response.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';
    } catch (error: any) {
      console.error('Erro ao gerar resposta IA:', error);
      return 'Desculpe, estou tendo dificuldades no momento. Por favor, tente novamente ou fale com um agente humano.';
    }
  }

  /**
   * Analisa sentimento da mensagem
   */
  private async analyzeSentiment(message: string): Promise<'positive' | 'neutral' | 'negative'> {
    const negativeWords = ['ruim', 'péssimo', 'horrível', 'problema', 'erro', 'não funciona', 'frustrado', 'raiva'];
    const positiveWords = ['ótimo', 'excelente', 'perfeito', 'obrigado', 'funcionou', 'feliz', 'satisfeito'];

    const lowerMessage = message.toLowerCase();

    const negativeCount = negativeWords.filter(w => lowerMessage.includes(w)).length;
    const positiveCount = positiveWords.filter(w => lowerMessage.includes(w)).length;

    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  }

  /**
   * Decide se deve escalar para humano
   */
  private async shouldEscalateToHuman(conversation: Conversation): Promise<boolean> {
    // Critérios de escalação
    const criteria = {
      negativeSentiment: conversation.sentiment === 'negative',
      manyMessages: conversation.messages.length > 10,
      unresolved: conversation.messages.some(m => 
        m.content.toLowerCase().includes('não consegui') || 
        m.content.toLowerCase().includes('não posso')
      ),
    };

    return criteria.negativeSentiment || (criteria.manyMessages && criteria.unresolved);
  }

  /**
   * Adiciona mensagem à conversa
   */
  private async addMessage(
    conversationId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    channel: 'web' | 'whatsapp' | 'telegram' | 'email'
  ): Promise<ChatMessage> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversa ${conversationId} não encontrada`);
    }

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      role,
      content,
      timestamp: new Date(),
      channel,
      sentiment: role === 'user' ? await this.analyzeSentiment(content) : undefined,
    };

    conversation.messages.push(message);
    conversation.updatedAt = new Date();
    this.messageQueue.push(message);

    return message;
  }

  /**
   * Gera mensagem de boas-vindas
   */
  private async generateWelcomeMessage(channel: string): Promise<string> {
    const messages: Record<string, string> = {
      web: '👋 Olá! Bem-vindo ao nosso atendimento. Como posso ajudá-lo hoje?',
      whatsapp: '👋 Oi! Estou aqui para ajudar. Qual é sua dúvida?',
      telegram: '👋 Olá! Como posso ajudá-lo?',
      email: 'Olá,\n\nObrigado por entrar em contato. Estou aqui para ajudar com suas dúvidas.',
    };

    return messages[channel] || messages.web;
  }

  /**
   * Gera mensagem de escalação
   */
  private async generateEscalationMessage(channel: string): Promise<string> {
    const messages: Record<string, string> = {
      web: '🤝 Vejo que você pode precisar de mais ajuda. Vou conectá-lo com um agente humano em breve.',
      whatsapp: '🤝 Vou chamar um agente para ajudar você melhor.',
      telegram: '🤝 Deixe-me conectar você com um especialista.',
      email: 'Vejo que você pode precisar de mais assistência. Um agente humano entrará em contato em breve.',
    };

    return messages[channel] || messages.web;
  }

  /**
   * Obtém histórico de conversa
   */
  public getConversation(conversationId: string): Conversation | undefined {
    return this.conversations.get(conversationId);
  }

  /**
   * Lista conversas de um usuário
   */
  public getUserConversations(userId: string): Conversation[] {
    return Array.from(this.conversations.values()).filter(c => c.userId === userId);
  }

  /**
   * Fecha conversa
   */
  public closeConversation(conversationId: string): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.status = 'closed';
      conversation.updatedAt = new Date();
    }
  }

  /**
   * Obtém estatísticas de atendimento
   */
  public getStatistics(organizationId: string) {
    const orgConversations = Array.from(this.conversations.values()).filter(
      c => c.organizationId === organizationId
    );

    return {
      totalConversations: orgConversations.length,
      activeConversations: orgConversations.filter(c => c.status === 'active').length,
      resolvedConversations: orgConversations.filter(c => c.status === 'resolved').length,
      escalatedConversations: orgConversations.filter(c => c.status === 'escalated').length,
      avgSentiment: this.calculateAverageSentiment(orgConversations),
      channelDistribution: this.getChannelDistribution(orgConversations),
      avgMessagesPerConversation: orgConversations.length > 0
        ? orgConversations.reduce((sum, c) => sum + c.messages.length, 0) / orgConversations.length
        : 0,
    };
  }

  /**
   * Calcula sentimento médio
   */
  private calculateAverageSentiment(conversations: Conversation[]): string {
    if (conversations.length === 0) return 'neutral';

    const sentiments = conversations.map(c => c.sentiment);
    const positive = sentiments.filter(s => s === 'positive').length;
    const negative = sentiments.filter(s => s === 'negative').length;

    if (positive > negative) return 'positive';
    if (negative > positive) return 'negative';
    return 'neutral';
  }

  /**
   * Obtém distribuição por canal
   */
  private getChannelDistribution(conversations: Conversation[]): Record<string, number> {
    const distribution: Record<string, number> = {
      web: 0,
      whatsapp: 0,
      telegram: 0,
      email: 0,
    };

    conversations.forEach(c => {
      distribution[c.channel]++;
    });

    return distribution;
  }

  /**
   * Processa fila de mensagens
   */
  public async processMessageQueue(): Promise<number> {
    const processed = this.messageQueue.length;
    // Aqui você poderia persistir as mensagens em um banco de dados
    // ou enviar para um serviço de logging
    this.messageQueue = [];
    return processed;
  }
}
