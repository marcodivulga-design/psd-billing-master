'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAdaptiveTheme } from '@/components/AdaptiveThemeProvider';

/**
 * AdaptiveButton.tsx - Botão que muda visual por faixa etária
 * 
 * Infantil: Gigante, cores fortes, animação pesada
 * Fund I: Grande, cores vibrantes, animação moderada
 * Fund II: Médio, dark mode, animação mínima
 * Médio: Pequeno, clean, sem animação
 * EJA: Médio, profissional, sem animação
 * Especial: Grande, alto contraste, animação moderada
 */

interface AdaptiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: string;
}

const AdaptiveButton: React.FC<AdaptiveButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  icon,
}) => {
  const { theme, ageGroup } = useAdaptiveTheme();

  // Determinar cores por variante
  const getColor = () => {
    switch (variant) {
      case 'secondary':
        return theme.colors.secondary;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  // Determinar tamanho por faixa etária
  const getSizeStyles = () => {
    switch (ageGroup) {
      case 'infantil':
        return {
          padding: '24px 32px',
          fontSize: '24px',
          borderRadius: '24px',
          gap: '12px',
        };
      case 'fund-i':
        return {
          padding: '18px 28px',
          fontSize: '18px',
          borderRadius: '16px',
          gap: '10px',
        };
      case 'fund-ii':
        return {
          padding: '12px 20px',
          fontSize: '16px',
          borderRadius: '12px',
          gap: '8px',
        };
      case 'medio':
        return {
          padding: '10px 16px',
          fontSize: '14px',
          borderRadius: '8px',
          gap: '6px',
        };
      case 'eja':
        return {
          padding: '12px 20px',
          fontSize: '15px',
          borderRadius: '8px',
          gap: '8px',
        };
      case 'especial':
        return {
          padding: '20px 28px',
          fontSize: '20px',
          borderRadius: '16px',
          gap: '10px',
        };
    }
  };

  // Determinar animação por faixa etária
  const getAnimationConfig = () => {
    switch (ageGroup) {
      case 'infantil':
        return {
          hoverScale: 1.2,
          tapScale: 0.85,
          duration: 0.6,
        };
      case 'fund-i':
        return {
          hoverScale: 1.12,
          tapScale: 0.9,
          duration: 0.4,
        };
      case 'fund-ii':
        return {
          hoverScale: 1.08,
          tapScale: 0.95,
          duration: 0.3,
        };
      case 'medio':
        return {
          hoverScale: 1.02,
          tapScale: 0.98,
          duration: 0.2,
        };
      case 'eja':
        return {
          hoverScale: 1.03,
          tapScale: 0.98,
          duration: 0.3,
        };
      case 'especial':
        return {
          hoverScale: 1.1,
          tapScale: 0.92,
          duration: 0.4,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const animConfig = getAnimationConfig();
  const color = getColor();

  return (
    <motion.button
      whileHover={{ scale: animConfig.hoverScale }}
      whileTap={{ scale: animConfig.tapScale }}
      transition={{ duration: animConfig.duration }}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: sizeStyles?.padding,
        fontSize: sizeStyles?.fontSize,
        borderRadius: sizeStyles?.borderRadius,
        backgroundColor: color,
        color: theme.colors.background,
        border: 'none',
        fontWeight: 'bold',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sizeStyles?.gap,
        width: fullWidth ? '100%' : 'auto',
        transition: 'opacity 0.2s ease',
      }}
    >
      {icon && <span style={{ fontSize: `${parseInt(sizeStyles?.fontSize || '14') * 1.2}px` }}>{icon}</span>}
      {children}
    </motion.button>
  );
};

export default AdaptiveButton;
