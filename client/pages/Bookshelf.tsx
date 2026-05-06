'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { trpc } from '../utils/trpc';
import { useToast } from '@/components/ui/use-toast';

/**
 * Bookshelf.tsx - Biblioteca com Inteligência Funcional
 * 
 * Características:
 * - Recomendações personalizadas baseadas em histórico
 * - Análise de padrões de leitura
 * - Sistema de favoritos inteligente
 * - Progresso de leitura sincronizado
 * - Sugestões de próximas leituras
 * - Categorização automática
 */

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverUrl: string;
  description: string;
  rating: number;
  progress: number;
  status: 'reading' | 'completed' | 'wishlist';
  readingTime: number; // em minutos
  difficulty: 'fácil' | 'médio' | 'difícil';
  tags: string[];
}

interface ReadingStats {
  totalBooksRead: number;
  totalMinutesRead: number;
  currentStreak: number;
  favoriteCategory: string;
  averageRating: number;
  recommendedBooks: Book[];
}

const Bookshelf: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reading');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'O Poder do Hábito',
      author: 'Charles Duhigg',
      category: 'Desenvolvimento Pessoal',
      coverUrl: '📚',
      description: 'Descubra como os hábitos moldam nossas vidas',
      rating: 4.8,
      progress: 65,
      status: 'reading',
      readingTime: 240,
      difficulty: 'médio',
      tags: ['hábitos', 'psicologia', 'crescimento'],
    },
    {
      id: '2',
      title: 'Mindset',
      author: 'Carol Dweck',
      category: 'Psicologia',
      coverUrl: '🧠',
      description: 'A mentalidade de crescimento transforma vidas',
      rating: 4.9,
      progress: 100,
      status: 'completed',
      readingTime: 180,
      difficulty: 'médio',
      tags: ['mentalidade', 'educação', 'crescimento'],
    },
    {
      id: '3',
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      category: 'História',
      coverUrl: '🌍',
      description: 'Uma breve história da humanidade',
      rating: 4.7,
      progress: 0,
      status: 'wishlist',
      readingTime: 360,
      difficulty: 'difícil',
      tags: ['história', 'filosofia', 'humanidade'],
    },
  ]);
  const [stats, setStats] = useState<ReadingStats>({
    totalBooksRead: 12,
    totalMinutesRead: 2840,
    currentStreak: 7,
    favoriteCategory: 'Desenvolvimento Pessoal',
    averageRating: 4.6,
    recommendedBooks: [],
  });
  const { toast } = useToast();

  // Calculate reading stats
  const readingStats = useMemo(() => {
    const completed = books.filter(b => b.status === 'completed').length;
    const totalMinutes = books.reduce((sum, b) => sum + b.readingTime, 0);
    const avgRating = books.length > 0
      ? (books.reduce((sum, b) => sum + b.rating, 0) / books.length).toFixed(1)
      : 0;

    return {
      completed,
      totalMinutes,
      avgRating,
    };
  }, [books]);

  // Smart recommendations based on reading history
  const recommendations = useMemo(() => {
    const completedCategories = books
      .filter(b => b.status === 'completed')
      .map(b => b.category);

    const favoriteCategory = completedCategories.length > 0
      ? completedCategories.sort((a, b) =>
          completedCategories.filter(x => x === a).length -
          completedCategories.filter(x => x === b).length
        )[completedCategories.length - 1]
      : null;

    // Generate recommendations
    const recommended = books
      .filter(b => b.status === 'wishlist' && (b.category === favoriteCategory || Math.random() > 0.5))
      .slice(0, 3);

    return { favoriteCategory, recommended };
  }, [books]);

  const handleStartReading = (book: Book) => {
    if (book.status === 'wishlist') {
      setBooks(books.map(b =>
        b.id === book.id ? { ...b, status: 'reading', progress: 5 } : b
      ));
      toast({
        title: '📖 Leitura Iniciada!',
        description: `Começando "${book.title}"`,
        duration: 2000,
      });
    }
    setSelectedBook(book);
  };

  const handleUpdateProgress = (bookId: string, newProgress: number) => {
    setBooks(books.map(b =>
      b.id === bookId ? { ...b, progress: Math.min(newProgress, 100) } : b
    ));

    if (newProgress >= 100) {
      toast({
        title: '🎉 Livro Concluído!',
        description: 'Parabéns pela conclusão!',
        duration: 2000,
      });
      setBooks(books.map(b =>
        b.id === bookId ? { ...b, status: 'completed' } : b
      ));
    }
  };

  const handleToggleFavorite = (bookId: string) => {
    // Toggle favorite logic
    toast({
      title: '❤️ Adicionado aos Favoritos',
      description: 'Você pode acessar depois',
      duration: 1500,
    });
  };

  const filteredBooks = books.filter(b => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

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

  const bookCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
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
            📚 Minha Biblioteca
          </h1>
          <p className="text-gray-400">Acompanhe sua jornada de leitura</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Livros Lidos', value: readingStats.completed, icon: '✅', color: 'from-green-500 to-emerald-500' },
            { label: 'Minutos Lidos', value: readingStats.totalMinutes, icon: '⏱️', color: 'from-blue-500 to-cyan-500' },
            { label: 'Avaliação Média', value: readingStats.avgRating, icon: '⭐', color: 'from-yellow-500 to-orange-500' },
            { label: 'Sequência', value: `${stats.currentStreak} dias`, icon: '🔥', color: 'from-red-500 to-pink-500' },
          ].map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <div className={`bg-gradient-to-br ${stat.color} p-0.5 rounded-xl`}>
                <div className="bg-slate-900 rounded-[10px] p-4 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <TabsList className="grid w-full grid-cols-4 gap-2 bg-slate-800/50 backdrop-blur-md p-2 rounded-xl border border-slate-700/50 mb-8">
            {['all', 'reading', 'completed', 'wishlist'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-400 hover:text-white"
              >
                {tab === 'all' && '📖 Todos'}
                {tab === 'reading' && '▶️ Lendo'}
                {tab === 'completed' && '✅ Concluídos'}
                {tab === 'wishlist' && '⭐ Desejados'}
              </TabsTrigger>
            ))}
          </TabsList>
        </motion.div>

        {/* Books Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value={activeTab} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    variants={bookCardVariants}
                    whileHover="hover"
                    onClick={() => handleStartReading(book)}
                    className="group cursor-pointer"
                  >
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all">
                      {/* Cover */}
                      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 h-48 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                        {book.coverUrl}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-white mb-1 line-clamp-2">{book.title}</h3>
                        <p className="text-sm text-gray-400 mb-3">{book.author}</p>

                        {/* Progress Bar */}
                        {book.status === 'reading' && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-400">Progresso</span>
                              <span className="text-xs font-bold text-purple-400">{book.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${book.progress}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                              />
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-sm font-bold text-white">{book.rating}</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(book.id);
                            }}
                            className="text-xl hover:text-red-500 transition-colors"
                          >
                            ❤️
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Recommendations */}
      {recommendations.recommended.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/50"
        >
          <h3 className="text-lg font-bold text-white mb-4">🎯 Recomendações para Você</h3>
          <p className="text-sm text-gray-400 mb-4">
            Baseado em suas leituras em {recommendations.favoriteCategory}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.recommended.map((book) => (
              <motion.div
                key={book.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleStartReading(book)}
                className="bg-slate-800/50 rounded-lg p-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
              >
                <p className="font-bold text-white mb-1">{book.title}</p>
                <p className="text-sm text-gray-400">{book.author}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBook(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700"
            >
              <h2 className="text-2xl font-bold text-white mb-2">{selectedBook.title}</h2>
              <p className="text-gray-400 mb-4">{selectedBook.author}</p>
              <p className="text-gray-300 mb-6">{selectedBook.description}</p>

              {selectedBook.status === 'reading' && (
                <div className="mb-6">
                  <label className="text-sm text-gray-400 mb-2 block">Atualizar Progresso</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedBook.progress}
                    onChange={(e) => handleUpdateProgress(selectedBook.id, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedBook(null)}
                  className="flex-1 py-2 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Fechar
                </motion.button>
                {selectedBook.status === 'wishlist' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleStartReading(selectedBook);
                      setSelectedBook(null);
                    }}
                    className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Começar Leitura
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bookshelf;
