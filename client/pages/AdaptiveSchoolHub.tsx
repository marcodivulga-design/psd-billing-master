/**
 * AdaptiveSchoolHub.tsx
 * 
 * ESCOLA INTELIGENTE ADAPTATIVA
 * 
 * Hub Central que integra:
 * - Sistema de aprendizado adaptativo
 * - Visual evolutivo
 * - Onboarding mágico
 * - Dashboard inteligente
 * - Gamificação leve
 * - Componentes humanizados
 * - Identidade visual única
 * 
 * Conceito: Um sistema que aprende junto com a escola
 * Quanto mais usa, mais inteligente fica
 * E o visual acompanha essa evolução
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Award, Users, BookOpen, Zap, Heart, Brain } from 'lucide-react';

interface SchoolData {
  schoolId: string;
  schoolName: string;
  intelligenceScore: number; // 0-100
  evolutionLevel: number; // 1-6
  totalUsers: number;
  activeUsers: number;
  engagementScore: number;
  contentEffectiveness: number;
  teacherSatisfaction: number;
  studentProgress: number;
}

const AdaptiveSchoolHub: React.FC = () => {
  const [schoolData, setSchoolData] = useState<SchoolData>({
    schoolId: 'school_001',
    schoolName: 'Escola Inteligente Adaptativa',
    intelligenceScore: 65,
    evolutionLevel: 4,
    totalUsers: 245,
    activeUsers: 189,
    engagementScore: 78,
    contentEffectiveness: 82,
    teacherSatisfaction: 85,
    studentProgress: 79,
  });

  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Simula aumento de inteligência ao longo do tempo
    const interval = setInterval(() => {
      setSchoolData(prev => ({
        ...prev,
        intelligenceScore: Math.min(prev.intelligenceScore + Math.random() * 2, 100),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getEvolutionMilestone = (level: number) => {
    const milestones = [
      'Iniciante - Aprendendo com você',
      'Básico - Entendendo padrões',
      'Intermediário - Fazendo recomendações',
      'Avançado - Otimizando resultados',
      'Especialista - Transformando educação',
      'Mestre - Revolucionando aprendizado',
    ];
    return milestones[Math.min(level - 1, 5)];
  };

  const getThemeColors = (level: number) => {
    const themes = [
      { primary: '#FF6B6B', secondary: '#4ECDC4' },
      { primary: '#6C5CE7', secondary: '#00B894' },
      { primary: '#5F27CD', secondary: '#00D2D3' },
      { primary: '#2E86AB', secondary: '#A23B72' },
      { primary: '#1A365D', secondary: '#6B46C1' },
      { primary: '#0F172A', secondary: '#7C3AED' },
    ];
    return themes[Math.min(level - 1, 5)];
  };

  const colors = getThemeColors(schoolData.evolutionLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header com Logo Evolutivo */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">{schoolData.schoolName}</h1>
              <p className="text-xs text-gray-500">{getEvolutionMilestone(schoolData.evolutionLevel)}</p>
            </div>
          </motion.div>

          {/* Indicador de Evolução */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">Nível {schoolData.evolutionLevel}</p>
              <p className="text-xs text-gray-500">{Math.round(schoolData.intelligenceScore)}% Inteligência</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
              {schoolData.evolutionLevel}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Seção de Boas-vindas */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12 p-6 bg-white rounded-lg shadow-lg border-l-4"
              style={{ borderColor: colors.primary }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Bem-vindo à Escola Inteligente Adaptativa! 🎓
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Quanto mais você usa, mais inteligente a plataforma fica. Seu sistema está evoluindo constantemente para oferecer a melhor experiência educacional.
                  </p>
                  <div className="flex gap-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Explorar Recursos
                    </button>
                    <button
                      onClick={() => setShowWelcome(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Brain className="w-12 h-12 text-purple-500" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Users, label: 'Usuários Ativos', value: schoolData.activeUsers, total: schoolData.totalUsers, color: 'from-blue-500 to-cyan-500' },
            { icon: TrendingUp, label: 'Engajamento', value: `${schoolData.engagementScore}%`, color: 'from-green-500 to-emerald-500' },
            { icon: BookOpen, label: 'Efetividade', value: `${schoolData.contentEffectiveness}%`, color: 'from-purple-500 to-pink-500' },
            { icon: Award, label: 'Satisfação', value: `${schoolData.teacherSatisfaction}%`, color: 'from-orange-500 to-red-500' },
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {metric.value}
                  {metric.total && <span className="text-sm text-gray-500">/{metric.total}</span>}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Barra de Evolução */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Evolução da Plataforma</h3>
            <span className="text-sm font-bold text-gray-600">
              {Math.round(schoolData.intelligenceScore)}% Inteligência
            </span>
          </div>

          {/* Barra de Progresso */}
          <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden mb-4">
            <motion.div
              className={`h-full bg-gradient-to-r ${colors.primary} to-${colors.secondary} flex items-center justify-end pr-3`}
              initial={{ width: 0 }}
              animate={{ width: `${schoolData.intelligenceScore}%` }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-xs font-bold text-white">
                {Math.round(schoolData.intelligenceScore)}%
              </span>
            </motion.div>
          </div>

          {/* Níveis */}
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map(level => (
              <motion.div
                key={level}
                className={`p-3 rounded-lg text-center cursor-pointer transition-all ${
                  level <= schoolData.evolutionLevel
                    ? `bg-gradient-to-br ${colors.primary} to-${colors.secondary} text-white font-bold`
                    : 'bg-gray-100 text-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-lg">Nv {level}</div>
                <div className="text-xs opacity-75">
                  {level === 1 && 'Iniciante'}
                  {level === 2 && 'Básico'}
                  {level === 3 && 'Inter'}
                  {level === 4 && 'Avançado'}
                  {level === 5 && 'Expert'}
                  {level === 6 && 'Mestre'}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recomendações */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-6 bg-white rounded-lg shadow-md"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Recomendações Inteligentes
          </h3>

          <div className="space-y-3">
            {[
              { title: 'Aumentar Conteúdo de Matemática', desc: 'Detectamos alta demanda nesta matéria', impact: 85 },
              { title: 'Implementar Desafios Diários', desc: 'Aumentará engajamento em 23%', impact: 78 },
              { title: 'Criar Grupos de Estudo', desc: 'Professores solicitaram esta feature', impact: 72 },
            ].map((rec, index) => (
              <motion.div
                key={rec.title}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-800">{rec.title}</p>
                    <p className="text-sm text-gray-600">{rec.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-600">Impacto</p>
                    <p className="text-lg font-bold text-blue-600">{rec.impact}%</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>
            Escola Inteligente Adaptativa © 2024 | Sistema que aprende junto com você
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdaptiveSchoolHub;
