'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * RealtimeNotifications.tsx - Componente de Notificações em Tempo Real
 * 
 * Funcionalidades:
 * - Notificações toast
 * - Notificações de conquista
 * - Notificações de level up
 * - Notificações de atividade de amigos
 */

interface Notification {
  id: string;
  type: 'achievement' | 'level-up' | 'xp-gain' | 'challenge' | 'friend-activity' | 'game-result';
  title: string;
  message: string;
  icon?: string;
  color?: string;
  duration?: number;
  data?: any;
}

interface RealtimeNotificationsProps {
  notifications: Notification[];
  onDismiss?: (id: string) => void;
}

const RealtimeNotifications: React.FC<RealtimeNotificationsProps> = ({
  notifications,
  onDismiss,
}) => {
  const [displayedNotifications, setDisplayedNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (notifications.length > 0) {
      const newNotif = notifications[notifications.length - 1];
      setDisplayedNotifications((prev) => [newNotif, ...prev].slice(0, 5));

      // Auto-dismiss após duração
      const duration = newNotif.duration || 5000;
      const timer = setTimeout(() => {
        handleDismiss(newNotif.id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const handleDismiss = (id: string) => {
    setDisplayedNotifications((prev) => prev.filter((n) => n.id !== id));
    onDismiss?.(id);
  };

  const getNotificationConfig = (type: string) => {
    const configs: Record<string, any> = {
      achievement: {
        icon: '🏆',
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
      },
      'level-up': {
        icon: '🎉',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
      },
      'xp-gain': {
        icon: '⭐',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
      },
      challenge: {
        icon: '⚔️',
        color: 'from-red-500 to-orange-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
      },
      'friend-activity': {
        icon: '👥',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
      },
      'game-result': {
        icon: '🎮',
        color: 'from-indigo-500 to-purple-500',
        bgColor: 'bg-indigo-500/10',
        borderColor: 'border-indigo-500/30',
      },
    };

    return configs[type] || configs.achievement;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {displayedNotifications.map((notif) => {
          const config = getNotificationConfig(notif.type);

          return (
            <motion.div
              key={notif.id}
              variants={itemVariants}
              exit="exit"
              onClick={() => handleDismiss(notif.id)}
              className={`pointer-events-auto cursor-pointer ${config.bgColor} backdrop-blur-md rounded-lg border ${config.borderColor} p-4 max-w-sm shadow-lg`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`text-2xl flex-shrink-0`}>
                  {notif.icon || config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm">{notif.title}</p>
                  <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                    {notif.message}
                  </p>

                  {/* Data Display */}
                  {notif.data && (
                    <div className="mt-2 space-y-1">
                      {notif.data.xp && (
                        <p className="text-xs text-amber-300 font-semibold">
                          +{notif.data.xp} XP
                        </p>
                      )}
                      {notif.data.newLevel && (
                        <p className="text-xs text-purple-300 font-semibold">
                          Nível {notif.data.newLevel}
                        </p>
                      )}
                      {notif.data.score && (
                        <p className="text-xs text-blue-300 font-semibold">
                          Pontuação: {notif.data.score}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss(notif.id);
                  }}
                  className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </motion.button>
              </div>

              {/* Progress Bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: notif.duration ? notif.duration / 1000 : 5 }}
                className={`mt-2 h-1 bg-gradient-to-r ${config.color} origin-left`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default RealtimeNotifications;
