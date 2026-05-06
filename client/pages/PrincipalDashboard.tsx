/**
 * PrincipalDashboard.tsx
 * 
 * CAMADA 6: GESTÃO ESCOLAR
 * 
 * Dashboard completo para Diretores acompanharem:
 * - Desempenho geral
 * - Frequência
 * - Professores
 * - Uso da plataforma
 * - Dificuldades
 * - Engajamento
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SchoolMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  averageGrade: number;
  attendanceRate: number;
  engagementRate: number;
  platformUsage: number;
}

interface ClassroomPerformance {
  name: string;
  grade: number;
  students: number;
  attendance: number;
  engagement: number;
}

interface TeacherMetrics {
  name: string;
  subject: string;
  studentCount: number;
  averageGrade: number;
  platformUsage: number;
  engagementRate: number;
}

interface StudentDifficulty {
  name: string;
  subject: string;
  difficulty: 'baixa' | 'média' | 'alta';
  suggestedAction: string;
}

export default function PrincipalDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'classrooms' | 'teachers' | 'difficulties' | 'attendance'>('overview');
  const [schoolMetrics, setSchoolMetrics] = useState<SchoolMetrics | null>(null);
  const [classroomData, setClassroomData] = useState<ClassroomPerformance[]>([]);
  const [teacherData, setTeacherData] = useState<TeacherMetrics[]>([]);
  const [difficultyData, setDifficultyData] = useState<StudentDifficulty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setSchoolMetrics({
        totalStudents: 245,
        totalTeachers: 18,
        totalClasses: 12,
        averageGrade: 7.8,
        attendanceRate: 92,
        engagementRate: 85,
        platformUsage: 78,
      });

      setClassroomData([
        { name: '1º A', grade: 8.2, students: 25, attendance: 94, engagement: 88 },
        { name: '1º B', grade: 7.9, students: 23, attendance: 91, engagement: 84 },
        { name: '2º A', grade: 7.5, students: 24, attendance: 90, engagement: 82 },
        { name: '2º B', grade: 8.1, students: 26, attendance: 93, engagement: 86 },
        { name: '3º A', grade: 7.8, students: 22, attendance: 92, engagement: 85 },
        { name: '3º B', grade: 7.6, students: 25, attendance: 89, engagement: 80 },
      ]);

      setTeacherData([
        { name: 'Professora Ana', subject: 'Português', studentCount: 75, averageGrade: 8.1, platformUsage: 92, engagementRate: 88 },
        { name: 'Professor Carlos', subject: 'Matemática', studentCount: 75, averageGrade: 7.6, platformUsage: 85, engagementRate: 82 },
        { name: 'Professora Maria', subject: 'Ciências', studentCount: 75, averageGrade: 8.3, platformUsage: 88, engagementRate: 86 },
        { name: 'Professor João', subject: 'História', studentCount: 75, averageGrade: 7.9, platformUsage: 80, engagementRate: 79 },
      ]);

      setDifficultyData([
        { name: 'Pedro Silva', subject: 'Matemática', difficulty: 'alta', suggestedAction: 'Reforço em frações' },
        { name: 'Ana Costa', subject: 'Português', difficulty: 'média', suggestedAction: 'Praticar interpretação' },
        { name: 'Lucas Santos', subject: 'Ciências', difficulty: 'alta', suggestedAction: 'Aulas extras' },
        { name: 'Juliana Oliveira', subject: 'Inglês', difficulty: 'média', suggestedAction: 'Conversação prática' },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const tabs = [
    { id: 'overview', label: '📊 Visão Geral', icon: '📊' },
    { id: 'classrooms', label: '🏫 Turmas', icon: '🏫' },
    { id: 'teachers', label: '👨‍🏫 Professores', icon: '👨‍🏫' },
    { id: 'difficulties', label: '⚠️ Dificuldades', icon: '⚠️' },
    { id: 'attendance', label: '📋 Frequência', icon: '📋' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'baixa':
        return '#10b981';
      case 'média':
        return '#f59e0b';
      case 'alta':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Dashboard do Diretor</h1>
          <p className="text-gray-600">Acompanhe o desempenho da sua escola em tempo real</p>
        </motion.div>

        {/* Métricas Principais */}
        {activeTab === 'overview' && schoolMetrics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
          >
            {[
              { label: 'Alunos', value: schoolMetrics.totalStudents, icon: '👥', color: 'from-blue-500 to-blue-600' },
              { label: 'Professores', value: schoolMetrics.totalTeachers, icon: '👨‍🏫', color: 'from-purple-500 to-purple-600' },
              { label: 'Turmas', value: schoolMetrics.totalClasses, icon: '🏫', color: 'from-pink-500 to-pink-600' },
              { label: 'Média Geral', value: `${schoolMetrics.averageGrade.toFixed(1)}`, icon: '📈', color: 'from-green-500 to-green-600' },
              { label: 'Frequência', value: `${schoolMetrics.attendanceRate}%`, icon: '📋', color: 'from-yellow-500 to-yellow-600' },
              { label: 'Engajamento', value: `${schoolMetrics.engagementRate}%`, icon: '⚡', color: 'from-red-500 to-red-600' },
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-br ${metric.color} text-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="text-2xl mb-2">{metric.icon}</div>
                <div className="text-sm opacity-90">{metric.label}</div>
                <div className="text-2xl font-bold">{metric.value}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Abas de Navegação */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Conteúdo por Aba */}
        <AnimatePresence mode="wait">
          {/* Visão Geral */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Desempenho por Turma */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Desempenho por Turma</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classroomData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="grade" fill="#6366f1" name="Média" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Uso da Plataforma */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📱 Uso da Plataforma</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={classroomData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="engagement" stroke="#8b5cf6" name="Engajamento" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Turmas */}
          {activeTab === 'classrooms' && (
            <motion.div key="classrooms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classroomData.map((classroom, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-bold text-gray-900">Turma {classroom.name}</h4>
                      <span className="text-2xl">🏫</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alunos:</span>
                        <span className="font-semibold text-gray-900">{classroom.students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Média:</span>
                        <span className="font-semibold text-indigo-600">{classroom.grade.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frequência:</span>
                        <span className="font-semibold text-green-600">{classroom.attendance}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Engajamento:</span>
                        <span className="font-semibold text-purple-600">{classroom.engagement}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Professores */}
          {activeTab === 'teachers' && (
            <motion.div key="teachers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-4">
                {teacherData.map((teacher, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{teacher.name}</h4>
                        <p className="text-gray-600">{teacher.subject}</p>
                      </div>
                      <span className="text-2xl">👨‍🏫</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Alunos</p>
                        <p className="text-xl font-bold text-gray-900">{teacher.studentCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Média</p>
                        <p className="text-xl font-bold text-indigo-600">{teacher.averageGrade.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Uso Plataforma</p>
                        <p className="text-xl font-bold text-purple-600">{teacher.platformUsage}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Engajamento</p>
                        <p className="text-xl font-bold text-green-600">{teacher.engagementRate}%</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Dificuldades */}
          {activeTab === 'difficulties' && (
            <motion.div key="difficulties" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-4">
                {difficultyData.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-lg shadow-lg p-6 border-l-4"
                    style={{ borderColor: getDifficultyColor(item.difficulty) }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
                        <p className="text-gray-600">{item.subject}</p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                        style={{ backgroundColor: getDifficultyColor(item.difficulty) }}
                      >
                        {item.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Ação sugerida:</span> {item.suggestedAction}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Frequência */}
          {activeTab === 'attendance' && (
            <motion.div key="attendance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Frequência por Turma</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={classroomData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendance" fill="#10b981" name="Frequência %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
