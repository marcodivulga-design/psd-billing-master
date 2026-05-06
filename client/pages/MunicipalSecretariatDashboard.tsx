/**
 * MunicipalSecretariatDashboard.tsx
 * 
 * CAMADA 7: SECRETARIA MUNICIPAL
 * 
 * A Secretaria vê:
 * - Evolução da cidade
 * - Escolas com dificuldade
 * - Participação
 * - Desempenho por matéria
 * - Relatórios automáticos
 * - Indicadores educacionais
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

interface CityMetrics {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  averageGrade: number;
  participationRate: number;
  platformAdoption: number;
  improvementRate: number;
}

interface SchoolPerformance {
  name: string;
  students: number;
  grade: number;
  participation: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

interface SubjectPerformance {
  subject: string;
  average: number;
  trend: number; // percentual de melhora
  schools: number;
}

interface EvolutionData {
  month: string;
  average: number;
  participation: number;
  schools: number;
}

export default function MunicipalSecretariatDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'schools' | 'subjects' | 'evolution' | 'reports'>('overview');
  const [cityMetrics, setCityMetrics] = useState<CityMetrics | null>(null);
  const [schoolData, setSchoolData] = useState<SchoolPerformance[]>([]);
  const [subjectData, setSubjectData] = useState<SubjectPerformance[]>([]);
  const [evolutionData, setEvolutionData] = useState<EvolutionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setCityMetrics({
        totalSchools: 45,
        totalStudents: 12500,
        totalTeachers: 850,
        averageGrade: 7.4,
        participationRate: 78,
        platformAdoption: 82,
        improvementRate: 15,
      });

      setSchoolData([
        { name: 'EMEF João Paulo II', students: 450, grade: 8.5, participation: 95, trend: 'up', status: 'excellent' },
        { name: 'EMEF Tiradentes', students: 380, grade: 7.8, participation: 85, trend: 'up', status: 'good' },
        { name: 'EMEF Getúlio Vargas', students: 320, grade: 6.9, participation: 65, trend: 'down', status: 'warning' },
        { name: 'EMEF Ayrton Senna', students: 410, grade: 7.2, participation: 72, trend: 'stable', status: 'warning' },
        { name: 'EMEF Pelé', students: 390, grade: 8.1, participation: 88, trend: 'up', status: 'good' },
        { name: 'EMEF Machado de Assis', students: 280, grade: 5.8, participation: 45, trend: 'down', status: 'critical' },
      ]);

      setSubjectData([
        { subject: 'Português', average: 7.8, trend: 12, schools: 45 },
        { subject: 'Matemática', average: 6.9, trend: -5, schools: 45 },
        { subject: 'Ciências', average: 7.5, trend: 18, schools: 45 },
        { subject: 'História', average: 7.6, trend: 8, schools: 45 },
        { subject: 'Geografia', average: 7.4, trend: 10, schools: 45 },
        { subject: 'Inglês', average: 6.8, trend: 22, schools: 35 },
      ]);

      setEvolutionData([
        { month: 'Jan', average: 6.8, participation: 65, schools: 35 },
        { month: 'Fev', average: 6.9, participation: 68, schools: 38 },
        { month: 'Mar', average: 7.1, participation: 72, schools: 40 },
        { month: 'Abr', average: 7.2, participation: 74, schools: 42 },
        { month: 'Mai', average: 7.3, participation: 76, schools: 43 },
        { month: 'Jun', average: 7.4, participation: 78, schools: 45 },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const tabs = [
    { id: 'overview', label: '📊 Visão Geral', icon: '📊' },
    { id: 'schools', label: '🏫 Escolas', icon: '🏫' },
    { id: 'subjects', label: '📚 Matérias', icon: '📚' },
    { id: 'evolution', label: '📈 Evolução', icon: '📈' },
    { id: 'reports', label: '📋 Relatórios', icon: '📋' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return '#10b981';
      case 'good':
        return '#3b82f6';
      case 'warning':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Excelente';
      case 'good':
        return 'Bom';
      case 'warning':
        return 'Atenção';
      case 'critical':
        return 'Crítico';
      default:
        return 'Desconhecido';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏛️ Secretaria Municipal de Educação</h1>
          <p className="text-gray-600">Acompanhe o desempenho educacional de toda a cidade</p>
        </motion.div>

        {/* Métricas Principais */}
        {activeTab === 'overview' && cityMetrics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Escolas', value: cityMetrics.totalSchools, icon: '🏫', color: 'from-blue-500 to-blue-600' },
              { label: 'Alunos', value: cityMetrics.totalStudents, icon: '👥', color: 'from-purple-500 to-purple-600' },
              { label: 'Professores', value: cityMetrics.totalTeachers, icon: '👨‍🏫', color: 'from-pink-500 to-pink-600' },
              { label: 'Média Geral', value: `${cityMetrics.averageGrade.toFixed(1)}`, icon: '📈', color: 'from-green-500 to-green-600' },
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-br ${metric.color} text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="text-3xl mb-2">{metric.icon}</div>
                <div className="text-sm opacity-90">{metric.label}</div>
                <div className="text-3xl font-bold">{metric.value}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Abas */}
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

        {/* Conteúdo */}
        <AnimatePresence mode="wait">
          {/* Visão Geral */}
          {activeTab === 'overview' && cityMetrics && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Indicadores Principais */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Indicadores Principais</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Taxa de Participação', value: cityMetrics.participationRate, color: 'bg-blue-500' },
                    { label: 'Adoção da Plataforma', value: cityMetrics.platformAdoption, color: 'bg-purple-500' },
                    { label: 'Taxa de Melhora', value: cityMetrics.improvementRate, color: 'bg-green-500' },
                  ].map((indicator, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-semibold">{indicator.label}</span>
                        <span className="text-gray-900 font-bold">{indicator.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${indicator.color} h-2 rounded-full transition-all`}
                          style={{ width: `${indicator.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribuição de Escolas por Status */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🏫 Status das Escolas</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Excelente', value: 8, fill: '#10b981' },
                        { name: 'Bom', value: 18, fill: '#3b82f6' },
                        { name: 'Atenção', value: 15, fill: '#f59e0b' },
                        { name: 'Crítico', value: 4, fill: '#ef4444' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {[0, 1, 2, 3].map((index) => (
                        <Cell key={`cell-${index}`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Escolas */}
          {activeTab === 'schools' && (
            <motion.div key="schools" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-4">
                {schoolData.map((school, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4"
                    style={{ borderColor: getStatusColor(school.status) }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{school.name}</h4>
                        <p className="text-gray-600">{school.students} alunos</p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                        style={{ backgroundColor: getStatusColor(school.status) }}
                      >
                        {getStatusLabel(school.status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Média</p>
                        <p className="text-2xl font-bold text-indigo-600">{school.grade.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Participação</p>
                        <p className="text-2xl font-bold text-purple-600">{school.participation}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tendência</p>
                        <p className={`text-2xl font-bold ${school.trend === 'up' ? 'text-green-600' : school.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                          {school.trend === 'up' ? '📈' : school.trend === 'down' ? '📉' : '➡️'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Matérias */}
          {activeTab === 'subjects' && (
            <motion.div key="subjects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">📚 Desempenho por Matéria</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average" fill="#6366f1" name="Média" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Evolução */}
          {activeTab === 'evolution' && (
            <motion.div key="evolution" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Evolução da Cidade (Últimos 6 Meses)</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="average" stroke="#6366f1" name="Média Geral" strokeWidth={2} />
                    <Line type="monotone" dataKey="participation" stroke="#8b5cf6" name="Participação %" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Relatórios */}
          {activeTab === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: '📊 Relatório Mensal', description: 'Desempenho geral da cidade', date: 'Junho 2024' },
                  { title: '🎯 Análise de Metas', description: 'Progresso em relação às metas', date: 'Junho 2024' },
                  { title: '⚠️ Escolas em Risco', description: 'Escolas que precisam de intervenção', date: 'Junho 2024' },
                  { title: '📈 Tendências', description: 'Análise de tendências educacionais', date: 'Junho 2024' },
                ].map((report, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{report.title}</h4>
                    <p className="text-gray-600 mb-4">{report.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{report.date}</span>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Baixar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
