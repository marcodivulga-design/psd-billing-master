import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentDashboard from '../StudentDashboard';

// Mock do trpc
vi.mock('../../utils/trpc', () => ({
  trpc: {
    student: {
      getStats: {
        useQuery: vi.fn(() => ({
          data: {
            totalXP: 2450,
            level: 5,
            completedLessons: 12,
            totalLessons: 50,
            streak: 7,
            rank: 23,
          },
          isLoading: false,
        })),
      },
    },
  },
}));

describe('StudentDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o dashboard com título', () => {
    render(<StudentDashboard />);
    expect(screen.getByText(/Seu Progresso/i)).toBeInTheDocument();
  });

  it('deve exibir estatísticas do aluno', () => {
    render(<StudentDashboard />);
    expect(screen.getByText(/Nível/i)).toBeInTheDocument();
    expect(screen.getByText(/XP Total/i)).toBeInTheDocument();
    expect(screen.getByText(/Sequência/i)).toBeInTheDocument();
    expect(screen.getByText(/Ranking/i)).toBeInTheDocument();
  });

  it('deve exibir valor do nível', () => {
    render(<StudentDashboard />);
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  it('deve exibir valor de XP total', () => {
    render(<StudentDashboard />);
    expect(screen.getByText(/2450/)).toBeInTheDocument();
  });

  it('deve exibir sequência de dias', () => {
    render(<StudentDashboard />);
    expect(screen.getByText(/7 dias/)).toBeInTheDocument();
  });

  it('deve exibir ranking', () => {
    render(<StudentDashboard />);
    expect(screen.getByText(/#23/)).toBeInTheDocument();
  });

  it('deve exibir progress bar para próximo nível', () => {
    render(<StudentDashboard />);
    expect(screen.getByText(/Progresso para Nível/i)).toBeInTheDocument();
  });

  it('deve exibir tabs de navegação', () => {
    render(<StudentDashboard />);
    expect(screen.getByText(/Visão Geral/i)).toBeInTheDocument();
    expect(screen.getByText(/Aulas/i)).toBeInTheDocument();
    expect(screen.getByText(/Desafios/i)).toBeInTheDocument();
    expect(screen.getByText(/Conquistas/i)).toBeInTheDocument();
    expect(screen.getByText(/Ranking/i)).toBeInTheDocument();
  });

  it('deve mudar de tab ao clicar', async () => {
    render(<StudentDashboard />);
    const desafiosTab = screen.getByText(/Desafios/i);
    fireEvent.click(desafiosTab);
    
    await waitFor(() => {
      expect(screen.getByText(/Primeiro Passo/i)).toBeInTheDocument();
    });
  });

  it('deve exibir desafios na aba correspondente', async () => {
    render(<StudentDashboard />);
    const desafiosTab = screen.getByText(/Desafios/i);
    fireEvent.click(desafiosTab);
    
    await waitFor(() => {
      expect(screen.getByText(/Semana de Ouro/i)).toBeInTheDocument();
      expect(screen.getByText(/Mestre Absoluto/i)).toBeInTheDocument();
    });
  });

  it('deve exibir conquistas na aba correspondente', async () => {
    render(<StudentDashboard />);
    const conquistasTab = screen.getByText(/Conquistas/i);
    fireEvent.click(conquistasTab);
    
    await waitFor(() => {
      expect(screen.getByText(/Decolagem/i)).toBeInTheDocument();
      expect(screen.getByText(/Brilhante/i)).toBeInTheDocument();
    });
  });

  it('deve exibir leaderboard na aba correspondente', async () => {
    render(<StudentDashboard />);
    const rankingTab = screen.getByText(/Ranking/i);
    fireEvent.click(rankingTab);
    
    await waitFor(() => {
      expect(screen.getByText(/Top 10 Estudantes/i)).toBeInTheDocument();
    });
  });

  it('deve exibir aulas recentes na visão geral', () => {
    render(<StudentDashboard />);
    expect(screen.getByText(/Aulas Recentes/i)).toBeInTheDocument();
  });

  it('deve exibir desafios ativos na visão geral', () => {
    render(<StudentDashboard />);
    expect(screen.getByText(/Desafios Ativos/i)).toBeInTheDocument();
  });

  it('deve ter animações ao renderizar', () => {
    const { container } = render(<StudentDashboard />);
    const animatedElements = container.querySelectorAll('[class*="motion"]');
    expect(animatedElements.length).toBeGreaterThan(0);
  });

  it('deve exibir dificuldade dos desafios', async () => {
    render(<StudentDashboard />);
    const desafiosTab = screen.getByText(/Desafios/i);
    fireEvent.click(desafiosTab);
    
    await waitFor(() => {
      expect(screen.getByText(/fácil/i)).toBeInTheDocument();
      expect(screen.getByText(/médio/i)).toBeInTheDocument();
      expect(screen.getByText(/difícil/i)).toBeInTheDocument();
    });
  });

  it('deve exibir recompensas dos desafios', async () => {
    render(<StudentDashboard />);
    const desafiosTab = screen.getByText(/Desafios/i);
    fireEvent.click(desafiosTab);
    
    await waitFor(() => {
      expect(screen.getByText(/100 XP/i)).toBeInTheDocument();
      expect(screen.getByText(/500 XP/i)).toBeInTheDocument();
    });
  });
});
