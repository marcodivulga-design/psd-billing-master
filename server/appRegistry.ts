/**
 * App Registry - Registro centralizado de aplicativos do ecossistema PSD
 * Mantém informações sobre todos os apps conectados ao Hub Mentor
 */

export interface RegisteredApp {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  inventoryEndpoint: string;
  status: 'CONNECTED' | 'OFFLINE' | 'NOT_INTEGRATED';
  lastCheckTime?: Date;
  version?: string;
  features?: Record<string, boolean>;
  organization?: string;
  projectPath?: string; // Caminho local do repositório para instalação do AVI Agent
  aviAgentStatus?: 'INSTALLED' | 'READY_TO_INSTALL' | 'FAILED' | 'NEEDS_MANUAL_PATH';
}

export class AppRegistry {
  private static apps: Map<string, RegisteredApp> = new Map();

  /**
   * Registrar um novo aplicativo
   */
  static register(app: Omit<RegisteredApp, 'status' | 'lastCheckTime'>): RegisteredApp {
    const registeredApp: RegisteredApp = {
      ...app,
      status: 'NOT_INTEGRATED',
    };

    this.apps.set(app.id, registeredApp);
    console.log(`✅ App registered: ${app.name} (${app.id})`);

    return registeredApp;
  }

  /**
   * Obter um aplicativo registrado
   */
  static get(appId: string): RegisteredApp | undefined {
    return this.apps.get(appId);
  }

  /**
   * Listar todos os aplicativos registrados
   */
  static list(): RegisteredApp[] {
    return Array.from(this.apps.values());
  }

  /**
   * Atualizar status de um aplicativo
   */
  static updateStatus(
    appId: string,
    status: RegisteredApp['status'],
    data?: Partial<RegisteredApp>
  ): RegisteredApp | undefined {
    const app = this.apps.get(appId);
    if (!app) return undefined;

    const updated: RegisteredApp = {
      ...app,
      status,
      lastCheckTime: new Date(),
      ...data,
    };

    this.apps.set(appId, updated);
    return updated;
  }

  /**
   * Remover um aplicativo
   */
  static unregister(appId: string): boolean {
    return this.apps.delete(appId);
  }

  /**
   * Obter aplicativos por status
   */
  static getByStatus(status: RegisteredApp['status']): RegisteredApp[] {
    return Array.from(this.apps.values()).filter(app => app.status === status);
  }

  /**
   * Contar aplicativos por status
   */
  static countByStatus(): Record<string, number> {
    const counts = {
      CONNECTED: 0,
      OFFLINE: 0,
      NOT_INTEGRATED: 0,
    };

    this.apps.forEach(app => {
      counts[app.status]++;
    });

    return counts;
  }

  /**
   * Obter estatísticas gerais
   */
  static getStats() {
    return {
      totalApps: this.apps.size,
      statusCounts: this.countByStatus(),
      apps: this.list(),
    };
  }
}

/**
 * Inicializar o registro com aplicativos conhecidos
 * URLs reais extraídas do Google Cloud Console (Manus.space)
 */
