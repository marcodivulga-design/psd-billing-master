/**
 * adaptive-ui-evolution.ts
 * 
 * Sistema de Visual Evolutivo
 * A interface muda conforme a plataforma aprende
 * 
 * Níveis de Evolução:
 * 1. Iniciante (0-20) - Cores quentes, interface simples
 * 2. Básico (20-40) - Cores mais vibrantes, mais opções
 * 3. Intermediário (40-60) - Cores sofisticadas, mais recursos
 * 4. Avançado (60-80) - Cores premium, interface completa
 * 5. Especialista (80-100) - Cores personalizadas, interface avançada
 * 6. Mestre (100+) - Cores dinâmicas, interface revolucionária
 */

export type EvolutionLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface EvolutiveTheme {
  level: EvolutionLevel;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      h1: number;
      h2: number;
      h3: number;
      body: number;
      small: number;
    };
    fontWeight: {
      light: number;
      regular: number;
      medium: number;
      bold: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animations: {
    duration: number; // ms
    easing: string;
    intensity: 'light' | 'moderate' | 'heavy';
  };
  components: {
    buttonSize: 'small' | 'medium' | 'large';
    cardStyle: 'flat' | 'elevated' | 'outlined';
    inputStyle: 'filled' | 'outlined' | 'underlined';
  };
}

/**
 * Temas por Nível de Evolução
 */
