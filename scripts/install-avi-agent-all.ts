#!/usr/bin/env node

/**
 * AVI Agent Installer - Instalador em Massa para Padronizar /api/system/inventory
 * 
 * Este script detecta a estrutura de cada aplicativo no ecossistema PSD e instala
 * o protocolo AVI Agent, permitindo que o Hub Mentor monitore todos os apps em tempo real.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface ProjectStructure {
  hasPackageJson: boolean;
  hasTypeScript: boolean;
  appRouterPath?: string;
  routersDir?: string;
  schemaPath?: string;
  usesTrpc: boolean;
  projectType: 'trpc' | 'rest' | 'unknown';
}

interface InstallResult {
  appId: string;
  appName: string;
  projectPath: string;
  status: 'SUCCESS' | 'ALREADY_INSTALLED' | 'FAILED' | 'NEEDS_MANUAL_PATH';
  structure?: ProjectStructure;
  filesCreated: string[];
  filesModified: string[];
  backupsCreated: string[];
  error?: string;
  endpoint?: string;
  notes: string[];
}

// ============================================================================
// UTILITÁRIOS DE SEGURANÇA
// ============================================================================

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
// DETECÇÃO DE ESTRUTURA
// ============================================================================

function detectProjectStructure(projectPath: string): ProjectStructure {
  const structure: ProjectStructure = {
    hasPackageJson: false,
    hasTypeScript: false,
    usesTrpc: false,
    projectType: 'unknown',
  };

  // Verificar package.json
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    structure.hasPackageJson = true;
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    structure.usesTrpc = !!(packageJson.dependencies?.['@trpc/server'] || packageJson.dependencies?.['trpc']);
  }

  // Verificar TypeScript
  const tsConfigPath = path.join(projectPath, 'tsconfig.json');
  structure.hasTypeScript = fs.existsSync(tsConfigPath);

  // Detectar appRouter
  const possibleAppRouterPaths = [
    'server/routers.ts',
    'server/router.ts',
    'server/api/root.ts',
    'src/server/routers.ts',
    'src/server/api/root.ts',
  ];

  for (const routerPath of possibleAppRouterPaths) {
    const fullPath = path.join(projectPath, routerPath);
    if (fs.existsSync(fullPath)) {
      structure.appRouterPath = routerPath;
      break;
    }
  }

  // Detectar diretório de routers
  const possibleRoutersDirs = [
    'server/routers',
    'src/server/routers',
    'server/api/routers',
    'src/server/api/routers',
  ];

  for (const routersDir of possibleRoutersDirs) {
    const fullPath = path.join(projectPath, routersDir);
    if (fs.existsSync(fullPath)) {
      structure.routersDir = routersDir;
      break;
    }
  }

  // Detectar schema
  const possibleSchemaPaths = [
    'drizzle/schema.ts',
    'src/db/schema.ts',
    'server/db/schema.ts',
  ];

  for (const schemaPath of possibleSchemaPaths) {
    const fullPath = path.join(projectPath, schemaPath);
    if (fs.existsSync(fullPath)) {
      structure.schemaPath = schemaPath;
      break;
    }
  }

  // Determinar tipo de projeto
  if (structure.usesTrpc && structure.appRouterPath) {
    structure.projectType = 'trpc';
  } else if (structure.hasPackageJson) {
    structure.projectType = 'rest';
  }

  return structure;
}

// ============================================================================
// CRIAÇÃO DE SYSTEM ROUTER
// ============================================================================

function createSystemRouter(projectPath: string, structure: ProjectStructure): string {
  const routersDir = structure.routersDir || 'server/routers';
  const systemRouterPath = path.join(projectPath, routersDir, 'system.router.ts');

  const systemRouterContent = `/**
 * System Router - AVI Agent Protocol
 * Endpoint: /api/trpc/system.inventory
 * Fornece informações de inventário e saúde da aplicação
 */

import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const systemRouter = router({
  inventory: publicProcedure.query(async ({ ctx }) => {
    const integrations = detectIntegrations();
    
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
        tables: getTables(),
      },
      integrations,
      features: getFeatures(),
      health: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
    };
  }),
});

function getTables(): string[] {
  // Implementar lógica para listar tabelas do banco
  // Por enquanto, retornar array vazio
  return [];
}

