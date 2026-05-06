'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdaptiveTheme } from '@/components/AdaptiveThemeProvider';

/**
 * JourneyEvolution.tsx - Modo Evolução da Jornada
 * 
 * Mostra:
 * - Onde começou
 * - Quanto evoluiu
 * - Medalhas antigas
 * - Fases desbloqueadas
 * - Habilidades adquiridas
 */

interface MilestoneData {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  level: number;
  achievement?: string;
}

interface EvolutionStats {
  startDate: string;
  currentLevel: number;
  totalXP: number;
  daysActive: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
  gamesPlayed: number;
  achievements: number;
  friendsMade: number;
}

const JourneyEvolution: React.FC = () => {
  const { theme, ageGroup } = useAdaptiveTheme();
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneData | null>(null);

  // Dados simulados
  const stats: EvolutionStats = {
    startDate: '2024-01-15',
    currentLevel: 18,
    totalXP: 5200,
    daysActive: 120,
    lessonsCompleted: 45,
    quizzesCompleted: 38,
    gamesPlayed: 156,
    achievements: 12,
    friendsMade: 8,
  };

  const milestones: MilestoneData[] = [
    {
      id: '1',
      date: '2024-01-15',
      title: 'Iniciante',
      description: 'Você começou sua jornada!',
      icon: '🌱',
      xp: 0,
      level: 1,
    },
    {
      id: '2',
      date: '2024-02-01',
      title: 'Nível 5',
      description: 'Parabéns! Você atingiu o nível 5!',
      icon: '⭐',
      xp: 500,
      level: 5,
    },
    {
      id: '3',
      date: '2024-02-20',
      title: 'Primeira Conquista',
      description: 'Você desbloqueou: Matemático Iniciante',
      icon: '🏆',
      xp: 1000,
      level: 8,
      achievement: 'Matemático Iniciante',
    },
    {
      id: '4',
      date: '2024-03-10',
      title: 'Nível 10',
      description: 'Você atingiu o nível 10!',
      icon: '🎉',
      xp: 1500,
      level: 10,
    },
    {
      id: '5',
      date: '2024-04-05',
      title: 'Região Desbloqueada',
      description: 'Você desbloqueou: Reino Lógico',
      icon: '🗺️',
      xp: 2500,
      level: 12,
    },
    {
      id: '6',
      date: '2024-05-01',
      title: 'Nível 15',
      description: 'Você atingiu o nível 15!',
      icon: '👑',
      xp: 3500,
      level: 15,
    },
    {
      id: '7',
      date: '2024-05-20',
      title: 'Mestre em Português',
      description: 'Você desbloqueou: Mestre em Português',
      icon: '📚',
      xp: 4500,
      level: 17,
      achievement: 'Mestre em Português',
    },
    {
      id: '8',
      date: '2024-06-01',
      title: 'Nível 18 (Atual)',
      description: 'Você está aqui! Continue evoluindo!',
      icon: '🚀',
      xp: 5200,
      level: 18,
    },
  ];

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
      className="min-h-screen p-4 md:p-8"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <h1
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{ color: theme.colors.primary }}
          >
            🌟 Sua Jornada de Evolução
          </h1>
          <p style={{ color: theme.colors.text }}>
            Veja como você evoluiu desde o início
          </p>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12"
      >
        {[
          { label: 'Dias Ativos', value: stats.daysActive, icon: '📅' },
          { label: 'Nível Atual', value: stats.currentLevel, icon: '⭐' },
          { label: 'Total XP', value: stats.totalXP, icon: '✨' },
          { label: 'Aulas', value: stats.lessonsCompleted, icon: '📚' },
          { label: 'Conquistas', value: stats.achievements, icon: '🏆' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <div
              className="rounded-lg p-4 text-center"
              style={{
                backgroundColor: theme.colors.accent,
                opacity: 0.1,
              }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold" style={{ color: theme.colors.primary }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: theme.colors.text }}>
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-8" style={{ color: theme.colors.primary }}>
          📖 Sua Trajetória
        </h2>

        <div className="relative">
          {/* Timeline Line */}
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 md:w-0.5"
            style={{ backgroundColor: theme.colors.accent, opacity: 0.3 }}
          />

          {/* Milestones */}
          <div className="space-y-8">
            {milestones.map((milestone, idx) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedMilestone(milestone)}
                className="relative cursor-pointer"
              >
                {/* Timeline Dot */}
                <div
                  className="absolute left-0 md:left-1/2 top-2 w-8 h-8 rounded-full flex items-center justify-center transform md:-translate-x-1/2 z-10"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <span className="text-lg">{milestone.icon}</span>
                </div>

                {/* Content */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="ml-16 md:ml-0 md:w-1/2 md:pr-8"
                  style={{
                    marginLeft: idx % 2 === 0 ? 'auto' : 'auto',
                  }}
                >
                  <div
                    className="rounded-lg p-4 border-2"
                    style={{
                      backgroundColor:
                        milestone.id === '8'
                          ? `${theme.colors.accent}20`
                          : `${theme.colors.secondary}10`,
                      borderColor: theme.colors.primary,
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3
                          className="font-bold text-lg"
                          style={{ color: theme.colors.primary }}
                        >
                          {milestone.title}
                        </h3>
                        <p className="text-sm" style={{ color: theme.colors.text }}>
                          {new Date(milestone.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div
                        className="text-sm font-bold px-2 py-1 rounded"
                        style={{
                          backgroundColor: theme.colors.accent,
                          color: theme.colors.primary,
                        }}
                      >
                        Nv {milestone.level}
                      </div>
                    </div>

                    <p style={{ color: theme.colors.text }}>{milestone.description}</p>

                    {milestone.achievement && (
                      <div
                        className="mt-2 text-sm font-semibold"
                        style={{ color: theme.colors.success }}
                      >
                        🏆 {milestone.achievement}
                      </div>
                    )}

                    <div className="mt-2 text-xs" style={{ color: theme.colors.text }}>
                      +{milestone.xp} XP
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: theme.colors.primary }}>
          🏆 Suas Conquistas
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { icon: '🎓', name: 'Matemático Iniciante', date: '2024-02-20' },
            { icon: '📚', name: 'Mestre em Português', date: '2024-05-20' },
            { icon: '🔥', name: 'Streak de 30 dias', date: '2024-04-15' },
            { icon: '⚡', name: 'Velocidade Máxima', date: '2024-03-30' },
            { icon: '🎯', name: 'Acurácia 100%', date: '2024-05-10' },
            { icon: '🌟', name: 'Explorador', date: '2024-04-05' },
            { icon: '👥', name: 'Socializador', date: '2024-03-15' },
            { icon: '🚀', name: 'Ascensão Rápida', date: '2024-05-25' },
          ].map((achievement, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg p-4 text-center cursor-pointer"
              style={{
                backgroundColor: `${theme.colors.accent}20`,
                border: `2px solid ${theme.colors.accent}`,
              }}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <div className="font-bold text-sm" style={{ color: theme.colors.primary }}>
                {achievement.name}
              </div>
              <div className="text-xs mt-1" style={{ color: theme.colors.text }}>
                {new Date(achievement.date).toLocaleDateString('pt-BR')}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal de Detalhe */}
      <AnimatePresence>
        {selectedMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMilestone(null)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-lg p-6 max-w-md w-full"
              style={{ backgroundColor: theme.colors.background }}
            >
              <div className="text-5xl mb-4 text-center">{selectedMilestone.icon}</div>
              <h3
                className="text-2xl font-bold mb-2 text-center"
                style={{ color: theme.colors.primary }}
              >
                {selectedMilestone.title}
              </h3>
              <p className="text-center mb-4" style={{ color: theme.colors.text }}>
                {selectedMilestone.description}
              </p>
              <div
                className="grid grid-cols-2 gap-4 mb-6"
                style={{ backgroundColor: `${theme.colors.accent}10`, padding: '16px', borderRadius: '8px' }}
              >
                <div>
                  <p className="text-xs" style={{ color: theme.colors.text }}>
                    Data
                  </p>
                  <p className="font-bold" style={{ color: theme.colors.primary }}>
                    {new Date(selectedMilestone.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: theme.colors.text }}>
                    Nível
                  </p>
                  <p className="font-bold" style={{ color: theme.colors.primary }}>
                    {selectedMilestone.level}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMilestone(null)}
                className="w-full py-2 rounded-lg font-bold text-white"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Fechar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JourneyEvolution;
