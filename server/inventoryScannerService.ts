import { AppRegistry, RegisteredApp } from './appRegistry';
import { healthProxyService } from './healthProxyService';

/**
 * Inventory Scanner Service
 * Consome dados reais dos endpoints /api/system/inventory dos apps registrados
 * Suporta tRPC e REST fallback com retry automático
 */

export interface InventoryData {
  name: string;
  version: string;
  status: string;
  description?: string;
  timestamp?: string;
  uptime?: number;
  database?: {
    connected: boolean;
    tables?: string[];
  };
  features?: Record<string, boolean>;
  endpoints?: string[];
  organization_id?: number | null;
}

export interface ScanResult {
  appId: string;
  appName: string;
  status: 'CONNECTED' | 'OFFLINE' | 'NOT_INTEGRATED';
  inventory?: InventoryData;
  error?: string;
  lastScanTime: Date;
  responseTime?: number;
  endpointUsed?: string;
}

export class InventoryScannerService {
  private static scanCache = new Map<string, ScanResult>();
  private static cacheExpiry = 5 * 60 * 1000; // 5 minutos

  /**
   * Fazer scan de um aplicativo específico
   */
  static async scanApp(appId: string): Promise<ScanResult> {
    try {
      // Verificar cache
      const cached = this.scanCache.get(appId);
      if (cached && Date.now() - cached.lastScanTime.getTime() < this.cacheExpiry) {
        return cached;
      }

      const app = AppRegistry.get(appId);
      if (!app) {
        return {
          appId,
          appName: 'Unknown',
          status: 'NOT_INTEGRATED',
          error: 'App not registered',
          lastScanTime: new Date(),
        };
      }

      console.log(`🔍 Scanning: ${app.name}`);

      const startTime = Date.now();

      try {
        // Tentar tRPC com GET primeiro
        let healthResult = await healthProxyService.checkHealth(
          `${app.baseUrl}/api/trpc/system.inventory`,
          {
            timeout: 10000,
            retries: 2,
            retryDelay: 500,
            followRedirects: true,
            method: 'GET',
          }
        );

        let endpointUsed = '/api/trpc/system.inventory (GET)';

        // Se GET falhar, tentar POST
        if (healthResult.status !== 'online') {
          healthResult = await healthProxyService.checkHealth(
            `${app.baseUrl}/api/trpc/system.inventory`,
            {
              timeout: 10000,
              retries: 2,
              retryDelay: 500,
              followRedirects: true,
              method: 'POST',
            }
          );
          endpointUsed = '/api/trpc/system.inventory (POST)';
        }

        // Se tRPC falhar completamente, tentar REST fallback com GET
        if (healthResult.status !== 'online') {
          healthResult = await healthProxyService.checkHealth(
            `${app.baseUrl}/api/system/inventory`,
            {
              timeout: 10000,
              retries: 2,
              retryDelay: 500,
              followRedirects: true,
              method: 'GET',
            }
          );
          endpointUsed = '/api/system/inventory (GET)';
        }

        // Se REST GET falhar, tentar REST POST
        if (healthResult.status !== 'online') {
          healthResult = await healthProxyService.checkHealth(
            `${app.baseUrl}/api/system/inventory`,
            {
              timeout: 10000,
              retries: 2,
              retryDelay: 500,
              followRedirects: true,
              method: 'POST',
            }
          );
          endpointUsed = '/api/system/inventory (POST)';
        }

        const responseTime = healthResult.responseTime;

        if (healthResult.status !== 'online') {
          throw new Error(healthResult.error || 'Endpoint not reachable');
        }

        // Parsear resposta
        const data = healthResult.data;
        const inventory = this.normalizeInventoryData(data);

        // Criar resultado
        const result: ScanResult = {
          appId,
          appName: app.name,
          status: 'CONNECTED',
          inventory,
          lastScanTime: new Date(),
          responseTime,
          endpointUsed,
        };

        // Atualizar status no registry
        AppRegistry.updateStatus(appId, 'CONNECTED', {
          version: inventory.version,
          features: inventory.features,
        });

        // Armazenar em cache
        this.scanCache.set(appId, result);

        console.log(`✅ ${app.name} is CONNECTED (${responseTime}ms) via ${endpointUsed}`);
        return result;
      } catch (error) {
        const result: ScanResult = {
          appId,
          appName: app.name,
          status: 'OFFLINE',
          error: error instanceof Error ? error.message : 'Unknown error',
          lastScanTime: new Date(),
        };

        // Atualizar status no registry
        AppRegistry.updateStatus(appId, 'OFFLINE');

        console.log(`❌ ${app.name} is OFFLINE: ${result.error}`);
        return result;
      }
    } catch (error) {
      return {
        appId,
        appName: 'Unknown',
        status: 'NOT_INTEGRATED',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastScanTime: new Date(),
      };
    }
  }

  /**
   * Fazer scan de todos os aplicativos registrados
   */
  static async scanAll(): Promise<ScanResult[]> {
    const apps = AppRegistry.list();
    console.log(`\n🔄 Starting full scan of ${apps.length} applications...\n`);

    const results = await Promise.all(
      apps.map(app => this.scanApp(app.id))
    );

    console.log(`\n📊 Scan complete. Summary:`);
    const summary = this.getScanSummary(results);
    console.log(`  ✅ Connected: ${summary.connected}`);
    console.log(`  ❌ Offline: ${summary.offline}`);
    console.log(`  ⚠️  Not Integrated: ${summary.notIntegrated}\n`);

    return results;
  }

  /**
   * Normalizar dados de inventário recebidos
   */
  private static normalizeInventoryData(data: any): InventoryData {
    // Se for resposta do tRPC, extrair o resultado
    if (data.result) {
      data = data.result;
    }

    return {
      name: data.name || data.appName || 'Unknown',
      version: data.version || '0.0.0',
      status: data.status || 'unknown',
      description: data.description,
      timestamp: data.timestamp,
      uptime: data.uptime,
      database: data.database,
      features: data.features,
      endpoints: data.endpoints,
      organization_id: data.organization_id,
    };
  }

  /**
   * Obter resultado de scan em cache
   */
  static getCachedResult(appId: string): ScanResult | undefined {
    return this.scanCache.get(appId);
  }

  /**
   * Limpar cache de scan
   */
  static clearCache(appId?: string) {
    if (appId) {
      this.scanCache.delete(appId);
    } else {
      this.scanCache.clear();
    }
  }

  /**
   * Obter resumo de scan
   */
  static getScanSummary(results: ScanResult[]) {
    return {
      total: results.length,
      connected: results.filter(r => r.status === 'CONNECTED').length,
      offline: results.filter(r => r.status === 'OFFLINE').length,
      notIntegrated: results.filter(r => r.status === 'NOT_INTEGRATED').length,
    };
  }

  /**
   * Obter todos os resultados em cache
   */
  static getAllCachedResults(): ScanResult[] {
    return Array.from(this.scanCache.values());
  }
}
