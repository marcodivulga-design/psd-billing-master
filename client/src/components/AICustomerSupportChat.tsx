import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, Phone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sentiment?: string;
}

interface AICustomerSupportChatProps {
  organizationId?: string;
  onClose?: () => void;
  channel?: 'web' | 'whatsapp' | 'telegram' | 'email';
}

export function AICustomerSupportChat({
  organizationId,
  onClose,
  channel = 'web',
}: AICustomerSupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [escalated, setEscalated] = useState(false);
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative'>('neutral');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Iniciar conversa ao montar
  useEffect(() => {
    initializeConversation();
  }, []);

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeConversation = async () => {
    try {
      setLoading(true);
      // Simulação - em produção chamaria a API
      const newConversationId = `conv_${Date.now()}`;
      setConversationId(newConversationId);

      const welcomeMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: '👋 Olá! Bem-vindo ao nosso atendimento. Como posso ajudá-lo hoje?',
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !conversationId) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Simulação - em produção chamaria a API
      const response = await simulateAIResponse(inputValue);

      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Analisar sentimento
      const newSentiment = analyzeSentiment(inputValue);
      setSentiment(newSentiment);

      // Verificar se deve escalar
      if (newSentiment === 'negative' && messages.length > 6) {
        setEscalated(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulação de resposta IA
    const responses: Record<string, string> = {
      oi: 'Olá! Como posso ajudá-lo?',
      produto: 'Temos várias opções de produtos. Qual você está procurando?',
      preço: 'Os preços variam conforme o produto. Qual você está interessado?',
      envio: 'Oferecemos frete grátis para compras acima de R$ 100.',
      devolução: 'Você pode devolver em até 30 dias sem custo.',
      problema: 'Desculpe ouvir isso. Vou ajudá-lo a resolver. Qual é o problema?',
      obrigado: 'De nada! Fico feliz em ajudar!',
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return value;
      }
    }

    return 'Entendi sua pergunta. Como posso ajudá-lo melhor?';
  };

  const analyzeSentiment = (message: string): 'positive' | 'neutral' | 'negative' => {
    const negativeWords = ['ruim', 'péssimo', 'horrível', 'problema', 'erro', 'frustrado', 'raiva'];
    const positiveWords = ['ótimo', 'excelente', 'perfeito', 'obrigado', 'feliz'];

    const lowerMessage = message.toLowerCase();
    const negativeCount = negativeWords.filter(w => lowerMessage.includes(w)).length;
    const positiveCount = positiveWords.filter(w => lowerMessage.includes(w)).length;

    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  };

  const handleEscalate = () => {
    const escalationMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: '🤝 Vejo que você pode precisar de mais ajuda. Vou conectá-lo com um agente humano em breve.',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, escalationMessage]);
    setEscalated(true);
  };

  const getSentimentColor = (): string => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'negative':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getSentimentIcon = (): string => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😟';
      default:
        return '😐';
    }
  };

  return (
    <Card className={`flex flex-col h-96 w-full max-w-md ${getSentimentColor()} border-2`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <div>
            <h3 className="font-bold">Atendimento IA</h3>
            <p className="text-xs opacity-90">{getSentimentIcon()} {sentiment}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Alerta de Escalação */}
      {escalated && (
        <div className="px-4 py-2 bg-orange-50 border-t border-orange-200 flex items-gap gap-2">
          <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
          <p className="text-xs text-orange-700">Um agente humano entrará em contato em breve</p>
        </div>
      )}

      {/* Input */}
      <div className="border-t p-3 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Digite sua mensagem..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          disabled={loading || escalated}
        />
        <Button
          onClick={handleSendMessage}
          disabled={loading || !inputValue.trim()}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Send className="w-4 h-4" />
        </Button>
        {!escalated && (
          <Button
            onClick={handleEscalate}
            variant="outline"
            size="sm"
            title="Falar com agente humano"
          >
            <Phone className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
