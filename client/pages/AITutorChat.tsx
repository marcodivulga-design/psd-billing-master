'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AITutorChat.tsx - Modo Professor Particular IA
 * 
 * Funcionalidades:
 * - Chat com IA pedagógica
 * - Explicações simples e claras
 * - Desenhos e exemplos visuais
 * - Exercícios gerados automaticamente
 * - Feedback contextual
 * - Histórico de conversas
 */

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'exercise' | 'explanation' | 'visual';
  metadata?: {
    difficulty?: string;
    topic?: string;
    visualContent?: string;
  };
}

interface ChatSession {
  id: string;
  topic: string;
  messages: Message[];
  createdAt: Date;
  difficulty: 'fácil' | 'médio' | 'difícil';
}

const AITutorChat: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewSession, setShowNewSession] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const generateAIResponse = (userMessage: string): Message => {
    // Simulação de resposta da IA
    const responses: { [key: string]: string } = {
      frações: `Ótima pergunta! Frações são partes de um todo. Imagine uma pizza dividida em 8 pedaços. Se você comer 3 pedaços, você comeu 3/8 da pizza.

🍕 Exemplo Visual:
- 1/2 = metade
- 1/4 = um quarto
- 3/8 = três oitavos

Quer que eu crie um exercício sobre isso?`,
      divisão: `A divisão é o oposto da multiplicação. Quando dividimos, estamos separando em partes iguais.

Exemplo: 12 ÷ 3 = 4
Significa: Se você tem 12 maçãs e quer dividir entre 3 pessoas, cada pessoa recebe 4 maçãs.

Vamos praticar? Quanto é 20 ÷ 5?`,
      interpretação: `Para interpretar um texto, você precisa:
1. Ler com atenção
2. Identificar as ideias principais
3. Entender o que o autor quer dizer
4. Responder perguntas sobre o texto

Qual é o texto que você quer interpretar?`,
    };

    const lowerMessage = userMessage.toLowerCase();
    let responseText = 'Desculpe, não entendi muito bem. Pode reformular sua pergunta?';

    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        responseText = value;
        break;
      }
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      role: 'assistant',
      content: responseText,
      timestamp: new Date(),
      type: 'explanation',
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentSession) return;

    setIsLoading(true);

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
    };

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiResponse],
      };

      setCurrentSession(finalSession);
      setSessions(
        sessions.map((s) => (s.id === finalSession.id ? finalSession : s))
      );
      setInputValue('');
      setIsLoading(false);
    }, 1000);
  };

  const startNewSession = (topic: string, difficulty: 'fácil' | 'médio' | 'difícil') => {
    const newSession: ChatSession = {
      id: Math.random().toString(36).substr(2, 9),
      topic,
      messages: [
        {
          id: Math.random().toString(36).substr(2, 9),
          role: 'assistant',
          content: `Olá! Sou seu professor particular de IA. Vamos aprender sobre ${topic} juntos! 📚

Estou aqui para:
✅ Explicar conceitos de forma simples
✅ Criar exemplos práticos
✅ Gerar exercícios personalizados
✅ Responder suas dúvidas

Como posso ajudar você hoje?`,
          timestamp: new Date(),
          type: 'text',
        },
      ],
      createdAt: new Date(),
      difficulty,
    };

    setSessions([...sessions, newSession]);
    setCurrentSession(newSession);
    setShowNewSession(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col">
      {/* Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 md:p-6 border-b border-slate-700/50"
      >
        <motion.div variants={itemVariants} className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            🤖 Professor Particular IA
          </h1>
          <p className="text-gray-300">Aprenda com um tutor inteligente e personalizado</p>
        </motion.div>
      </motion.div>

      <div className="flex-1 flex gap-4 p-4 md:p-6 max-w-6xl mx-auto w-full">
        {/* Sidebar - Sessões */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex flex-col w-64 bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-slate-700/50"
        >
          <h3 className="font-bold text-white mb-4">📚 Suas Sessões</h3>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {sessions.map((session) => (
              <motion.button
                key={session.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentSession(session)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  currentSession?.id === session.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-slate-700/30 text-gray-300 hover:bg-slate-700/50'
                }`}
              >
                <p className="font-semibold text-sm truncate">{session.topic}</p>
                <p className="text-xs opacity-75">
                  {session.messages.length} mensagens
                </p>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewSession(true)}
            className="w-full mt-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all"
          >
            + Nova Sessão
          </motion.button>
        </motion.div>

        {/* Main Chat Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 flex flex-col bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {showNewSession && !currentSession ? (
              <motion.div
                key="new-session"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                  className="text-6xl mb-6"
                >
                  🤖
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Escolha um Tópico para Aprender
                </h2>
                <p className="text-gray-400 mb-8">
                  Selecione o assunto e o nível de dificuldade
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {[
                    { topic: 'Frações', icon: '🍕', difficulty: 'fácil' as const },
                    { topic: 'Divisão', icon: '➗', difficulty: 'médio' as const },
                    { topic: 'Interpretação de Texto', icon: '📖', difficulty: 'médio' as const },
                    { topic: 'Geometria', icon: '📐', difficulty: 'difícil' as const },
                  ].map((item, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startNewSession(item.topic, item.difficulty)}
                      className="p-4 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg border border-slate-600 hover:border-purple-500 transition-all"
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <p className="font-bold text-white">{item.topic}</p>
                      <p className="text-xs text-gray-400 capitalize">{item.difficulty}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : currentSession ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full"
              >
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {currentSession.messages.map((message, idx) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-slate-700/50 text-gray-200 border border-slate-600'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-slate-700/50 text-gray-200 px-4 py-3 rounded-lg border border-slate-600">
                        <div className="flex gap-2">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ y: [0, -8, 0] }}
                              transition={{
                                delay: i * 0.1,
                                repeat: Infinity,
                                duration: 0.6,
                              }}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-700/50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isLoading) {
                          handleSendMessage();
                        }
                      }}
                      placeholder="Digite sua pergunta..."
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none disabled:opacity-50"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
                    >
                      Enviar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AITutorChat;
