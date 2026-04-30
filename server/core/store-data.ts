/**
 * PSD Store Data - Catálogo Oficial de Aplicativos
 */

export interface StoreApp {
  id: string;
  name: string;
  category: 'Negócios' | 'Música' | 'Gestão' | 'Espiritualidade';
  description: string;
  icon: string; // URL ou SVG sem fundo, estilo cósmico
  price: string;
  featured?: boolean;
}

export const PSD_STORE_CATALOG: StoreApp[] = [
  {
    id: 'opportunity',
    name: 'Opportunity',
    category: 'Negócios',
    description: 'Identificador autônomo de oportunidades lucrativas.',
    icon: '✨', // Estrela cadente / Brilho
    price: 'R$ 97/mês',
    featured: true
  },
  {
    id: 'zapia',
    name: 'Zapia AI',
    category: 'Gestão',
    description: 'Inteligência social e automação de vendas.',
    icon: '🌌', // Galáxia / Conexão
    price: 'R$ 147/mês',
    featured: true
  },
  {
    id: 'showhub',
    name: 'ShowHub',
    category: 'Música',
    description: 'Gestão de eventos e análise de engajamento.',
    icon: '🎭', // Máscaras / Palco
    price: 'R$ 197/mês'
  },
  {
    id: 'celebra',
    name: 'Celebra',
    category: 'Espiritualidade',
    description: 'Apoio à vida espiritual e comunitária.',
    icon: '🕊️', // Pomba / Luz
    price: 'Grátis'
  },
  {
    id: 'billing',
    name: 'Hub Mentor',
    category: 'Gestão',
    description: 'O cérebro financeiro do seu ecossistema.',
    icon: '🛡️', // Escudo / Proteção
    price: 'Incluso'
  }
];
