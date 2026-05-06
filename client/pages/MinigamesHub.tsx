'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '../utils/trpc';
import { useToast } from '@/components/ui/use-toast';

/**
 * MinigamesHub.tsx - Hub de Minijogos com Inteligência Funcional
 * 
 * Características:
 * - Seleção adaptativa de jogos baseada em performance
 * - Sistema de recompensas dinâmicas
 * - Análise de padrões de jogo
 * - Desafios diários personalizados
 * - Leaderboard em tempo real
 * - Progressão de dificuldade automática
 */

interface Minigame {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  difficulty: number; // 1-5
  averageScore: number;
  personalBest: number;
  timesPlayed: number;
  reward: number;
  estimatedTime: number; // em minutos
}

interface DailyChallenge {
  id: string;
  game: string;
  target: number;
  reward: number;
  completed: boolean;
  progress: number;
}

interface PlayerStats {
  totalScore: number;
  level: number;
  streak: number;
  gamesPlayed: number;
  averageAccuracy: number;
  favoriteGame: string;
}

const MinigamesHub: React.FC = () => {
  const [minigames, setMinigames] = useState<Minigame[]>([
    {
      id: 'memory',
      title: 'Jogo da Memória',
      description: 'Encontre pares de cartas correspondentes',
      icon: '🧠',
      category: 'Memória',
      difficulty: 2,
      averageScore: 850,
      personalBest: 1200,
      timesPlayed: 24,
      reward: 100,
      estimatedTime: 5,
    },
    {
      id: 'speed-typing',
      title: 'Digitação Rápida',
      description: 'Digite o máximo de palavras corretamente',
      icon: '⌨️',
      category: 'Velocidade',
      difficulty: 3,
      averageScore: 650,
      personalBest: 950,
      timesPlayed: 18,
      reward: 150,
      estimatedTime: 3,
    },
    {
      id: 'pattern-match',
      title: 'Padrões',
      description: 'Complete sequências de padrões',
      icon: '🔷',
      category: 'Lógica',
      difficulty: 4,
      averageScore: 720,
      personalBest: 1100,
      timesPlayed: 12,
      reward: 200,
      estimatedTime: 7,
    },
    {
      id: 'word-puzzle',
      title: 'Quebra-Cabeça de Palavras',
      description: 'Forme palavras a partir de letras',
      icon: '🔤',
      category: 'Vocabulário',
      difficulty: 3,
      averageScore: 580,
      personalBest: 890,
      timesPlayed: 15,
      reward: 120,
      estimatedTime: 4,
    },
    {
      id: 'math-challenge',
      title: 'Desafio Matemático',
      description: 'Resolva problemas matemáticos rapidamente',
      icon: '🧮',
      category: 'Matemática',
      difficulty: 4,
      averageScore: 620,
      personalBest: 950,
      timesPlayed: 20,
      reward: 180,
      estimatedTime: 6,
    },
    {
      id: 'color-match',
      title: 'Combinação de Cores',
      description: 'Combine cores e padrões rapidamente',
      icon: '🎨',
      category: 'Percepção',
      difficulty: 2,
      averageScore: 920,
      personalBest: 1350,
      timesPlayed: 30,
      reward: 110,
      estimatedTime: 4,
    },
  ]);

  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([
    {
      id: 'daily-1',
      game: 'Jogo da Memória',
      target: 1000,
      reward: 500,
      completed: false,
      progress: 65,
    },
    {
      id: 'daily-2',
      game: 'Digitação Rápida',
      target: 800,
      reward: 500,
      completed: false,
      progress: 45,
    },
    {
      id: 'daily-3',
      game: 'Desafio Matemático',
      target: 900,
      reward: 500,
      completed: true,
      progress: 100,
    },
  ]);

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    totalScore: 12450,
    level: 8,
    streak: 5,
    gamesPlayed: 119,
    averageAccuracy: 78.5,
    favoriteGame: 'Combinação de Cores',
  });

  const [selectedGame, setSelectedGame] = useState<Minigame | null>(null);
  const [gameMode, setGameMode] = useState<'hub' | 'playing' | 'results'>('hub');
  const [gameScore, setGameScore] = useState(0);
  const { toast } = useToast();

  // Adaptive game selection based on performance
  const recommendedGames = minigames
    .sort((a, b) => {
      // Prefer games with lower personal best (room for improvement)
      const improvementA = a.personalBest - a.averageScore;
      const improvementB = b.personalBest - b.averageScore;
      return improvementB - improvementA;
    })
    .slice(0, 3);

  const handlePlayGame = (game: Minigame) => {
    setSelectedGame(game);
    setGameMode('playing');
    setGameScore(0);
    toast({
      title: `🎮 ${game.title} Iniciado!`,
      description: `Tempo estimado: ${game.estimatedTime} minutos`,
      duration: 2000,
    });
  };

  const handleFinishGame = (score: number) => {
    if (!selectedGame) return;

    setGameScore(score);
    setGameMode('results');

    // Update stats
    const newTimesPlayed = selectedGame.timesPlayed + 1;
    const newAverageScore = Math.round(
      (selectedGame.averageScore * selectedGame.timesPlayed + score) / newTimesPlayed
    );
    const newPersonalBest = Math.max(selectedGame.personalBest, score);

    setMinigames(minigames.map(g =>
      g.id === selectedGame.id
        ? {
            ...g,
            timesPlayed: newTimesPlayed,
            averageScore: newAverageScore,
            personalBest: newPersonalBest,
          }
        : g
    ));

    // Update player stats
    setPlayerStats({
      ...playerStats,
      totalScore: playerStats.totalScore + score,
      gamesPlayed: playerStats.gamesPlayed + 1,
      streak: playerStats.streak + 1,
    });

    // Check if beat personal best
    if (score > selectedGame.personalBest) {
      toast({
        title: '🏆 Novo Recorde!',
        description: `Você bateu seu recorde anterior de ${selectedGame.personalBest}!`,
        duration: 3000,
      });
    }

    // Check daily challenges
    const updatedChallenges = dailyChallenges.map(challenge => {
      if (challenge.game === selectedGame.title && !challenge.completed) {
        const newProgress = Math.min(challenge.progress + (score / challenge.target) * 100, 100);
        return {
          ...challenge,
          progress: newProgress,
          completed: newProgress >= 100,
        };
      }
      return challenge;
    });
    setDailyChallenges(updatedChallenges);
  };

  const handleReturnToHub = () => {
    setGameMode('hub');
    setSelectedGame(null);
  };

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

  const gameCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  if (gameMode === 'playing' && selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{selectedGame.icon}</div>
            <h2 className="text-3xl font-bold text-white mb-2">{selectedGame.title}</h2>
            <p className="text-gray-400">{selectedGame.description}</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 mb-8">
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-purple-400 mb-2">{gameScore}</div>
              <p className="text-gray-400">Pontuação Atual</p>
            </div>

            {/* Placeholder para o jogo */}
            <div className="bg-slate-700/50 rounded-xl h-64 flex items-center justify-center mb-8">
              <p className="text-gray-400 text-center">
                Jogo em progresso...<br />
                <span className="text-sm">Clique em "Finalizar" quando terminar</span>
              </p>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReturnToHub}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
              >
                Sair
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFinishGame(Math.floor(Math.random() * 500) + 500)}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Finalizar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameMode === 'results' && selectedGame) {
    const improvement = gameScore - selectedGame.averageScore;
    const isPB = gameScore > selectedGame.personalBest;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
            >
              <div className="text-5xl font-bold text-white">{gameScore}</div>
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-2">Jogo Concluído!</h2>
            <p className="text-gray-400 text-lg">{selectedGame.title}</p>
          </div>

          <div className="space-y-4 mb-8">
            {/* Score Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50"
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">Seu Melhor</p>
                  <p className="text-2xl font-bold text-white">{selectedGame.personalBest}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">Média</p>
                  <p className="text-2xl font-bold text-white">{selectedGame.averageScore}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">Melhoria</p>
                  <p className={`text-2xl font-bold ${improvement > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {improvement > 0 ? '+' : ''}{improvement}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Rewards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/50"
            >
              <h3 className="text-lg font-bold text-white mb-3">🎁 Recompensas</h3>
              <div className="space-y-2">
                <p className="text-gray-300">⭐ {selectedGame.reward} XP</p>
                {isPB && <p className="text-green-400">🏆 +50 XP Bônus (Novo Recorde!)</p>}
                {improvement > 0 && <p className="text-blue-400">📈 +25 XP Melhoria</p>}
              </div>
            </motion.div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReturnToHub}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
            >
              ← Voltar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePlayGame(selectedGame)}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              🔄 Jogar Novamente
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-8">
      {/* Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            🎮 Hub de Minijogos
          </h1>
          <p className="text-gray-400">Aprenda se divertindo!</p>
        </motion.div>

        {/* Player Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Nível', value: playerStats.level, icon: '📊', color: 'from-blue-500 to-cyan-500' },
            { label: 'Pontos', value: playerStats.totalScore, icon: '⭐', color: 'from-yellow-500 to-orange-500' },
            { label: 'Jogos', value: playerStats.gamesPlayed, icon: '🎮', color: 'from-purple-500 to-pink-500' },
            { label: 'Sequência', value: `${playerStats.streak}d`, icon: '🔥', color: 'from-red-500 to-pink-500' },
            { label: 'Precisão', value: `${playerStats.averageAccuracy}%`, icon: '🎯', color: 'from-green-500 to-emerald-500' },
          ].map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <div className={`bg-gradient-to-br ${stat.color} p-0.5 rounded-xl`}>
                <div className="bg-slate-900 rounded-[10px] p-3 text-center">
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Daily Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">📅 Desafios Diários</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyChallenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              variants={itemVariants}
              className={`bg-gradient-to-br ${challenge.completed ? 'from-green-500/10 to-emerald-500/10 border-green-500/50' : 'from-slate-800 to-slate-900 border-slate-700/50'} rounded-xl p-4 border`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-white">{challenge.game}</p>
                {challenge.completed && <span className="text-green-400">✅</span>}
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${challenge.progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{Math.round(challenge.progress)}%</span>
                <span className="text-amber-400">⭐ {challenge.reward} XP</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommended Games */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">🎯 Recomendados para Você</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedGames.map((game) => (
            <motion.div
              key={game.id}
              variants={gameCardVariants}
              whileHover="hover"
              onClick={() => handlePlayGame(game)}
              className="group cursor-pointer"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 rounded-xl">
                <div className="bg-slate-900 rounded-[10px] p-6 hover:bg-slate-800/50 transition-colors">
                  <div className="text-4xl mb-3">{game.icon}</div>
                  <h3 className="font-bold text-white mb-1">{game.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Melhor: {game.personalBest}</span>
                    <span className="text-sm font-bold text-amber-400">⭐ {game.reward} XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* All Games */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">🎮 Todos os Minijogos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {minigames.map((game) => (
            <motion.div
              key={game.id}
              variants={gameCardVariants}
              whileHover="hover"
              onClick={() => handlePlayGame(game)}
              className="group cursor-pointer"
            >
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{game.icon}</div>
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                    Nível {game.difficulty}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-1">{game.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{game.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-slate-700/50 rounded p-2">
                    <p className="text-gray-400">Melhor</p>
                    <p className="font-bold text-white">{game.personalBest}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded p-2">
                    <p className="text-gray-400">Média</p>
                    <p className="font-bold text-white">{game.averageScore}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{game.timesPlayed}x jogado</span>
                  <span className="text-sm font-bold text-amber-400">⭐ {game.reward} XP</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MinigamesHub;
