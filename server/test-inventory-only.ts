import express from 'express';

const app = express();
app.use(express.json());

// REST Fallback para endpoint de inventário
app.get('/api/system/inventory', (_req, res) => {
  try {
    const inventory = {
      appName: process.env.APP_NAME || 'PSD Billing Master - Hub Mentor',
      appId: process.env.APP_ID || 'psd-billing-master',
      version: process.env.APP_VERSION || '1.0.0',
      status: 'online',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      endpoints: [
        '/api/system/inventory',
        '/api/trpc/hubMentor.listApps',
        '/api/trpc/hubMentor.scanAll',
      ],
      database: {
        connected: true,
        type: process.env.DATABASE_TYPE || 'postgresql',
        tables: ['apps', 'plans', 'subscriptions', 'organizations'],
      },
      integrations: {
        database: { status: 'configured' },
        trpc: { status: 'configured' },
      },
      features: {
        multiTenant: true,
        authentication: true,
        database: true,
        hubMentor: true,
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Test Server running on http://localhost:${PORT}`);
  console.log(`✅ AVI Agent endpoint available at http://localhost:${PORT}/api/system/inventory`);
});
