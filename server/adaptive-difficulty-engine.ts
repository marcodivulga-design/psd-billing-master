/**
 * adaptive-difficulty-engine.ts - IA de Dificuldade Automática
 * 
 * Identifica:
 * - Leitura lenta
 * - Erros repetidos
 * - Dificuldade de interpretação
 * - Ansiedade em tempo
 * - Abandono de exercícios
 * 
 * E adapta:
 * - Linguagem
 * - Quantidade
 * - Formato
 * - Repetição
 */

export interface StudentPerformanceMetrics {
  studentId: string;
  subjectId: string;
  readingSpeed: number; // palavras por minuto
  errorRate: number; // 0-100%
  interpretationScore: number; // 0-100
  timeSpentPerQuestion: number; // segundos
  questionsAbandoned: number;
  averageAccuracy: number; // 0-100
  sessionDuration: number; // minutos
  stressIndicators: {
    timeoutErrors: number;
    rapidClicks: number;
    longPauses: number;
  };
}

export interface DifficultyAdjustment {
  currentLevel: 'very-easy' | 'easy' | 'normal' | 'hard' | 'very-hard';
  recommendedLevel: 'very-easy' | 'easy' | 'normal' | 'hard' | 'very-hard';
  adjustments: {
    language: 'simplified' | 'normal' | 'advanced';
    questionQuantity: number; // reduzir ou aumentar
    questionFormat: 'multiple-choice' | 'true-false' | 'fill-blank' | 'essay' | 'mixed';
    timeLimit: number; // segundos por questão
    repetitionNeeded: boolean;
    additionalExamples: boolean;
    visualSupport: boolean;
    audioSupport: boolean;
  };
  reasons: string[];
  confidence: number; // 0-100%
}

// ============================================
// ANÁLISE DE PERFORMANCE
// ============================================

export function analyzePerformance(metrics: StudentPerformanceMetrics): DifficultyAdjustment {
  const reasons: string[] = [];
  let difficultyScore = 0; // -100 (muito fácil) a +100 (muito difícil)

  // Análise de Leitura Lenta
  if (metrics.readingSpeed < 100) {
    reasons.push('Leitura lenta detectada');
    difficultyScore -= 20;
  } else if (metrics.readingSpeed > 300) {
    reasons.push('Leitura rápida detectada');
    difficultyScore += 10;
  }

  // Análise de Taxa de Erro
  if (metrics.errorRate > 50) {
    reasons.push('Taxa de erro muito alta');
    difficultyScore -= 30;
  } else if (metrics.errorRate < 10) {
    reasons.push('Desempenho excelente');
    difficultyScore += 20;
  }

  // Análise de Interpretação
  if (metrics.interpretationScore < 40) {
    reasons.push('Dificuldade de interpretação');
    difficultyScore -= 25;
  } else if (metrics.interpretationScore > 80) {
    reasons.push('Interpretação excelente');
    difficultyScore += 15;
  }

  // Análise de Ansiedade (tempo)
  if (metrics.timeSpentPerQuestion < 10) {
    reasons.push('Ansiedade detectada - respostas muito rápidas');
    difficultyScore -= 15;
  } else if (metrics.timeSpentPerQuestion > 120) {
    reasons.push('Possível dificuldade - tempo excessivo');
    difficultyScore -= 20;
  }

  // Análise de Abandono
  if (metrics.questionsAbandoned > 3) {
    reasons.push('Muitas questões abandonadas');
    difficultyScore -= 35;
  }

  // Análise de Indicadores de Estresse
  if (metrics.stressIndicators.timeoutErrors > 2) {
    reasons.push('Muitos erros por timeout');
    difficultyScore -= 20;
  }

  if (metrics.stressIndicators.rapidClicks > 5) {
    reasons.push('Cliques rápidos indicam ansiedade');
    difficultyScore -= 15;
  }

  if (metrics.stressIndicators.longPauses > 3) {
    reasons.push('Pausas longas indicam dúvida');
    difficultyScore -= 10;
  }

  // Determinar nível de dificuldade
  const currentLevel = determineDifficultyLevel(difficultyScore);
  const recommendedLevel = recommendDifficultyLevel(difficultyScore);

  // Gerar ajustes
  const adjustments = generateAdjustments(recommendedLevel, metrics);

  return {
    currentLevel,
    recommendedLevel,
    adjustments,
    reasons,
    confidence: Math.min(100, Math.abs(difficultyScore) + 40),
  };
}

// ============================================
// DETERMINAÇÃO DE NÍVEL
// ============================================

