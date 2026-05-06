/**
 * EJAStudentDashboard.tsx
 * 
 * EDUCAÇÃO DE JOVENS E ADULTOS (EJA)
 * 
 * Versão simplificada e respeitosa para adultos:
 * - Navegação clara e direta
 * - Fontes maiores (16px+)
 * - Linguagem profissional e acolhedora
 * - Sem elementos infantis
 * - Foco em progresso e evolução
 * - Respeito ao tempo do aluno
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StudentStats {
  name: string;
  level: number;
  totalXP: number;
  lessonsCompleted: number;
  averageScore: number;
  streak: number;
  joinDate: string;
}

interface LessonProgress {
  name: string;
  completed: number;
  total: number;
  percentage: number;
}

interface ProgressData {
  month: string;
  score: number;
  lessons: number;
}

export default function EJAStudentDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'lessons' | 'profile'>('overview');
  const [studentStats, setStudentStats] = useState<StudentStats>({
    name: 'João Silva',
    level: 5,
    totalXP: 2450,
    lessonsCompleted: 24,
    averageScore: 7.8,
    streak: 12,
    joinDate: '2024-01-15',
  });

  const lessonProgress: LessonProgress[] = [
    { name: 'Português', completed: 8, total: 10, percentage: 80 },
    { name: 'Matemática', completed: 6, total: 10, percentage: 60 },
    { name: 'Ciências', completed: 7, total: 10, percentage: 70 },
    { name: 'História', completed: 9, total: 10, percentage: 90 },
    { name: 'Geografia', completed: 5, total: 10, percentage: 50 },
  ];

  const progressData: ProgressData[] = [
    { month: 'Jan', score: 6.5, lessons: 3 },
    { month: 'Fev', score: 6.8, lessons: 5 },
    { month: 'Mar', score: 7.2, lessons: 7 },
    { month: 'Abr', score: 7.5, lessons: 8 },
    { month: 'Mai', score: 7.8, lessons: 9 },
    { month: 'Jun', score: 7.8, lessons: 10 },
  ];

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '📊' },
    { id: 'progress', label: 'Progresso', icon: '📈' },
    { id: 'lessons', label: 'Aulas', icon: '📚' },
    { id: 'profile', label: 'Perfil', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bem-vindo, {studentStats.name}</h1>
          <p className="text-lg text-gray-700">Sua jornada de aprendizado contínuo</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
              }`}
            >
              {tab.icon} {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Conteúdo */}
        <AnimatePresence mode="wait">
          {/* Visão Geral */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Nível', value: studentStats.level, icon: '🎯', color: 'from-blue-500 to-blue-600' },
                  { label: 'Aulas Concluídas', value: studentStats.lessonsCompleted, icon: '✅', color: 'from-green-500 to-green-600' },
                  { label: 'Média', value: `${studentStats.averageScore.toFixed(1)}`, icon: '📊', color: 'from-purple-500 to-purple-600' },
                  { label: 'Sequência', value: `${studentStats.streak} dias`, icon: '🔥', color: 'from-orange-500 to-orange-600' },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-gradient-to-br ${stat.color} text-white rounded-lg p-6 shadow-lg`}
                  >
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Mensagem Motivadora */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-blue-600"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Sua Evolução</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Você vem evoluindo constantemente. Sua média subiu de 6.5 para 7.8 em 6 meses. Continue assim!
                </p>
                <div className="flex items-center gap-2 text-lg text-green-600 font-semibold">
                  <span>📈 +1.3 pontos de melhora</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Progresso */}
          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Evolução de Desempenho</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Média de Notas"
                      dot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Progresso por Matéria</h3>
                <div className="space-y-6">
                  {lessonProgress.map((lesson, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-lg font-semibold text-gray-900">{lesson.name}</span>
                        <span className="text-lg font-bold text-blue-600">{lesson.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${lesson.percentage}%` }}
                          transition={{ duration: 1 }}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                        />
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {lesson.completed} de {lesson.total} aulas concluídas
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Aulas */}
          {activeTab === 'lessons' && (
            <motion.div
              key="lessons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[
                { name: 'Português: Interpretação de Textos', status: 'concluído', date: '2024-06-10' },
                { name: 'Matemática: Frações e Porcentagem', status: 'em progresso', date: '2024-06-12' },
                { name: 'Ciências: Corpo Humano', status: 'concluído', date: '2024-06-08' },
                { name: 'História: Brasil Colônia', status: 'disponível', date: '2024-06-15' },
                { name: 'Geografia: Regiões do Brasil', status: 'disponível', date: '2024-06-17' },
              ].map((lesson, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{lesson.name}</h4>
                      <p className="text-gray-600">
                        {lesson.status === 'concluído' && '✅ Concluído'}
                        {lesson.status === 'em progresso' && '⏳ Em progresso'}
                        {lesson.status === 'disponível' && '📅 Disponível'}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${
                        lesson.status === 'concluído'
                          ? 'bg-gray-300 text-gray-600 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {lesson.status === 'concluído' ? 'Concluído' : 'Acessar'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Perfil */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-lg p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Informações do Perfil</h3>
              <div className="space-y-6">
                {[
                  { label: 'Nome', value: studentStats.name },
                  { label: 'Nível Atual', value: `Nível ${studentStats.level}` },
                  { label: 'Data de Inscrição', value: new Date(studentStats.joinDate).toLocaleDateString('pt-BR') },
                  { label: 'Total de XP', value: `${studentStats.totalXP} pontos` },
                  { label: 'Aulas Concluídas', value: `${studentStats.lessonsCompleted} aulas` },
                  { label: 'Média Geral', value: `${studentStats.averageScore.toFixed(1)}/10` },
                ].map((field, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex justify-between items-center pb-4 border-b border-gray-200"
                  >
                    <span className="text-lg font-semibold text-gray-700">{field.label}</span>
                    <span className="text-lg text-gray-900 font-bold">{field.value}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
              >
                Editar Perfil
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
