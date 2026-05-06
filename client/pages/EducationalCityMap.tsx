'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdaptiveText from '@/components/AdaptiveText';

/**
 * EducationalCityMap.tsx - Mapa Educacional da Cidade
 * 
 * Dashboard para Secretaria de Educação visualizar:
 * - Matemática caiu no 6º ano
 * - Português melhorou no 4º
 * - Escola X está sem adesão
 * - Escola Y evoluiu 23%
 */

interface SchoolMetrics {
  id: string;
  name: string;
  district: string;
  studentCount: number;
  adhesionRate: number; // 0-100%
  evolution: number; // -100 a +100%
  subjectPerformance: Record<string, number>; // 0-100
  trend: 'up' | 'down' | 'stable';
}

interface SubjectTrend {
  subject: string;
  grade: string;
  previousScore: number;
  currentScore: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

const EducationalCityMap: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester' | 'year'>('month');

  // Dados simulados
  const schools: SchoolMetrics[] = [
    {
      id: '1',
      name: 'Escola Municipal Centro',
      district: 'Centro',
      studentCount: 450,
      adhesionRate: 92,
      evolution: 23,
      subjectPerformance: {
        portugues: 78,
        matematica: 65,
        ciencias: 72,
        historia: 81,
        geografia: 75,
      },
      trend: 'up',
    },
    {
      id: '2',
      name: 'Escola Estadual Zona Norte',
      district: 'Zona Norte',
      studentCount: 320,
      adhesionRate: 45,
      evolution: -12,
      subjectPerformance: {
        portugues: 62,
        matematica: 48,
        ciencias: 55,
        historia: 60,
        geografia: 58,
      },
      trend: 'down',
    },
    {
      id: '3',
      name: 'Escola Particular Elite',
      district: 'Zona Sul',
      studentCount: 280,
      adhesionRate: 98,
      evolution: 15,
      subjectPerformance: {
        portugues: 89,
        matematica: 85,
        ciencias: 88,
        historia: 87,
        geografia: 86,
      },
      trend: 'up',
    },
  ];

  const subjectTrends: SubjectTrend[] = [
    {
      subject: 'Matemática',
      grade: '6º ano',
      previousScore: 72,
      currentScore: 58,
      change: -14,
      trend: 'down',
    },
    {
      subject: 'Português',
      grade: '4º ano',
      previousScore: 68,
      currentScore: 82,
      change: 14,
      trend: 'up',
    },
    {
      subject: 'Ciências',
      grade: '8º ano',
      previousScore: 65,
      currentScore: 71,
      change: 6,
      trend: 'up',
    },
    {
      subject: 'História',
      grade: '7º ano',
      previousScore: 75,
      currentScore: 73,
      change: -2,
      trend: 'stable',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <AdaptiveText variant="heading" className="text-4xl mb-2">
            🗺️ Mapa Educacional da Cidade
          </AdaptiveText>
          <AdaptiveText variant="subheading" className="text-gray-600">
            Visualize o desempenho de todas as escolas da rede
          </AdaptiveText>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div variants={itemVariants} className="flex gap-2 mb-8">
          {(['week', 'month', 'semester', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                timeRange === range
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range === 'week'
                ? 'Semana'
                : range === 'month'
                  ? 'Mês'
                  : range === 'semester'
                    ? 'Semestre'
                    : 'Ano'}
            </button>
          ))}
        </motion.div>

        {/* KPIs */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">🏫</div>
            <div className="text-3xl font-bold text-blue-600">{schools.length}</div>
            <div className="text-gray-600">Escolas Ativas</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-purple-600">
              {schools.reduce((acc, s) => acc + s.studentCount, 0)}
            </div>
            <div className="text-gray-600">Total de Alunos</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-3xl font-bold text-green-600">
              {(
                schools.reduce((acc, s) => acc + s.adhesionRate, 0) / schools.length
              ).toFixed(0)}
              %
            </div>
            <div className="text-gray-600">Adesão Média</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-yellow-600">
              {(
                schools.reduce((acc, s) => acc + s.evolution, 0) / schools.length
              ).toFixed(0)}
              %
            </div>
            <div className="text-gray-600">Evolução Média</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schools List */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            <AdaptiveText variant="heading" className="text-2xl mb-4">
              📊 Desempenho das Escolas
            </AdaptiveText>

            {schools.map((school) => (
              <motion.div
                key={school.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedSchool(school.id)}
                className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all ${
                  selectedSchool === school.id ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xl font-bold text-gray-800">{school.name}</div>
                    <div className="text-sm text-gray-600">{school.district}</div>
                  </div>
                  <div
                    className={`text-2xl ${
                      school.trend === 'up'
                        ? 'text-green-500'
                        : school.trend === 'down'
                          ? 'text-red-500'
                          : 'text-gray-500'
                    }`}
                  >
                    {school.trend === 'up' ? '📈' : school.trend === 'down' ? '📉' : '➡️'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Alunos</div>
                    <div className="text-2xl font-bold">{school.studentCount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Adesão</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {school.adhesionRate}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Evolução</div>
                    <div
                      className={`text-2xl font-bold ${
                        school.evolution > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {school.evolution > 0 ? '+' : ''}
                      {school.evolution}%
                    </div>
                  </div>
                </div>

                {/* Subject Performance */}
                <div className="space-y-2">
                  {Object.entries(school.subjectPerformance).map(([subject, score]) => (
                    <div key={subject} className="flex items-center gap-3">
                      <span className="w-20 text-sm font-medium capitalize">
                        {subject === 'portugues'
                          ? 'Português'
                          : subject === 'matematica'
                            ? 'Matemática'
                            : subject.charAt(0).toUpperCase() + subject.slice(1)}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            score >= 80
                              ? 'bg-green-500'
                              : score >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="w-10 text-right font-bold">{score}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Subject Trends */}
          <motion.div variants={itemVariants} className="space-y-4">
            <AdaptiveText variant="heading" className="text-2xl mb-4">
              📚 Tendências por Matéria
            </AdaptiveText>

            {subjectTrends.map((trend, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-gray-800">{trend.subject}</div>
                    <div className="text-sm text-gray-600">{trend.grade}</div>
                  </div>
                  <div
                    className={`text-2xl ${
                      trend.trend === 'up'
                        ? 'text-green-500'
                        : trend.trend === 'down'
                          ? 'text-red-500'
                          : 'text-gray-500'
                    }`}
                  >
                    {trend.trend === 'up' ? '📈' : trend.trend === 'down' ? '📉' : '➡️'}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Anterior</span>
                    <span className="font-bold">{trend.previousScore}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Atual</span>
                    <span className="font-bold">{trend.currentScore}%</span>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`text-lg font-bold ${
                      trend.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {trend.change > 0 ? '+' : ''}
                    {trend.change}%
                  </div>
                  <div className="text-xs text-gray-600">
                    {trend.change > 0 ? 'Melhora' : 'Queda'} em relação ao período anterior
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Alerts */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-red-50 border-2 border-red-300 rounded-lg p-4"
            >
              <div className="font-bold text-red-800 mb-2">⚠️ Alertas</div>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Matemática caiu 14% no 6º ano</li>
                <li>• Escola Zona Norte com baixa adesão (45%)</li>
                <li>• Ciências precisa de reforço no 8º ano</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default EducationalCityMap;
