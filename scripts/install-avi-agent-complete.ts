#!/usr/bin/env node

/**
 * AVI Agent Complete Installer
 * Instala o protocolo AVI Agent em todos os apps prontos
 */

import fs from 'fs';
import path from 'path';

interface InstallResult {
  appId: string;
  appName: string;
  projectPath: string;
  status: 'SUCCESS' | 'ALREADY_INSTALLED' | 'FAILED';
  filesCreated: string[];
  filesModified: string[];
  backupsCreated: string[];
  error?: string;
  endpoint?: string;
}

function maskSecret(value: string | undefined): string | null {
  if (!value) return null;
  if (value.length < 12) return '***';
  return value.substring(0, 6) + '...' + value.substring(value.length - 4);
}

function createSystemRouter(projectPath: string, routersDir: string): string {
  const systemRouterPath = path.join(projectPath, routersDir, 'system.router.ts');

  const systemRouterContent = `/**
 * System Router - AVI Agent Protocol
 * Endpoint: /api/trpc/system.inventory
 * Fornece informações de inventário e saúde da aplicação
 */

import { router, publicProcedure } from '../trpc';

export const systemRouter = router({
  inventory: publicProcedure.query(async ({ ctx }) => {
    return {
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
  }),
});

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

function maskSecret(value: string | undefined): string | null {
  if (!value) return null;
  if (value.length < 12) return '***';
  return value.substring(0, 6) + '...' + value.substring(value.length - 4);
}
`;

  // Criar diretório se não existir
  const dir = path.dirname(systemRouterPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(systemRouterPath, systemRouterContent);
  return systemRouterPath;
}

function registerSystemRouter(projectPath: string, appRouterPath: string): boolean {
  const fullAppRouterPath = path.join(projectPath, appRouterPath);
  const backupPath = fullAppRouterPath + '.bak.avi-agent';

  // Criar backup
  fs.copyFileSync(fullAppRouterPath, backupPath);

  // Ler conteúdo
  let content = fs.readFileSync(fullAppRouterPath, 'utf-8');

  // Verificar se system router já está registrado
  if (content.includes('systemRouter')) {
    return true;
  }

  // Adicionar import
  const importStatement = `import { systemRouter } from './routers/system.router';\n`;
  if (!content.includes('import { systemRouter')) {
    content = importStatement + content;
  }

  // Adicionar ao router
  content = content.replace(
    /export const appRouter = router\(\{/,
    `export const appRouter = router({
  system: systemRouter,`
  );

  fs.writeFileSync(fullAppRouterPath, content);
  return true;
}

function installAviAgent(appId: string, appName: string, projectPath: string, appRouterPath: string, routersDir: string): InstallResult {
  const result: InstallResult = {
    appId,
    appName,
    projectPath,
    status: 'FAILED',
    filesCreated: [],
    filesModified: [],
    backupsCreated: [],
  };

  try {
    // Verificar se system router já existe
    const systemRouterPath = path.join(projectPath, routersDir, 'system.router.ts');
    if (fs.existsSync(systemRouterPath)) {
      result.status = 'ALREADY_INSTALLED';
      result.endpoint = '/api/trpc/system.inventory';
      return result;
    }

    // Criar system router
    const createdPath = createSystemRouter(projectPath, routersDir);
    result.filesCreated.push(createdPath);

    // Registrar system router
    const registered = registerSystemRouter(projectPath, appRouterPath);
    if (!registered) {
      result.error = 'Falha ao registrar system router';
      return result;
    }

    result.filesModified.push(appRouterPath);
    result.backupsCreated.push(appRouterPath + '.bak.avi-agent');

    result.status = 'SUCCESS';
    result.endpoint = '/api/trpc/system.inventory';

  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Erro desconhecido';
  }

  return result;
}

function main() {
  console.log('🚀 AVI Agent Complete Installer\n');

  const appsToInstall = [
    { id: 'prefeitura', name: 'Prefeitura - Motor Municipal', path: '/home/ubuntu/motor-municipal-propaga', appRouter: 'server/routers.ts', routersDir: 'server/routers' },
    { id: 'apptipo', name: 'Assistente Financeiro', path: '/home/ubuntu/apptipo', appRouter: 'server/routers.ts', routersDir: 'server/routers' },
    { id: 'showhub', name: 'Show Hub', path: '/home/ubuntu/showhub', appRouter: 'server/routers.ts', routersDir: 'server/routers' },
    { id: 'boostlocal', name: 'BoostLocal', path: '/home/ubuntu/boostlocal', appRouter: 'server/routers.ts', routersDir: 'server/routers' },
    { id: 'ariston', name: 'Ariston', path: '/home/ubuntu/ariston', appRouter: 'server/routers.ts', routersDir: 'server/routers' },
  ];

  const results: InstallResult[] = [];

  appsToInstall.forEach(app => {
    console.log(`📦 Instalando AVI Agent em ${app.name}...`);
    const result = installAviAgent(app.id, app.name, app.path, app.appRouter, app.routersDir);
    results.push(result);

    if (result.status === 'SUCCESS') {
      console.log(`✅ Sucesso!`);
    } else if (result.status === 'ALREADY_INSTALLED') {
      console.log(`⚠️  Já instalado`);
    } else {
      console.log(`❌ Falha: ${result.error}`);
    }
    console.log();
  });

  // Gerar relatório
  const report = `# AVI Agent Installation Report

Data: ${new Date().toLocaleString('pt-BR')}

## Resumo

- Total de apps: ${results.length}
- Instalações bem-sucedidas: ${results.filter(r => r.status === 'SUCCESS').length}
- Já instalados: ${results.filter(r => r.status === 'ALREADY_INSTALLED').length}
- Falhados: ${results.filter(r => r.status === 'FAILED').length}

## Detalhes

${results.map(r => `
### ${r.appName} (${r.appId})

- **Status**: ${r.status}
- **Endpoint**: ${r.endpoint || 'N/A'}
- **Arquivos Criados**: ${r.filesCreated.length}
  ${r.filesCreated.map(f => `  - ${f}`).join('\n  ')}
- **Arquivos Modificados**: ${r.filesModified.length}
  ${r.filesModified.map(f => `  - ${f}`).join('\n  ')}
- **Backups Criados**: ${r.backupsCreated.length}
  ${r.backupsCreated.map(f => `  - ${f}`).join('\n  ')}
${r.error ? `- **Erro**: ${r.error}` : ''}
`).join('\n')}

## Próximos Passos

1. Fazer deploy de cada aplicativo
2. Executar \`scanAll()\` no Hub Mentor
3. Verificar conectividade em tempo real
`;

  fs.writeFileSync('/home/ubuntu/AVI_AGENT_INSTALL_REPORT.md', report);
  console.log('✅ Relatório gerado: /home/ubuntu/AVI_AGENT_INSTALL_REPORT.md');
}

main();
