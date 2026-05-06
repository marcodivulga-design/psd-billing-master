'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { trpc } from '../utils/trpc';
import { useToast } from '@/components/ui/use-toast';

/**
 * Lessons.tsx - Página de Aulas com Design Premium
 * 
 * Características:
 * - Design premium com gradientes sofisticados
 * - Animações Framer Motion entre tabs
 * - Notificações visuais de progresso
 * - Responsividade mobile-first
 * - Integração com gamificação
 */

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
  duration: number;
  completed: boolean;
  xp: number;
  progress: number;
}

const Lessons: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { toast } = useToast();

  // Fetch lessons from tRPC
  const { data: lessonsData, isLoading } = trpc.lessons.getAll.useQuery();

  useEffect(() => {
    if (lessonsData) {
      setLessons(lessonsData);
    }
  }, [lessonsData]);

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    toast({
      title: '🚀 Aula Iniciada!',
      description: `Bem-vindo a "${lesson.title}"`,
      duration: 3000,
    });
  };

  const handleCompleteLesson = async (lesson: Lesson) => {
    try {
      // Call tRPC to mark lesson as complete
      await trpc.lessons.complete.mutate({ lessonId: lesson.id });
      
      // Update local state
      setLessons(lessons.map(l => 
        l.id === lesson.id ? { ...l, completed: true, progress: 100 } : l
      ));

      toast({
        title: '✨ Parabéns!',
        description: `Você ganhou ${lesson.xp} XP!`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: '❌ Erro',
        description: 'Não foi possível completar a aula',
        variant: 'destructive',
      });
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return lesson.completed;
    if (activeTab === 'in-progress') return !lesson.completed && lesson.progress > 0;
    if (activeTab === 'pending') return lesson.progress === 0;
    return lesson.category === activeTab;
  });

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'fácil':
        return 'from-green-500 to-emerald-600';
      case 'médio':
        return 'from-yellow-500 to-orange-600';
      case 'difícil':
        return 'from-red-500 to-pink-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-8">
      {/* Header com Gradiente Premium */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              🎓 Suas Aulas
            </h1>
            <p className="text-gray-400 text-lg">
              {lessons.length} aulas disponíveis • {lessons.filter(l => l.completed).length} concluídas
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-amber-400">
              {lessons.reduce((sum, l) => sum + (l.completed ? l.xp : 0), 0)} XP
            </div>
            <p className="text-gray-400 text-sm">Total ganho</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs com Animações */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <TabsList className="grid w-full grid-cols-5 gap-2 bg-slate-800/50 backdrop-blur-md p-2 rounded-xl border border-slate-700/50 mb-8">
            {['all', 'pending', 'in-progress', 'completed', 'categories'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-400 hover:text-white"
              >
                {tab === 'all' && '📚 Todas'}
                {tab === 'pending' && '⏳ Pendentes'}
                {tab === 'in-progress' && '▶️ Em Progresso'}
                {tab === 'completed' && '✅ Concluídas'}
                {tab === 'categories' && '🏷️ Categorias'}
              </TabsTrigger>
            ))}
          </TabsList>
        </motion.div>

        {/* Conteúdo das Tabs com Animações */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full"
                  />
                </div>
              ) : filteredLessons.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-400 text-lg">Nenhuma aula encontrada nesta categoria</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      onClick={() => handleStartLesson(lesson)}
                      className="group cursor-pointer"
                    >
                      <div className={`bg-gradient-to-br ${getDifficultyColor(lesson.difficulty)} p-0.5 rounded-xl`}>
                        <div className="bg-slate-900 rounded-[10px] p-6 h-full flex flex-col justify-between hover:bg-slate-800/50 transition-colors">
                          {/* Header do Card */}
                          <div className="mb-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                                  {lesson.title}
                                </h3>
                                <p className="text-sm text-gray-400">{lesson.category}</p>
                              </div>
                              <div className="text-2xl ml-2">
                                {lesson.completed ? '✅' : '⏳'}
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 line-clamp-2">{lesson.description}</p>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-400">Progresso</span>
                              <span className="text-xs font-bold text-purple-400">{lesson.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${lesson.progress}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                              />
                            </div>
                          </div>

                          {/* Footer do Card */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">⏱️</span>
                              <span className="text-sm text-gray-400">{lesson.duration} min</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-amber-400">⭐</span>
                              <span className="text-sm font-bold text-amber-400">{lesson.xp} XP</span>
                            </div>
                          </div>

                          {/* Button de Ação */}
                          {lesson.completed ? (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="mt-4 w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all"
                            >
                              ✅ Revisitar
                            </motion.button>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompleteLesson(lesson);
                              }}
                              className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                            >
                              ▶️ Iniciar
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Modal de Aula Selecionada */}
      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLesson(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700"
            >
              <h2 className="text-2xl font-bold text-white mb-4">{selectedLesson.title}</h2>
              <p className="text-gray-300 mb-6">{selectedLesson.description}</p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedLesson(null)}
                  className="flex-1 py-2 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Fechar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleCompleteLesson(selectedLesson);
                    setSelectedLesson(null);
                  }}
                  className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Começar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Lessons;
