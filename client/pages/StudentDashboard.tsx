'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { trpc } from '../utils/trpc';

/**
 * StudentDashboard.tsx - Dashboard do Aluno com Gamificação
 * 
 * Características:
 * - Design premium com gradientes
 * - 5 tabs principais (Visão Geral, Aulas, Desafios, Conquistas, Leaderboard)
 * - Animações Framer Motion
 * - Componentes de gamificação
 * - Responsividade mobile-first
 */

interface StudentStats {
  totalXP: number;
  level: number;
  completedLessons: number;
  totalLessons: number;
  streak: number;
  rank: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  difficulty: 'fácil' | 'médio' | 'difícil';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<StudentStats>({
    totalXP: 2450,
    level: 5,
    completedLessons: 12,
    totalLessons: 50,
    streak: 7,
    rank: 23,
  });

  const [challenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Primeiro Passo',
      description: 'Complete sua primeira aula',
      reward: 100,
      completed: true,
      difficulty: 'fácil',
    },
    {
      id: '2',
      title: 'Semana de Ouro',
      description: 'Mantenha uma sequência de 7 dias',
      reward: 500,
      completed: false,
      difficulty: 'médio',
    },
    {
      id: '3',
      title: 'Mestre Absoluto',
      description: 'Complete todas as aulas de uma categoria',
      reward: 1000,
      completed: false,
      difficulty: 'difícil',
    },
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: '🚀 Decolagem',
      description: 'Ganhe seu primeiro XP',
      icon: '🚀',
      unlockedAt: new Date(),
    },
    {
      id: '2',
      title: '⭐ Brilhante',
      description: 'Atinja 1000 XP',
      icon: '⭐',
      unlockedAt: new Date(),
    },
    {
      id: '3',
      title: '👑 Lendário',
      description: 'Atinja o nível 10',
      icon: '👑',
    },
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-8">
      {/* Header com Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            🎮 Seu Progresso
          </h1>
          <p className="text-gray-400">Bem-vindo de volta, estudante!</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Nível', value: stats.level, icon: '📊', color: 'from-blue-500 to-cyan-500' },
            { label: 'XP Total', value: stats.totalXP, icon: '⭐', color: 'from-yellow-500 to-orange-500' },
            { label: 'Sequência', value: `${stats.streak} dias`, icon: '🔥', color: 'from-red-500 to-pink-500' },
            { label: 'Ranking', value: `#${stats.rank}`, icon: '👑', color: 'from-purple-500 to-pink-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover="hover"
              className="group cursor-pointer"
            >
              <div className={`bg-gradient-to-br ${stat.color} p-0.5 rounded-xl`}>
                <div className="bg-slate-900 rounded-[10px] p-4 text-center hover:bg-slate-800/50 transition-colors">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white">Progresso para Nível {stats.level + 1}</span>
            <span className="text-sm text-purple-400 font-bold">75%</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TabsList className="grid w-full grid-cols-5 gap-2 bg-slate-800/50 backdrop-blur-md p-2 rounded-xl border border-slate-700/50 mb-8 overflow-x-auto">
            {[
              { value: 'overview', label: '📊 Visão Geral' },
              { value: 'lessons', label: '📚 Aulas' },
              { value: 'challenges', label: '🎯 Desafios' },
              { value: 'achievements', label: '🏆 Conquistas' },
              { value: 'leaderboard', label: '👑 Ranking' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-400 hover:text-white whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </motion.div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Aulas Recentes */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-slate-700/50 backdrop-blur-md"
                >
                  <h3 className="text-lg font-bold text-white mb-4">📚 Aulas Recentes</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <span className="text-sm text-gray-300">Aula {i}</span>
                        <span className="text-xs text-green-400">✅ Concluída</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Desafios Ativos */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-slate-700/50 backdrop-blur-md"
                >
                  <h3 className="text-lg font-bold text-white mb-4">🎯 Desafios Ativos</h3>
                  <div className="space-y-3">
                    {challenges.slice(0, 3).map((challenge) => (
                      <div key={challenge.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <span className="text-sm text-gray-300">{challenge.title}</span>
                        <span className={`text-xs font-bold ${challenge.completed ? 'text-green-400' : 'text-yellow-400'}`}>
                          {challenge.completed ? '✅' : '⏳'} {challenge.reward} XP
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Lessons Tab */}
            <TabsContent value="lessons" className="space-y-4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center py-12"
              >
                <p className="text-gray-400">Vá para a página de Aulas para gerenciar suas lições</p>
              </motion.div>
            </TabsContent>

            {/* Challenges Tab */}
            <TabsContent value="challenges" className="space-y-4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {challenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all cursor-pointer"
                  >
                    <h3 className="text-lg font-bold text-white mb-2">{challenge.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{challenge.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        challenge.difficulty === 'fácil' ? 'bg-green-500/20 text-green-400' :
                        challenge.difficulty === 'médio' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-sm font-bold text-amber-400">⭐ {challenge.reward} XP</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    variants={cardVariants}
                    whileHover="hover"
                    className={`rounded-xl p-6 border transition-all cursor-pointer ${
                      achievement.unlockedAt
                        ? 'bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/50'
                        : 'bg-slate-800/50 border-slate-700/50 opacity-50'
                    }`}
                  >
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-1">{achievement.title}</h3>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                    {achievement.unlockedAt && (
                      <p className="text-xs text-amber-400 mt-3">✅ Desbloqueado</p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="space-y-4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50"
              >
                <h3 className="text-lg font-bold text-white mb-4">👑 Top 10 Estudantes</h3>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((rank) => (
                    <motion.div
                      key={rank}
                      variants={itemVariants}
                      className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-amber-400">#{rank}</span>
                        <span className="text-white font-medium">Estudante {rank}</span>
                      </div>
                      <span className="text-sm font-bold text-purple-400">{5000 - rank * 200} XP</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
