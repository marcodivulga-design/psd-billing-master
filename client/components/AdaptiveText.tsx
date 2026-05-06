'use client';

import React from 'react';
import { useAdaptiveTheme } from '@/components/AdaptiveThemeProvider';

/**
 * AdaptiveText.tsx - Texto que muda linguagem por faixa etária
 * 
 * Infantil: Playful, simples, com emojis
 * Fund I: Friendly, moderado
 * Fund II: Modern, descontraído
 * Médio: Professional, formal
 * EJA: Respectful, acolhedor
 * Especial: Simple, claro
 */

interface AdaptiveTextProps {
  children: React.ReactNode;
  variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'label';
  tone?: 'playful' | 'friendly' | 'modern' | 'professional' | 'respectful';
}

const AdaptiveText: React.FC<AdaptiveTextProps> = ({
  children,
  variant = 'body',
  tone,
}) => {
  const { theme, ageGroup } = useAdaptiveTheme();

  // Usar tom do tema se não especificado
  const selectedTone = tone || theme.language.tone;

  // Adaptar texto baseado no tom
  const adaptText = (text: string): string => {
    if (typeof text !== 'string') return String(text);

    switch (selectedTone) {
      case 'playful':
        // Adicionar emojis e entusiasmo
        if (text.includes('parabéns') || text.includes('sucesso'))
          return `🎉 ${text}! 🌟`;
        if (text.includes('tente novamente'))
          return `💪 ${text}! Você consegue! 🚀`;
        break;

      case 'friendly':
        // Tom amigável
        if (text.includes('bem-vindo'))
          return `Bem-vindo! Vamos aprender juntos? 😊`;
        if (text.includes('parabéns'))
          return `Parabéns! Você está indo bem! 👏`;
        break;

      case 'modern':
        // Tom moderno e descontraído
        if (text.includes('novo'))
          return `Novo desafio desbloqueado! 🔓`;
        if (text.includes('ranking'))
          return `Você subiu no ranking! 📈`;
        break;

      case 'professional':
        // Tom profissional
        if (text.includes('resultado'))
          return `Resultado: ${text}`;
        if (text.includes('análise'))
          return `Análise de Desempenho: ${text}`;
        break;

      case 'respectful':
        // Tom respeitoso
        if (text.includes('parabéns'))
          return `Parabéns por seu esforço em ${text}`;
        if (text.includes('progresso'))
          return `Você está fazendo progresso em ${text}`;
        break;
    }

    return text;
  };

  // Determinar tamanho de fonte por variante e faixa etária
  const getFontSize = (): string => {
    const baseSize = theme.typography.fontSize;

    switch (variant) {
      case 'heading':
        return ageGroup === 'infantil'
          ? baseSize['3xl']
          : ageGroup === 'fund-i'
          ? baseSize['2xl']
          : ageGroup === 'especial'
          ? baseSize['2xl']
          : baseSize.xl;

      case 'subheading':
        return ageGroup === 'infantil'
          ? baseSize.xl
          : ageGroup === 'fund-i'
          ? baseSize.lg
          : baseSize.lg;

      case 'body':
        return baseSize.base;

      case 'caption':
        return ageGroup === 'infantil' ? baseSize.sm : baseSize.xs;

      case 'label':
        return ageGroup === 'infantil' ? baseSize.base : baseSize.sm;

      default:
        return baseSize.base;
    }
  };

  // Determinar peso de fonte
  const getFontWeight = (): number => {
    switch (variant) {
      case 'heading':
      case 'subheading':
        return theme.typography.fontWeight.bold;
      case 'label':
        return theme.typography.fontWeight.semibold;
      default:
        return theme.typography.fontWeight.normal;
    }
  };

  // Determinar cor
  const getColor = (): string => {
    switch (variant) {
      case 'heading':
      case 'subheading':
        return theme.colors.primary;
      case 'caption':
        return theme.colors.text;
      case 'label':
        return theme.colors.primary;
      default:
        return theme.colors.text;
    }
  };

  const adaptedText = adaptText(String(children));

  return (
    <span
      style={{
        fontSize: getFontSize(),
        fontWeight: getFontWeight(),
        color: getColor(),
        display: variant === 'heading' || variant === 'subheading' ? 'block' : 'inline',
        margin: variant === 'heading' ? '16px 0 8px 0' : variant === 'subheading' ? '12px 0 6px 0' : 0,
      }}
    >
      {adaptedText}
    </span>
  );
};

export default AdaptiveText;
