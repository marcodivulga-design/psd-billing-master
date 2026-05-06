/**
 * school-registry-types.ts - Tipos e Schemas para Cadastro de Escola
 * 
 * Define estrutura flexível para:
 * - Tipos de Rede (Municipal, Estadual, Federal, Particular)
 * - Perfis de Escola (Urbana, Rural, Indígena, Quilombola, etc)
 * - 26 Matérias/Disciplinas
 * - Atividades Interativas por Matéria
 */

// ============================================
// TIPOS DE REDE
// ============================================

export const SCHOOL_NETWORKS = {
  municipal: {
    id: 'municipal',
    name: 'Municipal',
    description: 'Escolas gerenciadas pela prefeitura',
    icon: '🏛️',
  },
  estadual: {
    id: 'estadual',
    name: 'Estadual',
    description: 'Escolas gerenciadas pelo estado',
    icon: '🏢',
  },
  federal: {
    id: 'federal',
    name: 'Federal',
    description: 'Escolas gerenciadas pelo governo federal',
    icon: '🏛️',
  },
  particular: {
    id: 'particular',
    name: 'Particular',
    description: 'Escolas privadas',
    icon: '🎓',
  },
} as const;

export type SchoolNetwork = keyof typeof SCHOOL_NETWORKS;

// ============================================
// PERFIS DE ESCOLA
// ============================================

export const SCHOOL_PROFILES = {
  urbana: {
    id: 'urbana',
    name: 'Urbana',
    description: 'Escola em zona urbana',
    icon: '🏙️',
  },
  rural: {
    id: 'rural',
    name: 'Rural',
    description: 'Escola em zona rural',
    icon: '🌾',
  },
  indigena: {
    id: 'indigena',
    name: 'Indígena',
    description: 'Escola indígena com currículo culturalmente apropriado',
    icon: '🪶',
  },
  quilombola: {
    id: 'quilombola',
    name: 'Quilombola',
    description: 'Escola quilombola com valorização da história e cultura',
    icon: '🎭',
  },
  tecnica: {
    id: 'tecnica',
    name: 'Técnica/Profissionalizante',
    description: 'Escola com foco em formação técnica',
    icon: '⚙️',
  },
  especial: {
    id: 'especial',
    name: 'Educação Especial',
    description: 'Escola com atendimento especializado',
    icon: '♿',
  },
  eja: {
    id: 'eja',
    name: 'EJA',
    description: 'Educação de Jovens e Adultos',
    icon: '👨‍🎓',
  },
  comunitaria: {
    id: 'comunitaria',
    name: 'Comunitária',
    description: 'Escola comunitária',
    icon: '🤝',
  },
  filantropica: {
    id: 'filantropica',
    name: 'Filantrópica',
    description: 'Escola filantrópica',
    icon: '❤️',
  },
  confessional: {
    id: 'confessional',
    name: 'Confessional/Religiosa',
    description: 'Escola com orientação religiosa',
    icon: '✝️',
  },
  conveniada: {
    id: 'conveniada',
    name: 'Conveniada',
    description: 'Escola conveniada com poder público',
    icon: '🤝',
  },
} as const;

export type SchoolProfile = keyof typeof SCHOOL_PROFILES;

// ============================================
// MATÉRIAS/DISCIPLINAS (26 TOTAL)
// ============================================

