'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdaptiveText from '@/components/AdaptiveText';
import AdaptiveButton from '@/components/AdaptiveButton';
import { useToast } from '@/components/ui/use-toast';

/**
 * TeacherLibrary.tsx - Biblioteca Compartilhada de Professores
 * 
 * Professores podem:
 * - Criar atividade
 * - Compartilhar
 * - Copiar de outro professor
 * - Adaptar exercício
 * - Salvar planejamento
 */

interface Activity {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  author: string;
  authorId: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // minutos
  downloads: number;
  likes: number;
  shared: boolean;
  createdAt: string;
  tags: string[];
}

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: number; // semanas
  activities: Activity[];
  author: string;
  downloads: number;
}

const TeacherLibrary: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      title: 'Jogo de Fração Usando Pizza',
      description: 'Alunos aprendem frações dividindo pizza em partes',
      subject: 'Matemática',
      grade: '4º ano',
      author: 'Prof. Maria Silva',
      authorId: 'prof_001',
      content: 'Atividade interativa com pizza dividida em pedaços...',
      difficulty: 'easy',
      duration: 30,
      downloads: 245,
      likes: 89,
      shared: true,
      createdAt: '2024-01-15',
      tags: ['frações', 'matemática', 'interativo'],
    },
    {
      id: '2',
      title: 'Caça-Palavras Temático',
      description: 'Caça-palavras com vocabulário de animais',
      subject: 'Português',
      grade: '3º ano',
      author: 'Prof. João Santos',
      authorId: 'prof_002',
      content: 'Caça-palavras com 20 palavras de animais...',
      difficulty: 'easy',
      duration: 20,
      downloads: 156,
      likes: 62,
      shared: true,
      createdAt: '2024-01-10',
      tags: ['vocabulário', 'português', 'animais'],
    },
  ]);

  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([
    {
      id: 'lp_1',
      title: 'Plano de Aula: Frações - 4º ano',
      subject: 'Matemática',
      grade: '4º ano',
      duration: 2,
      activities: activities.slice(0, 1),
      author: 'Prof. Maria Silva',
      downloads: 128,
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState<string | null>(null);
  const [filterGrade, setFilterGrade] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || activity.subject === filterSubject;
    const matchesGrade = !filterGrade || activity.grade === filterGrade;

    return matchesSearch && matchesSubject && matchesGrade;
  });

  const handleCopyActivity = (activity: Activity) => {
    const newActivity: Activity = {
      ...activity,
      id: `activity_${Date.now()}`,
      title: `${activity.title} (Cópia)`,
      author: 'Você',
      authorId: 'current_user',
      downloads: 0,
      likes: 0,
      shared: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setActivities([...activities, newActivity]);
    toast({
      title: '✅ Atividade copiada!',
      description: `"${activity.title}" foi copiada para sua biblioteca`,
      variant: 'success',
    });
  };

  const handleLikeActivity = (activityId: string) => {
    setActivities(
      activities.map((a) =>
        a.id === activityId ? { ...a, likes: a.likes + 1 } : a
      )
    );
  };

  const handleShareActivity = (activityId: string) => {
    setActivities(
      activities.map((a) =>
        a.id === activityId ? { ...a, shared: !a.shared } : a
      )
    );

    const activity = activities.find((a) => a.id === activityId);
    toast({
      title: activity?.shared ? '🔒 Privado' : '🌍 Compartilhado',
      description: `Atividade "${activity?.title}" agora é ${activity?.shared ? 'privada' : 'compartilhada'}`,
      variant: 'success',
    });
  };

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <AdaptiveText variant="heading" className="text-4xl mb-2">
            📚 Biblioteca Compartilhada de Professores
          </AdaptiveText>
          <AdaptiveText variant="subheading" className="text-gray-600">
            Compartilhe, copie e adapte atividades com a comunidade de professores
          </AdaptiveText>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">📖</div>
            <div className="text-3xl font-bold text-green-600">{activities.length}</div>
            <div className="text-gray-600">Atividades Disponíveis</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">📋</div>
            <div className="text-3xl font-bold text-blue-600">{lessonPlans.length}</div>
            <div className="text-gray-600">Planos de Aula</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-purple-600">
              {new Set(activities.map((a) => a.authorId)).size}
            </div>
            <div className="text-gray-600">Professores Contribuindo</div>
          </div>
        </motion.div>

        {/* Create Button */}
        <motion.div variants={itemVariants} className="mb-8">
          <AdaptiveButton
            onClick={() => setShowCreateForm(!showCreateForm)}
            icon="➕"
          >
            Criar Nova Atividade
          </AdaptiveButton>
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Buscar atividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />

            <select
              value={filterSubject || ''}
              onChange={(e) => setFilterSubject(e.target.value || null)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            >
              <option value="">Todas as Matérias</option>
              <option value="Matemática">Matemática</option>
              <option value="Português">Português</option>
              <option value="Ciências">Ciências</option>
              <option value="História">História</option>
            </select>

            <select
              value={filterGrade || ''}
              onChange={(e) => setFilterGrade(e.target.value || null)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            >
              <option value="">Todas as Séries</option>
              <option value="3º ano">3º ano</option>
              <option value="4º ano">4º ano</option>
              <option value="5º ano">5º ano</option>
              <option value="6º ano">6º ano</option>
            </select>
          </div>
        </motion.div>

        {/* Activities Grid */}
        <motion.div variants={itemVariants} className="space-y-4">
          <AdaptiveText variant="heading" className="text-2xl mb-4">
            📖 Atividades Compartilhadas
          </AdaptiveText>

          {filteredActivities.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <AdaptiveText variant="body">
                Nenhuma atividade encontrada. Tente ajustar os filtros!
              </AdaptiveText>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-xl font-bold text-gray-800">{activity.title}</div>
                      <div className="text-sm text-gray-600">
                        por {activity.author}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        activity.difficulty === 'easy'
                          ? 'bg-green-100 text-green-800'
                          : activity.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {activity.difficulty === 'easy'
                        ? 'Fácil'
                        : activity.difficulty === 'medium'
                          ? 'Médio'
                          : 'Difícil'}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{activity.description}</p>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">Matéria:</span>
                      <div className="font-bold">{activity.subject}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Série:</span>
                      <div className="font-bold">{activity.grade}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Duração:</span>
                      <div className="font-bold">{activity.duration} min</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Downloads:</span>
                      <div className="font-bold">{activity.downloads}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    {activity.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLikeActivity(activity.id)}
                      className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-bold"
                    >
                      ❤️ {activity.likes}
                    </button>
                    <button
                      onClick={() => handleShareActivity(activity.id)}
                      className={`flex-1 px-3 py-2 rounded-lg transition-colors font-bold ${
                        activity.shared
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {activity.shared ? '🌍 Compartilhado' : '🔒 Privado'}
                    </button>
                    <button
                      onClick={() => handleCopyActivity(activity)}
                      className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-bold"
                    >
                      📋 Copiar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Lesson Plans */}
        <motion.div variants={itemVariants} className="mt-12 space-y-4">
          <AdaptiveText variant="heading" className="text-2xl mb-4">
            📋 Planos de Aula Compartilhados
          </AdaptiveText>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessonPlans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="text-xl font-bold text-gray-800 mb-2">{plan.title}</div>
                <div className="text-sm text-gray-600 mb-4">por {plan.author}</div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Matéria</span>
                    <div className="font-bold">{plan.subject}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Série</span>
                    <div className="font-bold">{plan.grade}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Duração</span>
                    <div className="font-bold">{plan.duration} semanas</div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-gray-600 text-sm">Atividades incluídas:</span>
                  <div className="font-bold">{plan.activities.length} atividades</div>
                </div>

                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-bold">
                  📥 Usar Plano
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TeacherLibrary;
