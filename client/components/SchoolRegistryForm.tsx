'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdaptiveButton from '@/components/AdaptiveButton';
import AdaptiveCard from '@/components/AdaptiveCard';
import AdaptiveText from '@/components/AdaptiveText';
import {
  SCHOOL_NETWORKS,
  SCHOOL_PROFILES,
  SUBJECTS,
  SchoolNetwork,
  SchoolProfile,
  SubjectId,
} from '@/server/school-registry-types';

/**
 * SchoolRegistryForm.tsx - Componente de Formulário para Cadastro de Escola
 * 
 * Suporta:
 * - Seleção de Rede e Perfis
 * - Seleção de Matérias
 * - Dados de Endereço e Contato
 * - Configuração de Séries
 */

interface SchoolFormData {
  name: string;
  description: string;
  network: SchoolNetwork | '';
  profiles: SchoolProfile[];
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  subjects: SubjectId[];
  grades: string[];
  studentCount: number;
  teacherCount: number;
}

interface SchoolRegistryFormProps {
  onSubmit?: (data: SchoolFormData) => void;
  initialData?: Partial<SchoolFormData>;
}

const SchoolRegistryForm: React.FC<SchoolRegistryFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<SchoolFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    network: initialData?.network || '',
    profiles: initialData?.profiles || [],
    address: initialData?.address || {
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
    contact: initialData?.contact || {
      phone: '',
      email: '',
      website: '',
    },
    subjects: initialData?.subjects || [],
    grades: initialData?.grades || [],
    studentCount: initialData?.studentCount || 0,
    teacherCount: initialData?.teacherCount || 0,
  });

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Informações Básicas', icon: '📝' },
    { title: 'Tipo de Escola', icon: '🏫' },
    { title: 'Endereço', icon: '📍' },
    { title: 'Contato', icon: '📞' },
    { title: 'Matérias', icon: '📚' },
    { title: 'Séries e Alunos', icon: '👥' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  const toggleProfile = (profile: SchoolProfile) => {
    setFormData((prev) => ({
      ...prev,
      profiles: prev.profiles.includes(profile)
        ? prev.profiles.filter((p) => p !== profile)
        : [...prev.profiles, profile],
    }));
  };

  const toggleSubject = (subject: SubjectId) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
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
    <div className="max-w-4xl mx-auto p-4">
      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          {steps.map((step, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentStep(idx)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-bold transition-all ${
                currentStep === idx
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {step.icon} {step.title}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Form Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Step 0: Informações Básicas */}
        {currentStep === 0 && (
          <motion.div variants={itemVariants} className="space-y-4">
            <AdaptiveText variant="heading">📝 Informações Básicas</AdaptiveText>

            <div>
              <label className="block font-bold mb-2">Nome da Escola *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Ex: Escola Municipal João Silva"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Descrição breve da escola"
                rows={4}
              />
            </div>
          </motion.div>
        )}

        {/* Step 1: Tipo de Escola */}
        {currentStep === 1 && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <AdaptiveText variant="heading">🏛️ Rede de Ensino *</AdaptiveText>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {Object.entries(SCHOOL_NETWORKS).map(([key, network]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleInputChange('network', key)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.network === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-3xl mb-2">{network.icon}</div>
                    <div className="font-bold">{network.name}</div>
                    <div className="text-sm text-gray-600">{network.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <AdaptiveText variant="heading">🎯 Perfis da Escola</AdaptiveText>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {Object.entries(SCHOOL_PROFILES).map(([key, profile]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleProfile(key as SchoolProfile)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.profiles.includes(key as SchoolProfile)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-3xl mb-2">{profile.icon}</div>
                    <div className="font-bold">{profile.name}</div>
                    <div className="text-sm text-gray-600">{profile.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Endereço */}
        {currentStep === 2 && (
          <motion.div variants={itemVariants} className="space-y-4">
            <AdaptiveText variant="heading">📍 Endereço</AdaptiveText>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Rua *"
                value={formData.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Número *"
                value={formData.address.number}
                onChange={(e) => handleAddressChange('number', e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Bairro *"
                value={formData.address.neighborhood}
                onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Cidade *"
                value={formData.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Estado *"
                value={formData.address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="CEP"
                value={formData.address.zipCode}
                onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Contato */}
        {currentStep === 3 && (
          <motion.div variants={itemVariants} className="space-y-4">
            <AdaptiveText variant="heading">📞 Contato</AdaptiveText>

            <div>
              <label className="block font-bold mb-2">Telefone *</label>
              <input
                type="tel"
                placeholder="(XX) XXXXX-XXXX"
                value={formData.contact.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Email *</label>
              <input
                type="email"
                placeholder="escola@email.com"
                value={formData.contact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Website</label>
              <input
                type="url"
                placeholder="https://www.escola.com.br"
                value={formData.contact.website}
                onChange={(e) => handleContactChange('website', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </motion.div>
        )}

        {/* Step 4: Matérias */}
        {currentStep === 4 && (
          <motion.div variants={itemVariants} className="space-y-4">
            <AdaptiveText variant="heading">📚 Matérias/Disciplinas</AdaptiveText>
            <p className="text-gray-600">Selecione as matérias oferecidas pela escola:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(SUBJECTS).map(([key, subject]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSubject(key as SubjectId)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    formData.subjects.includes(key as SubjectId)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-1">{subject.icon}</div>
                  <div className="font-bold text-sm">{subject.name}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 5: Séries e Alunos */}
        {currentStep === 5 && (
          <motion.div variants={itemVariants} className="space-y-4">
            <AdaptiveText variant="heading">👥 Séries e Alunos</AdaptiveText>

            <div>
              <label className="block font-bold mb-2">Séries Oferecidas</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  '1º ano',
                  '2º ano',
                  '3º ano',
                  '4º ano',
                  '5º ano',
                  '6º ano',
                  '7º ano',
                  '8º ano',
                  '9º ano',
                  '1º EM',
                  '2º EM',
                  '3º EM',
                ].map((grade) => (
                  <motion.button
                    key={grade}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        grades: prev.grades.includes(grade)
                          ? prev.grades.filter((g) => g !== grade)
                          : [...prev.grades, grade],
                      }));
                    }}
                    className={`p-2 rounded-lg border-2 transition-all font-bold ${
                      formData.grades.includes(grade)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {grade}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2">Número de Alunos</label>
                <input
                  type="number"
                  value={formData.studentCount}
                  onChange={(e) => handleInputChange('studentCount', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Número de Professores</label>
                <input
                  type="number"
                  value={formData.teacherCount}
                  onChange={(e) => handleInputChange('teacherCount', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4 mt-8"
      >
        <AdaptiveButton
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          variant="secondary"
          disabled={currentStep === 0}
          fullWidth
          icon="⬅️"
        >
          Anterior
        </AdaptiveButton>

        {currentStep === steps.length - 1 ? (
          <AdaptiveButton
            onClick={handleSubmit}
            fullWidth
            icon="✅"
          >
            Salvar Escola
          </AdaptiveButton>
        ) : (
          <AdaptiveButton
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            fullWidth
            icon="➡️"
          >
            Próximo
          </AdaptiveButton>
        )}
      </motion.div>
    </div>
  );
};

export default SchoolRegistryForm;
