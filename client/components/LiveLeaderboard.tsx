'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LiveLeaderboard.tsx - Leaderboard em Tempo Real
 * 
 * Funcionalidades:
 * - Ranking ao vivo
 * - Animações de mudanças de posição
 * - Filtros por período
 * - Badges de conquistas
 */

interface LeaderboardEntry {
  id: string;
  name: string;
  level: number;
  xp: number;
  position: number;
  badge?: string;
  trend?: 'up' | 'down' | 'stable';
}

interface LiveLeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  period?: 'day' | 'week' | 'month' | 'all-time';
  onPeriodChange?: (period: string) => void;
}

const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({
  entries,
  currentUserId,
  period = 'week',
  onPeriodChange,
}) => {
  const [displayEntries, setDisplayEntries] = useState<LeaderboardEntry[]>(entries);
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  useEffect(() => {
    setDisplayEntries(entries);
  }, [entries]);

  const handlePeriodChange = (newPeriod: string) => {
    setSelectedPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '⭐';
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'from-yellow-400 to-orange-400';
      case 2:
        return 'from-gray-300 to-gray-400';
      case 3:
        return 'from-orange-400 to-orange-500';
      default:
        return 'from-slate-600 to-slate-700';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          🏆 Leaderboard
        </h3>

        {/* Period Selector */}
        <div className="flex gap-2">
          {['day', 'week', 'month', 'all-time'].map((p) => (
            <motion.button
              key={p}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePeriodChange(p)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedPeriod === p
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-slate-700/50 text-gray-400 hover:text-white'
              }`}
            >
              {p === 'day' && 'Hoje'}
              {p === 'week' && 'Semana'}
              {p === 'month' && 'Mês'}
              {p === 'all-time' && 'Tudo'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Leaderboard Entries */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <AnimatePresence mode="popLayout">
          {displayEntries.map((entry, idx) => {
            const isCurrentUser = entry.id === currentUserId;
            const medal = getMedalEmoji(entry.position);
            const positionColor = getPositionColor(entry.position);

            return (
              <motion.div
                key={entry.id}
                layout
                variants={itemVariants}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50'
                    : 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50'
                }`}
              >
                {/* Position */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.05 + 0.1 }}
                  className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${positionColor} flex items-center justify-center font-bold text-white`}
                >
                  {medal}
                </motion.div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-bold ${isCurrentUser ? 'text-purple-300' : 'text-white'}`}>
                      {entry.name}
                    </p>
                    {entry.badge && <span className="text-lg">{entry.badge}</span>}
                  </div>
                  <p className="text-xs text-gray-400">Nível {entry.level}</p>
                </div>

                {/* XP */}
                <div className="flex-shrink-0 text-right">
                  <motion.p
                    initial={{ scale: 1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="font-bold text-amber-400"
                  >
                    {entry.xp.toLocaleString()}
                  </motion.p>
                  <p className="text-xs text-gray-400">XP</p>
                </div>

                {/* Trend */}
                {entry.trend && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex-shrink-0 text-lg ${
                      entry.trend === 'up'
                        ? 'text-green-400'
                        : entry.trend === 'down'
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {entry.trend === 'up' && '📈'}
                    {entry.trend === 'down' && '📉'}
                    {entry.trend === 'stable' && '➡️'}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {displayEntries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-gray-400">Nenhum dado disponível para este período</p>
        </motion.div>
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 pt-4 border-t border-slate-700/50"
      >
        <p className="text-xs text-gray-400 text-center">
          🔄 Atualizado em tempo real
        </p>
      </motion.div>
    </div>
  );
};

export default LiveLeaderboard;
