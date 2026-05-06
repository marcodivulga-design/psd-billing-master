import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Lessons from '../Lessons';

// Mock do trpc
vi.mock('../../utils/trpc', () => ({
  trpc: {
    lessons: {
      getAll: {
        useQuery: vi.fn(() => ({
          data: [
            {
              id: '1',
              title: 'Introdução ao React',
              description: 'Aprenda os conceitos básicos do React',
              category: 'Frontend',
              difficulty: 'fácil',
              duration: 30,
              completed: false,
              xp: 100,
              progress: 0,
            },
          ],
          isLoading: false,
        })),
      },
      complete: {
        mutate: vi.fn(),
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

describe('Lessons Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o componente com título', () => {
    render(<Lessons />);
    expect(screen.getByText(/Suas Aulas/i)).toBeInTheDocument();
  });

  it('deve exibir tabs de navegação', () => {
    render(<Lessons />);
    expect(screen.getByText(/Todas/i)).toBeInTheDocument();
    expect(screen.getByText(/Pendentes/i)).toBeInTheDocument();
    expect(screen.getByText(/Em Progresso/i)).toBeInTheDocument();
    expect(screen.getByText(/Concluídas/i)).toBeInTheDocument();
  });

  it('deve renderizar cards de aulas', async () => {
    render(<Lessons />);
    await waitFor(() => {
      expect(screen.getByText(/Introdução ao React/i)).toBeInTheDocument();
    });
  });

  it('deve filtrar aulas por tab', async () => {
    render(<Lessons />);
    const pendentesTab = screen.getByText(/Pendentes/i);
    fireEvent.click(pendentesTab);
    
    await waitFor(() => {
      expect(screen.getByText(/Introdução ao React/i)).toBeInTheDocument();
    });
  });

  it('deve abrir modal ao clicar em aula', async () => {
    render(<Lessons />);
    const lessonCard = await screen.findByText(/Introdução ao React/i);
    fireEvent.click(lessonCard);
    
    await waitFor(() => {
      expect(screen.getByText(/Começar/i)).toBeInTheDocument();
    });
  });

  it('deve exibir progresso da aula', async () => {
    render(<Lessons />);
    await waitFor(() => {
      expect(screen.getByText(/Progresso/i)).toBeInTheDocument();
    });
  });

  it('deve exibir XP da aula', async () => {
    render(<Lessons />);
    await waitFor(() => {
      expect(screen.getByText(/100 XP/i)).toBeInTheDocument();
    });
  });

  it('deve exibir duração da aula', async () => {
    render(<Lessons />);
    await waitFor(() => {
      expect(screen.getByText(/30 min/i)).toBeInTheDocument();
    });
  });

  it('deve contar aulas concluídas corretamente', async () => {
    render(<Lessons />);
    await waitFor(() => {
      expect(screen.getByText(/0 concluídas/i)).toBeInTheDocument();
    });
  });

  it('deve exibir ícone de dificuldade', async () => {
    render(<Lessons />);
    await waitFor(() => {
      expect(screen.getByText(/fácil/i)).toBeInTheDocument();
    });
  });

  it('deve renderizar loading spinner quando carregando', () => {
    vi.mock('../../utils/trpc', () => ({
      trpc: {
        lessons: {
          getAll: {
            useQuery: vi.fn(() => ({
              data: null,
              isLoading: true,
            })),
          },
        },
      },
    }));
    
    render(<Lessons />);
    // Verificar se há elemento de loading
    const loadingElements = document.querySelectorAll('[class*="animate"]');
    expect(loadingElements.length).toBeGreaterThan(0);
  });
});
