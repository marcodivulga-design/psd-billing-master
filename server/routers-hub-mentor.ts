import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { AppRegistry, initializeAppRegistry } from './appRegistry';
import { InventoryScannerService } from './inventoryScannerService';

/**
 * Hub Mentor Router
 * Expõe endpoints para gerenciar o registro de aplicativos e monitorar seu status
 */

// Inicializar registry na primeira importação
initializeAppRegistry();

export const hubMentorRouter = router({
  /**
   * Listar todos os aplicativos registrados
   */
  listApps: publicProcedure.query(() => {
    const apps = AppRegistry.list();
    return {
      total: apps.length,
      apps,
    };
  }),

  /**
   * Obter detalhes de um aplicativo específico
   */
  getApp: publicProcedure
    .input(z.object({ appId: z.string() }))
    .query(({ input }) => {
      const app = AppRegistry.get(input.appId);
      if (!app) {
        throw new Error(`App not found: ${input.appId}`);
      }
      return app;
    }),

  /**
   * Fazer scan de um aplicativo específico
   */
  scanApp: publicProcedure
    .input(z.object({ appId: z.string() }))
    .query(async ({ input }) => {
      const result = await InventoryScannerService.scanApp(input.appId);
      return result;
    }),

  /**
   * Fazer scan de todos os aplicativos
   */
  scanAll: publicProcedure.query(async () => {
    const results = await InventoryScannerService.scanAll();
    const summary = InventoryScannerService.getScanSummary(results);

    return {
      summary,
      results,
      timestamp: new Date(),
    };
  }),

  /**
   * Obter status geral do ecossistema
   */
  getStatus: publicProcedure.query(() => {
    const stats = AppRegistry.getStats();
    const cachedResults = InventoryScannerService.getAllCachedResults();

    return {
      timestamp: new Date(),
      registry: stats,
      cachedScans: cachedResults.length,
      lastScanResults: cachedResults,
    };
  }),

  /**
   * Registrar um novo aplicativo
   */
  registerApp: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      baseUrl: z.string().url(),
      inventoryEndpoint: z.string(),
      organization: z.string().optional(),
    }))
    .mutation(({ input }) => {
      try {
        const app = AppRegistry.register({
          id: input.id,
          name: input.name,
          description: input.description,
          baseUrl: input.baseUrl,
          inventoryEndpoint: input.inventoryEndpoint,
          organization: input.organization,
        });

        return {
          success: true,
          app,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  /**
   * Atualizar informações de um aplicativo
   */
  updateApp: publicProcedure
    .input(z.object({
      appId: z.string(),
      baseUrl: z.string().url().optional(),
      inventoryEndpoint: z.string().optional(),
      organization: z.string().optional(),
    }))
    .mutation(({ input }) => {
      try {
        const app = AppRegistry.get(input.appId);
        if (!app) {
          throw new Error(`App not found: ${input.appId}`);
        }

        const updated = AppRegistry.updateStatus(input.appId, app.status, {
          baseUrl: input.baseUrl || app.baseUrl,
          inventoryEndpoint: input.inventoryEndpoint || app.inventoryEndpoint,
          organization: input.organization || app.organization,
        });

        return {
          success: true,
          app: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  /**
   * Remover um aplicativo do registro
   */
  unregisterApp: publicProcedure
    .input(z.object({ appId: z.string() }))
    .mutation(({ input }) => {
      try {
        const success = AppRegistry.unregister(input.appId);
        return {
          success,
          message: success ? `App ${input.appId} unregistered` : `App ${input.appId} not found`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  /**
   * Obter aplicativos por status
   */
  getAppsByStatus: publicProcedure
    .input(z.object({ status: z.enum(['CONNECTED', 'OFFLINE', 'NOT_INTEGRATED']) }))
    .query(({ input }) => {
      const apps = AppRegistry.getByStatus(input.status);
      return {
        status: input.status,
        count: apps.length,
        apps,
      };
    }),

  /**
   * Limpar cache de scans
   */
  clearCache: publicProcedure
    .input(z.object({ appId: z.string().optional() }))
    .mutation(({ input }) => {
      try {
        InventoryScannerService.clearCache(input.appId);
        return {
          success: true,
          message: input.appId
            ? `Cache cleared for app ${input.appId}`
            : 'All cache cleared',
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  /**
   * Obter dados de inventário de um app em cache
   */
  getInventory: publicProcedure
    .input(z.object({ appId: z.string() }))
    .query(({ input }) => {
      const result = InventoryScannerService.getCachedResult(input.appId);
      if (!result) {
        return {
          found: false,
          message: `No cached inventory for app ${input.appId}`,
        };
      }

      return {
        found: true,
        ...result,
      };
    }),
});
