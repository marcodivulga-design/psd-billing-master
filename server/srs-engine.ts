/**
 * SRS Engine - Sistema de Repetição Espaçada (Spaced Repetition System)
 * 
 * Implementa o algoritmo de repetição espaçada baseado em pesquisa científica
 * para otimizar retenção de conhecimento.
 * 
 * Algoritmo: SM-2 (SuperMemo 2)
 * Referência: https://www.supermemo.com/en/archives1990-2015/english/ol/2prt.htm
 */

interface ReviewData {
  id: string;
  contentId: string;
  userId: string;
  quality: number; // 0-5 (0=complete blackout, 5=perfect response)
  interval: number; // dias até próxima revisão
  easeFactor: number; // fator de dificuldade (1.3 - 2.5)
  repetitions: number; // número de vezes revisado
  nextReviewDate: Date;
  lastReviewDate: Date;
  createdAt: Date;
}

interface SRSConfig {
  initialInterval: number; // dias para primeira revisão (padrão: 1)
  initialEaseFactor: number; // fator inicial (padrão: 2.5)
  minEaseFactor: number; // mínimo (padrão: 1.3)
  qualityThreshold: number; // qualidade mínima para progressão (padrão: 3)
}

const DEFAULT_CONFIG: SRSConfig = {
  initialInterval: 1,
  initialEaseFactor: 2.5,
  minEaseFactor: 1.3,
  qualityThreshold: 3,
};

/**
 * Calcula o próximo intervalo de revisão usando SM-2
 */
export function calculateNextInterval(
  repetitions: number,
  easeFactor: number,
  quality: number,
  config: SRSConfig = DEFAULT_CONFIG
): { interval: number; newEaseFactor: number } {
  // Fórmula SM-2
  let newEaseFactor = easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  
  // Limitar fator de facilidade
  if (newEaseFactor < config.minEaseFactor) {
    newEaseFactor = config.minEaseFactor;
  }

  let interval: number;

  if (quality < config.qualityThreshold) {
    // Se qualidade baixa, reiniciar
    interval = config.initialInterval;
  } else if (repetitions === 0) {
    // Primeira revisão
    interval = config.initialInterval;
  } else if (repetitions === 1) {
    // Segunda revisão
    interval = 3;
  } else {
    // Próximas revisões
    interval = Math.round(interval * newEaseFactor);
  }

  return { interval, newEaseFactor };
}

/**
 * Cria um novo registro de revisão
 */
export function createReviewRecord(
  contentId: string,
  userId: string,
  config: SRSConfig = DEFAULT_CONFIG
): ReviewData {
  const now = new Date();
  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + config.initialInterval);

  return {
    id: generateId(),
    contentId,
    userId,
    quality: 0,
    interval: config.initialInterval,
    easeFactor: config.initialEaseFactor,
    repetitions: 0,
    nextReviewDate,
    lastReviewDate: now,
    createdAt: now,
  };
}

/**
 * Processa uma revisão e calcula próxima data
 */
export function processReview(
  review: ReviewData,
  quality: number,
  config: SRSConfig = DEFAULT_CONFIG
): ReviewData {
  if (quality < 0 || quality > 5) {
    throw new Error('Quality must be between 0 and 5');
  }

  const { interval, newEaseFactor } = calculateNextInterval(
    review.repetitions,
    review.easeFactor,
    quality,
    config
  );

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    ...review,
    quality,
    interval,
    easeFactor: newEaseFactor,
    repetitions: review.repetitions + 1,
    nextReviewDate,
    lastReviewDate: new Date(),
  };
}

/**
 * Obtém conteúdo devido para revisão
 */
export function getContentDueForReview(reviews: ReviewData[]): ReviewData[] {
  const now = new Date();
  return reviews.filter((review) => review.nextReviewDate <= now);
}

/**
 * Calcula estatísticas de retenção
 */
export function calculateRetentionStats(reviews: ReviewData[]) {
  const totalReviews = reviews.length;
  const averageQuality = reviews.reduce((sum, r) => sum + r.quality, 0) / totalReviews || 0;
  const averageEaseFactor = reviews.reduce((sum, r) => sum + r.easeFactor, 0) / totalReviews || 0;
  const averageRepetitions = reviews.reduce((sum, r) => sum + r.repetitions, 0) / totalReviews || 0;
  const dueForReview = getContentDueForReview(reviews).length;

  return {
    totalReviews,
    averageQuality: Math.round(averageQuality * 100) / 100,
    averageEaseFactor: Math.round(averageEaseFactor * 100) / 100,
    averageRepetitions: Math.round(averageRepetitions * 100) / 100,
    dueForReview,
    retentionRate: Math.round((averageQuality / 5) * 100),
  };
}

/**
 * Gera ID único
 */
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Exporta funções principais
 */
export const SRSEngine = {
  calculateNextInterval,
  createReviewRecord,
  processReview,
  getContentDueForReview,
  calculateRetentionStats,
};

export default SRSEngine;
