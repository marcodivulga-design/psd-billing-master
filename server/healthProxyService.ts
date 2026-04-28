/**
 * Health Proxy Service
 * 
 * Fornece um mecanismo robusto para verificar a saúde dos endpoints de inventário
 * dos aplicativos, com suporte a múltiplas tentativas, timeouts e fallbacks.
 */

interface HealthCheckResult {
  url: string;
  status: 'online' | 'offline' | 'error';
  statusCode?: number;
  responseTime: number;
  lastChecked: Date;
  error?: string;
  data?: Record<string, any>;
}

interface HealthCheckOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  followRedirects?: boolean;
}

export class HealthProxyService {
  private cache: Map<string, HealthCheckResult> = new Map();
  private readonly DEFAULT_TIMEOUT = 5000; // 5 segundos
  private readonly DEFAULT_RETRIES = 2;
  private readonly DEFAULT_RETRY_DELAY = 1000; // 1 segundo

  /**
   * Verifica a saúde de um endpoint de inventário
   */
  async checkHealth(
    url: string,
    options: HealthCheckOptions = {}
  ): Promise<HealthCheckResult> {
    const timeout = options.timeout || this.DEFAULT_TIMEOUT;
    const retries = options.retries || this.DEFAULT_RETRIES;
    const retryDelay = options.retryDelay || this.DEFAULT_RETRY_DELAY;

    // Verificar cache
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.lastChecked.getTime() < 60000) {
      // Cache válido por 1 minuto
      return cached;
    }

    let lastError: string | undefined;
    let responseTime = 0;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const startTime = Date.now();

        // Criar AbortController para timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'PSD-Hub-Mentor/1.0',
          },
          signal: controller.signal,
          redirect: options.followRedirects ? 'follow' : 'manual',
        });

        clearTimeout(timeoutId);
        responseTime = Date.now() - startTime;

        // Verificar status HTTP
        if (!response.ok) {
          lastError = `HTTP ${response.status}: ${response.statusText}`;
          if (attempt < retries) {
            await this.delay(retryDelay);
            continue;
          }
          throw new Error(lastError);
        }

        // Tentar parsear JSON
        let data: Record<string, any> | undefined;
        try {
          data = await response.json();
        } catch (parseError) {
          lastError = 'Invalid JSON response';
          if (attempt < retries) {
            await this.delay(retryDelay);
            continue;
          }
          throw new Error(lastError);
        }

        // Sucesso!
        const result: HealthCheckResult = {
          url,
          status: 'online',
          statusCode: response.status,
          responseTime,
          lastChecked: new Date(),
          data,
        };

        this.cache.set(url, result);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);

        if (attempt < retries) {
          await this.delay(retryDelay);
        }
      }
    }

    // Todas as tentativas falharam
    const result: HealthCheckResult = {
      url,
      status: 'offline',
      responseTime,
      lastChecked: new Date(),
      error: lastError,
    };

    this.cache.set(url, result);
    return result;
  }

  /**
   * Verifica a saúde de múltiplos endpoints em paralelo
   */
  async checkHealthBatch(
    urls: string[],
    options: HealthCheckOptions = {}
  ): Promise<HealthCheckResult[]> {
    const promises = urls.map(url => this.checkHealth(url, options));
    return Promise.all(promises);
  }

  /**
   * Limpa o cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Obtém estatísticas de cache
   */
  getCacheStats(): {
    size: number;
    entries: Array<{ url: string; status: string; age: number }>;
  } {
    const entries = Array.from(this.cache.entries()).map(([url, result]) => ({
      url,
      status: result.status,
      age: Date.now() - result.lastChecked.getTime(),
    }));

    return {
      size: this.cache.size,
      entries,
    };
  }

  /**
   * Aguarda um período de tempo
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const healthProxyService = new HealthProxyService();
