import { z } from 'zod'
import { publicProcedure, router } from './trpc'

// Schema para sincronização de dados
const SyncDataSchema = z.object({
  appId: z.string(),
  dataType: z.enum(['users', 'transactions', 'analytics', 'settings']),
  timestamp: z.number(),
  data: z.record(z.string(), z.any()).optional()
})

type SyncData = z.infer<typeof SyncDataSchema>

// Armazenamento em memória (em produção, usar banco de dados)
const syncCache = new Map<string, SyncData>()

export const syncRouter = router({
  // Sync Router
  /**
   * Sincronizar dados entre apps
   */
  syncData: publicProcedure
    .input(SyncDataSchema)
    .mutation(async ({ input }) => {
      const key = `${input.appId}:${input.dataType}`
      syncCache.set(key, input)

      return {
        success: true,
        message: `Dados sincronizados para ${input.appId}`,
        timestamp: new Date().toISOString(),
        key
      }
    }),

  /**
   * Obter dados sincronizados
   */
  getSyncedData: publicProcedure
    .input(z.object({
      appId: z.string(),
      dataType: z.enum(['users', 'transactions', 'analytics', 'settings'])
    }))
    .query(({ input }) => {
      const key = `${input.appId}:${input.dataType}`
      const data = syncCache.get(key)

      return {
        found: !!data,
        data: data || null,
        timestamp: new Date().toISOString()
      }
    }),

  /**
   * Obter status de sincronização de todos os apps
   */
  getSyncStatus: publicProcedure
    .query(() => {
      const apps = new Set<string>()
      const dataTypes = new Map<string, Set<string>>()

      syncCache.forEach((_, key) => {
        const [appId, dataType] = key.split(':')
        apps.add(appId)
        if (!dataTypes.has(appId)) {
          dataTypes.set(appId, new Set())
        }
        dataTypes.get(appId)!.add(dataType)
      })

      return {
        totalApps: apps.size,
        apps: Array.from(apps).map(appId => ({
          appId,
          dataTypes: Array.from(dataTypes.get(appId) || []),
          lastSync: new Date().toISOString()
        }))
      }
    }),

  /**
   * Limpar cache de sincronização
   */
  clearSyncCache: publicProcedure
    .input(z.object({
      appId: z.string().optional()
    }))
    .mutation(({ input }) => {
      if (input.appId) {
        // Limpar apenas dados do app específico
        const keysToDelete: string[] = []
        syncCache.forEach((_, key) => {
          if (key.startsWith(`${input.appId}:`)) {
            keysToDelete.push(key)
          }
        })
        keysToDelete.forEach(key => syncCache.delete(key))
        return {
          success: true,
          message: `Cache limpo para ${input.appId}`,
          itemsDeleted: keysToDelete.length
        }
      } else {
        // Limpar todo o cache
        const size = syncCache.size
        syncCache.clear()
        return {
          success: true,
          message: 'Cache de sincronização limpo completamente',
          itemsDeleted: size
        }
      }
    })
})
