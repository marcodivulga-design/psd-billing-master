/**
 * REST Fallback Endpoint Template
 * Para aplicativos que não utilizam tRPC ou estrutura padrão
 * 
 * Adicione este arquivo em: server/api/system/inventory.ts
 * ou no equivalente da sua estrutura de rotas REST
 */

import { Request, Response } from 'express'; // ou framework equivalente

function maskSecret(value: string | undefined): string | null {
  if (!value) return null;
  if (value.length < 12) return '***';
  return value.substring(0, 6) + '...' + value.substring(value.length - 4);
}

function detectIntegrations(): Record<string, any> {
  const integrations: Record<string, any> = {};
  
  const integrationEnvVars = [
    { name: 'instagram', envVars: ['INSTAGRAM_ACCESS_TOKEN', 'INSTAGRAM_CLIENT_ID'] },
    { name: 'meta', envVars: ['META_ACCESS_TOKEN', 'META_CLIENT_ID'] },
    { name: 'facebook', envVars: ['FACEBOOK_ACCESS_TOKEN', 'FACEBOOK_APP_ID'] },
    { name: 'whatsapp', envVars: ['ZAPI_INSTANCE_ID', 'ZAPI_TOKEN'] },
    { name: 'stripe', envVars: ['STRIPE_SECRET_KEY'] },
    { name: 'mercadopago', envVars: ['MERCADOPAGO_ACCESS_TOKEN'] },
    { name: 'sendgrid', envVars: ['SENDGRID_API_KEY'] },
    { name: 'resend', envVars: ['RESEND_API_KEY'] },
    { name: 'openai', envVars: ['OPENAI_API_KEY'] },
    { name: 'anthropic', envVars: ['ANTHROPIC_API_KEY'] },
    { name: 'google', envVars: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'] },
    { name: 'youtube', envVars: ['YOUTUBE_API_KEY'] },
  ];

  integrationEnvVars.forEach(integration => {
    const hasToken = integration.envVars.some(envVar => process.env[envVar]);
    const tokenValue = integration.envVars.find(envVar => process.env[envVar]);
    
    integrations[integration.name] = {
      name: integration.name,
      status: hasToken ? 'configured' : 'missing',
      hasToken: hasToken,
      tokenPreview: tokenValue ? maskSecret(process.env[tokenValue]) : null,
      source: 'env',
    };
  });

  return integrations;
}

// ============================================================================
// Express Handler (para apps que usam Express)
// ============================================================================

export const systemInventoryHandler = async (req: Request, res: Response) => {
  try {
    const inventory = {
      appName: process.env.APP_NAME || 'Unknown App',
      appId: process.env.APP_ID || 'unknown',
      version: process.env.APP_VERSION || '1.0.0',
      status: 'online',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      endpoints: [
        '/api/trpc/system.inventory',
        '/api/system/inventory',
      ],
      database: {
        connected: true,
        type: process.env.DATABASE_TYPE || 'unknown',
        tables: [],
      },
      integrations: detectIntegrations(),
      features: {
        multiTenant: !!process.env.MULTI_TENANT,
        authentication: !!process.env.AUTH_ENABLED,
        database: !!process.env.DATABASE_URL,
      },
      health: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
    };

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve inventory',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ============================================================================
// Next.js API Route (para apps que usam Next.js)
// ============================================================================

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const inventory = {
      appName: process.env.APP_NAME || 'Unknown App',
      appId: process.env.APP_ID || 'unknown',
      version: process.env.APP_VERSION || '1.0.0',
      status: 'online',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      endpoints: [
        '/api/trpc/system.inventory',
        '/api/system/inventory',
      ],
      database: {
        connected: true,
        type: process.env.DATABASE_TYPE || 'unknown',
        tables: [],
      },
      integrations: detectIntegrations(),
      features: {
        multiTenant: !!process.env.MULTI_TENANT,
        authentication: !!process.env.AUTH_ENABLED,
        database: !!process.env.DATABASE_URL,
      },
      health: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
    };

    return res.status(200).json(inventory);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to retrieve inventory',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// ============================================================================
// Fastify Route (para apps que usam Fastify)
// ============================================================================

export async function fastifySystemInventoryRoute(fastify: any) {
  fastify.get('/api/system/inventory', async (request: any, reply: any) => {
    try {
      const inventory = {
        appName: process.env.APP_NAME || 'Unknown App',
        appId: process.env.APP_ID || 'unknown',
        version: process.env.APP_VERSION || '1.0.0',
        status: 'online',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        endpoints: [
          '/api/trpc/system.inventory',
          '/api/system/inventory',
        ],
        database: {
          connected: true,
          type: process.env.DATABASE_TYPE || 'unknown',
          tables: [],
        },
        integrations: detectIntegrations(),
        features: {
          multiTenant: !!process.env.MULTI_TENANT,
          authentication: !!process.env.AUTH_ENABLED,
          database: !!process.env.DATABASE_URL,
        },
        health: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
        },
      };

      reply.send(inventory);
    } catch (error) {
      reply.status(500).send({
        error: 'Failed to retrieve inventory',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}

// ============================================================================
// Instruções de Uso
// ============================================================================

/*
 * PARA EXPRESS:
 * 
 * import { systemInventoryHandler } from './api/system/inventory';
 * app.get('/api/system/inventory', systemInventoryHandler);
 * 
 * 
 * PARA NEXT.JS:
 * 
 * Crie o arquivo: pages/api/system/inventory.ts
 * E exporte o handler padrão (default export)
 * 
 * 
 * PARA FASTIFY:
 * 
 * import { fastifySystemInventoryRoute } from './routes/system';
 * await fastifySystemInventoryRoute(app);
 * 
 * 
 * VARIÁVEIS DE AMBIENTE NECESSÁRIAS:
 * 
 * APP_NAME=Nome da Aplicação
 * APP_ID=app-id-unico
 * APP_VERSION=1.0.0
 * DATABASE_TYPE=postgresql|mysql|sqlite
 * NODE_ENV=production|development
 * MULTI_TENANT=true|false
 * AUTH_ENABLED=true|false
 * DATABASE_URL=...
 */
