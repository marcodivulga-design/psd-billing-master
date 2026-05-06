import { z } from 'zod'

// Tipos de permissões
export enum Permission {
  // Admin
  ADMIN_FULL_ACCESS = 'admin:full_access',
  ADMIN_MANAGE_USERS = 'admin:manage_users',
  ADMIN_MANAGE_APPS = 'admin:manage_apps',

  // Apps
  APP_READ = 'app:read',
  APP_WRITE = 'app:write',
  APP_DELETE = 'app:delete',
  APP_MANAGE_SETTINGS = 'app:manage_settings',

  // Dados
  DATA_READ = 'data:read',
  DATA_WRITE = 'data:write',
  DATA_DELETE = 'data:delete',
  DATA_EXPORT = 'data:export',

  // Sincronização
  SYNC_READ = 'sync:read',
  SYNC_WRITE = 'sync:write',

  // Relatórios
  REPORTS_READ = 'reports:read',
  REPORTS_GENERATE = 'reports:generate',
  REPORTS_EXPORT = 'reports:export'
}

// Roles padrão
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    Permission.ADMIN_FULL_ACCESS,
    Permission.ADMIN_MANAGE_USERS,
    Permission.ADMIN_MANAGE_APPS,
    Permission.APP_READ,
    Permission.APP_WRITE,
    Permission.APP_DELETE,
    Permission.APP_MANAGE_SETTINGS,
    Permission.DATA_READ,
    Permission.DATA_WRITE,
    Permission.DATA_DELETE,
    Permission.DATA_EXPORT,
    Permission.SYNC_READ,
    Permission.SYNC_WRITE,
    Permission.REPORTS_READ,
    Permission.REPORTS_GENERATE,
    Permission.REPORTS_EXPORT
  ],
  manager: [
    Permission.APP_READ,
    Permission.APP_WRITE,
    Permission.APP_MANAGE_SETTINGS,
    Permission.DATA_READ,
    Permission.DATA_WRITE,
    Permission.DATA_EXPORT,
    Permission.SYNC_READ,
    Permission.SYNC_WRITE,
    Permission.REPORTS_READ,
    Permission.REPORTS_GENERATE,
    Permission.REPORTS_EXPORT
  ],
  user: [
    Permission.APP_READ,
    Permission.DATA_READ,
    Permission.SYNC_READ,
    Permission.REPORTS_READ
  ],
  guest: [
    Permission.APP_READ,
    Permission.DATA_READ
  ]
}

// Permissões por app
export const APP_PERMISSIONS: Record<string, Permission[]> = {
  'ai-customer-support': [
    Permission.APP_READ,
    Permission.APP_WRITE,
    Permission.DATA_READ,
    Permission.DATA_WRITE
  ],
  'analytics-service': [
    Permission.APP_READ,
    Permission.DATA_READ,
    Permission.REPORTS_READ,
    Permission.REPORTS_GENERATE
  ],
  'content-generator': [
    Permission.APP_READ,
    Permission.APP_WRITE,
    Permission.DATA_READ,
    Permission.DATA_WRITE
  ],
  'dashboard-operacional': [
    Permission.APP_READ,
    Permission.DATA_READ,
    Permission.REPORTS_READ
  ],
  'monitoring-service': [
    Permission.APP_READ,
    Permission.DATA_READ,
    Permission.SYNC_READ
  ],
  'payment-gateway': [
    Permission.APP_READ,
    Permission.DATA_READ,
    Permission.DATA_WRITE,
    Permission.REPORTS_READ
  ],
  'trend-radar': [
    Permission.APP_READ,
    Permission.DATA_READ,
    Permission.REPORTS_READ
  ]
}

/**
 * Verificar se um usuário tem uma permissão
 */
export function hasPermission(
  userRole: string,
  permission: Permission
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || []
  return permissions.includes(permission)
}

/**
 * Verificar se um usuário tem acesso a um app
 */
export function hasAppAccess(
  userRole: string,
  appId: string,
  permission: Permission
): boolean {
  // Admin tem acesso total
  if (hasPermission(userRole, Permission.ADMIN_FULL_ACCESS)) {
    return true
  }

  // Verificar permissões do app
  const appPermissions = APP_PERMISSIONS[appId] || []
  if (!appPermissions.includes(permission)) {
    return false
  }

  // Verificar permissões do usuário
  return hasPermission(userRole, permission)
}

/**
 * Obter todas as permissões de um usuário
 */
export function getUserPermissions(userRole: string): Permission[] {
  return ROLE_PERMISSIONS[userRole] || []
}

/**
 * Obter apps acessíveis para um usuário
 */
export function getAccessibleApps(userRole: string): string[] {
  if (hasPermission(userRole, Permission.ADMIN_FULL_ACCESS)) {
    return Object.keys(APP_PERMISSIONS)
  }

  const accessible: string[] = []
  Object.entries(APP_PERMISSIONS).forEach(([appId, permissions]) => {
    const userPerms = getUserPermissions(userRole)
    if (permissions.some(p => userPerms.includes(p))) {
      accessible.push(appId)
    }
  })

  return accessible
}

/**
 * Schema Zod para validação de permissões
 */
export const PermissionSchema = z.object({
  userRole: z.enum(['admin', 'manager', 'user', 'guest']),
  permission: z.nativeEnum(Permission),
  appId: z.string().optional()
})

export type PermissionInput = z.infer<typeof PermissionSchema>