function getFeatures(): Record<string, boolean> {
  // Implementar lógica para detectar features ativas
  return {
    multiTenant: !!process.env.MULTI_TENANT,
    authentication: !!process.env.AUTH_ENABLED,
    database: !!process.env.DATABASE_URL,
  };
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

function maskSecret(value: string | undefined): string | null {
  if (!value) return null;
  if (value.length < 12) return '***';
  return value.substring(0, 6) + '...' + value.substring(value.length - 4);
}
`;

  fs.writeFileSync(systemRouterPath, systemRouterContent);
  return systemRouterPath;
}

// ============================================================================
// REGISTRO DO SYSTEM ROUTER
// ============================================================================

function registerSystemRouter(projectPath: string, structure: ProjectStructure): boolean {
  if (!structure.appRouterPath) {
    console.log('❌ App Router não encontrado');
    return false;
  }

  const appRouterPath = path.join(projectPath, structure.appRouterPath);
  const backupPath = appRouterPath + '.bak.avi-agent';

  // Criar backup
  fs.copyFileSync(appRouterPath, backupPath);
  console.log(`✅ Backup criado: ${backupPath}`);

  // Ler conteúdo
  let content = fs.readFileSync(appRouterPath, 'utf-8');

  // Verificar se system router já está registrado
  if (content.includes('systemRouter')) {
    console.log('⚠️  System router já está registrado');
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

  fs.writeFileSync(appRouterPath, content);
  console.log(`✅ System router registrado em ${structure.appRouterPath}`);

  return true;
}

// ============================================================================
// INSTALAÇÃO
// ============================================================================

async function installAviAgentForApp(appId: string, appName: string, projectPath: string): Promise<InstallResult> {
  const result: InstallResult = {
    appId,
    appName,
    projectPath,
    status: 'FAILED',
    filesCreated: [],
    filesModified: [],
    backupsCreated: [],
    notes: [],
  };

  try {
    // Detectar estrutura
    const structure = detectProjectStructure(projectPath);
    result.structure = structure;

    if (!structure.hasPackageJson) {
      result.status = 'NEEDS_MANUAL_PATH';
      result.error = 'package.json não encontrado';
      return result;
    }

    if (structure.projectType === 'unknown') {
      result.status = 'FAILED';
      result.error = 'Tipo de projeto não suportado';
      return result;
    }

    // Criar system router
    const systemRouterPath = createSystemRouter(projectPath, structure);
    result.filesCreated.push(systemRouterPath);
    console.log(`✅ System router criado: ${systemRouterPath}`);

    // Registrar system router
    const registered = registerSystemRouter(projectPath, structure);
    if (!registered) {
      result.status = 'FAILED';
      result.error = 'Falha ao registrar system router';
      return result;
    }

    result.filesModified.push(structure.appRouterPath || '');
    result.backupsCreated.push((structure.appRouterPath || '') + '.bak.avi-agent');

    result.status = 'SUCCESS';
    result.endpoint = structure.usesTrpc ? '/api/trpc/system.inventory' : '/api/system/inventory';
    result.notes.push(`AVI Agent instalado com sucesso em ${appName}`);

  } catch (error) {
    result.status = 'FAILED';
    result.error = error instanceof Error ? error.message : 'Erro desconhecido';
  }

  return result;
}

// ============================================================================
// RELATÓRIO
// ============================================================================

function generateInstallReport(results: InstallResult[]): void {
  const report = `# AVI Agent Installation Report

Data: ${new Date().toLocaleString('pt-BR')}

## Resumo

- Total de apps analisados: ${results.length}
- Instalações bem-sucedidas: ${results.filter(r => r.status === 'SUCCESS').length}
- Já instalados: ${results.filter(r => r.status === 'ALREADY_INSTALLED').length}
- Falhados: ${results.filter(r => r.status === 'FAILED').length}
- Precisam de caminho manual: ${results.filter(r => r.status === 'NEEDS_MANUAL_PATH').length}

## Detalhes por App

${results.map(r => `
### ${r.appName} (${r.appId})

- **Status**: ${r.status}
- **Caminho**: ${r.projectPath}
- **Endpoint**: ${r.endpoint || 'N/A'}
- **Arquivos Criados**: ${r.filesCreated.length}
- **Arquivos Modificados**: ${r.filesModified.length}
- **Backups Criados**: ${r.backupsCreated.length}
${r.error ? `- **Erro**: ${r.error}` : ''}
${r.notes.length > 0 ? `- **Notas**: ${r.notes.join(', ')}` : ''}
`).join('\n')}

## Próximos Passos

1. Fazer deploy de cada aplicativo
2. Executar \`scanAll()\` no Hub Mentor
3. Verificar conectividade em tempo real
`;

  fs.writeFileSync('/home/ubuntu/AVI_AGENT_INSTALL_REPORT.md', report);
  console.log('\n✅ Relatório gerado: /home/ubuntu/AVI_AGENT_INSTALL_REPORT.md');
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('🚀 AVI Agent Installer - Iniciando instalação em massa...\n');

  const results: InstallResult[] = [];

  // Exemplo: Instalar no PSD Billing Master
  const psdPath = '/home/ubuntu/psd-billing-master';
  const result = await installAviAgentForApp('psd', 'PSD Billing Master', psdPath);
  results.push(result);

  // Gerar relatório
  generateInstallReport(results);

  console.log('\n✅ Instalação concluída!');
}

main().catch(console.error);
