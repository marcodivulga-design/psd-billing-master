import { Request, Response, NextFunction } from 'express';
import { TRPCError } from '@trpc/server';

/**
 * Middleware de Autenticação Multi-Tenant
 * Valida token JWT e injeta organization_id no contexto
 */

export interface AuthContext {
  userId: string;
  organizationId: string;
  email: string;
  role: 'admin' | 'user' | 'customer';
  token: string;
}

export interface RequestWithAuth extends Request {
  auth?: AuthContext;
}

/**
 * Middleware para extrair e validar token JWT
 */
export const authMiddleware = (req: RequestWithAuth, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continua sem autenticação (será validado em protectedProcedure)
    }

    const token = authHeader.substring(7);
    
    // Aqui você decodificaria o JWT real
    // Por agora, simulamos com um token de teste
    const decoded = decodeToken(token);
    
    if (!decoded) {
      return next();
    }

    req.auth = {
      userId: decoded.userId,
      organizationId: decoded.organizationId,
      email: decoded.email,
      role: decoded.role || 'customer',
      token,
    };

    next();
  } catch (error) {
    next();
  }
};

/**
 * Middleware para validar organization_id
 */
export const validateOrganizationMiddleware = (req: RequestWithAuth, res: Response, next: NextFunction) => {
  if (!req.auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Validar que organization_id é válido
  if (!req.auth.organizationId) {
    return res.status(403).json({ error: 'Organization not found' });
  }

  next();
};

/**
 * Middleware para validar role
 */
export const requireRole = (...roles: string[]) => {
  return (req: RequestWithAuth, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

/**
 * Função para decodificar JWT (implementação simplificada)
 */
function decodeToken(token: string): Partial<AuthContext> | null {
  try {
    // Em produção, use jsonwebtoken.verify()
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Simulação para desenvolvimento
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    return {
      userId: payload.sub || payload.userId,
      organizationId: payload.org_id || payload.organizationId,
      email: payload.email,
      role: payload.role || 'customer',
    };
  } catch (error) {
    return null;
  }
}

/**
 * Contexto para tRPC com autenticação multi-tenant
 */
export async function createContext(opts: {
  req?: RequestWithAuth;
  res?: Response;
}) {
  const auth = opts.req?.auth;

  return {
    user: auth ? {
      id: auth.userId,
      email: auth.email,
      organizationId: auth.organizationId,
      role: auth.role,
    } : null,
    organizationId: auth?.organizationId,
    isAuthenticated: !!auth,
  };
}

/**
 * Tipo do contexto para tRPC
 */
export type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Procedimento protegido que requer autenticação
 */
export const protectedProcedureMiddleware = async (opts: any) => {
  const { ctx } = opts;

  if (!ctx.isAuthenticated || !ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return opts.next({ ctx });
};

/**
 * Procedimento protegido que requer admin
 */
export const adminProcedureMiddleware = async (opts: any) => {
  const { ctx } = opts;

  if (!ctx.isAuthenticated || !ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in',
    });
  }

  if (ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You must be an admin to access this resource',
    });
  }

  return opts.next({ ctx });
};

/**
 * Validar que o usuário tem acesso à organização
 */
export const validateOrgAccess = (requiredOrgId: string) => {
  return async (opts: any) => {
    const { ctx } = opts;

    if (!ctx.isAuthenticated) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      });
    }

    if (ctx.organizationId !== requiredOrgId && ctx.user?.role !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have access to this organization',
      });
    }

    return opts.next({ ctx });
  };
};
