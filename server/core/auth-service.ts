/**
 * PSD Identity Service - Autenticação Centralizada (SSO)
 * Gerencia login único, perfis multi-tenant e permissões globais.
 */

export interface UserProfile {
  id: string;
  openId: string;
  name: string;
  email: string;
  organizationId: string;
  role: 'admin' | 'user' | 'manager' | 'affiliate';
  referralCode?: string;
  loginMethod: string;
  permissions: string[];
  createdAt: string;
}

export class PSDAuthService {
  private static instance: PSDAuthService;
  private currentUser: UserProfile | null = null;

  private constructor() {}

  public static getInstance(): PSDAuthService {
    if (!PSDAuthService.instance) {
      PSDAuthService.instance = new PSDAuthService();
    }
    return PSDAuthService.instance;
  }

  /**
   * Valida o token de acesso e retorna o perfil do usuário.
   * Em uma empresa grande, isso seria uma chamada para um serviço de Identity (ex: Auth0, Keycloak).
   */
  public async validateSession(token: string): Promise<UserProfile | null> {
    // Simulação de validação centralizada
    console.log('🔐 [PSD Identity] Validando sessão global...');
    
    // Mock de retorno para o ecossistema PSD
    return {
      id: 'usr_marco_veio',
      openId: 'psd_open_id_001',
      name: 'Marco Véio',
      email: 'marco@propaga.digital',
      organizationId: 'org_propaga_master',
      role: 'admin',
      referralCode: 'MARCO_ORIGINAL',
      loginMethod: 'manus_oauth',
      permissions: ['*'],
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Middleware para verificar se o usuário tem acesso a uma funcionalidade específica.
   */
  public hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.includes('*') || this.currentUser.permissions.includes(permission);
  }
}
