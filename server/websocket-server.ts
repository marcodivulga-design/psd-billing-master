/**
 * websocket-server.ts - WebSocket Server para Tempo Real
 * 
 * Funcionalidades:
 * - Notificações em tempo real
 * - Ranking ao vivo
 * - Chat em tempo real
 * - Desafios e batalhas ao vivo
 * - Atualizações de XP e níveis
 */

import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  socket: WebSocket;
}

interface Notification {
  id: string;
  userId: string;
  type: 'achievement' | 'challenge' | 'level-up' | 'friend-activity' | 'leaderboard';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
}

interface RealTimeEvent {
  type: 'xp-gain' | 'level-up' | 'achievement' | 'challenge-accepted' | 'game-result' | 'ranking-update';
  userId: string;
  data: any;
  timestamp: Date;
}

class WebSocketServer {
  private wss: WebSocketServer;
  private users: Map<string, User> = new Map();
  private notifications: Map<string, Notification[]> = new Map();
  private leaderboard: User[] = [];

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.setupConnections();
  }

  private setupConnections() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Novo cliente WebSocket conectado');

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Erro ao processar mensagem:', error);
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });

      ws.on('error', (error) => {
        console.error('Erro WebSocket:', error);
      });
    });
  }

  private handleMessage(ws: WebSocket, data: any) {
    const { type, userId, payload } = data;

    switch (type) {
      case 'register':
        this.registerUser(ws, userId, payload);
        break;
      case 'xp-gain':
        this.handleXPGain(userId, payload);
        break;
      case 'level-up':
        this.handleLevelUp(userId, payload);
        break;
      case 'achievement':
        this.handleAchievement(userId, payload);
        break;
      case 'challenge-accepted':
        this.handleChallengeAccepted(userId, payload);
        break;
      case 'game-result':
        this.handleGameResult(userId, payload);
        break;
      case 'chat-message':
        this.handleChatMessage(userId, payload);
        break;
      case 'get-leaderboard':
        this.sendLeaderboard(ws);
        break;
      case 'get-notifications':
        this.sendNotifications(ws, userId);
        break;
      default:
        console.log('Tipo de mensagem desconhecido:', type);
    }
  }

  private registerUser(ws: WebSocket, userId: string, payload: any) {
    const user: User = {
      id: userId,
      name: payload.name,
      level: payload.level || 1,
      xp: payload.xp || 0,
      socket: ws,
    };

    this.users.set(userId, user);
    this.updateLeaderboard();

    // Enviar confirmação
    ws.send(
      JSON.stringify({
        type: 'registered',
        message: 'Conectado com sucesso',
        userId,
      })
    );

    // Notificar outros usuários
    this.broadcastEvent({
      type: 'user-online',
      userId,
      data: { name: user.name, level: user.level },
      timestamp: new Date(),
    });
  }

  private handleXPGain(userId: string, payload: any) {
    const user = this.users.get(userId);
    if (!user) return;

    const { xp, source } = payload;
    user.xp += xp;

    // Verificar level up
    const newLevel = Math.floor(user.xp / 1000) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
      this.handleLevelUp(userId, { newLevel, totalXP: user.xp });
    }

    // Criar notificação
    this.createNotification(userId, {
      type: 'achievement',
      title: '⭐ XP Ganho!',
      message: `Você ganhou ${xp} XP em ${source}!`,
      data: { xp, source, totalXP: user.xp },
    });

    // Atualizar leaderboard
    this.updateLeaderboard();

    // Broadcast do evento
    this.broadcastEvent({
      type: 'xp-gain',
      userId,
      data: { xp, totalXP: user.xp, source },
      timestamp: new Date(),
    });
  }

  private handleLevelUp(userId: string, payload: any) {
    const user = this.users.get(userId);
    if (!user) return;

    const { newLevel } = payload;

    // Criar notificação especial
    this.createNotification(userId, {
      type: 'level-up',
      title: '🎉 Level Up!',
      message: `Parabéns! Você atingiu o nível ${newLevel}!`,
      data: { newLevel, totalXP: user.xp },
    });

    // Broadcast para todos os usuários
    this.broadcastEvent({
      type: 'level-up',
      userId,
      data: { newLevel, name: user.name },
      timestamp: new Date(),
    });

    // Enviar para o usuário
    user.socket.send(
      JSON.stringify({
        type: 'level-up-notification',
        title: '🎉 Level Up!',
        message: `Parabéns! Você atingiu o nível ${newLevel}!`,
        newLevel,
      })
    );
  }

  private handleAchievement(userId: string, payload: any) {
    const { achievementId, achievementName, points } = payload;

    this.createNotification(userId, {
      type: 'achievement',
      title: '🏆 Conquista Desbloqueada!',
      message: `Você desbloqueou: ${achievementName}`,
      data: { achievementId, points },
    });

    this.broadcastEvent({
      type: 'achievement',
      userId,
      data: { achievementName, points },
      timestamp: new Date(),
    });
  }

  private handleChallengeAccepted(userId: string, payload: any) {
    const { challengeId, challengeName, opponent } = payload;

    this.createNotification(userId, {
      type: 'challenge',
      title: '⚔️ Desafio Aceito!',
      message: `Você aceitou um desafio com ${opponent}`,
      data: { challengeId, challengeName },
    });

    this.broadcastEvent({
      type: 'challenge-accepted',
      userId,
      data: { challengeName, opponent },
      timestamp: new Date(),
    });
  }

  private handleGameResult(userId: string, payload: any) {
    const { gameName, score, result, reward } = payload;

    const resultText = result === 'win' ? 'Vitória!' : 'Derrota';
    const resultEmoji = result === 'win' ? '🎮✅' : '🎮❌';

    this.createNotification(userId, {
      type: 'achievement',
      title: `${resultEmoji} ${gameName}`,
      message: `${resultText} - Pontuação: ${score}`,
      data: { gameName, score, result, reward },
    });

    // Se foi vitória, adicionar XP
    if (result === 'win') {
      this.handleXPGain(userId, { xp: reward, source: gameName });
    }

    this.broadcastEvent({
      type: 'game-result',
      userId,
      data: { gameName, score, result },
      timestamp: new Date(),
    });
  }

  private handleChatMessage(userId: string, payload: any) {
    const { message, channelId } = payload;
    const user = this.users.get(userId);

    if (!user) return;

    // Broadcast para o canal
    this.broadcastToChannel(channelId, {
      type: 'chat-message',
      userId,
      userName: user.name,
      message,
      timestamp: new Date(),
    });
  }

  private createNotification(userId: string, notification: Omit<Notification, 'id' | 'userId' | 'timestamp'>) {
    const notif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      ...notification,
      timestamp: new Date(),
    };

    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }

    this.notifications.get(userId)!.push(notif);

    // Enviar para o usuário se conectado
    const user = this.users.get(userId);
    if (user) {
      user.socket.send(
        JSON.stringify({
          type: 'notification',
          notification: notif,
        })
      );
    }
  }

  private updateLeaderboard() {
    this.leaderboard = Array.from(this.users.values())
      .sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        return b.xp - a.xp;
      })
      .slice(0, 10);

    this.broadcastEvent({
      type: 'ranking-update',
      userId: 'system',
      data: { leaderboard: this.leaderboard },
      timestamp: new Date(),
    });
  }

  private sendLeaderboard(ws: WebSocket) {
    ws.send(
      JSON.stringify({
        type: 'leaderboard',
        data: this.leaderboard.map((user) => ({
          id: user.id,
          name: user.name,
          level: user.level,
          xp: user.xp,
        })),
      })
    );
  }

  private sendNotifications(ws: WebSocket, userId: string) {
    const notifications = this.notifications.get(userId) || [];
    ws.send(
      JSON.stringify({
        type: 'notifications',
        data: notifications,
      })
    );
  }

  private broadcastEvent(event: RealTimeEvent) {
    const message = JSON.stringify(event);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  private broadcastToChannel(channelId: string, data: any) {
    const message = JSON.stringify(data);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  private handleDisconnect(ws: WebSocket) {
    let disconnectedUserId: string | null = null;

    for (const [userId, user] of this.users.entries()) {
      if (user.socket === ws) {
        disconnectedUserId = userId;
        this.users.delete(userId);
        break;
      }
    }

    if (disconnectedUserId) {
      this.updateLeaderboard();
      this.broadcastEvent({
        type: 'user-offline',
        userId: disconnectedUserId,
        data: { userId: disconnectedUserId },
        timestamp: new Date(),
      });
    }
  }
}

export default WebSocketServer;
