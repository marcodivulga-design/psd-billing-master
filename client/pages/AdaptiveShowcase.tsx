'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdaptiveTheme } from '@/components/AdaptiveThemeProvider';
import AdaptiveButton from '@/components/AdaptiveButton';
import AdaptiveCard from '@/components/AdaptiveCard';
import AdaptiveText from '@/components/AdaptiveText';
import { AgeGroup, getAllAgeGroups } from '@/lib/age-group-themes';

/**
 * AdaptiveShowcase.tsx - Demonstração de Componentes Adaptativos
 * 
 * Mostra como os componentes mudam visual/linguagem por faixa etária
 */

const AdaptiveShowcase: React.FC = () => {
  const { ageGroup, setAgeGroup, theme } = useAdaptiveTheme();
  const allAgeGroups = getAllAgeGroups();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        minHeight: '100vh',
        padding: theme.spacing.padding,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-12"
      >
        <motion.div variants={itemVariants}>
          <AdaptiveText variant="heading">
            🎨 Componentes Adaptativos
          </AdaptiveText>
          <AdaptiveText variant="subheading">
            Veja como os componentes mudam por faixa etária
          </AdaptiveText>
        </motion.div>
      </motion.div>

      {/* Age Group Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
        }}
      >
        {allAgeGroups.map((group) => (
          <motion.button
            key={group.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAgeGroup(group.id as AgeGroup)}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: `2px solid ${ageGroup === group.id ? theme.colors.primary : theme.colors.accent}`,
              backgroundColor:
                ageGroup === group.id
                  ? `${theme.colors.primary}30`
                  : 'transparent',
              color: theme.colors.text,
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {group.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Buttons Showcase */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-12"
      >
        <motion.div variants={itemVariants}>
          <AdaptiveText variant="subheading">Botões</AdaptiveText>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginTop: '16px',
          }}
        >
          {['primary', 'secondary', 'success', 'warning', 'error'].map((variant) => (
            <motion.div key={variant} variants={itemVariants}>
              <AdaptiveButton
                variant={variant as any}
                icon={
                  variant === 'primary'
                    ? '🎯'
                    : variant === 'secondary'
                    ? '📚'
                    : variant === 'success'
                    ? '✅'
                    : variant === 'warning'
                    ? '⚠️'
                    : '❌'
                }
                fullWidth
              >
                {variant === 'primary' && 'Começar'}
                {variant === 'secondary' && 'Aprender'}
                {variant === 'success' && 'Sucesso'}
                {variant === 'warning' && 'Atenção'}
                {variant === 'error' && 'Erro'}
              </AdaptiveButton>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Cards Showcase */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-12"
      >
        <motion.div variants={itemVariants}>
          <AdaptiveText variant="subheading">Cards</AdaptiveText>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginTop: '16px',
          }}
        >
          {[
            {
              icon: '📚',
              title: 'Aulas',
              subtitle: 'Aprenda novos conceitos',
              content: 'Explore aulas interativas com exercícios práticos',
            },
            {
              icon: '🎮',
              title: 'Mini Games',
              subtitle: 'Aprenda jogando',
              content: 'Desafios educacionais divertidos e recompensadores',
            },
            {
              icon: '🏆',
              title: 'Conquistas',
              subtitle: 'Desbloqueie prêmios',
              content: 'Ganhe medalhas e suba de nível com seu progresso',
            },
          ].map((card, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <AdaptiveCard
                icon={card.icon}
                title={card.title}
                subtitle={card.subtitle}
                interactive
              >
                <AdaptiveText>{card.content}</AdaptiveText>
              </AdaptiveCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Text Showcase */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-12"
      >
        <motion.div variants={itemVariants}>
          <AdaptiveText variant="subheading">Linguagem Adaptativa</AdaptiveText>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginTop: '16px',
          }}
        >
          {[
            'parabéns por completar a aula',
            'tente novamente com mais atenção',
            'novo desafio desbloqueado',
            'ranking atualizado',
            'resultado da avaliação',
            'progresso em matemática',
          ].map((text, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: `${theme.colors.accent}20`,
                border: `2px solid ${theme.colors.accent}`,
              }}
            >
              <AdaptiveText>{text}</AdaptiveText>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Theme Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          padding: '24px',
          borderRadius: '12px',
          backgroundColor: `${theme.colors.primary}15`,
          border: `2px solid ${theme.colors.primary}`,
        }}
      >
        <AdaptiveText variant="subheading">Informações do Tema</AdaptiveText>
        <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          <div>
            <AdaptiveText variant="label">Faixa Etária</AdaptiveText>
            <p style={{ margin: 0, marginTop: '4px' }}>{theme.ageRange}</p>
          </div>
          <div>
            <AdaptiveText variant="label">Tom</AdaptiveText>
            <p style={{ margin: 0, marginTop: '4px' }}>{theme.language.tone}</p>
          </div>
          <div>
            <AdaptiveText variant="label">Complexidade</AdaptiveText>
            <p style={{ margin: 0, marginTop: '4px' }}>{theme.language.complexity}</p>
          </div>
          <div>
            <AdaptiveText variant="label">Animações</AdaptiveText>
            <p style={{ margin: 0, marginTop: '4px' }}>{theme.features.animations}</p>
          </div>
          <div>
            <AdaptiveText variant="label">Gamificação</AdaptiveText>
            <p style={{ margin: 0, marginTop: '4px' }}>{theme.features.gamification}</p>
          </div>
          <div>
            <AdaptiveText variant="label">Áudio</AdaptiveText>
            <p style={{ margin: 0, marginTop: '4px' }}>{theme.features.audio ? 'Sim' : 'Não'}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdaptiveShowcase;
