'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';

/**
 * SchoolManagementPanel.tsx - Painel de Gestão Escolar
 * 
 * Funcionalidades:
 * - Dashboard com métricas gerais
 * - Gerenciamento de turmas
 * - Monitoramento de alunos
 * - Relatórios de desempenho
 * - Gestão de professores
 * - Configurações da escola
 */

interface SchoolMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  averagePerformance: number;
  attendanceRate: number;
}

interface ClassData {
  id: string;
  name: string;
  teacher: string;
  students: number;
  performance: number;
  attendance: number;
}

interface StudentData {
  id: string;
  name: string;
  class: string;
  performance: number;
  attendance: number;
  xp: number;
  level: number;
}

const SchoolManagementPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const metrics: SchoolMetrics = {
    totalStudents: 245,
    totalTeachers: 18,
    totalClasses: 12,
    averagePerformance: 78,
    attendanceRate: 92,
  };

  const classes: ClassData[] = [
    {
      id: '1',
      name: '6º Ano A',
      teacher: 'Prof. Maria',
      students: 25,
      performance: 82,
      attendance: 95,
    },
    {
      id: '2',
      name: '6º Ano B',
      teacher: 'Prof. João',
      students: 24,
      performance: 75,
      attendance: 88,
    },
    {
      id: '3',
      name: '7º Ano A',
      teacher: 'Prof. Ana',
      students: 26,
      performance: 80,
      attendance: 93,
    },
  ];

  const students: StudentData[] = [
    {
      id: '1',
      name: 'João Silva',
      class: '6º Ano A',
      performance: 85,
      attendance: 98,
      xp: 3450,
      level: 15,
    },
    {
      id: '2',
      name: 'Maria Santos',
      class: '6º Ano A',
      performance: 92,
      attendance: 100,
      xp: 5200,
      level: 18,
    },
    {
      id: '3',
      name: 'Pedro Oliveira',
      class: '6º Ano B',
      performance: 68,
      attendance: 85,
      xp: 2100,
      level: 10,
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
            🏫 Painel de Gestão Escolar
          </h1>
          <p className="text-gray-400">Gerencie sua escola e monitore o desempenho dos alunos</p>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <TabsList className="grid w-full grid-cols-5 gap-2 bg-slate-800/50 backdrop-blur-md p-2 rounded-xl border border-slate-700/50 mb-8">
            {['dashboard', 'turmas', 'alunos', 'relatórios', 'configurações'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-400 hover:text-white"
              >
                {tab === 'dashboard' && '📊 Dashboard'}
                {tab === 'turmas' && '👥 Turmas'}
                {tab === 'alunos' && '👨‍🎓 Alunos'}
                {tab === 'relatórios' && '📈 Relatórios'}
                {tab === 'configurações' && '⚙️ Config'}
              </TabsTrigger>
            ))}
          </TabsList>
        </motion.div>

        {/* Dashboard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="dashboard" className="space-y-6">
              {/* Metrics Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
              >
                {[
                  {
                    label: 'Total de Alunos',
                    value: metrics.totalStudents,
                    icon: '👨‍🎓',
                    color: 'from-blue-500 to-cyan-500',
                  },
                  {
                    label: 'Professores',
                    value: metrics.totalTeachers,
                    icon: '👨‍🏫',
                    color: 'from-purple-500 to-pink-500',
                  },
                  {
                    label: 'Turmas',
                    value: metrics.totalClasses,
                    icon: '🏫',
                    color: 'from-green-500 to-emerald-500',
                  },
                  {
                    label: 'Desempenho Médio',
                    value: `${metrics.averagePerformance}%`,
                    icon: '📊',
                    color: 'from-yellow-500 to-orange-500',
                  },
                  {
                    label: 'Frequência',
                    value: `${metrics.attendanceRate}%`,
                    icon: '✅',
                    color: 'from-red-500 to-pink-500',
                  },
                ].map((metric, idx) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <div className={`bg-gradient-to-br ${metric.color} p-0.5 rounded-xl`}>
                      <div className="bg-slate-900 rounded-[10px] p-4 text-center">
                        <div className="text-2xl mb-2">{metric.icon}</div>
                        <div className="text-2xl font-bold text-white">{metric.value}</div>
                        <div className="text-xs text-gray-400">{metric.label}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Charts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Performance by Class */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-bold text-white mb-4">📊 Desempenho por Turma</h3>
                  <div className="space-y-3">
                    {classes.map((cls) => (
                      <div key={cls.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-400">{cls.name}</span>
                          <span className="text-sm font-bold text-white">{cls.performance}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cls.performance}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attendance by Class */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-bold text-white mb-4">✅ Frequência por Turma</h3>
                  <div className="space-y-3">
                    {classes.map((cls) => (
                      <div key={cls.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-400">{cls.name}</span>
                          <span className="text-sm font-bold text-white">{cls.attendance}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cls.attendance}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Turmas */}
            <TabsContent value="turmas" className="space-y-4">
              {classes.map((cls, idx) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-white text-lg">{cls.name}</h4>
                      <p className="text-sm text-gray-400">{cls.teacher}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{cls.students}</p>
                      <p className="text-xs text-gray-400">alunos</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Desempenho</p>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${cls.performance}%` }}
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                        />
                      </div>
                      <p className="text-xs text-white mt-1 font-bold">{cls.performance}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Frequência</p>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${cls.attendance}%` }}
                          className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
                        />
                      </div>
                      <p className="text-xs text-white mt-1 font-bold">{cls.attendance}%</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Ver Detalhes
                  </motion.button>
                </motion.div>
              ))}
            </TabsContent>

            {/* Alunos */}
            <TabsContent value="alunos" className="space-y-4">
              {students.map((student, idx) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white">{student.name}</h4>
                      <p className="text-sm text-gray-400">{student.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-400">Nv {student.level}</p>
                      <p className="text-xs text-gray-400">{student.xp} XP</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Desempenho</p>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${student.performance}%` }}
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                        />
                      </div>
                      <p className="text-xs text-white mt-1 font-bold">{student.performance}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Frequência</p>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${student.attendance}%` }}
                          className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
                        />
                      </div>
                      <p className="text-xs text-white mt-1 font-bold">{student.attendance}%</p>
                    </div>
                  </div>
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
                <h3 className="text-lg font-bold text-white mb-4">📈 Relatório Mensal</h3>
                <div className="space-y-4">
                  <p className="text-gray-400">
                    Desempenho geral da escola em {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-2">Alunos Ativos</p>
                      <p className="text-3xl font-bold text-white">{metrics.totalStudents}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-2">Desempenho Médio</p>
                      <p className="text-3xl font-bold text-green-400">{metrics.averagePerformance}%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Configurações */}
            <TabsContent value="configurações" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50"
              >
                <h3 className="text-lg font-bold text-white mb-4">⚙️ Configurações da Escola</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Nome da Escola</label>
                    <input
                      type="text"
                      defaultValue="Escola Professor Pedro Gomes"
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Cidade</label>
                    <input
                      type="text"
                      defaultValue="São Paulo"
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Salvar Configurações
                  </motion.button>
                </div>
              </motion.div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default SchoolManagementPanel;
