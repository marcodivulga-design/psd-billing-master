/**
 * Serviço de Gamificação e Loyalty
 * Pontos, badges, achievements, referral program
 */

export interface LoyaltyAccount {
  userId: string;
  organizationId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  totalPoints: number;
  joinedAt: Date;
  lastActivityAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  unlockedAt?: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  name: string;
  description: string;
  points: number;
  unlockedAt: Date;
}

export interface ReferralCode {
  code: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  usedCount: number;
  maxUses?: number;
  reward: {
    referrerPoints: number;
    refereeDiscount: number;
  };
}

export interface ReferralReward {
  referrerId: string;
  refereeId: string;
  referralCode: string;
  points: number;
  discount: number;
  claimedAt: Date;
}

export class GamificationService {
  /**
   * Criar conta de loyalty
   */
  async createLoyaltyAccount(userId: string, organizationId: string): Promise<LoyaltyAccount> {
    return {
      userId,
      organizationId,
      points: 0,
      tier: 'bronze',
      totalSpent: 0,
      totalPoints: 0,
      joinedAt: new Date(),
      lastActivityAt: new Date(),
    };
  }

  /**
   * Adicionar pontos
   */
  async addPoints(userId: string, points: number, reason: string): Promise<LoyaltyAccount> {
    // Buscar conta
    // Adicionar pontos
    // Atualizar tier se necessário
    // Verificar achievements
    // Salvar no banco

    const account: LoyaltyAccount = {
      userId,
      organizationId: '',
      points: 100 + points,
      tier: 'silver',
      totalSpent: 1000,
      totalPoints: 100 + points,
      joinedAt: new Date(),
      lastActivityAt: new Date(),
    };

    return account;
  }

  /**
   * Usar pontos
   */
  async redeemPoints(userId: string, points: number): Promise<{ success: boolean; discount: number }> {
    // Validar saldo
    // Descontar pontos
    // Calcular desconto
    // Retornar resultado

    const discount = (points / 100) * 10; // 100 pontos = R$ 10

    return {
      success: true,
      discount,
    };
  }

  /**
   * Atualizar tier
   */
  private updateTier(totalSpent: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (totalSpent >= 10000) return 'platinum';
    if (totalSpent >= 5000) return 'gold';
    if (totalSpent >= 1000) return 'silver';
    return 'bronze';
  }

  /**
   * Desbloquear badge
   */
  async unlockBadge(userId: string, badgeId: string): Promise<Badge> {
    const badges: Record<string, Badge> = {
      first_purchase: {
        id: 'first_purchase',
        name: 'Primeira Compra',
        description: 'Faça sua primeira compra',
        icon: '🎉',
        requirement: 'Comprar 1 produto',
        unlockedAt: new Date(),
      },
      power_buyer: {
        id: 'power_buyer',
        name: 'Comprador Poderoso',
        description: 'Gaste R$ 1000',
        icon: '💪',
        requirement: 'Gastar R$ 1000',
        unlockedAt: new Date(),
      },
      reviewer: {
        id: 'reviewer',
        name: 'Crítico',
        description: 'Deixe 5 avaliações',
        icon: '⭐',
        requirement: 'Deixar 5 reviews',
        unlockedAt: new Date(),
      },
      social_butterfly: {
        id: 'social_butterfly',
        name: 'Borboleta Social',
        description: 'Compartilhe 10 produtos',
        icon: '🦋',
        requirement: 'Compartilhar 10 produtos',
        unlockedAt: new Date(),
      },
      loyal_customer: {
        id: 'loyal_customer',
        name: 'Cliente Leal',
        description: 'Seja cliente por 1 ano',
        icon: '❤️',
        requirement: 'Ser cliente há 1 ano',
        unlockedAt: new Date(),
      },
    };

    return badges[badgeId] || badges.first_purchase;
  }

