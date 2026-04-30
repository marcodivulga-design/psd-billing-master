import { initTRPC } from '@trpc/server';
import { ZodError } from 'zod';

import { checkoutRouter } from './routers-checkout';
import { plansRouter } from './routers-plans';
import { sdkDocsRouter } from './routers-sdk-docs';
import { hubMentorRouter } from './routers-hub-mentor';
import { instagramRouter } from './routers-instagram';

export const t = initTRPC.context<any>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Funções auxiliares para inventário
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

// Endpoint de inventário do PSD Billing Master
export const inventoryRouter = router({
  inventory: publicProcedure.query(() => {
    return {
      appName: 'PSD Billing Master - Hub Mentor',
      appId: 'psd-hub-mentor',
      version: process.env.APP_VERSION || '1.0.0',
      status: 'online',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      description: 'Hub central para o ecossistema Propaga Digital (PSD)',
      endpoints: [
        '/api/trpc/inventory.inventory',
        '/api/trpc/hubMentor.listApps',
        '/api/trpc/hubMentor.scanApp',
        '/api/trpc/hubMentor.scanAll',
        '/api/trpc/hubMentor.getStatus',
        '/api/trpc/plans.list',
        '/api/trpc/checkout.createSession',
      ],
      database: {
        connected: true,
        type: process.env.DATABASE_TYPE || 'postgresql',
        tables: [
          'organizations',
          'users',
          'plans',
          'subscriptions',
          'app_registry',
        ],
      },
      integrations: detectIntegrations(),
      features: {
        multiTenant: true,
        authentication: true,
        database: true,
        appRegistry: true,
        inventoryScanning: true,
      },
      health: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
    };
  }),
});

export const appRouter = router({
  inventory: inventoryRouter,
  hubMentor: hubMentorRouter,
  instagram: instagramRouter,
  checkout: checkoutRouter,
  plans: plansRouter,
  sdkDocs: sdkDocsRouter,
});

export type AppRouter = typeof appRouter;