export const SUBJECTS = {
  portugues: {
    id: 'portugues',
    name: 'Português',
    icon: '📖',
    activities: [
      'Leitura guiada',
      'Caça-palavras',
      'Interpretação por imagem',
      'Ditado interativo',
      'Jogo de sinônimos',
    ],
  },
  matematica: {
    id: 'matematica',
    name: 'Matemática',
    icon: '🔢',
    activities: [
      'Batalha da tabuada',
      'Corrida de contas',
      'Desafios com moedas',
      'Frações com pizza',
      'Geometria com desenho',
    ],
  },
  ciencias: {
    id: 'ciencias',
    name: 'Ciências',
    icon: '🔬',
    activities: [
      'Laboratório virtual',
      'Quiz de corpo humano',
      'Ciclo da água animado',
      'Experiências simples em casa',
    ],
  },
  historia: {
    id: 'historia',
    name: 'História',
    icon: '📜',
    activities: [
      'Linha do tempo interativa',
      'Personagens históricos',
      'Mapas de eventos',
      'Jogo de causa e consequência',
    ],
  },
  geografia: {
    id: 'geografia',
    name: 'Geografia',
    icon: '🗺️',
    activities: [
      'Mapas clicáveis',
      'Bandeiras',
      'Clima e relevo',
      'Localização da cidade',
      'Biomas do Brasil',
    ],
  },
  artes: {
    id: 'artes',
    name: 'Artes',
    icon: '🎨',
    activities: [
      'Galeria de desenhos',
      'Desafios de pintura',
      'Música',
      'Teatro',
      'Fotografia',
      'Colagem',
      'Cultura local',
    ],
  },
  ingles: {
    id: 'ingles',
    name: 'Inglês',
    icon: '🌍',
    activities: [
      'Áudio com repetição',
      'Imagens com palavras',
      'Jogo de memória',
      'Frases do dia',
      'Mini diálogos',
    ],
  },
  educacao_fisica: {
    id: 'educacao_fisica',
    name: 'Educação Física',
    icon: '⚽',
    activities: [
      'Desafios de movimento',
      'Alongamento guiado',
      'Hábitos saudáveis',
      'Registro de atividade',
    ],
  },
  ensino_religioso: {
    id: 'ensino_religioso',
    name: 'Ensino Religioso',
    icon: '✨',
    activities: [
      'Valores humanos',
      'Respeito',
      'Convivência',
      'Cultura de paz',
      'Reflexão',
    ],
  },
  redacao: {
    id: 'redacao',
    name: 'Redação',
    icon: '✍️',
    activities: [
      'Escrita criativa',
      'Estrutura de texto',
      'Revisão de texto',
      'Gêneros textuais',
    ],
  },
  literatura: {
    id: 'literatura',
    name: 'Literatura',
    icon: '📚',
    activities: [
      'Análise de obras',
      'Autores e movimentos',
      'Discussão de livros',
      'Criação de histórias',
    ],
  },
  espanhol: {
    id: 'espanhol',
    name: 'Espanhol',
    icon: '🇪🇸',
    activities: [
      'Áudio com repetição',
      'Imagens com palavras',
      'Jogo de memória',
      'Frases do dia',
      'Mini diálogos',
    ],
  },
  filosofia: {
    id: 'filosofia',
    name: 'Filosofia',
    icon: '🧠',
    activities: [
      'Pensadores e ideias',
      'Ética e moral',
      'Reflexão crítica',
      'Debates',
    ],
  },
  sociologia: {
    id: 'sociologia',
    name: 'Sociologia',
    icon: '👥',
    activities: [
      'Análise social',
      'Movimentos sociais',
      'Cultura e sociedade',
      'Pesquisa de campo',
    ],
  },
  biologia: {
    id: 'biologia',
    name: 'Biologia',
    icon: '🧬',
    activities: [
      'Célula e organismos',
      'Evolução',
      'Ecossistemas',
      'Corpo humano',
    ],
  },
  fisica: {
    id: 'fisica',
    name: 'Física',
    icon: '⚡',
    activities: [
      'Movimento e força',
      'Energia',
      'Ondas e luz',
      'Experimentos',
    ],
  },
  quimica: {
    id: 'quimica',
    name: 'Química',
    icon: '⚗️',
    activities: [
      'Elementos e reações',
      'Tabela periódica',
      'Ligações químicas',
      'Experimentos',
    ],
  },
  projeto_de_vida: {
    id: 'projeto_de_vida',
    name: 'Projeto de Vida',
    icon: '🎯',
    activities: [
      'Autoconhecimento',
      'Planejamento de carreira',
      'Metas e objetivos',
      'Desenvolvimento pessoal',
    ],
  },
  tecnologia_robotica: {
    id: 'tecnologia_robotica',
    name: 'Tecnologia e Robótica',
    icon: '🤖',
    activities: [
      'Lógica de programação',
      'Robótica simples',
      'Segurança digital',
      'Criação de projetos',
    ],
  },
  educacao_financeira: {
    id: 'educacao_financeira',
    name: 'Educação Financeira',
    icon: '💰',
    activities: [
      'Mesada fictícia',
      'Compras simuladas',
      'Poupança',
      'Troco',
      'Orçamento',
    ],
  },
  empreendedorismo: {
    id: 'empreendedorismo',
    name: 'Empreendedorismo',
    icon: '💼',
    activities: [
      'Ideação de negócios',
      'Plano de negócios',
      'Pitch de ideias',
      'Simulação de empresa',
    ],
  },
  meio_ambiente: {
    id: 'meio_ambiente',
    name: 'Meio Ambiente',
    icon: '🌱',
    activities: [
      'Sustentabilidade',
      'Reciclagem',
      'Conservação',
      'Projetos ambientais',
    ],
  },
  cultura_regional: {
    id: 'cultura_regional',
    name: 'Cultura Regional',
    icon: '🎪',
    activities: [
      'Tradições locais',
      'Folclore',
      'Artesanato',
      'Festas regionais',
    ],
  },
  musica: {
    id: 'musica',
    name: 'Música',
    icon: '🎵',
    activities: [
      'Ritmo e melodia',
      'Instrumentos',
      'Composição',
      'Apreciação musical',
    ],
  },
  teatro: {
    id: 'teatro',
    name: 'Teatro',
    icon: '🎭',
    activities: [
      'Expressão corporal',
      'Dramatização',
      'Criação de cenas',
      'Performance',
    ],
  },
  danca: {
    id: 'danca',
    name: 'Dança',
    icon: '💃',
    activities: [
      'Ritmo e movimento',
      'Estilos de dança',
      'Coreografia',
      'Expressão artística',
    ],
  },
} as const;

