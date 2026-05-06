'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { trpc } from '../utils/trpc';
import { useToast } from '@/components/ui/use-toast';

/**
 * AdminPanel.tsx - Painel Admin para Gerenciar Conteúdo
 * 
 * Funcionalidades:
 * - Gerenciar Aulas
 * - Gerenciar Quizzes
 * - Gerenciar Livros
 * - Gerenciar Minijogos
 * - Visualizar Estatísticas
 * - Gerenciar Usuários
 */

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  xp: number;
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  rating: number;
}

interface Minigame {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  reward: number;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lessons');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [minigames, setMinigames] = useState<Minigame[]>([]);
  const { toast } = useToast();

  const handleAddLesson = () => {
    if (!formData.title || !formData.category) {
      toast({
        title: '❌ Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const newLesson: Lesson = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      difficulty: formData.difficulty || 'médio',
      duration: formData.duration || 30,
      xp: formData.xp || 100,
    };

    setLessons([...lessons, newLesson]);
    setFormData({});
    setShowForm(false);

    toast({
      title: '✅ Aula Adicionada',
      description: `"${newLesson.title}" foi adicionada com sucesso`,
      duration: 2000,
    });
  };

  const handleAddQuiz = () => {
    if (!formData.question || !formData.options || !formData.correctAnswer) {
      toast({
        title: '❌ Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const newQuiz: Quiz = {
      id: Math.random().toString(36).substr(2, 9),
      question: formData.question,
      options: formData.options.split(',').map((o: string) => o.trim()),
      correctAnswer: parseInt(formData.correctAnswer),
      category: formData.category || 'Geral',
    };

    setQuizzes([...quizzes, newQuiz]);
    setFormData({});
    setShowForm(false);

    toast({
      title: '✅ Quiz Adicionado',
      description: 'Nova questão foi adicionada com sucesso',
      duration: 2000,
    });
  };

  const handleAddBook = () => {
    if (!formData.title || !formData.author) {
      toast({
        title: '❌ Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const newBook: Book = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      author: formData.author,
      category: formData.category || 'Geral',
      rating: formData.rating || 0,
    };

    setBooks([...books, newBook]);
    setFormData({});
    setShowForm(false);

    toast({
      title: '✅ Livro Adicionado',
      description: `"${newBook.title}" foi adicionado com sucesso`,
      duration: 2000,
    });
  };

  const handleAddMinigame = () => {
    if (!formData.title) {
      toast({
        title: '❌ Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const newMinigame: Minigame = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      category: formData.category || 'Geral',
      difficulty: formData.difficulty || 1,
      reward: formData.reward || 100,
    };

    setMinigames([...minigames, newMinigame]);
    setFormData({});
    setShowForm(false);

    toast({
      title: '✅ Minijogo Adicionado',
      description: `"${newMinigame.title}" foi adicionado com sucesso`,
      duration: 2000,
    });
  };

  const handleDelete = (type: string, id: string) => {
    switch (type) {
      case 'lesson':
        setLessons(lessons.filter(l => l.id !== id));
        break;
      case 'quiz':
        setQuizzes(quizzes.filter(q => q.id !== id));
        break;
      case 'book':
        setBooks(books.filter(b => b.id !== id));
        break;
      case 'minigame':
        setMinigames(minigames.filter(m => m.id !== id));
        break;
    }

    toast({
      title: '🗑️ Deletado',
      description: 'Item foi removido com sucesso',
      duration: 1500,
    });
  };

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
            ⚙️ Painel Admin
          </h1>
          <p className="text-gray-400">Gerencie o conteúdo educacional</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Aulas', value: lessons.length, icon: '📚', color: 'from-blue-500 to-cyan-500' },
            { label: 'Quizzes', value: quizzes.length, icon: '📝', color: 'from-purple-500 to-pink-500' },
            { label: 'Livros', value: books.length, icon: '📖', color: 'from-yellow-500 to-orange-500' },
            { label: 'Minijogos', value: minigames.length, icon: '🎮', color: 'from-green-500 to-emerald-500' },
          ].map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
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
            {['lessons', 'quizzes', 'books', 'minigames'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-400 hover:text-white"
              >
                {tab === 'lessons' && '📚 Aulas'}
                {tab === 'quizzes' && '📝 Quizzes'}
                {tab === 'books' && '📖 Livros'}
                {tab === 'minigames' && '🎮 Minijogos'}
              </TabsTrigger>
            ))}
          </TabsList>
        </motion.div>

        {/* Add Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            {showForm ? '✕ Cancelar' : '+ Adicionar'}
          </motion.button>
        </motion.div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Título"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Categoria"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                />
                <textarea
                  placeholder="Descrição"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none col-span-1 md:col-span-2"
                />
                {activeTab === 'lessons' && (
                  <>
                    <select
                      value={formData.difficulty || 'médio'}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="fácil">Fácil</option>
                      <option value="médio">Médio</option>
                      <option value="difícil">Difícil</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Duração (min)"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="XP"
                      value={formData.xp || ''}
                      onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) })}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    />
                  </>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (activeTab === 'lessons') handleAddLesson();
                  else if (activeTab === 'quizzes') handleAddQuiz();
                  else if (activeTab === 'books') handleAddBook();
                  else if (activeTab === 'minigames') handleAddMinigame();
                }}
                className="mt-4 w-full px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all"
              >
                ✅ Salvar
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Lessons Tab */}
            <TabsContent value="lessons" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessons.map((lesson) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50"
                  >
                    <h3 className="font-bold text-white mb-2">{lesson.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{lesson.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500">{lesson.category}</span>
                      <span className="text-xs font-bold text-amber-400">⭐ {lesson.xp} XP</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete('lesson', lesson.id)}
                      className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-lg transition-colors"
                    >
                      🗑️ Deletar
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map((quiz) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50"
                  >
                    <p className="font-bold text-white mb-3">{quiz.question}</p>
                    <div className="space-y-1 mb-3">
                      {quiz.options.map((option, idx) => (
                        <p key={idx} className={`text-sm ${idx === quiz.correctAnswer ? 'text-green-400' : 'text-gray-400'}`}>
                          {String.fromCharCode(65 + idx)}) {option}
                        </p>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete('quiz', quiz.id)}
                      className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-lg transition-colors"
                    >
                      🗑️ Deletar
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Books Tab */}
            <TabsContent value="books" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map((book) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50"
                  >
                    <h3 className="font-bold text-white mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{book.author}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500">{book.category}</span>
                      <span className="text-xs font-bold text-yellow-400">⭐ {book.rating}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete('book', book.id)}
                      className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-lg transition-colors"
                    >
                      🗑️ Deletar
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Minigames Tab */}
            <TabsContent value="minigames" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {minigames.map((game) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50"
                  >
                    <h3 className="font-bold text-white mb-2">{game.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{game.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500">Nível {game.difficulty}</span>
                      <span className="text-xs font-bold text-amber-400">⭐ {game.reward} XP</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete('minigame', game.id)}
                      className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-lg transition-colors"
                    >
                      🗑️ Deletar
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
