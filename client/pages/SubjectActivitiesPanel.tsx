'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdaptiveText from '@/components/AdaptiveText';
import AdaptiveButton from '@/components/AdaptiveButton';
import { SUBJECTS, SubjectId } from '@/server/school-registry-types';
import { useToast } from '@/components/ui/use-toast';

/**
 * SubjectActivitiesPanel.tsx - Painel de Configuração de Atividades por Matéria
 * 
 * Funcionalidades:
 * - Visualizar atividades por matéria
 * - Adicionar atividades customizadas
 * - Configurar atividades por série
 * - Exportar configurações
 */

interface ActivityConfig {
  subjectId: SubjectId;
  selectedActivities: string[];
  customActivities: string[];
  gradeSpecific: Record<string, string[]>;
}

const SubjectActivitiesPanel: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('portugues');
  const [configs, setConfigs] = useState<Record<SubjectId, ActivityConfig>>({});
  const [newActivity, setNewActivity] = useState('');
  const { toast } = useToast();

  const subject = SUBJECTS[selectedSubject];

  const getConfig = (subjectId: SubjectId): ActivityConfig => {
    return (
      configs[subjectId] || {
        subjectId,
        selectedActivities: subject.activities,
        customActivities: [],
        gradeSpecific: {},
      }
    );
  };

  const config = getConfig(selectedSubject);

  const toggleActivity = (activity: string) => {
    const newConfig = { ...config };
    if (newConfig.selectedActivities.includes(activity)) {
      newConfig.selectedActivities = newConfig.selectedActivities.filter(
        (a) => a !== activity
      );
    } else {
      newConfig.selectedActivities.push(activity);
    }
    setConfigs({ ...configs, [selectedSubject]: newConfig });
  };

  const addCustomActivity = () => {
    if (!newActivity.trim()) return;

    const newConfig = { ...config };
    newConfig.customActivities.push(newActivity);
    newConfig.selectedActivities.push(newActivity);
    setConfigs({ ...configs, [selectedSubject]: newConfig });
    setNewActivity('');

    toast({
      title: '✅ Atividade adicionada!',
      description: `"${newActivity}" foi adicionada à matéria de ${subject.name}`,
      variant: 'success',
    });
  };

  const removeCustomActivity = (activity: string) => {
    const newConfig = { ...config };
    newConfig.customActivities = newConfig.customActivities.filter(
      (a) => a !== activity
    );
    newConfig.selectedActivities = newConfig.selectedActivities.filter(
      (a) => a !== activity
    );
    setConfigs({ ...configs, [selectedSubject]: newConfig });
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <AdaptiveText variant="heading" className="text-4xl mb-2">
            📚 Configuração de Atividades por Matéria
          </AdaptiveText>
          <AdaptiveText variant="subheading" className="text-gray-600">
            Personalize as atividades interativas de cada disciplina
          </AdaptiveText>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Subject List */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <AdaptiveText variant="heading" className="mb-4">
                📖 Matérias
              </AdaptiveText>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(SUBJECTS).map(([key, subj]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSubject(key as SubjectId)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      selectedSubject === key
                        ? 'bg-purple-500 text-white font-bold'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-lg mr-2">{subj.icon}</span>
                    {subj.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants} className="lg:col-span-3 space-y-6">
            {/* Subject Header */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">{subject.icon}</div>
                <div>
                  <AdaptiveText variant="heading" className="text-3xl">
                    {subject.name}
                  </AdaptiveText>
                  <AdaptiveText variant="body" className="text-gray-600">
                    {config.selectedActivities.length} atividades selecionadas
                  </AdaptiveText>
                </div>
              </div>
            </div>

            {/* Default Activities */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <AdaptiveText variant="heading" className="mb-4">
                ✨ Atividades Padrão
              </AdaptiveText>

              <div className="space-y-3">
                {subject.activities.map((activity) => (
                  <motion.div
                    key={activity}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => toggleActivity(activity)}
                  >
                    <input
                      type="checkbox"
                      checked={config.selectedActivities.includes(activity)}
                      onChange={() => toggleActivity(activity)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <span className="flex-1 font-medium">{activity}</span>
                    <span className="text-2xl">✓</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Custom Activities */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <AdaptiveText variant="heading" className="mb-4">
                🎯 Atividades Customizadas
              </AdaptiveText>

              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomActivity()}
                  placeholder="Digite uma nova atividade..."
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <AdaptiveButton
                  onClick={addCustomActivity}
                  icon="➕"
                >
                  Adicionar
                </AdaptiveButton>
              </div>

              {config.customActivities.length > 0 ? (
                <div className="space-y-3">
                  {config.customActivities.map((activity) => (
                    <motion.div
                      key={activity}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <span className="font-medium">{activity}</span>
                      <button
                        onClick={() => removeCustomActivity(activity)}
                        className="text-red-500 hover:text-red-700 text-xl"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>Nenhuma atividade customizada ainda</p>
                </div>
              )}
            </div>

            {/* Grade-Specific Configuration */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <AdaptiveText variant="heading" className="mb-4">
                🎓 Configuração por Série (Opcional)
              </AdaptiveText>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['1º ano', '4º ano', '7º ano', '1º EM'].map((grade) => (
                  <div key={grade} className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-bold mb-3">{grade}</div>
                    <div className="space-y-2">
                      {config.selectedActivities.slice(0, 3).map((activity) => (
                        <div key={activity} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <AdaptiveButton
                fullWidth
                icon="💾"
              >
                Salvar Configurações
              </AdaptiveButton>
              <AdaptiveButton
                fullWidth
                variant="secondary"
                icon="📥"
              >
                Exportar
              </AdaptiveButton>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubjectActivitiesPanel;
