import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MinigamesHub from '../MinigamesHub';

// Mock do trpc
vi.mock('../../utils/trpc', () => ({
  trpc: {
    minigames: {
      getAll: {
        useQuery: vi.fn(() => ({
          data: [],
          isLoading: false,
        })),
      },
    },
  },
}));

// Mock do use-toast
vi.mock('../../components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('MinigamesHub Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o hub com título', () => {
    render(<MinigamesHub />);
    expect(screen.getByText(/Hub de Minijogos/i)).toBeInTheDocument();
  });

  it('deve exibir estatísticas do jogador', () => {
    render(<MinigamesHub />);
    expect(screen.getByText(/Nível/i)).toBeInTheDocument();
    expect(screen.getByText(/Pontos/i)).toBeInTheDocument();
    expect(screen.getByText(/Jogos/i)).toBeInTheDocument();
    expect(screen.getByText(/Sequência/i)).toBeInTheDocument();
    expect(screen.getByText(/Precisão/i)).toBeInTheDocument();
  });

  it('deve exibir desafios diários', () => {
    render(<MinigamesHub />);
    expect(screen.getByText(/Desafios Diários/i)).toBeInTheDocument();
  });

  it('deve exibir 3 desafios diários', () => {
    render(<MinigamesHub />);
    const challenges = screen.getAllByText(/Jogo da Memória|Digitação Rápida|Desafio Matemático/i);
    expect(challenges.length).toBeGreaterThanOrEqual(3);
  });

  it('deve exibir progresso dos desafios', () => {
    render(<MinigamesHub />);
    expect(screen.getByText(/Jogo da Memória/i)).toBeInTheDocument();
  });

  it('deve exibir recompensas dos desafios', () => {
    render(<MinigamesHub />);
    expect(screen.getByText(/500 XP/i)).toBeInTheDocument();
  });

  it('deve exibir jogos recomendados', () => {
    render(<MinigamesHub />);
    expect(screen.getByText(/Recomendados para Você/i)).toBeInTheDocument();
  });

  it('deve exibir todos os minijogos', () => {
    render(<MinigamesHub />);
    expect(screen.getByText(/Todos os Minijogos/i)).toBeInTheDocument();
    expect(screen.getByText(/Jogo da Memória/i)).toBeInTheDocument();
    expect(screen.getByText(/Digitação Rápida/i)).toBeInTheDocument();
    expect(screen.getByText(/Padrões/i)).toBeInTheDocument();
  });

  it('deve permitir iniciar um jogo', async () => {
    render(<MinigamesHub />);
    const memoryGameButton = screen.getAllByText(/Jogo da Memória/i)[0].closest('button');
    fireEvent.click(memoryGameButton!);
    
    await waitFor(() => {
      expect(screen.getByText(/Jogo em progresso/i)).toBeInTheDocument();
    });
  });

  it('deve exibir score durante o jogo', async () => {
    render(<MinigamesHub />);
    const memoryGameButton = screen.getAllByText(/Jogo da Memória/i)[0].closest('button');
    fireEvent.click(memoryGameButton!);
    
    await waitFor(() => {
      expect(screen.getByText(/Pontuação Atual/i)).toBeInTheDocument();
    });
  });

  it('deve permitir finalizar o jogo', async () => {
    render(<MinigamesHub />);
    const memoryGameButton = screen.getAllByText(/Jogo da Memória/i)[0].closest('button');
    fireEvent.click(memoryGameButton!);
    
    await waitFor(() => {
      const finishButton = screen.getByText(/Finalizar/i);
      fireEvent.click(finishButton);
      
      expect(screen.getByText(/Jogo Concluído/i)).toBeInTheDocument();
    });
  });

  it('deve exibir resultados após finalizar', async () => {
    render(<MinigamesHub />);
    const memoryGameButton = screen.getAllByText(/Jogo da Memória/i)[0].closest('button');
    fireEvent.click(memoryGameButton!);
    
    await waitFor(() => {
      const finishButton = screen.getByText(/Finalizar/i);
      fireEvent.click(finishButton);
      
      expect(screen.getByText(/Seu Melhor/i)).toBeInTheDocument();
      expect(screen.getByText(/Média/i)).toBeInTheDocument();
    });
  });

  it('deve exibir análise de performance', async () => {
    render(<MinigamesHub />);
    const memoryGameButton = screen.getAllByText(/Jogo da Memória/i)[0].closest('button');
    fireEvent.click(memoryGameButton!);
    
    await waitFor(() => {
      const finishButton = screen.getByText(/Finalizar/i);
      fireEvent.click(finishButton);
      
      expect(screen.getByText(/Recompensas/i)).toBeInTheDocument();
    });
  });

  it('deve permitir tentar novamente', async () => {
    render(<MinigamesHub />);
    const memoryGameButton = screen.getAllByText(/Jogo da Memória/i)[0].closest('button');
    fireEvent.click(memoryGameButton!);
    
    await waitFor(() => {
      const finishButton = screen.getByText(/Finalizar/i);
      fireEvent.click(finishButton);
      
      const retryButton = screen.getByText(/Jogar Novamente/i);
      fireEvent.click(retryButton);
      
      expect(screen.getByText(/Jogo em progresso/i)).toBeInTheDocument();
    });
  });

  it('deve permitir voltar ao hub', async () => {
    render(<MinigamesHub />);
    const memoryGameButton = screen.getAllByText(/Jogo da Memória/i)[0].closest('button');
    fireEvent.click(memoryGameButton!);
    
    await waitFor(() => {
      const backButton = screen.getByText(/Sair/i);
      fireEvent.click(backButton);
      
      expect(screen.getByText(/Hub de Minijogos/i)).toBeInTheDocument();
    });
  });

  it('deve exibir nível de dificuldade dos jogos', () => {
    render(<MinigamesHub />);
    expect(screen.getByText(/Nível 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Nível 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Nível 4/i)).toBeInTheDocument();
  });

  it('deve exibir melhor score de cada jogo', () => {
    render(<MinigamesHub />);
    expect(screen.getByText(/Melhor/i)).toBeInTheDocument();
  });

  it('deve exibir média de score de cada jogo', () => {
    render(<MinigamesHub />);
    expect(screen.getByText(/Média/i)).toBeInTheDocument();
  });

  it('deve exibir vezes que cada jogo foi jogado', () => {
    render(<MinigamesHub />);
    expect(screen.getByText(/x jogado/i)).toBeInTheDocument();
  });

  it('deve exibir recompensas XP de cada jogo', () => {
    render(<MinigamesHub />);
    expect(screen.getByText(/100 XP/i)).toBeInTheDocument();
    expect(screen.getByText(/150 XP/i)).toBeInTheDocument();
  });
});
