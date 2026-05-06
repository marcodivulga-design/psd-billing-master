'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * EvolutionaryAvatar.tsx - Avatar que Evolui com o Progresso do Aluno
 * 
 * Características:
 * - Evolui visualmente conforme XP aumenta
 * - Muda de roupa, acessórios e poderes
 * - Ambiente muda com nível
 * - Animações suaves de transformação
 */

interface AvatarState {
  level: number; // 1-100
  xp: number;
  xpNeeded: number;
  outfit: 'iniciante' | 'aprendiz' | 'estudioso' | 'mestre' | 'lendário';
  accessories: string[];
  powers: string[];
  environment: 'floresta' | 'montanha' | 'castelo' | 'espaço' | 'dimensão';
}

interface EvolutionaryAvatarProps {
  level: number;
  xp: number;
  xpNeeded: number;
  onLevelUp?: (newLevel: number) => void;
}

const LEVEL_THRESHOLDS = {
  iniciante: { minLevel: 1, maxLevel: 10, color: 'from-blue-400 to-cyan-400' },
  aprendiz: { minLevel: 11, maxLevel: 25, color: 'from-purple-400 to-pink-400' },
  estudioso: { minLevel: 26, maxLevel: 50, color: 'from-yellow-400 to-orange-400' },
  mestre: { minLevel: 51, maxLevel: 75, color: 'from-red-400 to-pink-400' },
  lendário: { minLevel: 76, maxLevel: 100, color: 'from-amber-300 to-yellow-300' },
};

const ACCESSORIES_BY_LEVEL = {
  iniciante: ['📚'],
  aprendiz: ['📚', '🎓'],
  estudioso: ['📚', '🎓', '⭐'],
  mestre: ['📚', '🎓', '⭐', '👑'],
  lendário: ['📚', '🎓', '⭐', '👑', '🔥'],
};

const POWERS_BY_LEVEL = {
  iniciante: [],
  aprendiz: ['Foco Aumentado'],
  estudioso: ['Foco Aumentado', 'Memória Aguçada'],
  mestre: ['Foco Aumentado', 'Memória Aguçada', 'Sabedoria Ancestral'],
  lendário: ['Foco Aumentado', 'Memória Aguçada', 'Sabedoria Ancestral', 'Conhecimento Infinito'],
};

const ENVIRONMENTS = {
  floresta: '🌲🌿🦋',
  montanha: '⛰️🏔️🦅',
  castelo: '🏰👑⚔️',
  espaço: '🚀🌌⭐',
  dimensão: '✨🌀🔮',
};

const EvolutionaryAvatar: React.FC<EvolutionaryAvatarProps> = ({
  level,
  xp,
  xpNeeded,
  onLevelUp,
}) => {
  const [avatarState, setAvatarState] = useState<AvatarState>({
    level,
    xp,
    xpNeeded,
    outfit: 'iniciante',
    accessories: [],
    powers: [],
    environment: 'floresta',
  });

  const [isLevelingUp, setIsLevelingUp] = useState(false);

  useEffect(() => {
    // Determinar outfit baseado no nível
    let outfit: AvatarState['outfit'] = 'iniciante';
    let environment: AvatarState['environment'] = 'floresta';

    if (level >= 76) {
      outfit = 'lendário';
      environment = 'dimensão';
    } else if (level >= 51) {
      outfit = 'mestre';
      environment = 'espaço';
    } else if (level >= 26) {
      outfit = 'estudioso';
      environment = 'castelo';
    } else if (level >= 11) {
      outfit = 'aprendiz';
      environment = 'montanha';
    }

    const newState: AvatarState = {
      level,
      xp,
      xpNeeded,
      outfit,
      accessories: ACCESSORIES_BY_LEVEL[outfit],
      powers: POWERS_BY_LEVEL[outfit],
      environment,
    };

    // Verificar se houve level up
    if (level > avatarState.level) {
      setIsLevelingUp(true);
      setTimeout(() => setIsLevelingUp(false), 1500);
      onLevelUp?.(level);
    }

    setAvatarState(newState);
  }, [level, xp, xpNeeded]);

  const progressPercentage = (xp / xpNeeded) * 100;
  const thresholdData = LEVEL_THRESHOLDS[avatarState.outfit];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const levelUpVariants = {
    hidden: { scale: 1 },
    levelUp: {
      scale: [1, 1.2, 1.1, 1],
      transition: { duration: 1, times: [0, 0.3, 0.7, 1] },
    },
  };

  const avatarVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50"
    >
      {/* Ambiente */}
      <div className="text-4xl mb-4 opacity-60">{ENVIRONMENTS[avatarState.environment]}</div>

      {/* Avatar Principal */}
      <motion.div
        variants={levelUpVariants}
        animate={isLevelingUp ? 'levelUp' : 'hidden'}
        className="relative mb-4"
      >
        <motion.div
          variants={avatarVariants}
          className={`text-8xl bg-gradient-to-br ${thresholdData.color} bg-clip-text text-transparent`}
        >
          🧙
        </motion.div>

        {/* Acessórios */}
        <div className="absolute -top-4 -right-4 flex gap-1">
          {avatarState.accessories.map((accessory, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="text-2xl"
            >
              {accessory}
            </motion.div>
          ))}
        </div>

        {/* Efeito de Level Up */}
        {isLevelingUp && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 border-2 border-yellow-400 rounded-full"
          />
        )}
      </motion.div>

      {/* Informações */}
      <div className="text-center mb-6">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-3xl font-bold bg-gradient-to-r ${thresholdData.color} bg-clip-text text-transparent mb-1`}
        >
          Nível {avatarState.level}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-400 capitalize"
        >
          {avatarState.outfit}
        </motion.p>
      </div>

      {/* Progress Bar */}
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">Progresso</span>
          <span className="text-xs text-gray-400">
            {xp} / {xpNeeded} XP
          </span>
        </div>
        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full bg-gradient-to-r ${thresholdData.color}`}
          />
        </div>
      </div>

      {/* Poderes */}
      {avatarState.powers.length > 0 && (
        <div className="w-full mb-4">
          <p className="text-xs text-gray-400 mb-2">✨ Poderes Desbloqueados:</p>
          <div className="flex flex-wrap gap-2">
            {avatarState.powers.map((power, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full text-xs text-purple-300 border border-purple-500/50"
              >
                {power}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Próximo Nível */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-xs text-gray-500">
          Próximo nível em {xpNeeded - xp} XP
        </p>
        {level < 100 && (
          <p className="text-xs text-gray-600 mt-1">
            {Math.round(progressPercentage)}% para o próximo nível
          </p>
        )}
      </motion.div>

      {/* Milestone */}
      {level === 100 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-lg text-center"
        >
          <p className="text-sm font-bold text-slate-900">🎉 Você é uma Lenda!</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EvolutionaryAvatar;