export type SubjectId = keyof typeof SUBJECTS;

// ============================================
// TIPOS PARA ESCOLA
// ============================================

export interface SchoolRegistry {
  id: string;
  municipalityId: string;
  name: string;
  description?: string;
  network: SchoolNetwork;
  profiles: SchoolProfile[];
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  subjects: SubjectId[];
  customSubjects?: Array<{
    id: string;
    name: string;
    icon: string;
    activities: string[];
  }>;
  grades: string[]; // ex: ['1º ano', '2º ano', '3º ano']
  studentCount?: number;
  teacherCount?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface SubjectConfiguration {
  schoolId: string;
  subjectId: SubjectId;
  selectedActivities: string[];
  customActivities?: string[];
  gradeSpecific?: Record<string, string[]>; // atividades por série
  enabled: boolean;
}

// ============================================
// HELPERS
// ============================================

export function getNetworkName(network: SchoolNetwork): string {
  return SCHOOL_NETWORKS[network].name;
}

export function getProfileName(profile: SchoolProfile): string {
  return SCHOOL_PROFILES[profile].name;
}

export function getSubjectName(subject: SubjectId): string {
  return SUBJECTS[subject].name;
}

export function getSubjectActivities(subject: SubjectId): string[] {
  return SUBJECTS[subject].activities;
}

export function getAllSubjects(): Array<{
  id: SubjectId;
  name: string;
  icon: string;
  activities: string[];
}> {
  return Object.values(SUBJECTS) as any;
}

export function getAllNetworks() {
  return Object.values(SCHOOL_NETWORKS);
}

export function getAllProfiles() {
  return Object.values(SCHOOL_PROFILES);
}
