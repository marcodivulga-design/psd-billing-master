/**
 * Unified Authentication Service - PSD-Core-v2
 * 
 * Consolidação de API Key e OAuth em uma interface única
 */

export interface AuthToken {
  token: string;
  type: 'apiKey' | 'oauth';
  expiresAt?: Date;
  userId?: string;
  appId?: string;
}

export interface AuthContext {
  userId: string;
  appId: string;
  role: 'admin' | 'user' | 'guest';
  permissions: string[];
}

/**
 * API Key Authentication
 */
export const apiKeyAuth = {
  /**
   * Validar API Key
   */
  async validate(apiKey: string): Promise<AuthContext | null> {
    // Validar formato
    if (!apiKey.startsWith('psd_live_')) {
      return null;
    }

    // Validar comprimento
    if (apiKey.length !== 41) {
      // psd_live_ (9) + 32 chars
      return null;
    }

    // Buscar no banco (simular)
    return {
      userId: 'user_' + apiKey.substring(9, 15),
      appId: 'app_' + apiKey.substring(15, 21),
      role: 'user',
      permissions: ['read', 'write'],
    };
  },

  /**
   * Gerar API Key
   */
  async generate(input: {
    userId: string;
    appId: string;
  }): Promise<string> {
    const random = Math.random().toString(36).substring(2, 34);
    return `psd_live_${random}`;
  },

  /**
   * Revogar API Key
   */
  async revoke(apiKey: string): Promise<boolean> {
    // Implementar revogação
    return true;
  },
};

/**
 * OAuth Authentication
 */
export const oauthAuth = {
  /**
   * Validar OAuth Token
   */
  async validate(token: string): Promise<AuthContext | null> {
    // Validar formato
    if (!token.startsWith('oauth_')) {
      return null;
    }

    // Buscar no banco (simular)
    return {
      userId: 'user_' + token.substring(6, 12),
      appId: 'app_' + token.substring(12, 18),
      role: 'user',
      permissions: ['read', 'write'],
    };
  },

  /**
   * Gerar OAuth Token
   */
  async generate(input: {
    userId: string;
    appId: string;
    expiresIn?: number;
  }): Promise<AuthToken> {
    const token = 'oauth_' + Math.random().toString(36).substring(2, 34);
    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + (input.expiresIn || 3600)
    );

    return {
      token,
      type: 'oauth',
      expiresAt,
      userId: input.userId,
      appId: input.appId,
    };
  },

  /**
   * Revogar OAuth Token
   */
  async revoke(token: string): Promise<boolean> {
    // Implementar revogação
    return true;
  },

  /**
   * Renovar OAuth Token
   */
  async refresh(token: string): Promise<AuthToken> {
    // Validar token antigo
    const context = await oauthAuth.validate(token);
    if (!context) {
      throw new Error('Invalid token');
    }

    // Gerar novo token
    return await oauthAuth.generate({
      userId: context.userId,
      appId: context.appId,
    });
  },
};

/**
 * Unified Authentication Service
 */
export const unifiedAuthService = {
  /**
   * Autenticar com qualquer método
   */
  async authenticate(input: {
    method: 'apiKey' | 'oauth';
    credentials: string;
  }): Promise<AuthContext | null> {
    if (input.method === 'apiKey') {
      return await apiKeyAuth.validate(input.credentials);
    } else if (input.method === 'oauth') {
      return await oauthAuth.validate(input.credentials);
    }
    return null;
  },

  /**
   * Gerar token de autenticação
   */
  async generateToken(input: {
    method: 'apiKey' | 'oauth';
    userId: string;
    appId: string;
    expiresIn?: number;
  }): Promise<string | AuthToken> {
    if (input.method === 'apiKey') {
      return await apiKeyAuth.generate({
        userId: input.userId,
        appId: input.appId,
      });
    } else if (input.method === 'oauth') {
      return await oauthAuth.generate({
        userId: input.userId,
        appId: input.appId,
        expiresIn: input.expiresIn,
      });
    }
    throw new Error('Method not supported');
  },

  /**
   * Revogar token
   */
  async revokeToken(input: {
    method: 'apiKey' | 'oauth';
    token: string;
  }): Promise<boolean> {
    if (input.method === 'apiKey') {
      return await apiKeyAuth.revoke(input.token);
    } else if (input.method === 'oauth') {
      return await oauthAuth.revoke(input.token);
    }
    return false;
  },

  /**
   * Renovar token (apenas OAuth)
   */
  async refreshToken(token: string): Promise<AuthToken> {
    return await oauthAuth.refresh(token);
  },

  /**
   * Validar permissão
   */
  async hasPermission(input: {
    context: AuthContext;
    permission: string;
  }): Promise<boolean> {
    return input.context.permissions.includes(input.permission);
  },
};

export default unifiedAuthService;
