'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AdvancedMiniGames.tsx - Mini Games Educacionais Avançados
 * 
 * Jogos:
 * - Batalha Matemática (PvP)
 * - Defesa de Castelo (Estratégia)
 * - Corrida Espacial (Velocidade)
 * - Memória Mágica (Concentração)
 * - Digitação Rápida (Teclado)
 * - Padrões Coloridos (Lógica)
 */

interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
  duration: number;
  maxPlayers: number;
  rewards: number;
  playerCount: number;
}

interface GameSession {
  gameId: string;
  score: number;
  time: number;
  completed: boolean;
  reward: number;
}

const AdvancedMiniGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const games: Game[] = [
    {
      id: 'math-battle',
      name: 'Batalha Matemática',
      description: 'Compita contra outros alunos em desafios de matemática em tempo real',
      icon: '⚔️',
      color: 'from-red-500 to-orange-500',
      difficulty: 'médio',
      duration: 5,
      maxPlayers: 4,
      rewards: 150,
      playerCount: 3,
    },
    {
      id: 'castle-defense',
      name: 'Defesa de Castelo',
      description: 'Responda perguntas para defender seu castelo de invasores',
      icon: '🏰',
      color: 'from-purple-500 to-pink-500',
      difficulty: 'médio',
      duration: 10,
      maxPlayers: 1,
      rewards: 200,
      playerCount: 1,
    },
    {
      id: 'space-race',
      name: 'Corrida Espacial',
      description: 'Responda rápido para avançar sua nave no espaço',
      icon: '🚀',
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'fácil',
      duration: 3,
      maxPlayers: 4,
      rewards: 100,
      playerCount: 2,
    },
    {
      id: 'memory-magic',
      name: 'Memória Mágica',
      description: 'Encontre pares de cartas com conceitos relacionados',
      icon: '✨',
      color: 'from-yellow-500 to-pink-500',
      difficulty: 'fácil',
      duration: 5,
      maxPlayers: 1,
      rewards: 120,
      playerCount: 1,
    },
    {
      id: 'typing-speed',
      name: 'Digitação Rápida',
      description: 'Digite palavras e frases o mais rápido possível',
      icon: '⌨️',
      color: 'from-green-500 to-emerald-500',
      difficulty: 'médio',
      duration: 2,
      maxPlayers: 1,
      rewards: 80,
      playerCount: 1,
    },
    {
      id: 'color-patterns',
      name: 'Padrões Coloridos',
      description: 'Identifique e complete sequências de cores e formas',
      icon: '🎨',
      color: 'from-indigo-500 to-purple-500',
      difficulty: 'fácil',
      duration: 4,
      maxPlayers: 1,
      rewards: 90,
      playerCount: 1,
    },
  ];

  const startGame = (game: Game) => {
    setSelectedGame(game);
    setGameSession({
      gameId: game.id,
      score: 0,
      time: game.duration * 60,
      completed: false,
      reward: 0,
    });
    setIsPlaying(true);
  };

  const finishGame = (finalScore: number) => {
    if (gameSession) {
      const reward = Math.round((finalScore / 100) * (selectedGame?.rewards || 0));
      setGameSession({
        ...gameSession,
        score: finalScore,
        completed: true,
        reward,
      });
      setIsPlaying(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-8">
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  🎮 Mini Games Avançados
                </h1>
                <p className="text-gray-400">
                  Aprenda jogando e ganhe recompensas
                </p>
              </motion.div>
            </motion.div>

            {/* Games Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {games.map((game) => (
                <motion.button
                  key={game.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startGame(game)}
                  className="group relative overflow-hidden rounded-xl"
                >
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Content */}
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700/50 group-hover:border-white/20 transition-all">
                    <div className="text-5xl mb-4">{game.icon}</div>

                    <h3 className="text-xl font-bold text-white mb-2 text-left">
                      {game.name}
                    </h3>

                    <p className="text-sm text-gray-400 mb-4 text-left line-clamp-2">
                      {game.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-700/30 rounded-lg p-2">
                        <p className="text-xs text-gray-400">Duração</p>
                        <p className="font-bold text-white">{game.duration} min</p>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-2">
                        <p className="text-xs text-gray-400">Recompensa</p>
                        <p className="font-bold text-amber-400">+{game.rewards} XP</p>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-2">
                        <p className="text-xs text-gray-400">Dificuldade</p>
                        <p className="font-bold text-white capitalize">
                          {game.difficulty}
                        </p>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-2">
                        <p className="text-xs text-gray-400">Jogadores</p>
                        <p className="font-bold text-white">
                          {game.playerCount}/{game.maxPlayers}
                        </p>
                      </div>
                    </div>

                    {/* Play Button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                    >
                      Jogar Agora
                    </motion.div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        ) : selectedGame && gameSession ? (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen"
          >
            {!gameSession.completed ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 max-w-2xl border border-slate-700/50 text-center"
              >
                <div className="text-6xl mb-4">{selectedGame.icon}</div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedGame.name}
                </h2>
                <p className="text-gray-400 mb-8">{selectedGame.description}</p>

                {/* Game Simulation */}
                <div className="bg-slate-700/30 rounded-lg p-8 mb-8">
                  <div className="text-5xl font-bold text-amber-400 mb-4">
                    {gameSession.score}
                  </div>
                  <p className="text-gray-400 mb-6">Pontos</p>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="w-full h-4 bg-slate-600 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 2 }}
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Progresso: 75%</p>
                  </div>

                  {/* Timer */}
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-4xl font-bold text-blue-400 mb-6"
                  >
                    ⏱️ {gameSession.time}s
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => finishGame(85)}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all"
                >
                  ✅ Terminar Jogo
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 max-w-2xl border border-slate-700/50 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-2">
                  Parabéns!
                </h2>
                <p className="text-gray-400 mb-8">Você completou {selectedGame.name}</p>

                {/* Results */}
                <div className="bg-slate-700/30 rounded-lg p-8 mb-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Pontuação</span>
                    <span className="text-2xl font-bold text-amber-400">
                      {gameSession.score}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tempo</span>
                    <span className="text-2xl font-bold text-blue-400">
                      {selectedGame.duration - Math.floor(gameSession.time / 60)}m
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-600 pt-4">
                    <span className="text-gray-400 font-bold">Recompensa</span>
                    <span className="text-2xl font-bold text-green-400">
                      +{gameSession.reward} XP
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsPlaying(false);
                    setGameSession(null);
                    setSelectedGame(null);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  ← Voltar ao Menu
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedMiniGames;
