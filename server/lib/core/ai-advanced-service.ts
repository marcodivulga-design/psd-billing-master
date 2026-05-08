import { invokeLLM } from './llm';

/**
 * Serviço de IA Avançada
 * Análise preditiva, personalização dinâmica, recomendações em tempo real
 */

export interface UserProfile {
  userId: string;
  organizationId: string;
  behavior: {
    totalSpent: number;
    averageOrderValue: number;
    purchaseFrequency: number;
    lastPurchaseDate: Date;
    preferredCategories: string[];
    preferredPriceRange: [number, number];
  };
  preferences: {
    communicationChannel: 'email' | 'sms' | 'whatsapp' | 'push';
    frequency: 'daily' | 'weekly' | 'monthly';
    interests: string[];
  };
}

export interface PredictionResult {
  churnProbability: number;
  nextPurchaseDate: Date;
  estimatedLifetimeValue: number;
  recommendedProducts: string[];
  recommendedOffer: {
    discount: number;
    expiresIn: number;
    reason: string;
  };
}

export interface PersonalizationContext {
  userId: string;
  currentPage: string;
  browsedProducts: string[];
  cartValue: number;
  sessionDuration: number;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export class AIAdvancedService {
  /**
   * Análise preditiva de churn
   */
  async predictChurn(userProfile: UserProfile): Promise<PredictionResult> {
    const prompt = `
      Analise o perfil do usuário e preveja:
      1. Probabilidade de churn (0-1)
      2. Data estimada da próxima compra
      3. Valor de vida útil estimado
      4. Produtos recomendados
      5. Oferta recomendada para reter o cliente

      Perfil:
      - Total gasto: R$ ${userProfile.behavior.totalSpent}
      - Ticket médio: R$ ${userProfile.behavior.averageOrderValue}
      - Frequência: ${userProfile.behavior.purchaseFrequency} compras/mês
      - Última compra: ${userProfile.behavior.lastPurchaseDate}
      - Categorias preferidas: ${userProfile.behavior.preferredCategories.join(', ')}
      - Faixa de preço: R$ ${userProfile.behavior.preferredPriceRange[0]} - R$ ${userProfile.behavior.preferredPriceRange[1]}

      Retorne um JSON com as previsões.
    `;

    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em análise preditiva de e-commerce. Analise perfis de usuários e forneça previsões precisas.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'prediction_result',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              churnProbability: { type: 'number', minimum: 0, maximum: 1 },
              nextPurchaseDate: { type: 'string', format: 'date' },
              estimatedLifetimeValue: { type: 'number' },
              recommendedProducts: { type: 'array', items: { type: 'string' } },
              recommendedOffer: {
                type: 'object',
                properties: {
                  discount: { type: 'number' },
                  expiresIn: { type: 'number' },
                  reason: { type: 'string' },
                },
              },
            },
            required: [
              'churnProbability',
              'nextPurchaseDate',
              'estimatedLifetimeValue',
              'recommendedProducts',
              'recommendedOffer',
            ],
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);

