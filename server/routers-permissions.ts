import { z } from 'zod'
import { publicProcedure, router } from './trpc'
import {
  hasPermission,
  hasAppAccess,
  getUserPermissions,
  getAccessibleApps,
  Permission,
  PermissionSchema
} from './permissions'

export const permissionsRouter = router({
  /**
   * Verificar se usuário tem permissão
   */
  checkPermission: publicProcedure
    .input(PermissionSchema)
    .query(({ input }) => {
      if (input.appId) {
        return {
          hasAccess: hasAppAccess(input.userRole, input.appId, input.permission),
          userRole: input.userRole,
          permission: input.permission,
          appId: input.appId
        }
      } else {
        return {
          hasAccess: hasPermission(input.userRole, input.permission),
          userRole: input.userRole,
          permission: input.permission
        }
      }
    }),

  /**
   * Obter todas as permissões de um usuário
   */
  getUserPermissions: publicProcedure
    .input(z.object({
      userRole: z.enum(['admin', 'manager', 'user', 'guest'])
    }))
    .query(({ input }) => {
      const permissions = getUserPermissions(input.userRole)
      return {
        userRole: input.userRole,
        permissions,
        count: permissions.length
      }
    }),

  /**
   * Obter apps acessíveis para um usuário
   */
  getAccessibleApps: publicProcedure
    .input(z.object({
      userRole: z.enum(['admin', 'manager', 'user', 'guest'])
    }))
    .query(({ input }) => {
      const apps = getAccessibleApps(input.userRole)
      return {
        userRole: input.userRole,
        apps,
        count: apps.length
      }
    }),

  /**
   * Listar todas as permissões disponíveis
   */
  listAllPermissions: publicProcedure
    .query(() => {
      return {
        permissions: Object.values(Permission),
        count: Object.values(Permission).length
      }
    }),

  /**
   * Obter informações de um role
   */
  getRoleInfo: publicProcedure
    .input(z.object({
      role: z.enum(['admin', 'manager', 'user', 'guest'])
    }))
    .query(({ input }) => {
      const permissions = getUserPermissions(input.role)
      const apps = getAccessibleApps(input.role)

      return {
        role: input.role,
        permissions,
        permissionCount: permissions.length,
        accessibleApps: apps,
        appCount: apps.length
      }
    }),

  /**
   * Verificar múltiplas permissões
   */
  checkMultiplePermissions: publicProcedure
    .input(z.object({
      userRole: z.enum(['admin', 'manager', 'user', 'guest']),
      permissions: z.array(z.nativeEnum(Permission))
    }))
    .query(({ input }) => {
      const results = input.permissions.map(permission => ({
        permission,
        hasAccess: hasPermission(input.userRole, permission)
      }))

      return {
        userRole: input.userRole,
        results,
        allGranted: results.every(r => r.hasAccess),
        grantedCount: results.filter(r => r.hasAccess).length
      }
    })
})
