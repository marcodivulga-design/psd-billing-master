/**
 * AccessibilityFeatures.tsx
 * 
 * EDUCAÇÃO ESPECIAL - ACESSIBILIDADE COMPLETA
 * 
 * - LIBRAS (Língua Brasileira de Sinais)
 * - Leitura por voz (Text-to-Speech)
 * - Pictogramas
 * - Alto contraste
 * - Navegação simplificada
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// TIPOS
// ============================================================================

interface AccessibilitySettings {
  librasEnabled: boolean;
  textToSpeechEnabled: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  pictogramsEnabled: boolean;
}

interface Pictogram {
  id: string;
  name: string;
  emoji: string;
  description: string;
  librasUrl?: string;
}

// ============================================================================
// BANCO DE PICTOGRAMAS
// ============================================================================

const PICTOGRAMS: Record<string, Pictogram> = {
  hello: { id: 'hello', name: 'Olá', emoji: '👋', description: 'Saudação', librasUrl: '/libras/hello.mp4' },
  goodbye: { id: 'goodbye', name: 'Adeus', emoji: '👋', description: 'Despedida', librasUrl: '/libras/goodbye.mp4' },
  help: { id: 'help', name: 'Ajuda', emoji: '🆘', description: 'Pedir ajuda', librasUrl: '/libras/help.mp4' },
  yes: { id: 'yes', name: 'Sim', emoji: '✅', description: 'Afirmação', librasUrl: '/libras/yes.mp4' },
  no: { id: 'no', name: 'Não', emoji: '❌', description: 'Negação', librasUrl: '/libras/no.mp4' },
  thanks: { id: 'thanks', name: 'Obrigado', emoji: '🙏', description: 'Gratidão', librasUrl: '/libras/thanks.mp4' },
  water: { id: 'water', name: 'Água', emoji: '💧', description: 'Bebida', librasUrl: '/libras/water.mp4' },
  food: { id: 'food', name: 'Comida', emoji: '🍽️', description: 'Refeição', librasUrl: '/libras/food.mp4' },
  bathroom: { id: 'bathroom', name: 'Banheiro', emoji: '🚽', description: 'Sanitário', librasUrl: '/libras/bathroom.mp4' },
  tired: { id: 'tired', name: 'Cansado', emoji: '😴', description: 'Fadiga', librasUrl: '/libras/tired.mp4' },
};

// ============================================================================
// HOOK DE TEXT-TO-SPEECH
// ============================================================================

export const useSpeech = () => {
  const speak = (text: string, lang: string = 'pt-BR') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  return { speak, stop };
};

// ============================================================================
// COMPONENTE DE LIBRAS
// ============================================================================

interface LIBRASDisplayProps {
  text: string;
  videoUrl?: string;
}

export const LIBRASDisplay: React.FC<LIBRASDisplayProps> = ({ text, videoUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6 border-4 border-blue-500"
    >
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-900">🤟 LIBRAS</h3>
      </div>

      {videoUrl ? (
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full rounded-lg border-4 border-white"
          style={{ maxHeight: '300px' }}
        />
      ) : (
        <div className="bg-white rounded-lg p-8 text-center border-4 border-gray-300">
          <div className="text-6xl mb-4">🤟</div>
          <p className="text-xl font-bold text-gray-700">{text}</p>
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// PAINEL DE PICTOGRAMAS
// ============================================================================

export const PictogramBoard: React.FC<{
  onSelect: (pictogram: Pictogram) => void;
}> = ({ onSelect }) => {
  const { speak } = useSpeech();

  const handlePictogramClick = (pictogram: Pictogram) => {
    onSelect(pictogram);
    speak(pictogram.name);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl p-6 shadow-lg border-4 border-gray-300"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6">📋 Pictogramas de Comunicação</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.values(PICTOGRAMS).map((pictogram) => (
          <motion.button
            key={pictogram.id}
            onClick={() => handlePictogramClick(pictogram)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-blue-400 to-purple-400 text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border-4 border-white"
          >
            <div className="text-5xl mb-2">{pictogram.emoji}</div>
            <div className="text-sm font-bold">{pictogram.name}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// PAINEL DE CONFIGURAÇÕES DE ACESSIBILIDADE
// ============================================================================

export const AccessibilitySettings: React.FC<{
  settings: AccessibilitySettings;
  onSettingsChange: (settings: AccessibilitySettings) => void;
}> = ({ settings, onSettingsChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`rounded-2xl p-6 shadow-lg border-4 ${
        settings.highContrast
          ? 'bg-black text-white border-yellow-400'
          : 'bg-white text-gray-900 border-gray-300'
      }`}
    >
      <h3 className="text-2xl font-bold mb-6">⚙️ Configurações de Acessibilidade</h3>

      <div className="space-y-6">
        {/* LIBRAS */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg border-2 cursor-pointer ${
            settings.librasEnabled
              ? 'bg-blue-100 border-blue-500'
              : 'bg-gray-100 border-gray-300'
          }`}
          onClick={() =>
            onSettingsChange({ ...settings, librasEnabled: !settings.librasEnabled })
          }
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.librasEnabled}
              readOnly
              className="w-6 h-6 cursor-pointer"
            />
            <div>
              <h4 className="text-lg font-bold">🤟 LIBRAS</h4>
              <p className="text-sm">Mostrar vídeos em Língua Brasileira de Sinais</p>
            </div>
          </div>
        </motion.div>

        {/* Text-to-Speech */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg border-2 cursor-pointer ${
            settings.textToSpeechEnabled
              ? 'bg-green-100 border-green-500'
              : 'bg-gray-100 border-gray-300'
          }`}
          onClick={() =>
            onSettingsChange({
              ...settings,
              textToSpeechEnabled: !settings.textToSpeechEnabled,
            })
          }
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.textToSpeechEnabled}
              readOnly
              className="w-6 h-6 cursor-pointer"
            />
            <div>
              <h4 className="text-lg font-bold">🔊 Leitura por Voz</h4>
              <p className="text-sm">Ouvir o conteúdo em voz alta</p>
            </div>
          </div>
        </motion.div>

        {/* Pictogramas */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg border-2 cursor-pointer ${
            settings.pictogramsEnabled
              ? 'bg-purple-100 border-purple-500'
              : 'bg-gray-100 border-gray-300'
          }`}
          onClick={() =>
            onSettingsChange({
              ...settings,
              pictogramsEnabled: !settings.pictogramsEnabled,
            })
          }
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.pictogramsEnabled}
              readOnly
              className="w-6 h-6 cursor-pointer"
            />
            <div>
              <h4 className="text-lg font-bold">📋 Pictogramas</h4>
              <p className="text-sm">Usar imagens para comunicação</p>
            </div>
          </div>
        </motion.div>

        {/* Alto Contraste */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg border-2 cursor-pointer ${
            settings.highContrast
              ? 'bg-yellow-100 border-yellow-500'
              : 'bg-gray-100 border-gray-300'
          }`}
          onClick={() =>
            onSettingsChange({
              ...settings,
              highContrast: !settings.highContrast,
            })
          }
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.highContrast}
              readOnly
              className="w-6 h-6 cursor-pointer"
            />
            <div>
              <h4 className="text-lg font-bold">🎨 Alto Contraste</h4>
              <p className="text-sm">Aumentar contraste para melhor visibilidade</p>
            </div>
          </div>
        </motion.div>

        {/* Tamanho da Fonte */}
        <div className="p-4 bg-gray-100 rounded-lg border-2 border-gray-300">
          <h4 className="text-lg font-bold mb-3">📝 Tamanho da Fonte</h4>
          <div className="flex gap-2">
            {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
              <motion.button
                key={size}
                onClick={() => onSettingsChange({ ...settings, fontSize: size })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  settings.fontSize === size
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 border-2 border-gray-300'
                }`}
              >
                {size === 'small' && 'A'}
                {size === 'medium' && 'A'}
                {size === 'large' && 'A'}
                {size === 'xlarge' && 'A'}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// PÁGINA COMPLETA DE ACESSIBILIDADE
// ============================================================================

export const AccessibilityHub: React.FC = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    librasEnabled: true,
    textToSpeechEnabled: true,
    highContrast: false,
    fontSize: 'medium',
    pictogramsEnabled: true,
  });

  const [selectedPictogram, setSelectedPictogram] = useState<Pictogram | null>(null);
  const { speak } = useSpeech();

  const fontSizeMap = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors ${
        settings.highContrast
          ? 'bg-black text-white'
          : 'bg-gradient-to-br from-blue-50 to-purple-50'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mb-12 ${fontSizeMap[settings.fontSize]}`}
        >
          <h1 className="text-4xl font-bold mb-2">♿ Educação Acessível para Todos</h1>
          <p className="text-xl">Aprenda do seu jeito, com as ferramentas que você precisa</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configurações */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AccessibilitySettings settings={settings} onSettingsChange={setSettings} />
          </motion.div>

          {/* Conteúdo Principal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* LIBRAS */}
            {settings.librasEnabled && selectedPictogram && (
              <LIBRASDisplay
                text={selectedPictogram.name}
                videoUrl={selectedPictogram.librasUrl}
              />
            )}

            {/* Pictogramas */}
            {settings.pictogramsEnabled && (
              <PictogramBoard onSelect={setSelectedPictogram} />
            )}

            {/* Mensagem de Boas-vindas */}
            {!selectedPictogram && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`rounded-2xl p-8 shadow-lg border-4 text-center ${
                  settings.highContrast
                    ? 'bg-yellow-300 border-yellow-500 text-black'
                    : 'bg-white border-gray-300'
                }`}
              >
                <div className="text-6xl mb-4">👋</div>
                <h2 className="text-3xl font-bold mb-4">Bem-vindo!</h2>
                <p className={`text-xl ${fontSizeMap[settings.fontSize]}`}>
                  Clique em um pictograma para começar. Você pode usar LIBRAS, ouvir a leitura por voz e muito mais!
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
