/**
 * educational-levels.ts - Estrutura por Níveis Educacionais
 * 
 * Define 8 níveis com interfaces, linguagem, visual e dificuldade diferentes
 */

export type EducationalLevel =
  | 'infantil'
  | 'fundamental-i'
  | 'fundamental-ii'
  | 'ensino-medio'
  | 'eja'
  | 'tecnico'
  | 'reforco'
  | 'especial';

export interface LevelConfig {
  id: EducationalLevel;
  name: string;
  ageRange: string;
  icon: string;
  description: string;
  characteristics: {
    language: 'playful' | 'friendly' | 'modern' | 'professional' | 'respectful' | 'simple';
    fontSize: number;
    buttonSize: 'large' | 'medium' | 'small';
    animationIntensity: 'heavy' | 'moderate' | 'minimal';
    gamificationLevel: 'heavy' | 'moderate' | 'minimal';
    audioSupport: boolean;
    visualSupport: boolean;
    textLength: 'short' | 'medium' | 'long';
    interactionStyle: 'drag-drop' | 'click' | 'type' | 'mixed';
    difficultyProgression: 'slow' | 'normal' | 'fast';
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  modules: {
    lessons: boolean;
    quiz: boolean;
    gamification: boolean;
    aiTutor: boolean;
    parentsPanel: boolean;
    teacherLibrary: boolean;
    emotionalArea: boolean;
    schoolWall: boolean;
    municipalEvents: boolean;
  };
  features: {
    enem?: boolean;
    vestibular?: boolean;
    careerGuidance?: boolean;
    specializedContent?: boolean;
    workAdaptation?: boolean;
    inclusiveTools?: boolean;
    reinforcementFocus?: boolean;
  };
}

export const EDUCATIONAL_LEVELS: Record<EducationalLevel, LevelConfig> = {
  infantil: {
    id: 'infantil',
    name: 'Educação Infantil',
    ageRange: '4-6 anos',
    icon: '🍎',
    description: 'Interface gigante, colorida, com áudio e personagens',
    characteristics: {
      language: 'playful',
      fontSize: 32,
      buttonSize: 'large',
      animationIntensity: 'heavy',
      gamificationLevel: 'heavy',
      audioSupport: true,
      visualSupport: true,
      textLength: 'short',
      interactionStyle: 'drag-drop',
      difficultyProgression: 'slow',
    },
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      background: '#FFF9E6',
    },
    modules: {
      lessons: true,
      quiz: true,
      gamification: true,
      aiTutor: false,
      parentsPanel: true,
      teacherLibrary: true,
      emotionalArea: true,
      schoolWall: true,
      municipalEvents: false,
    },
    features: {},
  },
  'fundamental-i': {
    id: 'fundamental-i',
    name: 'Fundamental I',
    ageRange: '7-10 anos',
    icon: '📚',
    description: 'Mais gamificado, colorido, com desafios progressivos',
    characteristics: {
      language: 'friendly',
      fontSize: 24,
      buttonSize: 'large',
      animationIntensity: 'moderate',
      gamificationLevel: 'heavy',
      audioSupport: true,
      visualSupport: true,
      textLength: 'medium',
      interactionStyle: 'mixed',
      difficultyProgression: 'normal',
    },
    colors: {
      primary: '#6C5CE7',
      secondary: '#00B894',
      accent: '#FDCB6E',
      background: '#F5F6FA',
    },
    modules: {
      lessons: true,
      quiz: true,
      gamification: true,
      aiTutor: true,
      parentsPanel: true,
      teacherLibrary: true,
      emotionalArea: true,
      schoolWall: true,
      municipalEvents: true,
    },
    features: {},
  },
  'fundamental-ii': {
    id: 'fundamental-ii',
    name: 'Fundamental II',
    ageRange: '11-14 anos',
    icon: '🎓',
    description: 'Moderno, dark mode, com competição e desafios',
    characteristics: {
      language: 'modern',
      fontSize: 18,
      buttonSize: 'medium',
      animationIntensity: 'minimal',
      gamificationLevel: 'moderate',
      audioSupport: false,
      visualSupport: true,
      textLength: 'medium',
      interactionStyle: 'click',
      difficultyProgression: 'normal',
    },
    colors: {
      primary: '#0984E3',
      secondary: '#E84393',
      accent: '#6C5CE7',
      background: '#1E1E2E',
    },
    modules: {
      lessons: true,
      quiz: true,
      gamification: true,
      aiTutor: true,
      parentsPanel: true,
      teacherLibrary: true,
      emotionalArea: true,
      schoolWall: true,
      municipalEvents: true,
    },
    features: {},
  },
  'ensino-medio': {
    id: 'ensino-medio',
    name: 'Ensino Médio',
    ageRange: '15-18 anos',
    icon: '🎯',
    description: 'Professional, com ENEM, vestibular, carreira',
    characteristics: {
      language: 'professional',
      fontSize: 16,
      buttonSize: 'medium',
      animationIntensity: 'minimal',
      gamificationLevel: 'minimal',
      audioSupport: false,
      visualSupport: true,
      textLength: 'long',
      interactionStyle: 'type',
      difficultyProgression: 'fast',
    },
    colors: {
      primary: '#2C3E50',
      secondary: '#3498DB',
      accent: '#E74C3C',
      background: '#ECF0F1',
    },
    modules: {
      lessons: true,
      quiz: true,
      gamification: false,
      aiTutor: true,
      parentsPanel: true,
      teacherLibrary: true,
      emotionalArea: true,
      schoolWall: true,
      municipalEvents: true,
    },
    features: {
      enem: true,
      vestibular: true,
      careerGuidance: true,
    },
  },
  eja: {
    id: 'eja',
    name: 'EJA (Educação de Jovens e Adultos)',
    ageRange: 'Adultos',
    icon: '👨‍🎓',
    description: 'Profissional, respeitoso, com foco em aplicabilidade',
    characteristics: {
      language: 'respectful',
      fontSize: 18,
      buttonSize: 'medium',
      animationIntensity: 'minimal',
      gamificationLevel: 'minimal',
      audioSupport: false,
      visualSupport: true,
      textLength: 'long',
      interactionStyle: 'type',
      difficultyProgression: 'normal',
    },
    colors: {
      primary: '#34495E',
      secondary: '#16A085',
      accent: '#F39C12',
      background: '#ECF0F1',
    },
    modules: {
      lessons: true,
      quiz: true,
      gamification: false,
      aiTutor: true,
      parentsPanel: false,
      teacherLibrary: true,
      emotionalArea: true,
      schoolWall: true,
      municipalEvents: true,
    },
    features: {
      workAdaptation: true,
    },
  },
  tecnico: {
    id: 'tecnico',
    name: 'Educação Técnica/Profissionalizante',
    ageRange: '15+',
    icon: '⚙️',
    description: 'Especializado, com foco em habilidades práticas',
    characteristics: {
      language: 'professional',
      fontSize: 16,
      buttonSize: 'medium',
      animationIntensity: 'minimal',
      gamificationLevel: 'minimal',
      audioSupport: false,
      visualSupport: true,
      textLength: 'long',
      interactionStyle: 'type',
      difficultyProgression: 'fast',
    },
    colors: {
      primary: '#D35400',
      secondary: '#27AE60',
      accent: '#2980B9',
      background: '#ECF0F1',
    },
    modules: {
      lessons: true,
      quiz: true,
      gamification: false,
      aiTutor: true,
      parentsPanel: false,
      teacherLibrary: true,
      emotionalArea: false,
      schoolWall: true,
      municipalEvents: true,
    },
    features: {
      specializedContent: true,
      workAdaptation: true,
    },
  },
  reforco: {
    id: 'reforco',
    name: 'Reforço Escolar',
    ageRange: 'Variável',
    icon: '📖',
    description: 'Adaptativo, com foco em dificuldades específicas',
    characteristics: {
      language: 'friendly',
      fontSize: 20,
      buttonSize: 'medium',
      animationIntensity: 'moderate',
      gamificationLevel: 'heavy',
      audioSupport: true,
      visualSupport: true,
      textLength: 'short',
      interactionStyle: 'mixed',
      difficultyProgression: 'slow',
    },
    colors: {
      primary: '#E91E63',
      secondary: '#9C27B0',
      accent: '#FF9800',
      background: '#FFF3E0',
    },
    modules: {
      lessons: true,
      quiz: true,
      gamification: true,
      aiTutor: true,
      parentsPanel: true,
      teacherLibrary: true,
      emotionalArea: true,
      schoolWall: false,
      municipalEvents: false,
    },
    features: {
      reinforcementFocus: true,
    },
  },
  especial: {
    id: 'especial',
    name: 'Educação Especial',
    ageRange: 'Variável',
    icon: '♿',
    description: 'Acessível, com LIBRAS, alto contraste, pictogramas',
    characteristics: {
      language: 'simple',
      fontSize: 24,
      buttonSize: 'large',
      animationIntensity: 'minimal',
      gamificationLevel: 'moderate',
      audioSupport: true,
      visualSupport: true,
      textLength: 'short',
      interactionStyle: 'click',
      difficultyProgression: 'slow',
    },
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#FFFF00',
      background: '#FFFFFF',
    },
    modules: {
      lessons: true,
      quiz: true,
      gamification: true,
      aiTutor: true,
      parentsPanel: true,
      teacherLibrary: true,
      emotionalArea: true,
      schoolWall: true,
      municipalEvents: true,
    },
    features: {
      inclusiveTools: true,
    },
  },
};

// ============================================
// HELPERS
// ============================================

export function getLevelConfig(level: EducationalLevel): LevelConfig {
  return EDUCATIONAL_LEVELS[level];
}

export function getLevelName(level: EducationalLevel): string {
  return EDUCATIONAL_LEVELS[level].name;
}

export function getAgeRange(level: EducationalLevel): string {
  return EDUCATIONAL_LEVELS[level].ageRange;
}

export function isModuleAvailable(
  level: EducationalLevel,
  moduleName: keyof LevelConfig['modules']
): boolean {
  return EDUCATIONAL_LEVELS[level].modules[moduleName];
}

export function getAllLevels(): LevelConfig[] {
  return Object.values(EDUCATIONAL_LEVELS);
}

export function getLevelsByAge(age: number): EducationalLevel[] {
  const levels: EducationalLevel[] = [];

  if (age >= 4 && age <= 6) levels.push('infantil');
  if (age >= 7 && age <= 10) levels.push('fundamental-i');
  if (age >= 11 && age <= 14) levels.push('fundamental-ii');
  if (age >= 15 && age <= 18) levels.push('ensino-medio');

  return levels;
}
