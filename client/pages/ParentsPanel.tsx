'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import EvolutionaryAvatar from '../components/EvolutionaryAvatar';

/**
 * ParentsPanel.tsx - Painel dos Pais
 * 
 * Funcionalidades:
 * - Evolução do aluno em tempo real
 * - Alertas de dificuldades
 * - Sugestões de reforço
 * - Feedback emocional
 * - Comparação semanal
 * - Relatórios detalhados
 */

interface StudentData {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpNeeded: number;
  streak: number;
  averageAccuracy: number;
  timeStudied: number; // em minutos
  lastLogin: Date;
}

interface Alert {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  actionable: boolean;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  topic: string;
  duration: number; // em minutos
  priority: number; // 1-10
}

const ParentsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('visão-geral');
  const [student] = useState<StudentData>({
    id: '1',
    name: 'João Silva',
    level: 15,
    xp: 3450,
    xpNeeded: 5000,
    streak: 7,
    averageAccuracy: 78,
    timeStudied: 245,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
  });

  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: '⚠️ Dificuldade em Frações',
      message: 'João teve dificuldade em 3 questões sobre frações esta semana.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      actionable: true,
    },
    {
      id: '2',
      type: 'success',
      title: '🎉 Ótimo Desempenho',
      message: 'João teve um desempenho excelente em Matemática esta semana!',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      actionable: false,
    },
    {
      id: '3',
      type: 'info',
      title: '📚 Sugestão de Leitura',
      message: 'Seria bom revisar Interpretação de Texto por 10 minutos.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      actionable: true,
    },
  ]);

  const [suggestions] = useState<Suggestion[]>([
    {
      id: '1',
      title: 'Revisar Frações',
      description: 'João teve dificuldade neste tópico. Uma revisão de 15 minutos pode ajudar.',
      topic: 'Matemática - Frações',
      duration: 15,
      priority: 9,
    },
    {
      id: '2',
      title: 'Praticar Interpretação',
      description: 'Consolidar aprendizado com exercícios práticos.',
      topic: 'Português - Interpretação',
      duration: 20,
      priority: 7,
    },
    {
      id: '3',
      title: 'Desafio de Matemática',
      description: 'João está pronto para um desafio mais avançado em Geometria.',
      topic: 'Matemática - Geometria',
      duration: 25,
      priority: 6,
    },
  ]);

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
            👨‍👩‍👧 Painel dos Pais
          </h1>
          <p className="text-gray-400">Acompanhe a evolução de {student.name}</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Nível', value: student.level, icon: '📊', color: 'from-blue-500 to-cyan-500' },
            { label: 'Sequência', value: `${student.streak}d`, icon: '🔥', color: 'from-orange-500 to-red-500' },
            { label: 'Acurácia', value: `${student.averageAccuracy}%`, icon: '🎯', color: 'from-green-500 to-emerald-500' },
            { label: 'Tempo', value: `${Math.round(student.timeStudied / 60)}h`, icon: '⏱️', color: 'from-purple-500 to-pink-500' },
          ].map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <div className={`bg-gradient-to-br ${stat.color} p-0.5 rounded-xl`}>
                <div className="bg-slate-900 rounded-[10px] p-4 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <TabsList className="grid w-full grid-cols-4 gap-2 bg-slate-800/50 backdrop-blur-md p-2 rounded-xl border border-slate-700/50 mb-8">
            {['visão-geral', 'alertas', 'sugestões', 'relatórios'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-400 hover:text-white"
              >
                {tab === 'visão-geral' && '👁️ Visão Geral'}
                {tab === 'alertas' && '⚠️ Alertas'}
                {tab === 'sugestões' && '💡 Sugestões'}
                {tab === 'relatórios' && '📊 Relatórios'}
              </TabsTrigger>
            ))}
          </TabsList>
        </motion.div>

        {/* Visão Geral */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="visão-geral" className="space-y-6">
              {/* Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <EvolutionaryAvatar
                  level={student.level}
                  xp={student.xp}
                  xpNeeded={student.xpNeeded}
                />
              </motion.div>

              {/* Feedback Emocional */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50"
              >
                <h3 className="text-lg font-bold text-white mb-4">❤️ Feedback Emocional</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-gray-300">Motivação</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-6 rounded-full ${
                            i < 4 ? 'bg-green-500' : 'bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-gray-300">Engajamento</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-6 rounded-full ${
                            i < 4 ? 'bg-blue-500' : 'bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-gray-300">Confiança</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-6 rounded-full ${
                            i < 3 ? 'bg-purple-500' : 'bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Últimas Atividades */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50"
              >
                <h3 className="text-lg font-bold text-white mb-4">📅 Últimas Atividades</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">Quiz de Matemática</p>
                      <p className="text-xs text-gray-400">Há 2 horas</p>
                    </div>
                    <span className="text-lg">✅ 85%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">Aula de Português</p>
                      <p className="text-xs text-gray-400">Há 1 dia</p>
                    </div>
                    <span className="text-lg">✅ 92%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">Minijogo - Memória</p>
                      <p className="text-xs text-gray-400">Há 2 dias</p>
                    </div>
                    <span className="text-lg">🎮 1200 pts</span>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Alertas */}
            <TabsContent value="alertas" className="space-y-4">
              {alerts.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-xl border-l-4 ${
                    alert.type === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500 text-yellow-300'
                      : alert.type === 'success'
                      ? 'bg-green-500/10 border-green-500 text-green-300'
                      : 'bg-blue-500/10 border-blue-500 text-blue-300'
                  }`}
                >
                  <h4 className="font-bold mb-1">{alert.title}</h4>
                  <p className="text-sm mb-2">{alert.message}</p>
                  {alert.actionable && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs font-bold px-3 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
                    >
                      Tomar Ação
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </TabsContent>

            {/* Sugestões */}
            <TabsContent value="sugestões" className="space-y-4">
              {suggestions.map((suggestion, idx) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-white">{suggestion.title}</h4>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.ceil(suggestion.priority / 2) ? '⭐' : '☆'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{suggestion.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{suggestion.topic}</span>
                    <span className="text-xs text-gray-500">⏱️ {suggestion.duration} min</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-3 w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    💡 Sugerir ao {student.name}
                  </motion.button>
                </motion.div>
              ))}
            </TabsContent>

            {/* Relatórios */}
            <TabsContent value="relatórios" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50"
              >
                <h3 className="text-lg font-bold text-white mb-4">📊 Relatório Semanal</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Matemática</span>
                      <span className="text-white font-bold">82%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-blue-500 to-cyan-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Português</span>
                      <span className="text-white font-bold">78%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-gradient-to-r from-purple-500 to-pink-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Ciências</span>
                      <span className="text-white font-bold">88%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-green-500 to-emerald-500" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50"
              >
                <h3 className="text-lg font-bold text-white mb-4">📈 Evolução Mensal</h3>
                <p className="text-gray-400 mb-4">Evolução de {student.level - 3} para {student.level} nível</p>
                <div className="flex items-end justify-around h-32 gap-2">
                  {[40, 50, 60, 70, 75, 80, 85].map((height, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg"
                    />
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

export default ParentsPanel;