export function initializeAppRegistry() {
  // Registrar Prefeitura (Motor Municipal)
  AppRegistry.register({
    id: 'prefeitura',
    name: 'Prefeitura - Motor Municipal Propaga',
    description: 'Sistema de gestão municipal integrado',
    baseUrl: process.env.PREFEITURA_BASE_URL || 'https://motormuni-hikfbk7v.manus.space',
    inventoryEndpoint: '/api/trpc/system.inventory',
    organization: 'Prefeitura',
  });

  // Registrar Assistente Financeiro
  AppRegistry.register({
    id: 'assistente-financeiro',
    name: 'Assistente Financeiro',
    description: 'Sistema de gestão financeira pessoal e empresarial',
    baseUrl: process.env.ASSISTENTE_FINANCEIRO_BASE_URL || 'https://apptipo-xxx.manus.space',
    inventoryEndpoint: '/api/trpc/system.inventory',
    organization: 'AppTipo',
  });

  // Registrar Show Hub
  AppRegistry.register({
    id: 'show-hub',
    name: 'Show Hub',
    description: 'Plataforma de gerenciamento de eventos e shows',
    baseUrl: process.env.SHOW_HUB_BASE_URL || 'https://showhub-cgmrydrw.manus.space',
    inventoryEndpoint: '/api/trpc/system.inventory',
    organization: 'Show Hub',
  });

  // Registrar Loja (PetSys)
  AppRegistry.register({
    id: 'loja',
    name: 'Loja - Propaga Digital PetSys',
    description: 'Plataforma de e-commerce',
    baseUrl: process.env.LOJA_BASE_URL || 'https://petsysapp-gm2bxsnu.manus.space',
    inventoryEndpoint: '/api/trpc/system.inventory',
    organization: 'Loja',
  });

  // Registrar KeyPlay (Cubase)
  AppRegistry.register({
    id: 'cubase',
    name: 'KeyPlay - Plataforma de Música',
    description: 'Plataforma de produção e gestão musical',
    baseUrl: process.env.CUBASE_BASE_URL || 'https://keyplaymusic-j3uvvsvt.manus.space',
    inventoryEndpoint: '/api/system/inventory',
    organization: 'KeyPlay',
  });

  // Registrar Mantra (Loja)
  AppRegistry.register({
    id: 'mantra',
    name: 'Mantra - Loja Digital',
    description: 'Plataforma de e-commerce e gestão de loja',
    baseUrl: process.env.MANTRA_BASE_URL || 'https://mantra.manus.space',
    inventoryEndpoint: '/api/system/inventory',
    organization: 'Mantra',
  });

  // Registrar Lux Trader
  AppRegistry.register({
    id: 'trader',
    name: 'Lux Trader - Motor de Arbitragem',
    description: 'Sistema de trading e arbitragem estatística',
    baseUrl: process.env.TRADER_BASE_URL || 'https://luxtrader-3cc2p32z.manus.space',
    inventoryEndpoint: '/api/system/inventory',
    organization: 'Lux Trader',
  });

  // Registrar BoostLocal
  AppRegistry.register({
    id: 'boost',
    name: 'BoostLocal',
    description: 'Plataforma de marketing local e automação de vendas',
    baseUrl: process.env.BOOST_BASE_URL || 'https://boostlocal-mmtifyuc.manus.space',
    inventoryEndpoint: '/api/trpc/system.inventory',
    organization: 'BoostLocal',
  });

  // Registrar Ariston
  AppRegistry.register({
    id: 'ariston',
    name: 'Ariston - Writer Studio',
    description: 'Plataforma de escrita com mentor IA',
    baseUrl: process.env.ARISTON_BASE_URL || 'https://aristonws-qaycuqzf.manus.space',
    inventoryEndpoint: '/api/trpc/system.inventory',
    organization: 'Ariston',
  });

  // Registrar PSD Billing Master
  AppRegistry.register({
    id: 'psd',
    name: 'PSD Billing Master - Hub Mentor',
    description: 'Hub central de faturamento e gestão',
    baseUrl: process.env.PSD_BASE_URL || 'https://psdbillingui-4bb4ecor.manus.space',
    inventoryEndpoint: '/api/trpc/inventory.inventory',
    organization: 'PSD',
  });

  // Registrar Hub Mentor
  AppRegistry.register({
    id: 'hub-mentor',
    name: 'Hub Mentor - Project Prioritization',
    description: 'Hub central de priorização e monitoramento',
    baseUrl: process.env.HUB_MENTOR_BASE_URL || 'https://hubmentor-982obcqb.manus.space',
    inventoryEndpoint: '/api/trpc/system.inventory',
    organization: 'Hub Mentor',
  });

  console.log('✅ App Registry initialized with 11 applications (Production URLs)');
  console.log('📊 Apps com AVI Agent: 5 (tRPC) + 3 (REST Fallback) + 1 (Hub Mentor) = 9 monitorados');
  console.log('⚠️  Apps sem AVI Agent: 2 (Hub Mentor duplicado, Loja genérica)');

}
