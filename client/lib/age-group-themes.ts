/**
 * age-group-themes.ts - Sistema de Temas Adaptativos por Faixa Etária
 * 
 * Define temas visuais, linguagem e interações para cada faixa etária
 * Infantil, Fund I, Fund II, Médio, EJA, Especial
 */

export type AgeGroup = 'infantil' | 'fund-i' | 'fund-ii' | 'medio' | 'eja' | 'especial';

export interface AgeGroupTheme {
  id: AgeGroup;
  name: string;
  ageRange: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    buttonSize: 'sm' | 'md' | 'lg' | 'xl';
    padding: string;
    gap: string;
  };
  interactions: {
    animationDuration: number;
    hoverScale: number;
    tapScale: number;
  };
  language: {
    tone: 'playful' | 'friendly' | 'modern' | 'professional' | 'respectful';
    complexity: 'simple' | 'moderate' | 'complex';
    examples: string[];
  };
  features: {
    audio: boolean;
    animations: 'heavy' | 'moderate' | 'minimal';
    gamification: 'heavy' | 'moderate' | 'minimal';
    socialFeatures: boolean;
    customization: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    audioDescription: boolean;
    libras: boolean;
    pictograms: boolean;
    simplifiedNavigation: boolean;
  };
}

export const ageGroupThemes: Record<AgeGroup, AgeGroupTheme> = {
  infantil: {
    id: 'infantil',
    name: '👶 Educação Infantil',
    ageRange: '4 a 6 anos',
    description: 'Mundo mágico de descoberta e brincadeira',
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      background: '#FFF5E1',
      text: '#2D3436',
      success: '#00D084',
      warning: '#FFA502',
      error: '#FF6B6B',
    },
    typography: {
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '18px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '48px',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      buttonSize: 'xl',
      padding: '24px',
      gap: '20px',
    },
    interactions: {
      animationDuration: 800,
      hoverScale: 1.15,
      tapScale: 0.9,
    },
    language: {
      tone: 'playful',
      complexity: 'simple',
      examples: [
        'Vamos brincar juntos?',
        'Que legal! Você conseguiu!',
        'Tente de novo, você vai conseguir!',
      ],
    },
    features: {
      audio: true,
      animations: 'heavy',
      gamification: 'heavy',
      socialFeatures: false,
      customization: false,
    },
    accessibility: {
      highContrast: false,
      largeText: true,
      audioDescription: true,
      libras: false,
      pictograms: true,
      simplifiedNavigation: true,
    },
  },

  'fund-i': {
    id: 'fund-i',
    name: '🧒 Fundamental I',
    ageRange: '7 a 10 anos',
    description: 'Mundo de aventura e exploração',
    colors: {
      primary: '#5F27CD',
      secondary: '#00D2D3',
      accent: '#FFD93D',
      background: '#F0F3F7',
      text: '#2C3E50',
      success: '#1ABC9C',
      warning: '#F39C12',
      error: '#E74C3C',
    },
    typography: {
      fontSize: {
        xs: '13px',
        sm: '15px',
        base: '16px',
        lg: '20px',
        xl: '28px',
        '2xl': '36px',
        '3xl': '44px',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      buttonSize: 'lg',
      padding: '20px',
      gap: '16px',
    },
    interactions: {
      animationDuration: 600,
      hoverScale: 1.08,
      tapScale: 0.95,
    },
    language: {
      tone: 'friendly',
      complexity: 'moderate',
      examples: [
        'Você desbloqueou uma nova região!',
        'Parabéns! Você ganhou uma medalha!',
        'Desafio diário disponível!',
      ],
    },
    features: {
      audio: true,
      animations: 'moderate',
      gamification: 'heavy',
      socialFeatures: true,
      customization: true,
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      audioDescription: false,
      libras: false,
      pictograms: true,
      simplifiedNavigation: true,
    },
  },

  'fund-ii': {
    id: 'fund-ii',
    name: '🧑 Fundamental II',
    ageRange: '11 a 14 anos',
    description: 'Experiência gamer moderna e competitiva',
    colors: {
      primary: '#0F3460',
      secondary: '#16213E',
      accent: '#E94560',
      background: '#1A1A2E',
      text: '#EAEAEA',
      success: '#00D084',
      warning: '#FFA502',
      error: '#FF6B6B',
    },
    typography: {
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '15px',
        lg: '18px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      buttonSize: 'md',
      padding: '16px',
      gap: '12px',
    },
    interactions: {
      animationDuration: 400,
      hoverScale: 1.05,
      tapScale: 0.97,
    },
    language: {
      tone: 'modern',
      complexity: 'moderate',
      examples: [
        'Você subiu 2 posições no ranking!',
        'Nova skin desbloqueada!',
        'Streak de 7 dias! 🔥',
      ],
    },
    features: {
      audio: false,
      animations: 'moderate',
      gamification: 'heavy',
      socialFeatures: true,
      customization: true,
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      audioDescription: false,
      libras: false,
      pictograms: false,
      simplifiedNavigation: false,
    },
  },

  medio: {
    id: 'medio',
    name: '🎓 Ensino Médio',
    ageRange: '15 a 18 anos',
    description: 'Plataforma premium focada em desempenho',
    colors: {
      primary: '#1A365D',
      secondary: '#2D3748',
      accent: '#4299E1',
      background: '#F7FAFC',
      text: '#1A202C',
      success: '#48BB78',
      warning: '#ED8936',
      error: '#F56565',
    },
    typography: {
      fontSize: {
        xs: '12px',
        sm: '13px',
        base: '14px',
        lg: '16px',
        xl: '20px',
        '2xl': '28px',
        '3xl': '36px',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      buttonSize: 'md',
      padding: '16px',
      gap: '12px',
    },
    interactions: {
      animationDuration: 300,
      hoverScale: 1.02,
      tapScale: 0.98,
    },
    language: {
      tone: 'professional',
      complexity: 'complex',
      examples: [
        'Você melhorou 18% em interpretação.',
        'Seu desempenho em Matemática: 87%',
        'Recomendação: Revisar Geometria',
      ],
    },
    features: {
      audio: false,
      animations: 'minimal',
      gamification: 'minimal',
      socialFeatures: false,
      customization: true,
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      audioDescription: false,
      libras: false,
      pictograms: false,
      simplifiedNavigation: false,
    },
  },

  eja: {
    id: 'eja',
    name: '🧠 EJA (Adultos)',
    ageRange: 'Adultos',
    description: 'Educação respeitosa e acessível',
    colors: {
      primary: '#34495E',
      secondary: '#7F8C8D',
      accent: '#3498DB',
      background: '#ECF0F1',
      text: '#2C3E50',
      success: '#27AE60',
      warning: '#E67E22',
      error: '#E74C3C',
    },
    typography: {
      fontSize: {
        xs: '13px',
        sm: '14px',
        base: '15px',
        lg: '17px',
        xl: '20px',
        '2xl': '26px',
        '3xl': '32px',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      buttonSize: 'md',
      padding: '16px',
      gap: '12px',
    },
    interactions: {
      animationDuration: 500,
      hoverScale: 1.03,
      tapScale: 0.98,
    },
    language: {
      tone: 'respectful',
      complexity: 'complex',
      examples: [
        'Você completou a lição com sucesso.',
        'Seu progresso: 65% do curso',
        'Próximo tópico: Redação',
      ],
    },
    features: {
      audio: false,
      animations: 'minimal',
      gamification: 'minimal',
      socialFeatures: false,
      customization: true,
    },
    accessibility: {
      highContrast: false,
      largeText: true,
      audioDescription: true,
      libras: false,
      pictograms: false,
      simplifiedNavigation: true,
    },
  },

  especial: {
    id: 'especial',
    name: '♿ Educação Especial',
    ageRange: 'Todas as idades',
    description: 'Acessibilidade total e inclusão',
    colors: {
      primary: '#2C3E50',
      secondary: '#34495E',
      accent: '#3498DB',
      background: '#FFFFFF',
      text: '#000000',
      success: '#27AE60',
      warning: '#E67E22',
      error: '#E74C3C',
    },
    typography: {
      fontSize: {
        xs: '16px',
        sm: '18px',
        base: '20px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '48px',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      buttonSize: 'lg',
      padding: '20px',
      gap: '16px',
    },
    interactions: {
      animationDuration: 600,
      hoverScale: 1.08,
      tapScale: 0.95,
    },
    language: {
      tone: 'friendly',
      complexity: 'simple',
      examples: [
        'Muito bem! Você conseguiu!',
        'Vamos tentar juntos?',
        'Parabéns por seu esforço!',
      ],
    },
    features: {
      audio: true,
      animations: 'moderate',
      gamification: 'moderate',
      socialFeatures: false,
      customization: true,
    },
    accessibility: {
      highContrast: true,
      largeText: true,
      audioDescription: true,
      libras: true,
      pictograms: true,
      simplifiedNavigation: true,
    },
  },
};

export const getThemeByAgeGroup = (ageGroup: AgeGroup): AgeGroupTheme => {
  return ageGroupThemes[ageGroup];
};

export const getAllAgeGroups = (): AgeGroupTheme[] => {
  return Object.values(ageGroupThemes);
};

export const getAgeGroupByAge = (age: number): AgeGroup => {
  if (age >= 4 && age <= 6) return 'infantil';
  if (age >= 7 && age <= 10) return 'fund-i';
  if (age >= 11 && age <= 14) return 'fund-ii';
  if (age >= 15 && age <= 18) return 'medio';
  return 'eja'; // Adultos
};
