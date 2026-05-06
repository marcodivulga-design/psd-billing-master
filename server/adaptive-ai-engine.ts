/**
 * Adaptive AI Engine - IA Pedagógica Adaptativa
 * 
 * Analisa padrões de aprendizado do aluno e adapta conteúdo
 * para otimizar retenção e engajamento.
 */

interface StudentProfile {
  userId: string;
  learningStyle: 'visual' | 'auditivo' | 'repetição' | 'leitura' | 'prática' | 'lógica' | 'criatividade';
  averageResponseTime: number; // em segundos
  averageAccuracy: number; // 0-100
  preferredTimeOfDay: 'manhã' | 'tarde' | 'noite';
  engagementLevel: number; // 0-100
  strengths: string[]; // matérias/tópicos fortes
  weaknesses: string[]; // matérias/tópicos fracos
  errorPatterns: Map<string, number>; // padrão de erros
  lastUpdated: Date;
}

interface LearningRecommendation {
  contentId: string;
  reason: string;
  priority: number; // 1-10
  difficulty: 'fácil' | 'médio' | 'difícil';
  format: 'vídeo' | 'texto' | 'interativo' | 'jogo' | 'prática';
  estimatedTime: number; // em minutos
  expectedRetention: number; // 0-100
}

interface AdaptiveContent {
  baseContent: string;
  adaptedFormat: string;
  visualElements: boolean;
  audioElements: boolean;
  interactiveElements: boolean;
  practiceExercises: number;
  reviewSchedule: Date[];
}

/**
 * Analisa padrões de resposta do aluno
 */
export function analyzeStudentPattern(
  responses: Array<{
    questionId: string;
    correct: boolean;
    responseTime: number;
    topic: string;
  }>
): Partial<StudentProfile> {
  const totalResponses = responses.length;
  const correctResponses = responses.filter((r) => r.correct).length;
  const averageResponseTime = responses.reduce((sum, r) => sum + r.responseTime, 0) / totalResponses;

  // Identificar tópicos fracos
  const topicStats = new Map<string, { correct: number; total: number }>();
  responses.forEach((r) => {
    const stats = topicStats.get(r.topic) || { correct: 0, total: 0 };
    stats.total++;
    if (r.correct) stats.correct++;
    topicStats.set(r.topic, stats);
  });

  const weaknesses = Array.from(topicStats.entries())
    .filter(([_, stats]) => stats.correct / stats.total < 0.6)
    .map(([topic]) => topic);

  const strengths = Array.from(topicStats.entries())
    .filter(([_, stats]) => stats.correct / stats.total > 0.8)
    .map(([topic]) => topic);

  return {
    averageResponseTime,
    averageAccuracy: (correctResponses / totalResponses) * 100,
    weaknesses,
    strengths,
  };
}

/**
 * Detecta estilo de aprendizado
 */
export function detectLearningStyle(
  interactions: Array<{
    type: 'video' | 'text' | 'audio' | 'interactive' | 'practice';
    engagementScore: number;
    completionRate: number;
  }>
): StudentProfile['learningStyle'] {
  const styleScores = {
    visual: 0,
    auditivo: 0,
    repetição: 0,
    leitura: 0,
    prática: 0,
    lógica: 0,
    criatividade: 0,
  };

  interactions.forEach((interaction) => {
    const score = interaction.engagementScore * interaction.completionRate;

    if (interaction.type === 'video') styleScores.visual += score;
    if (interaction.type === 'audio') styleScores.auditivo += score;
    if (interaction.type === 'text') styleScores.leitura += score;
    if (interaction.type === 'practice') styleScores.prática += score;
    if (interaction.type === 'interactive') {
      styleScores.lógica += score * 0.5;
      styleScores.criatividade += score * 0.5;
    }
  });

  const maxStyle = Object.entries(styleScores).reduce((max, [style, score]) =>
    score > max[1] ? [style, score] : max
  );

  return maxStyle[0] as StudentProfile['learningStyle'];
}

/**
 * Gera recomendações personalizadas
 */
export function generateRecommendations(
  profile: StudentProfile,
  availableContent: Array<{
    id: string;
    topic: string;
    difficulty: string;
    format: string;
  }>
): LearningRecommendation[] {
  const recommendations: LearningRecommendation[] = [];

  // Priorizar tópicos fracos
  const weakTopics = profile.weaknesses.slice(0, 3);
  
  weakTopics.forEach((topic) => {
    const relevantContent = availableContent.filter(
      (c) => c.topic === topic && c.difficulty === 'fácil'
    );

    if (relevantContent.length > 0) {
      const content = relevantContent[0];
      recommendations.push({
        contentId: content.id,
        reason: `Você teve dificuldade em ${topic}. Vamos revisar!`,
        priority: 10,
        difficulty: 'fácil',
        format: getFormatByLearningStyle(profile.learningStyle),
        estimatedTime: 15,
        expectedRetention: 65,
      });
    }
  });

  // Sugerir prática nos tópicos fortes
  profile.strengths.forEach((topic) => {
    const relevantContent = availableContent.filter(
      (c) => c.topic === topic && c.difficulty === 'médio'
    );

    if (relevantContent.length > 0) {
      const content = relevantContent[0];
      recommendations.push({
        contentId: content.id,
        reason: `Você é bom em ${topic}. Vamos desafiar?`,
        priority: 7,
        difficulty: 'médio',
        format: 'jogo',
        estimatedTime: 10,
        expectedRetention: 80,
      });
    }
  });

  return recommendations.sort((a, b) => b.priority - a.priority);
}

