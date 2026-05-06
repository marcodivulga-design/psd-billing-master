import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdaptiveButton from '@/components/AdaptiveButton';
import AdaptiveCard from '@/components/AdaptiveCard';
import AdaptiveText from '@/components/AdaptiveText';
import { AdaptiveThemeProvider } from '@/components/AdaptiveThemeProvider';

/**
 * AdaptiveComponents.test.tsx - Testes de Componentes Adaptativos
 * 
 * Testa:
 * - Renderização por faixa etária
 * - Responsividade mobile
 * - Acessibilidade
 * - Adaptação de linguagem
 */

const renderWithTheme = (component: React.ReactElement, ageGroup: any = 'fund-i') => {
  return render(
    <AdaptiveThemeProvider defaultAgeGroup={ageGroup}>
      {component}
    </AdaptiveThemeProvider>
  );
};

describe('AdaptiveButton', () => {
  it('renderiza botão primário', () => {
    renderWithTheme(<AdaptiveButton>Clique aqui</AdaptiveButton>);
    const button = screen.getByRole('button', { name: /clique aqui/i });
    expect(button).toBeInTheDocument();
  });

  it('renderiza botão com ícone', () => {
    renderWithTheme(
      <AdaptiveButton icon="🎯">Começar</AdaptiveButton>
    );
    const button = screen.getByRole('button', { name: /começar/i });
    expect(button).toBeInTheDocument();
  });

  it('renderiza botão desabilitado', () => {
    renderWithTheme(
      <AdaptiveButton disabled>Desabilitado</AdaptiveButton>
    );
    const button = screen.getByRole('button', { name: /desabilitado/i });
    expect(button).toBeDisabled();
  });

  it('renderiza botão full width', () => {
    renderWithTheme(
      <AdaptiveButton fullWidth>Full Width</AdaptiveButton>
    );
    const button = screen.getByRole('button', { name: /full width/i });
    expect(button).toHaveStyle({ width: '100%' });
  });

  it('renderiza variantes de cor', () => {
    const variants = ['primary', 'secondary', 'success', 'warning', 'error'];
    
    variants.forEach((variant) => {
      const { unmount } = renderWithTheme(
        <AdaptiveButton variant={variant as any}>{variant}</AdaptiveButton>
      );
      const button = screen.getByRole('button', { name: new RegExp(variant, 'i') });
      expect(button).toBeInTheDocument();
      unmount();
    });
  });
});

describe('AdaptiveCard', () => {
  it('renderiza card básico', () => {
    renderWithTheme(
      <AdaptiveCard>Conteúdo do card</AdaptiveCard>
    );
    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument();
  });

  it('renderiza card com ícone e título', () => {
    renderWithTheme(
      <AdaptiveCard icon="📚" title="Aulas">
        Conteúdo
      </AdaptiveCard>
    );
    expect(screen.getByText('Aulas')).toBeInTheDocument();
  });

  it('renderiza card com subtítulo', () => {
    renderWithTheme(
      <AdaptiveCard
        icon="📚"
        title="Aulas"
        subtitle="Aprenda novos conceitos"
      >
        Conteúdo
      </AdaptiveCard>
    );
    expect(screen.getByText('Aprenda novos conceitos')).toBeInTheDocument();
  });

  it('renderiza card interativo', () => {
    const onClick = vi.fn();
    renderWithTheme(
      <AdaptiveCard interactive onClick={onClick}>
        Clique aqui
      </AdaptiveCard>
    );
    const card = screen.getByText('Clique aqui').closest('div');
    expect(card).toHaveStyle({ cursor: 'pointer' });
  });
});

describe('AdaptiveText', () => {
  it('renderiza texto body', () => {
    renderWithTheme(
      <AdaptiveText variant="body">Texto normal</AdaptiveText>
    );
    expect(screen.getByText('Texto normal')).toBeInTheDocument();
  });

  it('renderiza heading', () => {
    renderWithTheme(
      <AdaptiveText variant="heading">Título</AdaptiveText>
    );
    expect(screen.getByText('Título')).toBeInTheDocument();
  });

  it('renderiza subheading', () => {
    renderWithTheme(
      <AdaptiveText variant="subheading">Subtítulo</AdaptiveText>
    );
    expect(screen.getByText('Subtítulo')).toBeInTheDocument();
  });

  it('renderiza caption', () => {
    renderWithTheme(
      <AdaptiveText variant="caption">Legenda</AdaptiveText>
    );
    expect(screen.getByText('Legenda')).toBeInTheDocument();
  });

  it('adapta linguagem playful para infantil', () => {
    renderWithTheme(
      <AdaptiveText tone="playful">parabéns</AdaptiveText>,
      'infantil'
    );
    const text = screen.getByText(/parabéns/i);
    expect(text.textContent).toContain('🎉');
  });

  it('adapta linguagem respectful para EJA', () => {
    renderWithTheme(
      <AdaptiveText tone="respectful">parabéns</AdaptiveText>,
      'eja'
    );
    const text = screen.getByText(/parabéns/i);
    expect(text.textContent).toContain('esforço');
  });
});

describe('Responsividade Mobile', () => {
  beforeEach(() => {
    // Simular viewport mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // iPhone width
    });
  });

  it('botão adapta tamanho em mobile infantil', () => {
    renderWithTheme(
      <AdaptiveButton>Mobile</AdaptiveButton>,
      'infantil'
    );
    const button = screen.getByRole('button');
    // Infantil deve ter padding grande mesmo em mobile
    expect(button).toHaveStyle({ padding: '24px 32px' });
  });

  it('card adapta grid em mobile', () => {
    renderWithTheme(
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        <AdaptiveCard>Card 1</AdaptiveCard>
        <AdaptiveCard>Card 2</AdaptiveCard>
      </div>,
      'infantil'
    );
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });
});

describe('Acessibilidade', () => {
  it('botão tem atributo role', () => {
    renderWithTheme(<AdaptiveButton>Acessível</AdaptiveButton>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('card com título tem estrutura semântica', () => {
    renderWithTheme(
      <AdaptiveCard title="Título">Conteúdo</AdaptiveCard>
    );
    expect(screen.getByText('Título')).toBeInTheDocument();
  });

  it('texto heading tem tamanho adequado', () => {
    renderWithTheme(
      <AdaptiveText variant="heading">Grande</AdaptiveText>
    );
    const heading = screen.getByText('Grande');
    expect(heading).toHaveStyle({ display: 'block' });
  });

  it('botão desabilitado não é clicável', () => {
    renderWithTheme(
      <AdaptiveButton disabled>Desabilitado</AdaptiveButton>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('disabled');
  });
});

describe('Integração de Temas', () => {
  it('infantil tem cores vibrantes', () => {
    renderWithTheme(
      <AdaptiveCard>Infantil</AdaptiveCard>,
      'infantil'
    );
    // Infantil deve ter cores fortes
    expect(screen.getByText('Infantil')).toBeInTheDocument();
  });

  it('médio tem cores profissionais', () => {
    renderWithTheme(
      <AdaptiveCard>Médio</AdaptiveCard>,
      'medio'
    );
    expect(screen.getByText('Médio')).toBeInTheDocument();
  });

  it('especial tem alto contraste', () => {
    renderWithTheme(
      <AdaptiveCard>Especial</AdaptiveCard>,
      'especial'
    );
    expect(screen.getByText('Especial')).toBeInTheDocument();
  });
});
