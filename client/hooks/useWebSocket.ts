import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useWebSocket.ts - Hook para WebSocket em Tempo Real
 * 
 * Funcionalidades:
 * - Conexão automática
 * - Reconexão automática
 * - Gerenciamento de mensagens
 * - Notificações em tempo real
 * - Leaderboard ao vivo
 */

interface WebSocketMessage {
  type: string;
  data?: any;
  message?: string;
  [key: string]: any;
}

interface UseWebSocketOptions {
  url?: string;
  userId: string;
  userName: string;
  level?: number;
  xp?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onNotification?: (notification: any) => void;
  onLeaderboardUpdate?: (leaderboard: any[]) => void;
  onLevelUp?: (level: number) => void;
}

export const useWebSocket = ({
  url = process.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080',
  userId,
  userName,
  level = 1,
  xp = 0,
  onMessage,
  onNotification,
  onLeaderboardUpdate,
  onLevelUp,
}: UseWebSocketOptions) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = useRef(1000);

  // Conectar ao WebSocket
  useEffect(() => {
    const connect = () => {
      try {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
          console.log('WebSocket conectado');
          setIsConnected(true);
          reconnectAttempts.current = 0;
          reconnectDelay.current = 1000;

          // Registrar usuário
          if (ws.current) {
            ws.current.send(
              JSON.stringify({
                type: 'register',
                userId,
                payload: { name: userName, level, xp },
              })
            );
          }
        };

        ws.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            handleMessage(message);
          } catch (error) {
            console.error('Erro ao processar mensagem:', error);
          }
        };

        ws.current.onerror = (error) => {
          console.error('Erro WebSocket:', error);
          setIsConnected(false);
        };

        ws.current.onclose = () => {
          console.log('WebSocket desconectado');
          setIsConnected(false);

          // Tentar reconectar
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            const delay = reconnectDelay.current * Math.pow(2, reconnectAttempts.current - 1);
            console.log(`Tentando reconectar em ${delay}ms...`);
            setTimeout(connect, delay);
          }
        };
      } catch (error) {
        console.error('Erro ao conectar WebSocket:', error);
      }
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, userId, userName, level, xp]);

  // Processar mensagens
  const handleMessage = useCallback(
    (message: WebSocketMessage) => {
      switch (message.type) {
        case 'registered':
          console.log('Usuário registrado com sucesso');
          break;

        case 'notification':
          if (message.notification) {
            setNotifications((prev) => [message.notification, ...prev].slice(0, 10));
            onNotification?.(message.notification);
          }
          break;

        case 'leaderboard':
          if (message.data) {
            setLeaderboard(message.data);
            onLeaderboardUpdate?.(message.data);
          }
          break;

        case 'level-up-notification':
          onLevelUp?.(message.newLevel);
          break;

        case 'xp-gain':
        case 'level-up':
        case 'achievement':
        case 'challenge-accepted':
        case 'game-result':
        case 'user-online':
        case 'user-offline':
        case 'ranking-update':
        case 'chat-message':
          onMessage?.(message);
          break;

        default:
          console.log('Mensagem desconhecida:', message);
      }
    },
    [onMessage, onNotification, onLeaderboardUpdate, onLevelUp]
  );

  // Enviar XP
  const sendXPGain = useCallback(
    (xp: number, source: string) => {
      if (ws.current && isConnected) {
        ws.current.send(
          JSON.stringify({
            type: 'xp-gain',
            userId,
            payload: { xp, source },
          })
        );
      }
    },
    [userId, isConnected]
  );

  // Enviar Level Up
  const sendLevelUp = useCallback(
    (newLevel: number, totalXP: number) => {
      if (ws.current && isConnected) {
        ws.current.send(
          JSON.stringify({
            type: 'level-up',
            userId,
            payload: { newLevel, totalXP },
          })
        );
      }
    },
    [userId, isConnected]
  );

  // Enviar Conquista
  const sendAchievement = useCallback(
    (achievementId: string, achievementName: string, points: number) => {
      if (ws.current && isConnected) {
        ws.current.send(
          JSON.stringify({
            type: 'achievement',
            userId,
            payload: { achievementId, achievementName, points },
          })
        );
      }
    },
    [userId, isConnected]
  );

  // Enviar Resultado de Jogo
  const sendGameResult = useCallback(
    (gameName: string, score: number, result: 'win' | 'loss', reward: number) => {
      if (ws.current && isConnected) {
        ws.current.send(
          JSON.stringify({
            type: 'game-result',
            userId,
            payload: { gameName, score, result, reward },
          })
        );
      }
    },
    [userId, isConnected]
  );

  // Enviar Mensagem de Chat
  const sendChatMessage = useCallback(
    (message: string, channelId: string) => {
      if (ws.current && isConnected) {
        ws.current.send(
          JSON.stringify({
            type: 'chat-message',
            userId,
            payload: { message, channelId },
          })
        );
      }
    },
    [userId, isConnected]
  );

  // Solicitar Leaderboard
  const requestLeaderboard = useCallback(() => {
    if (ws.current && isConnected) {
      ws.current.send(
        JSON.stringify({
          type: 'get-leaderboard',
          userId,
        })
      );
    }
  }, [userId, isConnected]);

  // Solicitar Notificações
  const requestNotifications = useCallback(() => {
    if (ws.current && isConnected) {
      ws.current.send(
        JSON.stringify({
          type: 'get-notifications',
          userId,
        })
      );
    }
  }, [userId, isConnected]);

  return {
    isConnected,
    leaderboard,
    notifications,
    sendXPGain,
    sendLevelUp,
    sendAchievement,
    sendGameResult,
    sendChatMessage,
    requestLeaderboard,
    requestNotifications,
  };
};

export default useWebSocket;
