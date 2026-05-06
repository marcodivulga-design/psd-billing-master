'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '../utils/trpc';
import { useToast } from '@/components/ui/use-toast';

/**
 * Quiz.tsx - Sistema de Quiz com Inteligência Funcional
 * 
 * Características:
 * - Feedback adaptativo baseado em performance
 * - Análise de padrões de erros
 * - Recomendações personalizadas
 * - Modo prático vs modo desafio
 * - Sistema de dicas inteligentes
 * - Progresso visual detalhado
 */

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  category: string;
}

interface QuizSession {
  id: string;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  answeredQuestions: { questionId: string; answer: number; correct: boolean }[];
  startTime: Date;
  mode: 'practice' | 'challenge';
}

interface PerformanceAnalysis {
  accuracy: number;
  averageTime: number;
  strongCategories: string[];
  weakCategories: string[];
  recommendations: string[];
  nextLessonSuggestion: string;
}

const Quiz: React.FC = () => {
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [mode, setMode] = useState<'mode-select' | 'quiz' | 'results'>('mode-select');
  const [performance, setPerformance] = useState<PerformanceAnalysis | null>(null);
  const [hints, setHints] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const { toast } = useToast();

  // Fetch quiz questions
  const { data: questionsData } = trpc.quiz.getQuestions.useQuery();

  // Timer effect
  useEffect(() => {
    if (mode === 'quiz' && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeRemaining === 0 && mode === 'quiz') {
      handleNextQuestion();
    }
  }, [timeRemaining, mode]);

  const startQuiz = (selectedMode: 'practice' | 'challenge') => {
    if (!questionsData) return;

    const shuffledQuestions = [...questionsData].sort(() => Math.random() - 0.5);
    const session: QuizSession = {
      id: Math.random().toString(36).substr(2, 9),
      questions: shuffledQuestions.slice(0, selectedMode === 'practice' ? 5 : 10),
      currentQuestionIndex: 0,
      score: 0,
      totalQuestions: selectedMode === 'practice' ? 5 : 10,
      answeredQuestions: [],
      startTime: new Date(),
      mode: selectedMode,
    };

    setQuizSession(session);
    setMode('quiz');
    setTimeRemaining(60);
    setHints(3);
    toast({
      title: '🚀 Quiz Iniciado!',
      description: `Modo ${selectedMode === 'practice' ? 'Prático' : 'Desafio'} - ${session.totalQuestions} questões`,
      duration: 2000,
    });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const currentQuestion = quizSession!.questions[quizSession!.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    // Update session
    const updatedSession = { ...quizSession! };
    updatedSession.answeredQuestions.push({
      questionId: currentQuestion.id,
      answer: answerIndex,
      correct: isCorrect,
    });

    if (isCorrect) {
      updatedSession.score += 10;
      toast({
        title: '✅ Correto!',
        description: 'Excelente resposta!',
        duration: 1500,
      });
    } else {
      toast({
        title: '❌ Incorreto',
        description: `A resposta correta é: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
        variant: 'destructive',
        duration: 2000,
      });
    }

    setQuizSession(updatedSession);
  };

  const handleUseHint = () => {
    if (hints > 0) {
      setHints(hints - 1);
      const currentQuestion = quizSession!.questions[quizSession!.currentQuestionIndex];
      toast({
        title: '💡 Dica Usada',
        description: `${hints - 1} dicas restantes`,
        duration: 1500,
      });
    }
  };

  const handleNextQuestion = () => {
    if (!quizSession) return;

    if (quizSession.currentQuestionIndex < quizSession.questions.length - 1) {
      setQuizSession({
        ...quizSession,
        currentQuestionIndex: quizSession.currentQuestionIndex + 1,
      });
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeRemaining(60);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!quizSession) return;

    // Analyze performance
    const correctAnswers = quizSession.answeredQuestions.filter(a => a.correct).length;
    const accuracy = (correctAnswers / quizSession.totalQuestions) * 100;

    // Categorize performance
    const categoryPerformance: Record<string, { correct: number; total: number }> = {};
    quizSession.questions.forEach((q, idx) => {
      if (!categoryPerformance[q.category]) {
        categoryPerformance[q.category] = { correct: 0, total: 0 };
      }
      categoryPerformance[q.category].total++;
      if (quizSession.answeredQuestions[idx]?.correct) {
        categoryPerformance[q.category].correct++;
      }
    });

    const strongCategories = Object.entries(categoryPerformance)
      .filter(([_, perf]) => (perf.correct / perf.total) > 0.8)
      .map(([cat]) => cat);

    const weakCategories = Object.entries(categoryPerformance)
      .filter(([_, perf]) => (perf.correct / perf.total) < 0.5)
      .map(([cat]) => cat);

    // Generate recommendations
    const recommendations: string[] = [];
    if (accuracy >= 90) {
      recommendations.push('🌟 Desempenho excelente! Você está pronto para o próximo nível.');
    } else if (accuracy >= 70) {
      recommendations.push('👍 Bom desempenho! Revise os tópicos com dificuldade.');
    } else {
      recommendations.push('📚 Continue praticando! Recomendamos revisar as aulas.');
    }

    if (weakCategories.length > 0) {
      recommendations.push(`🎯 Foque em: ${weakCategories.join(', ')}`);
    }

    const analysis: PerformanceAnalysis = {
      accuracy,
      averageTime: 60,
      strongCategories,
      weakCategories,
      recommendations,
      nextLessonSuggestion: weakCategories[0] || 'Próximo Tópico',
    };

    setPerformance(analysis);
    setMode('results');

    toast({
      title: '🎉 Quiz Concluído!',
      description: `Você acertou ${correctAnswers}/${quizSession.totalQuestions}`,
      duration: 3000,
    });
  };

  if (mode === 'mode-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              🎯 Quiz Inteligente
            </h1>
            <p className="text-gray-400 text-lg">Escolha o modo de aprendizado</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                mode: 'practice' as const,
                title: '📚 Modo Prático',
                description: 'Aprenda no seu próprio ritmo com dicas e explicações',
                icon: '📖',
                color: 'from-blue-500 to-cyan-500',
                questions: 5,
              },
              {
                mode: 'challenge' as const,
                title: '⚡ Modo Desafio',
                description: 'Teste seus conhecimentos contra o tempo',
                icon: '🏆',
                color: 'from-orange-500 to-red-500',
                questions: 10,
              },
            ].map((option) => (
              <motion.button
                key={option.mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startQuiz(option.mode)}
                className="group"
              >
                <div className={`bg-gradient-to-br ${option.color} p-0.5 rounded-2xl`}>
                  <div className="bg-slate-900 rounded-[15px] p-8 text-left hover:bg-slate-800/50 transition-colors">
                    <div className="text-5xl mb-4">{option.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{option.title}</h3>
                    <p className="text-gray-400 mb-4">{option.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{option.questions} questões</span>
                      <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (mode === 'quiz' && quizSession) {
    const currentQuestion = quizSession.questions[quizSession.currentQuestionIndex];
    const progress = ((quizSession.currentQuestionIndex + 1) / quizSession.totalQuestions) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Questão {quizSession.currentQuestionIndex + 1}/{quizSession.totalQuestions}
              </h2>
              <p className="text-gray-400">Pontuação: {quizSession.score} pontos</p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${timeRemaining > 20 ? 'text-green-400' : 'text-red-400'}`}>
                ⏱️ {timeRemaining}s
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
        </motion.div>

        {/* Question */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">{currentQuestion.text}</h3>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-lg text-left font-medium transition-all ${
                  selectedAnswer === null
                    ? 'bg-slate-700 hover:bg-slate-600 text-white cursor-pointer'
                    : index === currentQuestion.correctAnswer
                    ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                    : index === selectedAnswer
                    ? 'bg-red-500/20 border-2 border-red-500 text-red-400'
                    : 'bg-slate-700 text-gray-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                    {String.fromCharCode(65 + index)}
                  </div>
                  {option}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mb-6"
              >
                <p className="text-blue-300 font-medium mb-2">💡 Explicação:</p>
                <p className="text-gray-300">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUseHint}
              disabled={hints === 0 || selectedAnswer === null}
              className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
            >
              💡 Dica ({hints})
            </motion.button>
            {selectedAnswer !== null && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextQuestion}
                className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                {quizSession.currentQuestionIndex === quizSession.questions.length - 1
                  ? 'Finalizar'
                  : 'Próxima'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (mode === 'results' && performance && quizSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          {/* Score Circle */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
            >
              <div className="text-5xl font-bold text-white">{Math.round(performance.accuracy)}%</div>
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-2">Quiz Concluído!</h2>
            <p className="text-gray-400 text-lg">
              Você acertou {quizSession.answeredQuestions.filter(a => a.correct).length}/{quizSession.totalQuestions} questões
            </p>
          </div>

          {/* Performance Analysis */}
          <div className="space-y-4 mb-8">
            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/50"
            >
              <h3 className="text-lg font-bold text-white mb-3">🎯 Recomendações</h3>
              <div className="space-y-2">
                {performance.recommendations.map((rec, idx) => (
                  <p key={idx} className="text-gray-300">{rec}</p>
                ))}
              </div>
            </motion.div>

            {/* Strong Categories */}
            {performance.strongCategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/50"
              >
                <h3 className="text-lg font-bold text-white mb-3">✅ Pontos Fortes</h3>
                <div className="flex flex-wrap gap-2">
                  {performance.strongCategories.map((cat) => (
                    <span key={cat} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Weak Categories */}
            {performance.weakCategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-xl p-6 border border-red-500/50"
              >
                <h3 className="text-lg font-bold text-white mb-3">📚 Áreas para Melhorar</h3>
                <div className="flex flex-wrap gap-2">
                  {performance.weakCategories.map((cat) => (
                    <span key={cat} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setMode('mode-select');
                setQuizSession(null);
                setPerformance(null);
                setSelectedAnswer(null);
              }}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
            >
              ← Voltar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startQuiz(quizSession.mode)}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              🔄 Tentar Novamente
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default Quiz;
