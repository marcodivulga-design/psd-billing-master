import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Quiz from '../Quiz';

// Mock do trpc
vi.mock('../../utils/trpc', () => ({
  trpc: {
    quiz: {
      getQuestions: {
        useQuery: vi.fn(() => ({
          data: [
            {
              id: '1',
              text: 'Qual é a capital do Brasil?',
              options: ['São Paulo', 'Brasília', 'Rio de Janeiro', 'Salvador'],
              correctAnswer: 1,
              explanation: 'Brasília é a capital do Brasil desde 1960',
              difficulty: 1,
              category: 'Geografia',
            },
            {
              id: '2',
              text: 'Qual é o maior planeta do sistema solar?',
              options: ['Marte', 'Saturno', 'Júpiter', 'Netuno'],
              correctAnswer: 2,
              explanation: 'Júpiter é o maior planeta do sistema solar',
              difficulty: 1,
              category: 'Astronomia',
            },
          ],
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

describe('Quiz Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar seletor de modo', () => {
    render(<Quiz />);
    expect(screen.getByText(/Quiz Inteligente/i)).toBeInTheDocument();
    expect(screen.getByText(/Modo Prático/i)).toBeInTheDocument();
    expect(screen.getByText(/Modo Desafio/i)).toBeInTheDocument();
  });

  it('deve iniciar quiz em modo prático', async () => {
    render(<Quiz />);
    const practiceModeButton = screen.getByText(/Modo Prático/i).closest('button');
    fireEvent.click(practiceModeButton!);
    
    await waitFor(() => {
      expect(screen.getByText(/Questão 1/i)).toBeInTheDocument();
    });
  });

  it('deve exibir questão e opções', async () => {
    render(<Quiz />);
    const practiceModeButton = screen.getByText(/Modo Prático/i).closest('button');
    fireEvent.click(practiceModeButton!);
    
    await waitFor(() => {
      expect(screen.getByText(/Qual é a capital do Brasil/i)).toBeInTheDocument();
      expect(screen.getByText(/Brasília/i)).toBeInTheDocument();
    });
  });

  it('deve permitir selecionar resposta', async () => {
    render(<Quiz />);
    const practiceModeButton = screen.getByText(/Modo Prático/i).closest('button');
    fireEvent.click(practiceModeButton!);
    
    await waitFor(() => {
      const brasíliaOption = screen.getByText(/Brasília/i).closest('button');
      fireEvent.click(brasíliaOption!);
      expect(screen.getByText(/Explicação/i)).toBeInTheDocument();
    });
  });

  it('deve exibir explicação após responder', async () => {
    render(<Quiz />);
    const practiceModeButton = screen.getByText(/Modo Prático/i).closest('button');
    fireEvent.click(practiceModeButton!);
    
    await waitFor(() => {
      const brasíliaOption = screen.getByText(/Brasília/i).closest('button');
      fireEvent.click(brasíliaOption!);
      expect(screen.getByText(/Brasília é a capital do Brasil desde 1960/i)).toBeInTheDocument();
    });
  });

  it('deve permitir usar dica', async () => {
    render(<Quiz />);
    const practiceModeButton = screen.getByText(/Modo Prático/i).closest('button');
    fireEvent.click(practiceModeButton!);
    
    await waitFor(() => {
      const hintButton = screen.getByText(/Dica/i).closest('button');
      fireEvent.click(hintButton!);
      expect(screen.getByText(/Dica/i)).toBeInTheDocument();
    });
  });

  it('deve contar dicas corretamente', async () => {
    render(<Quiz />);
    const practiceModeButton = screen.getByText(/Modo Prático/i).closest('button');
    fireEvent.click(practiceModeButton!);
    
    await waitFor(() => {
      expect(screen.getByText(/Dica \(3\)/i)).toBeInTheDocument();
    });
  });

  it('deve mostrar progresso do quiz', async () => {
    render(<Quiz />);
    const practiceModeButton = screen.getByText(/Modo Prático/i).closest('button');
    fireEvent.click(practiceModeButton!);
    
    await waitFor(() => {
      expect(screen.getByText(/Questão 1\/5/i)).toBeInTheDocument();
    });
  });

  it('deve permitir ir para próxima questão', async () => {
    render(<Quiz />);
    const practiceModeButton = screen.getByText(/Modo Prático/i).closest('button');
    fireEvent.click(practiceModeButton!);
    
    await waitFor(() => {
      const brasíliaOption = screen.getByText(/Brasília/i).closest('button');
      fireEvent.click(brasíliaOption!);
      
      const nextButton = screen.getByText(/Próxima/i).closest('button');
      fireEvent.click(nextButton!);
      
      expect(screen.getByText(/Questão 2/i)).toBeInTheDocument();
    });
  });

  it('deve finalizar quiz e mostrar resultados', async () => {
    render(<Quiz />);
    const practiceModeButton = screen.getByText(/Modo Prático/i).closest('button');
    fireEvent.click(practiceModeButton!);
    
    // Responder todas as questões
    for (let i = 0; i < 5; i++) {
      await waitFor(() => {
        const options = screen.getAllByRole('button');
        const answerButton = options.find(btn => btn.textContent?.includes('Brasília') || btn.textContent?.includes('Júpiter'));
        if (answerButton) fireEvent.click(answerButton);
      });
      
      await waitFor(() => {
        const nextButton = screen.queryByText(/Próxima|Finalizar/i)?.closest('button');
        if (nextButton) fireEvent.click(nextButton);
      });
    }
    
    await waitFor(() => {
      expect(screen.getByText(/Quiz Concluído/i)).toBeInTheDocument();
    });
  });

  it('deve exibir análise de performance', async () => {
    render(<Quiz />);
    const practiceModeButton = screen.getByText(/Modo Prático/i).closest('button');
    fireEvent.click(practiceModeButton!);
    
    // Responder e finalizar
    await waitFor(() => {
      expect(screen.getByText(/Recomendações/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('deve permitir tentar novamente', async () => {
    render(<Quiz />);
    const practiceModeButton = screen.getByText(/Modo Prático/i).closest('button');
    fireEvent.click(practiceModeButton!);
    
    // Finalizar quiz
    await waitFor(() => {
      expect(screen.getByText(/Quiz Concluído/i)).toBeInTheDocument();
    }, { timeout: 5000 });
    
    const retryButton = screen.getByText(/Tentar Novamente/i).closest('button');
    fireEvent.click(retryButton!);
    
    await waitFor(() => {
      expect(screen.getByText(/Questão 1/i)).toBeInTheDocument();
    });
  });
});
