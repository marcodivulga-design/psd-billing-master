'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SchoolRegistryForm from '@/components/SchoolRegistryForm';
import AdaptiveText from '@/components/AdaptiveText';
import { useToast } from '@/components/ui/use-toast';

/**
 * SchoolRegistry.tsx - Página de Cadastro de Escola
 * 
 * Funcionalidades:
 * - Formulário multi-step para cadastro
 * - Lista de escolas cadastradas
 * - Edição e exclusão
 * - Exportação de dados
 */

interface School {
  id: string;
  name: string;
  network: string;
  profiles: string[];
  city: string;
  studentCount: number;
  subjects: string[];
  createdAt: string;
}

const SchoolRegistry: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([
    {
      id: '1',
      name: 'Escola Municipal João Silva',
      network: 'municipal',
      profiles: ['urbana'],
      city: 'São Paulo',
      studentCount: 450,
      subjects: ['portugues', 'matematica', 'ciencias', 'historia', 'geografia'],
      createdAt: '2024-01-15',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = (data: any) => {
    const newSchool: School = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      network: data.network,
      profiles: data.profiles,
      city: data.address.city,
      studentCount: data.studentCount,
      subjects: data.subjects,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setSchools([...schools, newSchool]);
    setShowForm(false);
    toast({
      title: '✅ Sucesso!',
      description: `Escola "${data.name}" cadastrada com sucesso!`,
      variant: 'success',
    });
  };

  const handleDeleteSchool = (id: string) => {
    setSchools(schools.filter((s) => s.id !== id));
    toast({
      title: '🗑️ Deletado',
      description: 'Escola removida com sucesso!',
      variant: 'destructive',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <AdaptiveText variant="heading" className="text-4xl mb-2">
            🏫 Cadastro de Escolas
          </AdaptiveText>
          <AdaptiveText variant="subheading" className="text-gray-600">
            Gerencie as escolas da sua rede de ensino
          </AdaptiveText>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-2">🏫</div>
            <div className="text-3xl font-bold text-blue-600">{schools.length}</div>
            <div className="text-gray-600">Escolas Cadastradas</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-purple-600">
              {schools.reduce((acc, s) => acc + s.studentCount, 0)}
            </div>
            <div className="text-gray-600">Total de Alunos</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-3xl font-bold text-pink-600">
              {new Set(schools.flatMap((s) => s.subjects)).size}
            </div>
            <div className="text-gray-600">Matérias Oferecidas</div>
          </div>
        </motion.div>

        {/* Form Section */}
        {showForm && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-lg p-8 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <AdaptiveText variant="heading">Adicionar Nova Escola</AdaptiveText>
              <button
                onClick={() => setShowForm(false)}
                className="text-2xl hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>
            <SchoolRegistryForm onSubmit={handleFormSubmit} />
          </motion.div>
        )}

        {!showForm && (
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="mb-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold hover:shadow-lg transition-shadow"
          >
            ➕ Adicionar Escola
          </motion.button>
        )}

        {/* Schools List */}
        <motion.div variants={itemVariants} className="space-y-4">
          <AdaptiveText variant="heading">Escolas Cadastradas</AdaptiveText>

          {schools.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🏫</div>
              <AdaptiveText variant="body">
                Nenhuma escola cadastrada ainda. Clique em "Adicionar Escola" para começar!
              </AdaptiveText>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schools.map((school, idx) => (
                <motion.div
                  key={school.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{school.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {school.network.charAt(0).toUpperCase() + school.network.slice(1)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSchool(school.id)}
                      className="text-red-500 hover:text-red-700 text-xl"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📍</span>
                      <span className="text-gray-700">{school.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👥</span>
                      <span className="text-gray-700">{school.studentCount} alunos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📚</span>
                      <span className="text-gray-700">{school.subjects.length} matérias</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                    >
                      ✏️ Editar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-colors"
                    >
                      👁️ Ver
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SchoolRegistry;
