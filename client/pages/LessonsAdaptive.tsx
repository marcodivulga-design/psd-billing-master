'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdaptiveTheme } from '@/components/AdaptiveThemeProvider';
import AdaptiveButton from '@/components/AdaptiveButton';
import AdaptiveCard from '@/components/AdaptiveCard';
import AdaptiveText from '@/components/AdaptiveText';

/**
 * LessonsAdaptive.tsx - Página de Aulas com Componentes Adaptativos
 * 
 * Mesma funcionalidade, visual diferente por faixa etária
 */

interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
  duration: number;
  xp: number;
  completed: boolean;
  progress: number;
}

const LessonsAdaptive: React.FC = () => {
  const { theme, ageGroup } = useAdaptiveTheme();
  const [selectedTab, setSelectedTab] = useState<'todas' | 'pendentes' | 'progresso' | 'concluidas'>('todas');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const lessons: Lesson[] = [
    {
      id: '1',
      title: 'Frações Básicas',
      description: ageGroup === 'infantil' ? '🍕 Dividir pizza' : 'Aprenda o conceito de frações',
      icon: '🍕',
      difficulty: 'fácil',
      duration: 15,
      xp: 100,
      completed: true,
      progress: 100,
    },
    {
      id: '2',
      title: 'Adição e Subtração',
      description: ageGroup === 'infantil' ? '🎈 Contar balões' : 'Operações básicas com números',
      icon: '🎈',
      difficulty: 'fácil',
      duration: 20,
      xp: 150,
      completed: true,
      progress: 100,
    },
    {
      id: '3',
      title: 'Multiplicação',
      description: ageGroup === 'infantil' ? '🎁 Grupos de presentes' : 'Multiplicação e tabuada',
      icon: '🎁',
      difficulty: 'médio',
      duration: 25,
      xp: 200,
      completed: false,
      progress: 60,
    },
    {
      id: '4',
      title: 'Divisão',
      description: ageGroup === 'infantil' ? '🍰 Dividir bolos' : 'Conceito de divisão',
      icon: '🍰',
      difficulty: 'médio',
      duration: 25,
      xp: 200,
      completed: false,
      progress: 30,
    },
    {
      id: '5',
      title: 'Geometria',
      description: ageGroup === 'infantil' ? '🔷 Formas e cores' : 'Formas geométricas',
      icon: '🔷',
      difficulty: 'médio',
      duration: 30,
      xp: 250,
      completed: false,
      progress: 0,
    },
    {
      id: '6',
      title: 'Álgebra Básica',
      description: ageGroup === 'infantil' ? '❓ Encontrar números' : 'Equações simples',
      icon: '❓',
      difficulty: 'difícil',
      duration: 40,
      xp: 300,
      completed: false,
      progress: 0,
    },
  ];

  const filteredLessons = lessons.filter((lesson) => {
    switch (selectedTab) {
      case 'pendentes':
        return !lesson.completed && lesson.progress === 0;
      case 'progresso':
        return !lesson.completed && lesson.progress > 0;
      case 'concluidas':
        return lesson.completed;
      default:
        return true;
    }
  });

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
        className="mb-8"
      >
        <motion.div variants={itemVariants}>
          <AdaptiveText variant="heading">📚 Aulas</AdaptiveText>
          <AdaptiveText variant="subheading">
            {ageGroup === 'infantil'
              ? 'Vamos aprender brincando!'
              : ageGroup === 'fund-i'
              ? 'Explore novos tópicos'
              : ageGroup === 'fund-ii'
              ? 'Desafios educacionais'
              : 'Conteúdo de qualidade'}
          </AdaptiveText>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        {['todas', 'pendentes', 'progresso', 'concluidas'].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTab(tab as any)}
            style={{
              padding: ageGroup === 'infantil' ? '16px 24px' : '12px 16px',
              borderRadius: '8px',
              border: `2px solid ${selectedTab === tab ? theme.colors.primary : theme.colors.accent}`,
              backgroundColor: selectedTab === tab ? `${theme.colors.primary}30` : 'transparent',
              color: theme.colors.text,
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: ageGroup === 'infantil' ? '16px' : '14px',
            }}
          >
            {tab === 'todas' && '📖 Todas'}
            {tab === 'pendentes' && '⏳ Pendentes'}
            {tab === 'progresso' && '⚡ Em Progresso'}
            {tab === 'concluidas' && '✅ Concluídas'}
          </motion.button>
        ))}
      </motion.div>

      {/* Lessons Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns:
            ageGroup === 'infantil'
              ? 'repeat(auto-fill, minmax(280px, 1fr))'
              : ageGroup === 'fund-i'
              ? 'repeat(auto-fill, minmax(250px, 1fr))'
              : 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: theme.spacing.gap,
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredLessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              variants={itemVariants}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
            >
              <AdaptiveCard
                icon={lesson.icon}
                title={lesson.title}
                subtitle={lesson.description}
                interactive
                onClick={() => setSelectedLesson(lesson)}
              >
                {/* Difficulty Badge */}
                <div
                  style={{
                    display: 'inline-block',
                    padding: ageGroup === 'infantil' ? '8px 12px' : '6px 10px',
                    borderRadius: '6px',
                    backgroundColor:
                      lesson.difficulty === 'fácil'
                        ? theme.colors.success
                        : lesson.difficulty === 'médio'
                        ? theme.colors.warning
                        : theme.colors.error,
                    color: '#FFFFFF',
                    fontSize: ageGroup === 'infantil' ? '12px' : '11px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                  }}
                >
                  {lesson.difficulty === 'fácil' && '⭐ Fácil'}
                  {lesson.difficulty === 'médio' && '⭐⭐ Médio'}
                  {lesson.difficulty === 'difícil' && '⭐⭐⭐ Difícil'}
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '100%',
                      height: ageGroup === 'infantil' ? '12px' : '8px',
                      backgroundColor: `${theme.colors.accent}40`,
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${lesson.progress}%` }}
                      transition={{ duration: 0.5 }}
                      style={{
                        height: '100%',
                        background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: ageGroup === 'infantil' ? '12px' : '11px',
                      color: theme.colors.text,
                      marginTop: '4px',
                    }}
                  >
                    {lesson.progress}% completo
                  </div>
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    fontSize: ageGroup === 'infantil' ? '12px' : '11px',
                  }}
                >
                  <div>
                    <span style={{ color: theme.colors.text, opacity: 0.7 }}>⏱️</span>{' '}
                    {lesson.duration}min
                  </div>
                  <div>
                    <span style={{ color: theme.colors.accent }}>✨</span> +{lesson.xp} XP
                  </div>
                </div>

                {/* Action Button */}
                <div style={{ marginTop: '12px' }}>
                  <AdaptiveButton
                    fullWidth
                    icon={lesson.completed ? '✅' : '▶️'}
                  >
                    {lesson.completed ? 'Revisar' : 'Iniciar'}
                  </AdaptiveButton>
                </div>
              </AdaptiveCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredLessons.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: '48px 24px',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <AdaptiveText variant="subheading">
            Nenhuma aula nesta categoria
          </AdaptiveText>
        </motion.div>
      )}

      {/* Lesson Detail Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLesson(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 50,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: theme.colors.background,
                borderRadius: '16px',
                padding: ageGroup === 'infantil' ? '32px' : '24px',
                maxWidth: '500px',
                width: '100%',
                border: `3px solid ${theme.colors.primary}`,
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: '16px', textAlign: 'center' }}>
                {selectedLesson.icon}
              </div>

              <AdaptiveText variant="heading">{selectedLesson.title}</AdaptiveText>
              <AdaptiveText variant="body">{selectedLesson.description}</AdaptiveText>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  margin: '24px 0',
                }}
              >
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: `${theme.colors.accent}20`,
                    borderRadius: '8px',
                  }}
                >
                  <AdaptiveText variant="label">Duração</AdaptiveText>
                  <p style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 'bold' }}>
                    {selectedLesson.duration} min
                  </p>
                </div>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: `${theme.colors.accent}20`,
                    borderRadius: '8px',
                  }}
                >
                  <AdaptiveText variant="label">Recompensa</AdaptiveText>
                  <p style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: theme.colors.accent }}>
                    +{selectedLesson.xp} XP
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <AdaptiveButton
                  onClick={() => setSelectedLesson(null)}
                  variant="secondary"
                  fullWidth
                >
                  Voltar
                </AdaptiveButton>
                <AdaptiveButton
                  onClick={() => setSelectedLesson(null)}
                  fullWidth
                  icon="▶️"
                >
                  Começar
                </AdaptiveButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonsAdaptive;