export const EVOLUTION_THEMES: Record<EvolutionLevel, EvolutiveTheme> = {
  1: {
    level: 1,
    name: 'Iniciante - Aprendendo com você',
    description: 'Interface simples e acolhedora, cores quentes',
    colors: {
      primary: '#FF6B6B', // Vermelho quente
      secondary: '#4ECDC4', // Turquesa
      accent: '#FFE66D', // Amarelo
      background: '#FFF9F5',
      surface: '#FFFFFF',
      text: '#2C3E50',
      success: '#51CF66',
      warning: '#FFA94D',
      error: '#FF6B6B',
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      fontSize: {
        h1: 28,
        h2: 24,
        h3: 20,
        body: 16,
        small: 14,
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        bold: 700,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
    },
    shadows: {
      sm: '0 2px 4px rgba(0,0,0,0.1)',
      md: '0 4px 8px rgba(0,0,0,0.15)',
      lg: '0 8px 16px rgba(0,0,0,0.2)',
      xl: '0 12px 24px rgba(0,0,0,0.25)',
    },
    animations: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      intensity: 'heavy',
    },
    components: {
      buttonSize: 'large',
      cardStyle: 'flat',
      inputStyle: 'filled',
    },
  },
  2: {
    level: 2,
    name: 'Básico - Entendendo padrões',
    description: 'Cores mais vibrantes, mais opções disponíveis',
    colors: {
      primary: '#6C5CE7', // Roxo
      secondary: '#00B894', // Verde
      accent: '#FDCB6E', // Amarelo ouro
      background: '#F8F9FA',
      surface: '#FFFFFF',
      text: '#2D3436',
      success: '#00B894',
      warning: '#FDCB6E',
      error: '#D63031',
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      fontSize: {
        h1: 32,
        h2: 28,
        h3: 24,
        body: 16,
        small: 14,
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },
    shadows: {
      sm: '0 2px 8px rgba(0,0,0,0.1)',
      md: '0 4px 12px rgba(0,0,0,0.15)',
      lg: '0 8px 20px rgba(0,0,0,0.2)',
      xl: '0 12px 28px rgba(0,0,0,0.25)',
    },
    animations: {
      duration: 250,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      intensity: 'moderate',
    },
    components: {
      buttonSize: 'medium',
      cardStyle: 'elevated',
      inputStyle: 'outlined',
    },
  },
  3: {
    level: 3,
    name: 'Intermediário - Fazendo recomendações',
    description: 'Cores sofisticadas, mais recursos disponíveis',
    colors: {
      primary: '#5F27CD', // Roxo profundo
      secondary: '#00D2D3', // Ciano
      accent: '#FF9FF3', // Rosa
      background: '#F5F7FA',
      surface: '#FFFFFF',
      text: '#2C3E50',
      success: '#1DD1A1',
      warning: '#FECA57',
      error: '#EE5A6F',
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: {
        h1: 36,
        h2: 32,
        h3: 28,
        body: 16,
        small: 14,
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },
    shadows: {
      sm: '0 2px 12px rgba(95, 39, 205, 0.1)',
      md: '0 4px 16px rgba(95, 39, 205, 0.15)',
      lg: '0 8px 24px rgba(95, 39, 205, 0.2)',
      xl: '0 12px 32px rgba(95, 39, 205, 0.25)',
    },
    animations: {
      duration: 200,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      intensity: 'moderate',
    },
    components: {
      buttonSize: 'medium',
      cardStyle: 'elevated',
      inputStyle: 'outlined',
    },
  },
  4: {
    level: 4,
    name: 'Avançado - Otimizando resultados',
    description: 'Cores premium, interface completa',
    colors: {
      primary: '#2E86AB', // Azul profundo
      secondary: '#A23B72', // Rosa profundo
      accent: '#F18F01', // Laranja
      background: '#F0F3F7',
      surface: '#FFFFFF',
      text: '#1A202C',
      success: '#06A77D',
      warning: '#D4A574',
      error: '#C1121F',
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: {
        h1: 40,
        h2: 36,
        h3: 32,
        body: 16,
        small: 14,
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },
    shadows: {
      sm: '0 2px 16px rgba(46, 134, 171, 0.1)',
      md: '0 4px 20px rgba(46, 134, 171, 0.15)',
      lg: '0 8px 28px rgba(46, 134, 171, 0.2)',
      xl: '0 12px 36px rgba(46, 134, 171, 0.25)',
    },
    animations: {
      duration: 150,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      intensity: 'light',
    },
    components: {
      buttonSize: 'medium',
      cardStyle: 'outlined',
      inputStyle: 'outlined',
    },
  },
  5: {
    level: 5,
    name: 'Especialista - Transformando educação',
    description: 'Cores personalizadas, interface avançada',
    colors: {
      primary: '#1A365D', // Azul muito profundo
      secondary: '#6B46C1', // Roxo profundo
      accent: '#ED8936', // Laranja queimado
      background: '#EDF2F7',
      surface: '#FFFFFF',
      text: '#1A202C',
      success: '#38A169',
      warning: '#C05621',
      error: '#C53030',
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: {
        h1: 44,
        h2: 40,
        h3: 36,
        body: 16,
        small: 14,
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },
    shadows: {
      sm: '0 2px 20px rgba(26, 54, 93, 0.1)',
      md: '0 4px 24px rgba(26, 54, 93, 0.15)',
      lg: '0 8px 32px rgba(26, 54, 93, 0.2)',
      xl: '0 12px 40px rgba(26, 54, 93, 0.25)',
    },
    animations: {
      duration: 100,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      intensity: 'light',
    },
    components: {
      buttonSize: 'medium',
      cardStyle: 'outlined',
      inputStyle: 'outlined',
    },
  },
  6: {
    level: 6,
    name: 'Mestre - Revolucionando aprendizado',
    description: 'Cores dinâmicas, interface revolucionária',
    colors: {
      primary: '#0F172A', // Preto azulado
      secondary: '#7C3AED', // Roxo vibrante
      accent: '#EC4899', // Rosa vibrante
      background: '#F1F5F9',
      surface: '#FFFFFF',
      text: '#0F172A',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: {
        h1: 48,
        h2: 44,
        h3: 40,
        body: 16,
        small: 14,
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },
    shadows: {
      sm: '0 2px 24px rgba(124, 58, 237, 0.1)',
      md: '0 4px 28px rgba(124, 58, 237, 0.15)',
      lg: '0 8px 36px rgba(124, 58, 237, 0.2)',
      xl: '0 12px 44px rgba(124, 58, 237, 0.25)',
    },
    animations: {
      duration: 100,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      intensity: 'light',
    },
    components: {
      buttonSize: 'medium',
      cardStyle: 'outlined',
      inputStyle: 'outlined',
    },
  },
};

/**
 * Função para obter tema baseado no score de inteligência
 */
export function getThemeByIntelligenceScore(score: number): EvolutiveTheme {
  let level: EvolutionLevel = 1;

  if (score >= 80) level = 6;
  else if (score >= 60) level = 5;
  else if (score >= 40) level = 4;
  else if (score >= 20) level = 3;
  else if (score >= 10) level = 2;
  else level = 1;

  return EVOLUTION_THEMES[level];
}

/**
 * Função para calcular transição suave entre temas
 */
export function interpolateTheme(
  currentScore: number,
  previousScore: number,
  theme: EvolutiveTheme
): EvolutiveTheme {
  // Em produção, isso interpolaria cores e outros valores
  return theme;
}

/**
 * Classe para gerenciar evolução visual
 */
export class AdaptiveUIEvolution {
  private currentScore: number = 0;
  private previousScore: number = 0;
  private currentTheme: EvolutiveTheme = EVOLUTION_THEMES[1];

  constructor(initialScore: number = 0) {
    this.currentScore = initialScore;
    this.updateTheme();
  }

  /**
   * Atualiza o score e o tema
   */
  updateScore(newScore: number): void {
    this.previousScore = this.currentScore;
    this.currentScore = Math.min(newScore, 100);
    this.updateTheme();
  }

  /**
   * Atualiza o tema baseado no score
   */
  private updateTheme(): void {
    this.currentTheme = getThemeByIntelligenceScore(this.currentScore);
  }

  /**
   * Retorna o tema atual
   */
  getTheme(): EvolutiveTheme {
    return this.currentTheme;
  }

  /**
   * Retorna o nível de evolução
   */
  getLevel(): EvolutionLevel {
    return this.currentTheme.level;
  }

  /**
   * Retorna o nome do nível
   */
  getLevelName(): string {
    return this.currentTheme.name;
  }

  /**
   * Retorna a descrição do nível
   */
  getLevelDescription(): string {
    return this.currentTheme.description;
  }

  /**
   * Retorna o progresso até o próximo nível (0-100)
   */
  getProgressToNextLevel(): number {
    const levelSize = 20;
    const levelStart = (this.currentTheme.level - 1) * levelSize;
    const progress = this.currentScore - levelStart;
    return Math.round((progress / levelSize) * 100);
  }

  /**
   * Retorna se houve mudança de nível
   */
  hasLevelChanged(): boolean {
    const currentLevel = getThemeByIntelligenceScore(this.currentScore).level;
    const previousLevel = getThemeByIntelligenceScore(this.previousScore).level;
    return currentLevel !== previousLevel;
  }

  /**
   * Retorna variáveis CSS para aplicar o tema
   */
  getCSSVariables(): Record<string, string> {
    const theme = this.currentTheme;
    return {
      '--color-primary': theme.colors.primary,
      '--color-secondary': theme.colors.secondary,
      '--color-accent': theme.colors.accent,
      '--color-background': theme.colors.background,
      '--color-surface': theme.colors.surface,
      '--color-text': theme.colors.text,
      '--color-success': theme.colors.success,
      '--color-warning': theme.colors.warning,
      '--color-error': theme.colors.error,
      '--font-family': theme.typography.fontFamily,
      '--font-size-h1': `${theme.typography.fontSize.h1}px`,
      '--font-size-h2': `${theme.typography.fontSize.h2}px`,
      '--font-size-h3': `${theme.typography.fontSize.h3}px`,
      '--font-size-body': `${theme.typography.fontSize.body}px`,
      '--font-size-small': `${theme.typography.fontSize.small}px`,
      '--spacing-xs': `${theme.spacing.xs}px`,
      '--spacing-sm': `${theme.spacing.sm}px`,
      '--spacing-md': `${theme.spacing.md}px`,
      '--spacing-lg': `${theme.spacing.lg}px`,
      '--spacing-xl': `${theme.spacing.xl}px`,
      '--border-radius-sm': `${theme.borderRadius.sm}px`,
      '--border-radius-md': `${theme.borderRadius.md}px`,
      '--border-radius-lg': `${theme.borderRadius.lg}px`,
      '--border-radius-xl': `${theme.borderRadius.xl}px`,
      '--shadow-sm': theme.shadows.sm,
      '--shadow-md': theme.shadows.md,
      '--shadow-lg': theme.shadows.lg,
      '--shadow-xl': theme.shadows.xl,
      '--animation-duration': `${theme.animations.duration}ms`,
      '--animation-easing': theme.animations.easing,
    };
  }
}
