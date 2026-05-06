/**
 * PSD Store Data - Catálogo Categorizado por Verticais
 * Onde os produtos do império são exibidos.
 */

export interface StoreProduct {
  id: string;
  name: string;
  vertical: 'FINANCE' | 'MEDIA' | 'EDU' | 'LOCAL' | 'BRAIN';
  description: string;
  price: string;
  icon: string;
  link: string;
  featured?: boolean;
}

export const PSD_STORE_CATALOG: StoreProduct[] = [
  // BRAIN (Inteligência & IA)
  {
    id: 'zapia',
    name: 'Zapia AI',
    vertical: 'BRAIN',
    description: 'Inteligência social e automação de vendas via WhatsApp/Instagram.',
    price: 'R$ 147/mês',
    icon: '🌌',
    link: '/apps/zapia',
    featured: true
  },
  {
    id: 'opportunity',
    name: 'Opportunity',
    vertical: 'BRAIN',
    description: 'Identificador autônomo de oportunidades lucrativas e tendências.',
    price: 'R$ 97/mês',
    icon: '✨',
    link: '/apps/opportunity',
    featured: true
  },

  // FINANCE
  {
    id: 'billing-master',
    name: 'Hub Mentor (Billing)',
    vertical: 'FINANCE',
    description: 'Gestão financeira e cobrança via Asaas para mentores e agências.',
    price: 'R$ 297/mês',
    icon: '🏦',
    link: '/apps/billing-master'
  },
  {
    id: 'lux-trader',
    name: 'Lux Trader',
    vertical: 'FINANCE',
    description: 'Algoritmos de elite para trading e análise de mercado financeiro.',
    price: 'R$ 497/mês',
    icon: '📈',
    link: '/apps/lux-trader'
  },
  
  // MEDIA
  {
    id: 'showhub',
    name: 'ShowHub',
    vertical: 'MEDIA',
    description: 'Plataforma completa para gestão de carreiras artísticas e eventos.',
    price: 'R$ 197/mês',
    icon: '🎵',
    link: '/apps/showhub'
  },
  {
    id: 'gravadora-digital',
    name: 'Gravadora Digital',
    vertical: 'MEDIA',
    description: 'Distribuição e gestão de royalties fonográficos automatizada.',
    price: 'R$ 97/mês',
    icon: '💿',
    link: '/apps/gravadora-digital'
  },

  // EDU
  {
    id: 'edumunicipal',
    name: 'EduMunicipal',
    vertical: 'EDU',
    description: 'Sistema de gestão educacional para prefeituras e redes de ensino.',
    price: 'Sob Consulta',
    icon: '🎓',
    link: '/apps/edumunicipal'
  },
  {
    id: 'brincando-aprendendo',
    name: 'Brincando & Aprendendo',
    vertical: 'EDU',
    description: 'Plataforma lúdica de desenvolvimento infantil e alfabetização.',
    price: 'R$ 47/mês',
    icon: '🎨',
    link: '/apps/brincando-aprendendo'
  },

  // LOCAL
  {
    id: 'local-agent',
    name: 'PSD Local Agent',
    vertical: 'LOCAL',
    description: 'IA especialista para atendimento e vendas em negócios físicos.',
    price: 'R$ 197/mês',
    icon: '🏘️',
    link: '/apps/local-agent'
  },
  {
    id: 'qrpede',
    name: 'QRPede',
    vertical: 'LOCAL',
    description: 'Cardápio digital e sistema de pedidos via QR Code para varejo.',
    price: 'R$ 87/mês',
    icon: '📲',
    link: '/apps/qrpede'
  }
];
