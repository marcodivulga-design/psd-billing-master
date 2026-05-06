'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdaptiveText from '@/components/AdaptiveText';
import AdaptiveButton from '@/components/AdaptiveButton';
import { useToast } from '@/components/ui/use-toast';

/**
 * MunicipalEvents.tsx - Eventos e Desafios Municipais
 * 
 * Exemplo: "Semana da Leitura"
 * Todas as escolas competem com:
 * - Leitura
 * - Interpretação
 * - Produção artística
 * 
 * Com medalhas, certificados, ranking, destaque municipal
 */

interface Event {
  id: string;
  name: string;
  description: string;
  icon: string;
  startDate: string;
  endDate: string;
  categories: string[];
  prizes: {
    gold: string;
    silver: string;
    bronze: string;
  };
  participants: number;
  status: 'upcoming' | 'ongoing' | 'finished';
}

interface Challenge {
  id: string;
  eventId: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  participants: number;
  completed: number;
}

interface Ranking {
  position: number;
  school: string;
  city: string;
  points: number;
  medals: { gold: number; silver: number; bronze: number };
  trend: 'up' | 'down' | 'stable';
}

const MunicipalEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 'event_1',
      name: 'Semana da Leitura',
      description: 'Competição municipal de leitura, interpretação e produção artística',
      icon: '📚',
      startDate: '2024-02-01',
      endDate: '2024-02-07',
      categories: ['Leitura', 'Interpretação', 'Produção Artística'],
      prizes: {
        gold: 'Troféu de Ouro + Certificado',
        silver: 'Troféu de Prata + Certificado',
        bronze: 'Troféu de Bronze + Certificado',
      },
      participants: 1250,
      status: 'upcoming',
    },
    {
      id: 'event_2',
      name: 'Olimpíada de Matemática',
      description: 'Desafios matemáticos progressivos para todas as séries',
      icon: '🔢',
      startDate: '2024-01-15',
      endDate: '2024-01-29',
      categories: ['Fundamental I', 'Fundamental II', 'Ensino Médio'],
      prizes: {
        gold: 'Medalha de Ouro + Certificado',
        silver: 'Medalha de Prata + Certificado',
        bronze: 'Medalha de Bronze + Certificado',
      },
      participants: 2100,
      status: 'ongoing',
    },
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'challenge_1',
      eventId: 'event_2',
      name: 'Desafio da Tabuada',
      description: 'Responda 20 questões de tabuada em menos de 5 minutos',
      category: 'Fundamental I',
      difficulty: 'easy',
      xpReward: 50,
      participants: 450,
      completed: 320,
    },
    {
      id: 'challenge_2',
      eventId: 'event_2',
      name: 'Desafio de Álgebra',
      description: 'Resolva 10 equações de primeiro grau',
      category: 'Fundamental II',
      difficulty: 'medium',
      xpReward: 100,
      participants: 380,
      completed: 210,
    },
  ]);

  const [rankings, setRankings] = useState<Ranking[]>([
    {
      position: 1,
      school: 'Escola Municipal Centro',
      city: 'São Paulo',
      points: 2450,
      medals: { gold: 5, silver: 3, bronze: 2 },
      trend: 'up',
    },
    {
      position: 2,
      school: 'Escola Estadual Zona Norte',
      city: 'São Paulo',
      points: 2180,
      medals: { gold: 4, silver: 2, bronze: 4 },
      trend: 'stable',
    },
    {
      position: 3,
      school: 'Escola Particular Elite',
      city: 'São Paulo',
      points: 1950,
      medals: { gold: 3, silver: 4, bronze: 1 },
      trend: 'down',
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [userParticipation, setUserParticipation] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleJoinEvent = (eventId: string) => {
    setUserParticipation({
      ...userParticipation,
      [eventId]: !userParticipation[eventId],
    });

    const event = events.find((e) => e.id === eventId);
    if (!userParticipation[eventId]) {
      toast({
        title: '✅ Você se inscreveu!',
        description: `Você está participando de "${event?.name}"`,
        variant: 'success',
      });
    } else {
      toast({
        title: '❌ Inscrição cancelada',
        description: `Você se desinscreveu de "${event?.name}"`,
        variant: 'destructive',
      });
    }
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <AdaptiveText variant="heading" className="text-4xl mb-2">
            🏆 Eventos e Desafios Municipais
          </AdaptiveText>
          <AdaptiveText variant="subheading" className="text-gray-600">
            Participe de competições educacionais e ganhe medalhas, certificados e destaque municipal
          </AdaptiveText>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-3xl font-bold text-yellow-600">{events.length}</div>
            <div className="text-gray-600">Eventos Ativos</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">🎪</div>
            <div className="text-3xl font-bold text-orange-600">
              {challenges.length}
            </div>
            <div className="text-gray-600">Desafios</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-red-600">
              {events.reduce((acc, e) => acc + e.participants, 0)}
            </div>
            <div className="text-gray-600">Participantes</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">🏅</div>
            <div className="text-3xl font-bold text-purple-600">
              {rankings.reduce((acc, r) => acc + r.medals.gold + r.medals.silver + r.medals.bronze, 0)}
            </div>
            <div className="text-gray-600">Medalhas Distribuídas</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Events List */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            <AdaptiveText variant="heading" className="text-2xl mb-4">
              📅 Eventos Disponíveis
            </AdaptiveText>

            {events.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedEvent(event.id)}
                className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all ${
                  selectedEvent === event.id ? 'ring-2 ring-orange-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{event.icon}</div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{event.name}</div>
                      <p className="text-gray-600 mb-3">{event.description}</p>

                      <div className="flex gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Início:</span>
                          <div className="font-bold">{event.startDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Fim:</span>
                          <div className="font-bold">{event.endDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Participantes:</span>
                          <div className="font-bold">{event.participants}</div>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-4">
                        {event.categories.map((cat) => (
                          <span
                            key={cat}
                            className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-bold"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-lg font-bold text-white ${
                      event.status === 'upcoming'
                        ? 'bg-blue-500'
                        : event.status === 'ongoing'
                          ? 'bg-green-500'
                          : 'bg-gray-500'
                    }`}
                  >
                    {event.status === 'upcoming'
                      ? 'Em Breve'
                      : event.status === 'ongoing'
                        ? 'Em Andamento'
                        : 'Finalizado'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="text-2xl mb-1">🥇</div>
                    <div className="text-xs text-gray-600">Ouro</div>
                    <div className="font-bold text-sm">{event.prizes.gold}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-2xl mb-1">🥈</div>
                    <div className="text-xs text-gray-600">Prata</div>
                    <div className="font-bold text-sm">{event.prizes.silver}</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="text-2xl mb-1">🥉</div>
                    <div className="text-xs text-gray-600">Bronze</div>
                    <div className="font-bold text-sm">{event.prizes.bronze}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinEvent(event.id)}
                  className={`w-full px-4 py-3 rounded-lg font-bold transition-colors ${
                    userParticipation[event.id]
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {userParticipation[event.id] ? '❌ Cancelar Inscrição' : '✅ Se Inscrever'}
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Ranking */}
          <motion.div variants={itemVariants} className="space-y-4">
            <AdaptiveText variant="heading" className="text-2xl mb-4">
              🏅 Ranking Municipal
            </AdaptiveText>

            <div className="bg-white rounded-lg shadow-lg p-6 space-y-3">
              {rankings.map((rank) => (
                <motion.div
                  key={rank.position}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4"
                  style={{
                    borderColor:
                      rank.position === 1
                        ? '#FFD700'
                        : rank.position === 2
                          ? '#C0C0C0'
                          : '#CD7F32',
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`text-3xl font-bold w-10 h-10 rounded-full flex items-center justify-center text-white ${
                          rank.position === 1
                            ? 'bg-yellow-500'
                            : rank.position === 2
                              ? 'bg-gray-400'
                              : 'bg-orange-600'
                        }`}
                      >
                        {rank.position}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{rank.school}</div>
                        <div className="text-xs text-gray-600">{rank.city}</div>
                      </div>
                    </div>
                    <div
                      className={`text-2xl ${
                        rank.trend === 'up'
                          ? 'text-green-500'
                          : rank.trend === 'down'
                            ? 'text-red-500'
                            : 'text-gray-500'
                      }`}
                    >
                      {rank.trend === 'up' ? '📈' : rank.trend === 'down' ? '📉' : '➡️'}
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="text-2xl font-bold text-purple-600">{rank.points} pts</div>
                  </div>

                  <div className="flex gap-2 text-sm">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-bold">
                      🥇 {rank.medals.gold}
                    </span>
                    <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded font-bold">
                      🥈 {rank.medals.silver}
                    </span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded font-bold">
                      🥉 {rank.medals.bronze}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Challenges */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <AdaptiveText variant="heading" className="text-lg mb-3">
                🎯 Desafios Ativos
              </AdaptiveText>

              <div className="space-y-2">
                {challenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    whileHover={{ scale: 1.05 }}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="font-bold text-sm mb-1">{challenge.name}</div>
                    <div className="text-xs text-gray-600 mb-2">{challenge.description}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-purple-600">
                        +{challenge.xpReward} XP
                      </span>
                      <span className="text-xs text-gray-600">
                        {challenge.completed}/{challenge.participants}
                      </span>
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

export default MunicipalEvents;
