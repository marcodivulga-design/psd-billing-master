'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AccessibilityModule.tsx - Módulo de Acessibilidade Especial
 * 
 * Funcionalidades:
 * - Alto contraste
 * - Leitura por voz
 * - LIBRAS (integração)
 * - Pictogramas
 * - Comandos simples
 * - Exercícios adaptados
 */

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  audioDescription: boolean;
  libras: boolean;
  pictograms: boolean;
  simplifiedNavigation: boolean;
  textToSpeech: boolean;
  fontSize: number;
}

interface AccessibleContent {
  id: string;
  title: string;
  description: string;
  pictogram: string;
  audioUrl?: string;
  librasUrl?: string;
  simplifiedText: string;
}

const AccessibilityModule: React.FC = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    audioDescription: false,
    libras: false,
    pictograms: true,
    simplifiedNavigation: true,
    textToSpeech: false,
    fontSize: 16,
  });

  const [selectedContent, setSelectedContent] = useState<AccessibleContent | null>(null);

  const accessibleContents: AccessibleContent[] = [
    {
      id: '1',
      title: 'Matemática Básica',
      description: 'Aprenda os números e operações básicas',
      pictogram: '🔢',
      simplifiedText: 'Números: 1, 2, 3...',
      audioUrl: '/audio/math-intro.mp3',
      librasUrl: '/video/libras-math.mp4',
    },
    {
      id: '2',
      title: 'Português Simples',
      description: 'Leia e escreva palavras simples',
      pictogram: '📖',
      simplifiedText: 'Palavras: gato, casa, sol',
      audioUrl: '/audio/portuguese-intro.mp3',
      librasUrl: '/video/libras-portuguese.mp4',
    },
    {
      id: '3',
      title: 'Cores e Formas',
      description: 'Identifique cores e formas',
      pictogram: '🎨',
      simplifiedText: 'Cores: vermelho, azul, amarelo',
      audioUrl: '/audio/colors-intro.mp3',
      librasUrl: '/video/libras-colors.mp4',
    },
    {
      id: '4',
      title: 'Emoções',
      description: 'Reconheça e expresse emoções',
      pictogram: '😊',
      simplifiedText: 'Feliz, triste, bravo, assustado',
      audioUrl: '/audio/emotions-intro.mp3',
      librasUrl: '/video/libras-emotions.mp4',
    },
  ];

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const changeFontSize = (delta: number) => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.max(12, Math.min(32, prev.fontSize + delta)),
    }));
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

  const bgColor = settings.highContrast ? '#000000' : '#FFFFFF';
  const textColor = settings.highContrast ? '#FFFFFF' : '#000000';
  const accentColor = settings.highContrast ? '#FFFF00' : '#3498DB';

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        transition: 'all 0.3s ease',
        minHeight: '100vh',
        padding: '32px 16px',
      }}
    >
      {/* Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.div variants={itemVariants}>
          <h1
            style={{
              fontSize: `${settings.fontSize + 12}px`,
              fontWeight: 'bold',
              marginBottom: '8px',
              color: accentColor,
            }}
          >
            ♿ Educação Especial
          </h1>
          <p style={{ fontSize: `${settings.fontSize}px` }}>
            Aprenda do seu jeito, com as ferramentas certas
          </p>
        </motion.div>
      </motion.div>

      {/* Settings Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          backgroundColor: settings.highContrast ? '#111111' : '#F5F5F5',
          border: `3px solid ${accentColor}`,
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
        }}
      >
        <h2
          style={{
            fontSize: `${settings.fontSize + 4}px`,
            fontWeight: 'bold',
            marginBottom: '16px',
            color: accentColor,
          }}
        >
          ⚙️ Configurações de Acessibilidade
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { key: 'highContrast', label: '⚫ Alto Contraste', icon: '◼️' },
            { key: 'largeText', label: '📝 Texto Grande', icon: '🔤' },
            { key: 'audioDescription', label: '🔊 Áudio Descritivo', icon: '🎧' },
            { key: 'libras', label: '🤟 LIBRAS', icon: '✋' },
            { key: 'pictograms', label: '🖼️ Pictogramas', icon: '🎨' },
            { key: 'simplifiedNavigation', label: '🧭 Navegação Simples', icon: '➡️' },
            { key: 'textToSpeech', label: '🗣️ Falar Texto', icon: '🔈' },
          ].map((item) => (
            <motion.button
              key={item.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSetting(item.key as keyof AccessibilitySettings)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: `3px solid ${settings[item.key as keyof AccessibilitySettings] ? accentColor : '#CCCCCC'}`,
                backgroundColor: settings[item.key as keyof AccessibilitySettings] ? accentColor : 'transparent',
                color: settings[item.key as keyof AccessibilitySettings] ? (settings.highContrast ? '#000000' : '#FFFFFF') : textColor,
                fontSize: `${settings.fontSize}px`,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
              {item.label}
            </motion.button>
          ))}
        </div>

        {/* Font Size Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <label style={{ fontSize: `${settings.fontSize}px`, fontWeight: 'bold' }}>
            Tamanho da Fonte:
          </label>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => changeFontSize(-2)}
            style={{
              padding: '8px 16px',
              fontSize: `${settings.fontSize}px`,
              backgroundColor: accentColor,
              color: settings.highContrast ? '#000000' : '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            -
          </motion.button>
          <span style={{ fontSize: `${settings.fontSize + 2}px`, fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>
            {settings.fontSize}px
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => changeFontSize(2)}
            style={{
              padding: '8px 16px',
              fontSize: `${settings.fontSize}px`,
              backgroundColor: accentColor,
              color: settings.highContrast ? '#000000' : '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            +
          </motion.button>
        </div>
      </motion.div>

      {/* Content Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {accessibleContents.map((content) => (
          <motion.button
            key={content.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedContent(content)}
            style={{
              padding: '24px',
              borderRadius: '12px',
              border: `3px solid ${accentColor}`,
              backgroundColor: settings.highContrast ? '#111111' : '#F9F9F9',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {settings.pictograms && (
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                {content.pictogram}
              </div>
            )}
            <h3
              style={{
                fontSize: `${settings.fontSize + 2}px`,
                fontWeight: 'bold',
                marginBottom: '8px',
                color: accentColor,
              }}
            >
              {content.title}
            </h3>
            <p style={{ fontSize: `${settings.fontSize}px` }}>
              {content.description}
            </p>
          </motion.button>
        ))}
      </motion.div>

      {/* Modal de Conteúdo */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedContent(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 50,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: bgColor,
                border: `3px solid ${accentColor}`,
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '500px',
                width: '100%',
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: '16px', textAlign: 'center' }}>
                {selectedContent.pictogram}
              </div>

              <h2
                style={{
                  fontSize: `${settings.fontSize + 6}px`,
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  textAlign: 'center',
                  color: accentColor,
                }}
              >
                {selectedContent.title}
              </h2>

              <p style={{ fontSize: `${settings.fontSize}px`, marginBottom: '16px', textAlign: 'center' }}>
                {selectedContent.description}
              </p>

              <div
                style={{
                  backgroundColor: settings.highContrast ? '#111111' : '#F5F5F5',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: `2px solid ${accentColor}`,
                }}
              >
                <p style={{ fontSize: `${settings.fontSize}px`, fontWeight: 'bold' }}>
                  {selectedContent.simplifiedText}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {settings.audioDescription && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    style={{
                      padding: '12px',
                      fontSize: `${settings.fontSize}px`,
                      backgroundColor: accentColor,
                      color: settings.highContrast ? '#000000' : '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    🔊 Ouvir
                  </motion.button>
                )}

                {settings.libras && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    style={{
                      padding: '12px',
                      fontSize: `${settings.fontSize}px`,
                      backgroundColor: accentColor,
                      color: settings.highContrast ? '#000000' : '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    🤟 LIBRAS
                  </motion.button>
                )}

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedContent(null)}
                  style={{
                    padding: '12px',
                    fontSize: `${settings.fontSize}px`,
                    backgroundColor: accentColor,
                    color: settings.highContrast ? '#000000' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  ✅ Entendi
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccessibilityModule;