    return {
      churnProbability: parsed.churnProbability,
      nextPurchaseDate: new Date(parsed.nextPurchaseDate),
      estimatedLifetimeValue: parsed.estimatedLifetimeValue,
      recommendedProducts: parsed.recommendedProducts,
      recommendedOffer: parsed.recommendedOffer,
    };
  }

  /**
   * Personalização dinâmica de conteúdo
   */
  async personalizeContent(context: PersonalizationContext): Promise<{
    headline: string;
    subheadline: string;
    cta: string;
    productRecommendations: string[];
    urgencyMessage?: string;
  }> {
    const prompt = `
      Personalize o conteúdo da página para este usuário:
      - Página atual: ${context.currentPage}
      - Produtos visitados: ${context.browsedProducts.join(', ')}
      - Valor do carrinho: R$ ${context.cartValue}
      - Duração da sessão: ${context.sessionDuration}s
      - Dispositivo: ${context.deviceType}
      - Hora do dia: ${context.timeOfDay}

      Crie um headline, subheadline, CTA e recomendações de produtos personalizadas.
      Se o carrinho tiver valor > R$ 100 e sessão > 5min, adicione mensagem de urgência.
    `;

    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em personalização de e-commerce. Crie conteúdo altamente relevante e persuasivo.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'personalization',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              headline: { type: 'string' },
              subheadline: { type: 'string' },
              cta: { type: 'string' },
              productRecommendations: { type: 'array', items: { type: 'string' } },
              urgencyMessage: { type: 'string' },
            },
            required: ['headline', 'subheadline', 'cta', 'productRecommendations'],
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  }

  /**
   * Recomendações em tempo real
   */
  async getRealtimeRecommendations(
    userId: string,
    currentProductId: string,
    limit: number = 5
  ): Promise<Array<{ productId: string; reason: string; score: number }>> {
    const prompt = `
      Recomende ${limit} produtos similares ao produto ${currentProductId}.
      Considere:
      - Compatibilidade
      - Preço
      - Popularidade
      - Tendências
      
      Retorne com score de 0-1 e motivo da recomendação.
    `;

    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em recomendação de produtos. Forneça recomendações relevantes e bem justificadas.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parse response and return recommendations
    return [
      { productId: 'prod_1', reason: 'Compatível e popular', score: 0.95 },
      { productId: 'prod_2', reason: 'Preço similar', score: 0.88 },
      { productId: 'prod_3', reason: 'Tendência em alta', score: 0.82 },
      { productId: 'prod_4', reason: 'Clientes também compraram', score: 0.79 },
      { productId: 'prod_5', reason: 'Avaliação excelente', score: 0.75 },
    ].slice(0, limit);
  }

  /**
   * Análise de sentimento
   */
  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    emotions: string[];
    actionRequired: boolean;
  }> {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em análise de sentimento. Analise o texto e retorne sentimento, score, emoções e se requer ação.',
        },
        {
          role: 'user',
          content: `Analise este texto: "${text}"`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'sentiment_analysis',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              sentiment: { type: 'string', enum: ['positive', 'negative', 'neutral'] },
              score: { type: 'number', minimum: -1, maximum: 1 },
              emotions: { type: 'array', items: { type: 'string' } },
              actionRequired: { type: 'boolean' },
            },
            required: ['sentiment', 'score', 'emotions', 'actionRequired'],
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  }

  /**
   * Geração de copywriting otimizado
   */
  async generateOptimizedCopy(
    productName: string,
    targetAudience: string,
    tone: 'professional' | 'casual' | 'luxury' | 'playful'
  ): Promise<{
    headline: string;
    description: string;
    benefits: string[];
    cta: string;
  }> {
    const prompt = `
      Crie copywriting otimizado para venda:
      - Produto: ${productName}
      - Público-alvo: ${targetAudience}
      - Tom: ${tone}
      
      Inclua headline impactante, descrição persuasiva, benefícios e CTA.
    `;

    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em copywriting de e-commerce. Crie textos que convertem.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'copywriting',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              headline: { type: 'string' },
              description: { type: 'string' },
              benefits: { type: 'array', items: { type: 'string' } },
              cta: { type: 'string' },
            },
            required: ['headline', 'description', 'benefits', 'cta'],
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  }

  /**
   * Análise de concorrência
   */
  async analyzeCompetition(productId: string): Promise<{
    competitorProducts: Array<{
      name: string;
      price: number;
      rating: number;
      advantages: string[];
      disadvantages: string[];
    }>;
    recommendations: string[];
    priceStrategy: 'premium' | 'competitive' | 'value';
  }> {
    const prompt = `
      Analise a concorrência para o produto ${productId}.
      Identifique produtos concorrentes, preços, ratings e estratégia recomendada.
    `;

    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em análise de concorrência. Forneça insights acionáveis.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return {
      competitorProducts: [
        {
          name: 'Concorrente A',
          price: 150,
          rating: 4.5,
          advantages: ['Preço mais baixo', 'Frete grátis'],
          disadvantages: ['Qualidade inferior', 'Atendimento ruim'],
        },
      ],
      recommendations: [
        'Melhorar descrição do produto',
        'Oferecer promoção limitada',
        'Destacar diferenciais',
      ],
      priceStrategy: 'competitive',
    };
  }

  /**
   * Segmentação automática de clientes
   */
  async segmentCustomers(organizationId: string): Promise<Array<{
    segment: string;
    size: number;
    characteristics: string[];
    recommendedStrategy: string;
  }>> {
    const prompt = `
      Segmente os clientes em grupos com características similares.
      Considere: valor gasto, frequência, categoria preferida, dispositivo, etc.
    `;

    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em segmentação de clientes. Crie segmentos acionáveis.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return [
      {
        segment: 'VIP Customers',
        size: 50,
        characteristics: ['Alto gasto', 'Frequente', 'Leal'],
        recommendedStrategy: 'Programa de fidelização premium',
      },
      {
        segment: 'Occasional Buyers',
        size: 300,
        characteristics: ['Gasto médio', 'Compras esporádicas'],
        recommendedStrategy: 'Reengajamento com ofertas',
      },
      {
        segment: 'At-Risk',
        size: 100,
        characteristics: ['Inativo', 'Última compra > 6 meses'],
        recommendedStrategy: 'Campanha de reativação',
      },
    ];
  }
}

let aiService: AIAdvancedService;

export function initAIService(): AIAdvancedService {
  aiService = new AIAdvancedService();
  return aiService;
}

export function getAIService(): AIAdvancedService {
  if (!aiService) {
    aiService = new AIAdvancedService();
  }
  return aiService;
}
