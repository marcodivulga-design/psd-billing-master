'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AgeGroup, getThemeByAgeGroup, AgeGroupTheme } from '@/lib/age-group-themes';

interface AdaptiveThemeContextType {
  ageGroup: AgeGroup;
  theme: AgeGroupTheme;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  getLanguageExample: () => string;
}

const AdaptiveThemeContext = createContext<AdaptiveThemeContextType | undefined>(undefined);

export const useAdaptiveTheme = () => {
  const context = useContext(AdaptiveThemeContext);
  if (!context) {
    throw new Error('useAdaptiveTheme deve ser usado dentro de AdaptiveThemeProvider');
  }
  return context;
};

interface AdaptiveThemeProviderProps {
  children: React.ReactNode;
  defaultAgeGroup?: AgeGroup;
}

export const AdaptiveThemeProvider: React.FC<AdaptiveThemeProviderProps> = ({
  children,
  defaultAgeGroup = 'fund-i',
}) => {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(defaultAgeGroup);
  const theme = getThemeByAgeGroup(ageGroup);

  const getLanguageExample = () => {
    const examples = theme.language.examples;
    return examples[Math.floor(Math.random() * examples.length)];
  };

  // Aplicar variáveis CSS do tema
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-success', theme.colors.success);
    root.style.setProperty('--color-warning', theme.colors.warning);
    root.style.setProperty('--color-error', theme.colors.error);

    root.style.setProperty('--font-size-base', theme.typography.fontSize.base);
    root.style.setProperty('--font-size-lg', theme.typography.fontSize.lg);
    root.style.setProperty('--font-size-xl', theme.typography.fontSize.xl);

    root.style.setProperty('--spacing-padding', theme.spacing.padding);
    root.style.setProperty('--spacing-gap', theme.spacing.gap);

    root.style.setProperty('--animation-duration', `${theme.interactions.animationDuration}ms`);
  }, [theme]);

  return (
    <AdaptiveThemeContext.Provider
      value={{
        ageGroup,
        theme,
        setAgeGroup,
        getLanguageExample,
      }}
    >
      <div
        style={{
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          transition: 'all 0.3s ease',
        }}
      >
        {children}
      </div>
    </AdaptiveThemeContext.Provider>
  );
};

export default AdaptiveThemeProvider;
