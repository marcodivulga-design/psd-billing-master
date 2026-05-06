/**
 * MagicalOnboarding.tsx
 * 
 * Onboarding Mágico - Primeira Experiência Encantadora
 * 
 * Inspiração: Disney educacional + Duolingo
 * 
 * Etapas:
 * 1. Boas-vindas com animação
 * 2. Seleção de tipo de usuário (Aluno, Professor, Diretor)
 * 3. Configuração básica
 * 4. Apresentação de features principais
 * 5. Primeiro desafio/aula
 * 6. Celebração de conclusão
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, Users, Award, Zap, Heart } from 'lucide-react';

type UserType = 'student' | 'teacher' | 'director' | null;
type OnboardingStep = 'welcome' | 'userType' | 'setup' | 'features' | 'firstChallenge' | 'celebration';

interface OnboardingState {
  currentStep: OnboardingStep;
  userType: UserType;
  schoolName: string;
  userName: string;
  favoriteSubject: string;
}

const MagicalOnboarding: React.FC = () => {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 'welcome',
    userType: null,
    schoolName: '',
    userName: '',
    favoriteSubject: '',
  });

  const handleUserTypeSelect = (type: UserType) => {
    setState(prev => ({
      ...prev,
      userType: type,
      currentStep: 'setup',
    }));
  };

  const handleSetupComplete = (schoolName: string, userName: string) => {
    setState(prev => ({
      ...prev,
      schoolName,
      userName,
      currentStep: 'features',
    }));
  };

  const handleFeaturesComplete = () => {
    setState(prev => ({
      ...prev,
      currentStep: 'firstChallenge',
    }));
  };

  const handleChallengeComplete = () => {
    setState(prev => ({
      ...prev,
      currentStep: 'celebration',
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 overflow-hidden">
      <AnimatePresence mode="wait">
        {state.currentStep === 'welcome' && (
          <WelcomeStep key="welcome" onNext={() => setState(prev => ({ ...prev, currentStep: 'userType' }))} />
        )}
        {state.currentStep === 'userType' && (
          <UserTypeStep key="userType" onSelect={handleUserTypeSelect} />
        )}
        {state.currentStep === 'setup' && (
          <SetupStep key="setup" userType={state.userType} onComplete={handleSetupComplete} />
        )}
        {state.currentStep === 'features' && (
          <FeaturesStep key="features" userType={state.userType} onComplete={handleFeaturesComplete} />
        )}
        {state.currentStep === 'firstChallenge' && (
          <FirstChallengeStep key="firstChallenge" userName={state.userName} onComplete={handleChallengeComplete} />
        )}
        {state.currentStep === 'celebration' && (
          <CelebrationStep key="celebration" userName={state.userName} schoolName={state.schoolName} />
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Etapa 1: Boas-vindas
 */
const WelcomeStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="text-center max-w-md">
        {/* Logo animado */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-gray-800 mb-4"
        >
          Bem-vindo à <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Escola Inteligente</span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-gray-600 mb-8"
        >
          Um lugar onde a tecnologia encontra a educação, e você aprende de um jeito novo.
        </motion.p>

        {/* Descrição */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3 mb-12"
        >
          <div className="flex items-center gap-3 text-gray-700">
            <Heart className="w-5 h-5 text-pink-500" />
            <span>Educação personalizada para você</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Gamificação que motiva</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Award className="w-5 h-5 text-purple-500" />
            <span>Conquistas reais</span>
          </div>
        </motion.div>

        {/* Botão */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          Começar Jornada ✨
        </motion.button>
      </div>
    </motion.div>
  );
};

/**
 * Etapa 2: Seleção de tipo de usuário
 */
const UserTypeStep: React.FC<{ onSelect: (type: UserType) => void }> = ({ onSelect }) => {
  const userTypes = [
    {
      type: 'student' as const,
      icon: BookOpen,
      title: 'Sou Aluno',
      description: 'Quero aprender de forma divertida',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      type: 'teacher' as const,
      icon: Users,
      title: 'Sou Professor',
      description: 'Quero ensinar de forma inovadora',
      color: 'from-green-500 to-emerald-500',
    },
    {
      type: 'director' as const,
      icon: Award,
      title: 'Sou Diretor',
      description: 'Quero gerenciar a escola',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-4 py-12"
    >
      <div className="max-w-2xl w-full">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-center text-gray-800 mb-12"
        >
          Quem é você?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userTypes.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.type}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(item.type)}
                className={`p-6 rounded-lg bg-gradient-to-br ${item.color} text-white shadow-lg hover:shadow-xl transition-shadow`}
              >
                <Icon className="w-12 h-12 mb-4 mx-auto" />
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm opacity-90">{item.description}</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Etapa 3: Configuração básica
 */
const SetupStep: React.FC<{ userType: UserType; onComplete: (schoolName: string, userName: string) => void }> = ({ userType, onComplete }) => {
  const [schoolName, setSchoolName] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (schoolName.trim() && userName.trim()) {
      onComplete(schoolName, userName);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-center text-gray-800 mb-8"
        >
          Vamos nos conhecer melhor
        </motion.h2>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Escola
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Ex: Escola Municipal..."
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seu Nome
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Como você gostaria de ser chamado?"
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Continuar →
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

/**
 * Etapa 4: Apresentação de features
 */
const FeaturesStep: React.FC<{ userType: UserType; onComplete: () => void }> = ({ userType, onComplete }) => {
  const features = [
    {
      icon: Sparkles,
      title: 'IA Adaptativa',
      description: 'A plataforma aprende com você',
    },
    {
      icon: Award,
      title: 'Gamificação',
      description: 'Ganhe pontos e conquistas',
    },
    {
      icon: Zap,
      title: 'Recomendações',
      description: 'Conteúdo personalizado',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-4 py-12"
    >
      <div className="max-w-2xl w-full">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-center text-gray-800 mb-12"
        >
          Conheça os Superpoderes
        </motion.h2>

        <div className="space-y-4 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          Vamos Começar! 🚀
        </motion.button>
      </div>
    </motion.div>
  );
};

/**
 * Etapa 5: Primeiro desafio
 */
const FirstChallengeStep: React.FC<{ userName: string; onComplete: () => void }> = ({ userName, onComplete }) => {
  const [answered, setAnswered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-center text-gray-800 mb-8"
        >
          Seu Primeiro Desafio, {userName}! 🎯
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg mb-6"
        >
          <p className="text-gray-700 mb-6">
            <span className="font-bold">Pergunta:</span> Qual é a capital do Brasil?
          </p>

          <div className="space-y-3">
            {['Brasília', 'Rio de Janeiro', 'São Paulo', 'Salvador'].map((option, index) => (
              <motion.button
                key={option}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAnswered(true)}
                className={`w-full p-3 rounded-lg border-2 transition-all ${
                  option === 'Brasília'
                    ? 'border-green-500 bg-green-50 text-green-700 font-bold'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {answered && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Próximo → 🎉
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Etapa 6: Celebração
 */
const CelebrationStep: React.FC<{ userName: string; schoolName: string }> = ({ userName, schoolName }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="text-center max-w-md">
        {/* Confete animado */}
        <motion.div
          animate={{ scale: [0, 1, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <div className="text-6xl">🎉</div>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-gray-800 mb-4"
        >
          Parabéns, {userName}!
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-8"
        >
          Você completou seu onboarding na <span className="font-bold">{schoolName}</span> e ganhou seus primeiros 100 XP! 🌟
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg mb-8"
        >
          <p className="text-sm text-gray-700">
            Você está no <span className="font-bold text-purple-600">Nível 1 - Iniciante</span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full w-1/6"></div>
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          Explorar Plataforma 🚀
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MagicalOnboarding;
