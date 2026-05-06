'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LearningRPGMap.tsx - Mapa RPG de Aprendizado
 * 
 * Funcionalidades:
 * - Cada matéria é um mundo
 * - Regiões desbloqueáveis
 * - Progresso visual
 * - Desafios por região
 * - Recompensas e conquistas
 */

interface Region {
  id: string;
  name: string;
  icon: string;
  difficulty: number;
  progress: number;
  locked: boolean;
  unlocksAt: number;
  reward: number;
  description: string;
}

interface World {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  regions: Region[];
  completed: boolean;
  progress: number;
}

const LearningRPGMap: React.FC = () => {
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const worlds: World[] = [
    {
      id: 'math',
      name: 'Reino Lógico',
      description: 'Domine os números e a lógica matemática',
      icon: '🔢',
      color: 'from-blue-500 to-cyan-500',
      completed: false,
      progress: 65,
      regions: [
        {
          id: 'math-1',
          name: 'Floresta dos Números',
          icon: '🌲',
          difficulty: 1,
          progress: 100,
          locked: false,
          unlocksAt: 0,
          reward: 100,
          description: 'Aprenda sobre números naturais e operações básicas',
        },
        {
          id: 'math-2',
          name: 'Montanha das Frações',
          icon: '⛰️',
          difficulty: 2,
          progress: 75,
          locked: false,
          unlocksAt: 0,
          reward: 200,
          description: 'Domine frações e proporções',
        },
        {
          id: 'math-3',
          name: 'Caverna da Geometria',
          icon: '🏔️',
          difficulty: 3,
          progress: 40,
          locked: false,
          unlocksAt: 0,
          reward: 300,
          description: 'Explore formas e espaço',
        },
        {
          id: 'math-4',
          name: 'Castelo da Álgebra',
          icon: '🏰',
          difficulty: 4,
          progress: 0,
          locked: true,
          unlocksAt: 75,
          reward: 500,
          description: 'Desbloqueado ao atingir 75% no Reino Lógico',
        },
      ],
    },
    {
      id: 'portuguese',
      name: 'Torre das Palavras',
      description: 'Desenvolva suas habilidades de leitura e escrita',
      icon: '📖',
      color: 'from-purple-500 to-pink-500',
      completed: false,
      progress: 45,
      regions: [
        {
          id: 'port-1',
          name: 'Biblioteca Encantada',
          icon: '📚',
          difficulty: 1,
          progress: 100,
          locked: false,
          unlocksAt: 0,
          reward: 100,
          description: 'Comece com leitura básica',
        },
        {
          id: 'port-2',
          name: 'Sala de Interpretação',
          icon: '🎭',
          difficulty: 2,
          progress: 50,
          locked: false,
          unlocksAt: 0,
          reward: 200,
          description: 'Interprete textos e histórias',
        },
        {
          id: 'port-3',
          name: 'Estúdio de Escrita',
          icon: '✍️',
          difficulty: 3,
          progress: 0,
          locked: true,
          unlocksAt: 60,
          reward: 300,
          description: 'Desenvolva suas habilidades de escrita',
        },
      ],
    },
    {
      id: 'science',
      name: 'Laboratório Espacial',
      description: 'Descubra os mistérios da ciência',
      icon: '🚀',
      color: 'from-green-500 to-emerald-500',
      completed: false,
      progress: 30,
      regions: [
        {
          id: 'sci-1',
          name: 'Planeta Terra',
          icon: '🌍',
          difficulty: 1,
          progress: 100,
          locked: false,
          unlocksAt: 0,
          reward: 100,
          description: 'Aprenda sobre nosso planeta',
        },
        {
          id: 'sci-2',
          name: 'Órbita Cósmica',
          icon: '🌌',
          difficulty: 2,
          progress: 0,
          locked: true,
          unlocksAt: 50,
          reward: 200,
          description: 'Explore o universo',
        },
      ],
    },
    {
      id: 'history',
      name: 'Máquina do Tempo',
      description: 'Viaje pela história da humanidade',
      icon: '⏰',
      color: 'from-yellow-500 to-orange-500',
      completed: false,
      progress: 20,
      regions: [
        {
          id: 'hist-1',
          name: 'Antiguidade',
          icon: '🏛️',
          difficulty: 1,
          progress: 50,
          locked: false,
          unlocksAt: 0,
          reward: 100,
          description: 'Conheça as civilizações antigas',
        },
      ],
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
            🗺️ Mapa de Aprendizado
          </h1>
          <p className="text-gray-400">Explore mundos de conhecimento e desbloqueie regiões</p>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Worlds List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="space-y-3">
            {worlds.map((world) => (
              <motion.button
                key={world.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedWorld(world)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedWorld?.id === world.id
                    ? `bg-gradient-to-r ${world.color} border-white`
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{world.icon}</span>
                  <div className="text-left flex-1">
                    <p className={`font-bold ${selectedWorld?.id === world.id ? 'text-white' : 'text-white'}`}>
                      {world.name}
                    </p>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mt-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${world.progress}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full bg-gradient-to-r ${world.color}`}
                      />
                    </div>
                    <p className={`text-xs mt-1 ${selectedWorld?.id === world.id ? 'text-white' : 'text-gray-400'}`}>
                      {world.progress}% completo
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* World Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <AnimatePresence mode="wait">
            {selectedWorld ? (
              <motion.div
                key={selectedWorld.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl">{selectedWorld.icon}</span>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedWorld.name}</h2>
                    <p className="text-gray-400">{selectedWorld.description}</p>
                  </div>
                </div>

                {/* Regions */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white mb-4">🏰 Regiões</h3>
                  {selectedWorld.regions.map((region, idx) => (
                    <motion.button
                      key={region.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={!region.locked ? { scale: 1.02 } : {}}
                      onClick={() => !region.locked && setSelectedRegion(region)}
                      disabled={region.locked}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        region.locked
                          ? 'bg-slate-700/20 border-slate-700/30 opacity-50 cursor-not-allowed'
                          : selectedRegion?.id === region.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-white'
                          : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 text-left">
                          <span className="text-2xl">{region.icon}</span>
                          <div>
                            <p className="font-bold text-white">{region.name}</p>
                            <p className="text-xs text-gray-400">{region.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {region.locked ? (
                            <div className="text-yellow-400 font-bold text-sm">
                              🔒 {region.unlocksAt}%
                            </div>
                          ) : (
                            <>
                              <div className="text-amber-400 font-bold">⭐ {region.reward} XP</div>
                              <div className="w-16 h-2 bg-slate-600 rounded-full overflow-hidden mt-1">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${region.progress}%` }}
                                  transition={{ duration: 0.5 }}
                                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                                />
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{region.progress}%</p>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-12 border border-slate-700/50 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-gray-400">Selecione um mundo para começar sua jornada</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Region Details Modal */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRegion(null)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-md border border-slate-700/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{selectedRegion.icon}</span>
                <h3 className="text-2xl font-bold text-white">{selectedRegion.name}</h3>
              </div>

              <p className="text-gray-400 mb-6">{selectedRegion.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Dificuldade</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < selectedRegion.difficulty ? '⭐' : '☆'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Recompensa</span>
                  <span className="font-bold text-amber-400">+{selectedRegion.reward} XP</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-2">Progresso</span>
                  <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedRegion.progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{selectedRegion.progress}% concluído</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRegion(null)}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                🎮 Começar Desafio
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningRPGMap;
