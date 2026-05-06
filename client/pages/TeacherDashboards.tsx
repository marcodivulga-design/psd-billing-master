'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';

/**
 * TeacherDashboards.tsx - Experiências de Professor Diferenciadas
 * 
 * Tipos:
 * - Professor Infantil (Visual, rápido)
 * - Professor Fundamental (Analítico, desafios)
 * - Diretor (Dashboards, métricas)
 * - Secretaria (Relatórios, indicadores)
 */

type TeacherType = 'infantil' | 'fundamental' | 'diretor' | 'secretaria';

interface TeacherDashboardConfig {
  type: TeacherType;
  name: string;
  icon: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  focusAreas: string[];
  metrics: Array<{ label: string; value: string | number; icon: string }>;
}

const TeacherDashboards: React.FC = () => {
  const [selectedType, setSelectedType] = useState<TeacherType>('infantil');

  const dashboardConfigs: Record<TeacherType, TeacherDashboardConfig> = {
    infantil: {
      type: 'infantil',
      name: '👨‍🏫 Professor Infantil',
      icon: '🎨',
      description: 'Visual, rápido e intuitivo',
      primaryColor: '#FF6B6B',
      secondaryColor: '#FFE66D',
      focusAreas: [
        'Atividades Diárias',
        'Desenvolvimento Social',
        'Criatividade',
        'Bem-estar',
      ],
      metrics: [
        { label: 'Alunos Presentes', value: 22, icon: '✅' },
        { label: 'Atividades Completadas', value: 8, icon: '🎯' },
        { label: 'Alegria Média', value: '92%', icon: '😊' },
        { label: 'Colaboração', value: '88%', icon: '👥' },
      ],
    },

    fundamental: {
      type: 'fundamental',
      name: '👨‍🏫 Professor Fundamental',
      icon: '📊',
      description: 'Analítico e focado em desafios',
      primaryColor: '#5F27CD',
      secondaryColor: '#00D2D3',
      focusAreas: [
        'Desempenho Acadêmico',
        'Participação',
        'Progresso Individual',
        'Desafios Semanais',
      ],
      metrics: [
        { label: 'Média da Turma', value: '78%', icon: '📈' },
        { label: 'Alunos em Dificuldade', value: 3, icon: '⚠️' },
        { label: 'Quizzes Completados', value: 156, icon: '✍️' },
        { label: 'Taxa de Engajamento', value: '85%', icon: '🔥' },
      ],
    },

    diretor: {
      type: 'diretor',
      name: '🏫 Diretor',
      icon: '📊',
      description: 'Dashboards e métricas gerais',
      primaryColor: '#1A365D',
      secondaryColor: '#4299E1',
      focusAreas: [
        'Desempenho Geral',
        'Gestão de Recursos',
        'Relatórios Estratégicos',
        'Indicadores de Qualidade',
      ],
      metrics: [
        { label: 'Total de Alunos', value: 245, icon: '👨‍🎓' },
        { label: 'Taxa de Aprovação', value: '92%', icon: '✅' },
        { label: 'Professores Ativos', value: 18, icon: '👨‍🏫' },
        { label: 'Turmas', value: 12, icon: '🏫' },
      ],
    },

    secretaria: {
      type: 'secretaria',
      name: '📋 Secretaria',
      icon: '📄',
      description: 'Relatórios e indicadores',
      primaryColor: '#34495E',
      secondaryColor: '#3498DB',
      focusAreas: [
        'Documentação',
        'Relatórios Mensais',
        'Indicadores de Qualidade',
        'Conformidade',
      ],
      metrics: [
        { label: 'Documentos Processados', value: 342, icon: '📄' },
        { label: 'Relatórios Gerados', value: 12, icon: '📊' },
        { label: 'Conformidade', value: '98%', icon: '✓' },
        { label: 'Tempo Médio', value: '2.3h', icon: '⏱️' },
      ],
    },
  };

  const config = dashboardConfigs[selectedType];

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
            👨‍🏫 Dashboards de Professor
          </h1>
          <p className="text-gray-400">
            Experiências personalizadas para cada tipo de educador
          </p>
        </motion.div>
      </motion.div>

      {/* Type Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
      >
        {Object.entries(dashboardConfigs).map(([key, cfg]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedType(key as TeacherType)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedType === key
                ? 'border-white bg-white/10'
                : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
            }`}
          >
            <div className="text-3xl mb-2">{cfg.icon}</div>
            <div className="font-bold text-white text-sm">{cfg.name}</div>
            <div className="text-xs text-gray-400">{cfg.description}</div>
          </motion.button>
        ))}
      </motion.div>

      {/* Dashboard Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Title */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <motion.div variants={itemVariants}>
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: config.primaryColor }}
              >
                {config.name}
              </h2>
              <p className="text-gray-400">{config.description}</p>
            </motion.div>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {config.metrics.map((metric, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <div
                  className="rounded-lg p-4 border border-slate-700/50"
                  style={{ backgroundColor: `${config.primaryColor}15` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm">{metric.label}</p>
                    <span className="text-2xl">{metric.icon}</span>
                  </div>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: config.primaryColor }}
                  >
                    {metric.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Focus Areas */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50"
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: config.primaryColor }}
            >
              Áreas de Foco
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.focusAreas.map((area, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: `${config.primaryColor}10` }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: config.primaryColor }}
                  />
                  <span className="text-white">{area}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { label: 'Gerar Relatório', icon: '📄' },
              { label: 'Exportar Dados', icon: '📊' },
              { label: 'Configurações', icon: '⚙️' },
            ].map((action, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: config.primaryColor }}
              >
                <span>{action.icon}</span>
                {action.label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TeacherDashboards;