/**
 * Adapta conteúdo baseado no estilo de aprendizado
 */
export function adaptContent(
  baseContent: string,
  learningStyle: StudentProfile['learningStyle']
): AdaptiveContent {
  const adaptedContent: AdaptiveContent = {
    baseContent,
    adaptedFormat: baseContent,
    visualElements: false,
    audioElements: false,
    interactiveElements: false,
    practiceExercises: 3,
    reviewSchedule: generateReviewSchedule(),
  };

  switch (learningStyle) {
    case 'visual':
      adaptedContent.visualElements = true;
      adaptedContent.adaptedFormat = `[IMAGENS E GRÁFICOS]\n${baseContent}\n[MAPAS MENTAIS]`;
      break;
    case 'auditivo':
      adaptedContent.audioElements = true;
      adaptedContent.adaptedFormat = `[NARRAÇÃO]\n${baseContent}\n[DISCUSSÃO]`;
      break;
    case 'repetição':
      adaptedContent.practiceExercises = 5;
      adaptedContent.adaptedFormat = `${baseContent}\n[REPETIÇÃO 1]\n[REPETIÇÃO 2]\n[REPETIÇÃO 3]`;
      break;
    case 'leitura':
      adaptedContent.adaptedFormat = `[LEITURA DETALHADA]\n${baseContent}\n[RESUMO]`;
      break;
    case 'prática':
      adaptedContent.interactiveElements = true;
      adaptedContent.practiceExercises = 8;
      adaptedContent.adaptedFormat = `${baseContent}\n[EXERCÍCIO PRÁTICO 1]\n[EXERCÍCIO PRÁTICO 2]`;
      break;
    case 'lógica':
      adaptedContent.interactiveElements = true;
      adaptedContent.adaptedFormat = `${baseContent}\n[PROBLEMA LÓGICO]\n[ANÁLISE]`;
      break;
    case 'criatividade':
      adaptedContent.interactiveElements = true;
      adaptedContent.adaptedFormat = `${baseContent}\n[DESAFIO CRIATIVO]\n[PROJETO]`;
      break;
  }

  return adaptedContent;
}

/**
 * Detecta sinais de cansaço/desengajamento
 */
export function detectFatigue(
  recentSessions: Array<{
    duration: number;
    accuracy: number;
    responseTime: number;
    timestamp: Date;
  }>
): boolean {
  if (recentSessions.length < 3) return false;

  const lastThree = recentSessions.slice(-3);
  const accuracyTrend = lastThree.map((s) => s.accuracy);
  const responseTimeTrend = lastThree.map((s) => s.responseTime);

  // Verificar queda de acurácia
  const accuracyDecline = accuracyTrend[0] - accuracyTrend[2] > 15;

  // Verificar aumento de tempo de resposta
  const responseTimeIncrease = responseTimeTrend[2] - responseTimeTrend[0] > 5;

  return accuracyDecline || responseTimeIncrease;
}

/**
 * Gera sugestões de pausa
 */
export function suggestBreak(
  fatigue: boolean,
  sessionDuration: number
): { shouldBreak: boolean; message: string; suggestedDuration: number } {
  if (fatigue || sessionDuration > 45) {
    return {
      shouldBreak: true,
      message: 'Você está estudando há muito tempo. Que tal uma pausa?',
      suggestedDuration: 10,
    };
  }

  return {
    shouldBreak: false,
    message: '',
    suggestedDuration: 0,
  };
}

/**
 * Gera cronograma de revisão personalizado
 */
function generateReviewSchedule(): Date[] {
  const schedule: Date[] = [];
  const intervals = [1, 3, 7, 14, 30]; // dias

  intervals.forEach((days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    schedule.push(date);
  });

  return schedule;
}

/**
 * Retorna formato recomendado baseado no estilo de aprendizado
 */
function getFormatByLearningStyle(style: StudentProfile['learningStyle']): LearningRecommendation['format'] {
  const formatMap: Record<StudentProfile['learningStyle'], LearningRecommendation['format']> = {
    visual: 'vídeo',
    auditivo: 'vídeo', // com áudio
    repetição: 'prática',
    leitura: 'texto',
    prática: 'prática',
    lógica: 'interativo',
    criatividade: 'jogo',
  };

  return formatMap[style];
}

/**
 * Exporta funções principais
 */
export const AdaptiveAIEngine = {
  analyzeStudentPattern,
  detectLearningStyle,
  generateRecommendations,
  adaptContent,
  detectFatigue,
  suggestBreak,
};

export default AdaptiveAIEngine;
