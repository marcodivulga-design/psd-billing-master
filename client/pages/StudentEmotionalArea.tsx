'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdaptiveText from '@/components/AdaptiveText';
import { useToast } from '@/components/ui/use-toast';

/**
 * StudentEmotionalArea.tsx - Área Emocional do Aluno
 * 
 * Aluno marca:
 * - Feliz
 * - Cansado
 * - Confuso
 * - Ansioso
 * - Motivado
 * 
 * IA entende padrões e sugere adaptações
 */

type Emotion = 'happy' | 'tired' | 'confused' | 'anxious' | 'motivated';

interface EmotionEntry {
  id: string;
  emotion: Emotion;
  timestamp: string;
  subject?: string;
  notes?: string;
}

interface EmotionPattern {
  emotion: Emotion;
  frequency: number;
  percentage: number;
  commonTriggers: string[];
  recommendations: string[];
}

const StudentEmotionalArea: React.FC = () => {
  const [entries, setEntries] = useState<EmotionEntry[]>([
    {
      id: '1',
      emotion: 'confused',
      timestamp: '2024-01-20 10:30',
      subject: 'Matemática',
      notes: 'Dificuldade com frações',
    },
    {
      id: '2',
      emotion: 'anxious',
      timestamp: '2024-01-20 14:00',
      subject: 'Português',
      notes: 'Prova de redação',
    },
    {
      id: '3',
      emotion: 'motivated',
      timestamp: '2024-01-20 16:45',
      subject: 'Artes',
      notes: 'Projeto criativo',
    },
  ]);

  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const emotions: Record<Emotion, { icon: string; label: string; color: string }> = {
    happy: { icon: '😊', label: 'Feliz', color: 'bg-yellow-100 border-yellow-300' },
    tired: { icon: '😴', label: 'Cansado', color: 'bg-blue-100 border-blue-300' },
    confused: { icon: '😕', label: 'Confuso', color: 'bg-orange-100 border-orange-300' },
    anxious: { icon: '😰', label: 'Ansioso', color: 'bg-red-100 border-red-300' },
    motivated: { icon: '🚀', label: 'Motivado', color: 'bg-green-100 border-green-300' },
  };

  const subjects = ['Matemática', 'Português', 'Ciências', 'História', 'Artes'];

  // Calcular padrões
  const patterns: Record<Emotion, EmotionPattern> = {
    happy: {
      emotion: 'happy',
      frequency: 12,
      percentage: 25,
      commonTriggers: ['Artes', 'Educação Física', 'Projetos criativos'],
      recommendations: ['Manter atividades criativas', 'Aumentar gamificação'],
    },
    tired: {
      emotion: 'tired',
      frequency: 8,
      percentage: 17,
      commonTriggers: ['Fim de semana', 'Aulas longas', 'Manhã cedo'],
      recommendations: ['Pausas mais frequentes', 'Atividades mais curtas'],
    },
    confused: {
      emotion: 'confused',
      frequency: 15,
      percentage: 31,
      commonTriggers: ['Matemática', 'Frações', 'Conceitos abstratos'],
      recommendations: ['Mais exemplos visuais', 'Exercícios passo a passo', 'Dicas inteligentes'],
    },
    anxious: {
      emotion: 'anxious',
      frequency: 10,
      percentage: 21,
      commonTriggers: ['Provas', 'Tempo limitado', 'Português'],
      recommendations: ['Reduzir pressão de tempo', 'Mais exercícios práticos', 'Feedback positivo'],
    },
    motivated: {
      emotion: 'motivated',
      frequency: 3,
      percentage: 6,
      commonTriggers: ['Desafios vencidos', 'Recompensas', 'Progresso visível'],
      recommendations: ['Manter desafios', 'Celebrar conquistas', 'Aumentar dificuldade gradualmente'],
    },
  };

  const handleAddEmotion = () => {
    if (!selectedEmotion) {
      toast({
        title: '⚠️ Selecione uma emoção',
        description: 'Escolha como você está se sentindo agora',
        variant: 'destructive',
      });
      return;
    }

    const newEntry: EmotionEntry = {
      id: `emotion_${Date.now()}`,
      emotion: selectedEmotion,
      timestamp: new Date().toLocaleString('pt-BR'),
      subject: selectedSubject || undefined,
      notes: notes || undefined,
    };

    setEntries([newEntry, ...entries]);
    setSelectedEmotion(null);
    setSelectedSubject('');
    setNotes('');

    toast({
      title: '✅ Emoção registrada!',
      description: `Você registrou que está ${emotions[selectedEmotion].label.toLowerCase()}`,
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <AdaptiveText variant="heading" className="text-4xl mb-2">
            💭 Área Emocional
          </AdaptiveText>
          <AdaptiveText variant="subheading" className="text-gray-600">
            Como você está se sentindo? Compartilhe suas emoções para que possamos ajudar melhor
          </AdaptiveText>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emotion Selector */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <AdaptiveText variant="heading" className="mb-4">
                Como você está?
              </AdaptiveText>

              <div className="space-y-3 mb-6">
                {(Object.entries(emotions) as [Emotion, typeof emotions[Emotion]][]).map(
                  ([emotionKey, emotion]) => (
                    <motion.button
                      key={emotionKey}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedEmotion(emotionKey)}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        selectedEmotion === emotionKey
                          ? `${emotion.color} ring-2 ring-purple-500`
                          : `${emotion.color} hover:ring-2 hover:ring-purple-300`
                      }`}
                    >
                      <div className="text-3xl mb-2">{emotion.icon}</div>
                      <div className="font-bold">{emotion.label}</div>
                    </motion.button>
                  )
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Matéria (opcional)</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Selecione uma matéria</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Notas (opcional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Conte mais sobre como você está..."
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <button
                onClick={handleAddEmotion}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-shadow"
              >
                ✅ Registrar Emoção
              </button>
            </div>
          </motion.div>

          {/* Patterns and Recommendations */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            {/* Emotion Distribution */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <AdaptiveText variant="heading" className="mb-4">
                📊 Seus Padrões Emocionais
              </AdaptiveText>

              <div className="space-y-4">
                {(Object.entries(patterns) as [Emotion, EmotionPattern][]).map(
                  ([emotionKey, pattern]) => (
                    <div key={emotionKey}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{emotions[emotionKey].icon}</span>
                          <span className="font-bold">{emotions[emotionKey].label}</span>
                        </div>
                        <span className="font-bold text-purple-600">{pattern.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            emotionKey === 'happy'
                              ? 'bg-yellow-500'
                              : emotionKey === 'tired'
                                ? 'bg-blue-500'
                                : emotionKey === 'confused'
                                  ? 'bg-orange-500'
                                  : emotionKey === 'anxious'
                                    ? 'bg-red-500'
                                    : 'bg-green-500'
                          }`}
                          style={{ width: `${pattern.percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <AdaptiveText variant="heading" className="mb-4">
                🤖 Insights da IA
              </AdaptiveText>

              <div className="space-y-4">
                <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
                  <div className="font-bold text-orange-800 mb-2">
                    ⚠️ Padrão Detectado: Confusão em Matemática
                  </div>
                  <p className="text-sm text-orange-700">
                    Você marca "confuso" frequentemente durante aulas de Matemática. Vamos ajudar:
                  </p>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1 ml-4">
                    <li>✓ Mais exemplos visuais com desenhos</li>
                    <li>✓ Exercícios passo a passo</li>
                    <li>✓ Dicas inteligentes automáticas</li>
                  </ul>
                </div>

                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                  <div className="font-bold text-red-800 mb-2">
                    ⚠️ Padrão Detectado: Ansiedade em Provas
                  </div>
                  <p className="text-sm text-red-700">
                    Você fica ansioso quando há limite de tempo. Sugestões:
                  </p>
                  <ul className="text-sm text-red-700 mt-2 space-y-1 ml-4">
                    <li>✓ Aumentar tempo limite em 50%</li>
                    <li>✓ Mais exercícios práticos sem pressão</li>
                    <li>✓ Feedback positivo após cada resposta</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                  <div className="font-bold text-green-800 mb-2">
                    ✅ Ponto Forte: Motivação em Projetos Criativos
                  </div>
                  <p className="text-sm text-green-700">
                    Você fica motivado em atividades criativas. Vamos potencializar:
                  </p>
                  <ul className="text-sm text-green-700 mt-2 space-y-1 ml-4">
                    <li>✓ Mais desafios criativos em todas as matérias</li>
                    <li>✓ Projetos colaborativos com amigos</li>
                    <li>✓ Celebrar suas criações</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Entries */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <AdaptiveText variant="heading" className="mb-4">
                📝 Registros Recentes
              </AdaptiveText>

              <div className="space-y-3">
                {entries.slice(0, 5).map((entry) => (
                  <motion.div
                    key={entry.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-50 rounded-lg border-l-4"
                    style={{
                      borderColor:
                        entry.emotion === 'happy'
                          ? '#FBBF24'
                          : entry.emotion === 'tired'
                            ? '#60A5FA'
                            : entry.emotion === 'confused'
                              ? '#F97316'
                              : entry.emotion === 'anxious'
                                ? '#EF4444'
                                : '#22C55E',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">
                            {emotions[entry.emotion].icon}
                          </span>
                          <span className="font-bold">{emotions[entry.emotion].label}</span>
                          {entry.subject && (
                            <span className="text-sm text-gray-600">em {entry.subject}</span>
                          )}
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-gray-700 ml-8">{entry.notes}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-600">{entry.timestamp}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentEmotionalArea;