  /**
   * Gerar código de referral
   */
  async generateReferralCode(userId: string, organizationId: string): Promise<ReferralCode> {
    const code = this.generateCode();

    return {
      code,
      userId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
      usedCount: 0,
      maxUses: undefined,
      reward: {
        referrerPoints: 100,
        refereeDiscount: 10, // R$ 10
      },
    };
  }

  /**
   * Validar e usar código de referral
   */
  async validateReferralCode(code: string, refereeId: string): Promise<ReferralReward | null> {
    // Buscar código
    // Validar se ainda é válido
    // Validar limite de usos
    // Criar reward
    // Adicionar pontos ao referrer
    // Aplicar desconto ao referee

    return {
      referrerId: 'user_123',
      refereeId,
      referralCode: code,
      points: 100,
      discount: 10,
      claimedAt: new Date(),
    };
  }

  /**
   * Obter leaderboard
   */
  async getLeaderboard(organizationId: string, limit: number = 10): Promise<Array<{
    rank: number;
    userId: string;
    points: number;
    tier: string;
  }>> {
    // Buscar top users por pontos
    // Retornar leaderboard

    return [
      { rank: 1, userId: 'user_1', points: 5000, tier: 'platinum' },
      { rank: 2, userId: 'user_2', points: 4500, tier: 'gold' },
      { rank: 3, userId: 'user_3', points: 4000, tier: 'gold' },
      { rank: 4, userId: 'user_4', points: 3500, tier: 'silver' },
      { rank: 5, userId: 'user_5', points: 3000, tier: 'silver' },
    ].slice(0, limit);
  }

  /**
   * Obter achievements do usuário
   */
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    // Buscar achievements do usuário
    // Retornar lista

    return [
      {
        id: 'ach_1',
        userId,
        name: 'Primeira Compra',
        description: 'Faça sua primeira compra',
        points: 50,
        unlockedAt: new Date(),
      },
      {
        id: 'ach_2',
        userId,
        name: 'Comprador Frequente',
        description: 'Faça 10 compras',
        points: 200,
        unlockedAt: new Date(),
      },
    ];
  }

  /**
   * Obter badges do usuário
   */
  async getUserBadges(userId: string): Promise<Badge[]> {
    // Buscar badges do usuário
    // Retornar lista

    return [
      {
        id: 'first_purchase',
        name: 'Primeira Compra',
        description: 'Faça sua primeira compra',
        icon: '🎉',
        requirement: 'Comprar 1 produto',
        unlockedAt: new Date(),
      },
    ];
  }

  /**
   * Gerar código aleatório
   */
  private generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Obter estatísticas de loyalty
   */
  async getLoyaltyStats(organizationId: string): Promise<{
    totalMembers: number;
    totalPointsIssued: number;
    totalPointsRedeemed: number;
    averagePointsPerMember: number;
    tierDistribution: Record<string, number>;
  }> {
    return {
      totalMembers: 1000,
      totalPointsIssued: 500000,
      totalPointsRedeemed: 150000,
      averagePointsPerMember: 350,
      tierDistribution: {
        bronze: 600,
        silver: 300,
        gold: 80,
        platinum: 20,
      },
    };
  }

  /**
   * Enviar notificação de achievement
   */
  async notifyAchievement(userId: string, achievement: Achievement): Promise<void> {
    // Enviar email/SMS/push notification
    console.log(`Achievement unlocked for ${userId}: ${achievement.name}`);
  }

  /**
   * Enviar notificação de badge
   */
  async notifyBadge(userId: string, badge: Badge): Promise<void> {
    // Enviar email/SMS/push notification
    console.log(`Badge unlocked for ${userId}: ${badge.name}`);
  }
}

let gamificationService: GamificationService;

export function initGamificationService(): GamificationService {
  gamificationService = new GamificationService();
  return gamificationService;
}

export function getGamificationService(): GamificationService {
  if (!gamificationService) {
    gamificationService = new GamificationService();
  }
  return gamificationService;
}
