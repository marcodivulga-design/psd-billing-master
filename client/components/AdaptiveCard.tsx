'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAdaptiveTheme } from '@/components/AdaptiveThemeProvider';

/**
 * AdaptiveCard.tsx - Card que muda visual por faixa etária
 * 
 * Infantil: Colorido, borda grossa, animação pesada
 * Fund I: Vibrante, borda média, animação moderada
 * Fund II: Dark, borda fina, animação mínima
 * Médio: Clean, borda sutil, sem animação
 * EJA: Profissional, borda discreta, sem animação
 * Especial: Alto contraste, borda grossa, animação moderada
 */

interface AdaptiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  interactive?: boolean;
  icon?: string;
  title?: string;
  subtitle?: string;
}

const AdaptiveCard: React.FC<AdaptiveCardProps> = ({
  children,
  onClick,
  interactive = false,
  icon,
  title,
  subtitle,
}) => {
  const { theme, ageGroup } = useAdaptiveTheme();

  // Determinar estilos por faixa etária
  const getCardStyles = () => {
    switch (ageGroup) {
      case 'infantil':
        return {
          padding: '28px',
          borderWidth: '6px',
          borderRadius: '24px',
          gap: '16px',
          hoverScale: 1.08,
          tapScale: 0.95,
          duration: 0.5,
        };
      case 'fund-i':
        return {
          padding: '20px',
          borderWidth: '4px',
          borderRadius: '16px',
          gap: '12px',
          hoverScale: 1.06,
          tapScale: 0.97,
          duration: 0.4,
        };
      case 'fund-ii':
        return {
          padding: '16px',
          borderWidth: '2px',
          borderRadius: '12px',
          gap: '10px',
          hoverScale: 1.04,
          tapScale: 0.98,
          duration: 0.3,
        };
      case 'medio':
        return {
          padding: '16px',
          borderWidth: '1px',
          borderRadius: '8px',
          gap: '8px',
          hoverScale: 1.02,
          tapScale: 0.99,
          duration: 0.2,
        };
      case 'eja':
        return {
          padding: '16px',
          borderWidth: '1px',
          borderRadius: '8px',
          gap: '8px',
          hoverScale: 1.02,
          tapScale: 0.99,
          duration: 0.2,
        };
      case 'especial':
        return {
          padding: '24px',
          borderWidth: '4px',
          borderRadius: '16px',
          gap: '12px',
          hoverScale: 1.06,
          tapScale: 0.97,
          duration: 0.4,
        };
    }
  };

  const styles = getCardStyles();

  return (
    <motion.div
      whileHover={interactive ? { scale: styles?.hoverScale } : {}}
      whileTap={interactive ? { scale: styles?.tapScale } : {}}
      transition={{ duration: styles?.duration }}
      onClick={onClick}
      style={{
        padding: styles?.padding,
        border: `${styles?.borderWidth} solid ${theme.colors.primary}`,
        borderRadius: styles?.borderRadius,
        backgroundColor:
          ageGroup === 'fund-ii' || ageGroup === 'medio'
            ? theme.colors.background
            : `${theme.colors.accent}15`,
        cursor: interactive ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: styles?.gap,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header */}
      {(icon || title) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon && (
            <span
              style={{
                fontSize:
                  ageGroup === 'infantil'
                    ? '48px'
                    : ageGroup === 'fund-i'
                    ? '36px'
                    : ageGroup === 'especial'
                    ? '40px'
                    : '28px',
              }}
            >
              {icon}
            </span>
          )}
          {title && (
            <h3
              style={{
                fontSize:
                  ageGroup === 'infantil'
                    ? '20px'
                    : ageGroup === 'fund-i'
                    ? '18px'
                    : ageGroup === 'especial'
                    ? '18px'
                    : '16px',
                fontWeight: 'bold',
                margin: 0,
                color: theme.colors.primary,
              }}
            >
              {title}
            </h3>
          )}
        </div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            fontSize:
              ageGroup === 'infantil'
                ? '14px'
                : ageGroup === 'fund-i'
                ? '13px'
                : '12px',
            color: theme.colors.text,
            margin: 0,
            opacity: 0.8,
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Content */}
      <div
        style={{
          fontSize:
            ageGroup === 'infantil'
              ? '16px'
              : ageGroup === 'fund-i'
              ? '14px'
              : '13px',
          color: theme.colors.text,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default AdaptiveCard;
