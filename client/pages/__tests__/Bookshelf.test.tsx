import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Bookshelf from '../Bookshelf';

// Mock do trpc
vi.mock('../../utils/trpc', () => ({
  trpc: {
    books: {
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

describe('Bookshelf Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a biblioteca com título', () => {
    render(<Bookshelf />);
    expect(screen.getByText(/Minha Biblioteca/i)).toBeInTheDocument();
  });

  it('deve exibir estatísticas de leitura', () => {
    render(<Bookshelf />);
    expect(screen.getByText(/Livros Lidos/i)).toBeInTheDocument();
    expect(screen.getByText(/Minutos Lidos/i)).toBeInTheDocument();
    expect(screen.getByText(/Avaliação Média/i)).toBeInTheDocument();
    expect(screen.getByText(/Sequência/i)).toBeInTheDocument();
  });

  it('deve exibir tabs de filtro', () => {
    render(<Bookshelf />);
    expect(screen.getByText(/Todos/i)).toBeInTheDocument();
    expect(screen.getByText(/Lendo/i)).toBeInTheDocument();
    expect(screen.getByText(/Concluídos/i)).toBeInTheDocument();
    expect(screen.getByText(/Desejados/i)).toBeInTheDocument();
  });

  it('deve exibir livros na tab "Todos"', () => {
    render(<Bookshelf />);
    expect(screen.getByText(/O Poder do Hábito/i)).toBeInTheDocument();
    expect(screen.getByText(/Mindset/i)).toBeInTheDocument();
    expect(screen.getByText(/Sapiens/i)).toBeInTheDocument();
  });

  it('deve filtrar livros por status', async () => {
    render(<Bookshelf />);
    const lendoTab = screen.getByText(/Lendo/i);
    fireEvent.click(lendoTab);
    
    await waitFor(() => {
      expect(screen.getByText(/O Poder do Hábito/i)).toBeInTheDocument();
      expect(screen.queryByText(/Sapiens/i)).not.toBeInTheDocument();
    });
  });

  it('deve exibir progresso de leitura', () => {
    render(<Bookshelf />);
    expect(screen.getByText(/Progresso/i)).toBeInTheDocument();
  });

  it('deve exibir avaliação dos livros', () => {
    render(<Bookshelf />);
    expect(screen.getByText(/4.8/)).toBeInTheDocument();
    expect(screen.getByText(/4.9/)).toBeInTheDocument();
  });

  it('deve permitir adicionar aos favoritos', async () => {
    render(<Bookshelf />);
    const favoriteButtons = screen.getAllByText(/❤️/i);
    fireEvent.click(favoriteButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/Adicionado aos Favoritos/i)).toBeInTheDocument();
    });
  });

  it('deve abrir modal ao clicar em livro', async () => {
    render(<Bookshelf />);
    const bookCard = screen.getByText(/O Poder do Hábito/i).closest('div');
    fireEvent.click(bookCard!);
    
    await waitFor(() => {
      expect(screen.getByText(/Fechar/i)).toBeInTheDocument();
    });
  });

  it('deve exibir recomendações personalizadas', () => {
    render(<Bookshelf />);
    expect(screen.getByText(/Recomendações para Você/i)).toBeInTheDocument();
  });

  it('deve exibir autor dos livros', () => {
    render(<Bookshelf />);
    expect(screen.getByText(/Charles Duhigg/i)).toBeInTheDocument();
    expect(screen.getByText(/Carol Dweck/i)).toBeInTheDocument();
  });

  it('deve exibir descrição dos livros', () => {
    render(<Bookshelf />);
    expect(screen.getByText(/Descubra como os hábitos moldam nossas vidas/i)).toBeInTheDocument();
  });

  it('deve permitir começar leitura de livro desejado', async () => {
    render(<Bookshelf />);
    const desejadasTab = screen.getByText(/Desejados/i);
    fireEvent.click(desejadasTab);
    
    await waitFor(() => {
      const sapienCard = screen.getByText(/Sapiens/i).closest('div');
      fireEvent.click(sapienCard!);
      
      const startButton = screen.getByText(/Começar Leitura/i);
      fireEvent.click(startButton);
      
      expect(screen.getByText(/Leitura Iniciada/i)).toBeInTheDocument();
    });
  });

  it('deve exibir tempo de leitura estimado', () => {
    render(<Bookshelf />);
    expect(screen.getByText(/⏱️/i)).toBeInTheDocument();
  });

  it('deve exibir dificuldade dos livros', () => {
    render(<Bookshelf />);
    expect(screen.getByText(/fácil/i)).toBeInTheDocument();
    expect(screen.getByText(/médio/i)).toBeInTheDocument();
    expect(screen.getByText(/difícil/i)).toBeInTheDocument();
  });

  it('deve contar livros lidos corretamente', () => {
    render(<Bookshelf />);
    expect(screen.getByText(/1/)).toBeInTheDocument(); // 1 livro concluído
  });

  it('deve calcular minutos totais de leitura', () => {
    render(<Bookshelf />);
    expect(screen.getByText(/1430/)).toBeInTheDocument(); // 240 + 180 + 360 + 180 + 240
  });
});