function determineDifficultyLevel(
  score: number
): 'very-easy' | 'easy' | 'normal' | 'hard' | 'very-hard' {
  if (score < -60) return 'very-easy';
  if (score < -20) return 'easy';
  if (score < 20) return 'normal';
  if (score < 60) return 'hard';
  return 'very-hard';
}

function recommendDifficultyLevel(
  score: number
): 'very-easy' | 'easy' | 'normal' | 'hard' | 'very-hard' {
  // Recomendação é mais conservadora
  if (score < -50) return 'very-easy';
  if (score < -10) return 'easy';
  if (score < 30) return 'normal';
  if (score < 70) return 'hard';
  return 'very-hard';
}

// ============================================
// GERAÇÃO DE AJUSTES
// ============================================

function generateAdjustments(
  level: 'very-easy' | 'easy' | 'normal' | 'hard' | 'very-hard',
  metrics: StudentPerformanceMetrics
) {
  const adjustments = {
    language: 'normal' as 'simplified' | 'normal' | 'advanced',
    questionQuantity: 10,
    questionFormat: 'multiple-choice' as const,
    timeLimit: 60,
    repetitionNeeded: false,
    additionalExamples: false,
    visualSupport: false,
    audioSupport: false,
  };

  switch (level) {
    case 'very-easy':
      adjustments.language = 'simplified';
      adjustments.questionQuantity = 5;
      adjustments.questionFormat = 'true-false';
      adjustments.timeLimit = 120;
      adjustments.repetitionNeeded = true;
      adjustments.additionalExamples = true;
      adjustments.visualSupport = true;
      adjustments.audioSupport = true;
      break;

    case 'easy':
      adjustments.language = 'simplified';
      adjustments.questionQuantity = 8;
      adjustments.questionFormat = 'multiple-choice';
      adjustments.timeLimit = 90;
      adjustments.repetitionNeeded = true;
      adjustments.additionalExamples = true;
      adjustments.visualSupport = true;
      adjustments.audioSupport = metrics.readingSpeed < 100;
      break;

    case 'normal':
      adjustments.language = 'normal';
      adjustments.questionQuantity = 10;
      adjustments.questionFormat = 'mixed';
      adjustments.timeLimit = 60;
      adjustments.repetitionNeeded = false;
      adjustments.additionalExamples = false;
      adjustments.visualSupport = false;
      adjustments.audioSupport = false;
      break;

    case 'hard':
      adjustments.language = 'advanced';
      adjustments.questionQuantity = 12;
      adjustments.questionFormat = 'mixed';
      adjustments.timeLimit = 45;
      adjustments.repetitionNeeded = false;
      adjustments.additionalExamples = false;
      adjustments.visualSupport = false;
      adjustments.audioSupport = false;
      break;

    case 'very-hard':
      adjustments.language = 'advanced';
      adjustments.questionQuantity = 15;
      adjustments.questionFormat = 'essay';
      adjustments.timeLimit = 30;
      adjustments.repetitionNeeded = false;
      adjustments.additionalExamples = false;
      adjustments.visualSupport = false;
      adjustments.audioSupport = false;
      break;
  }

  return adjustments;
}

// ============================================
// HELPERS
// ============================================

export function shouldAdjustDifficulty(
  adjustment: DifficultyAdjustment
): boolean {
  return adjustment.currentLevel !== adjustment.recommendedLevel;
}

export function getAdjustmentSummary(adjustment: DifficultyAdjustment): string {
  if (adjustment.currentLevel === adjustment.recommendedLevel) {
    return 'Nível de dificuldade mantido';
  }

  const direction =
    adjustment.currentLevel > adjustment.recommendedLevel ? 'reduzida' : 'aumentada';
  return `Dificuldade ${direction} para ${adjustment.recommendedLevel}`;
}

export function createPerformanceMetrics(
  studentId: string,
  subjectId: string,
  data: Partial<StudentPerformanceMetrics>
): StudentPerformanceMetrics {
  return {
    studentId,
    subjectId,
    readingSpeed: data.readingSpeed || 150,
    errorRate: data.errorRate || 25,
    interpretationScore: data.interpretationScore || 60,
    timeSpentPerQuestion: data.timeSpentPerQuestion || 45,
    questionsAbandoned: data.questionsAbandoned || 0,
    averageAccuracy: data.averageAccuracy || 75,
    sessionDuration: data.sessionDuration || 30,
    stressIndicators: data.stressIndicators || {
      timeoutErrors: 0,
      rapidClicks: 0,
      longPauses: 0,
    },
  };
}
