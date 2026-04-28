#!/usr/bin/env node

/**
 * App Structure Detector - Detecta estrutura de cada app e classifica para instalação
 */

import fs from 'fs';
import path from 'path';

interface ProjectStructure {
  hasPackageJson: boolean;
  hasTypeScript: boolean;
  appRouterPath?: string;
  routersDir?: string;
  schemaPath?: string;
  usesTrpc: boolean;
  projectType: 'trpc' | 'rest' | 'unknown';
}

interface AppClassification {
  appId: string;
  appName: string;
  projectPath: string;
  classification: 'READY_TO_INSTALL' | 'ALREADY_INSTALLED' | 'NEEDS_MANUAL_PATH' | 'UNSUPPORTED_STRUCTURE' | 'FAILED';
  structure?: ProjectStructure;
  reason?: string;
}

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
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      structure.usesTrpc = !!(packageJson.dependencies?.['@trpc/server'] || packageJson.dependencies?.['trpc']);
    } catch (e) {
      // Erro ao parsear package.json
    }
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

function classifyApp(appId: string, appName: string, projectPath: string): AppClassification {
  const classification: AppClassification = {
    appId,
    appName,
    projectPath,
    classification: 'FAILED',
  };

  // Verificar se caminho existe
  if (!fs.existsSync(projectPath)) {
    classification.classification = 'NEEDS_MANUAL_PATH';
    classification.reason = 'Caminho do projeto não encontrado';
    return classification;
  }

  // Detectar estrutura
  const structure = detectProjectStructure(projectPath);
  classification.structure = structure;

  // Verificar se já tem system router
  const systemRouterPath = path.join(
    projectPath,
    structure.routersDir || 'server/routers',
    'system.router.ts'
  );

  if (fs.existsSync(systemRouterPath)) {
    classification.classification = 'ALREADY_INSTALLED';
    classification.reason = 'System router já existe';
    return classification;
  }

  // Classificar
  if (!structure.hasPackageJson) {
    classification.classification = 'NEEDS_MANUAL_PATH';
    classification.reason = 'package.json não encontrado';
  } else if (structure.projectType === 'unknown') {
    classification.classification = 'UNSUPPORTED_STRUCTURE';
    classification.reason = 'Estrutura de projeto não suportada';
  } else if (!structure.appRouterPath) {
    classification.classification = 'NEEDS_MANUAL_PATH';
    classification.reason = 'App router não encontrado';
  } else {
    classification.classification = 'READY_TO_INSTALL';
    classification.reason = 'Pronto para instalação do AVI Agent';
  }

  return classification;
}

function main() {
  console.log('🔍 Detectando estrutura de aplicativos...\n');

  const apps = [
    { id: 'psd', name: 'PSD Billing Master', path: '/home/ubuntu/psd-billing-master' },
    { id: 'prefeitura', name: 'Prefeitura - Motor Municipal', path: '/home/ubuntu/motor-municipal-propaga' },
    { id: 'apptipo', name: 'Assistente Financeiro', path: '/home/ubuntu/apptipo' },
    { id: 'showhub', name: 'Show Hub', path: '/home/ubuntu/showhub' },
    { id: 'boostlocal', name: 'BoostLocal', path: '/home/ubuntu/boostlocal' },
    { id: 'ariston', name: 'Ariston', path: '/home/ubuntu/ariston' },
    { id: 'keyplay', name: 'KeyPlay', path: '/home/ubuntu/keyplay' },
    { id: 'mantra', name: 'Loja - Mantra', path: '/home/ubuntu/mantra' },
    { id: 'luxtrader', name: 'Lux Trader', path: '/home/ubuntu/lux-trader' },
  ];

  const classifications: AppClassification[] = [];

  apps.forEach(app => {
    const result = classifyApp(app.id, app.name, app.path);
    classifications.push(result);
    
    console.log(`${app.name}`);
    console.log(`  ID: ${app.id}`);
    console.log(`  Status: ${result.classification}`);
    console.log(`  Razão: ${result.reason}`);
    if (result.structure) {
      console.log(`  Tipo: ${result.structure.projectType}`);
      console.log(`  tRPC: ${result.structure.usesTrpc ? 'Sim' : 'Não'}`);
      console.log(`  Router: ${result.structure.appRouterPath || 'Não encontrado'}`);
    }
    console.log();
  });

  // Gerar relatório
  const report = `# App Structure Detection Report

Data: ${new Date().toLocaleString('pt-BR')}

## Resumo

- Total de apps: ${classifications.length}
- Prontos para instalar: ${classifications.filter(c => c.classification === 'READY_TO_INSTALL').length}
- Já instalados: ${classifications.filter(c => c.classification === 'ALREADY_INSTALLED').length}
- Precisam de caminho manual: ${classifications.filter(c => c.classification === 'NEEDS_MANUAL_PATH').length}
- Estrutura não suportada: ${classifications.filter(c => c.classification === 'UNSUPPORTED_STRUCTURE').length}
- Falhados: ${classifications.filter(c => c.classification === 'FAILED').length}

## Detalhes

${classifications.map(c => `
### ${c.appName} (${c.appId})

- **Classificação**: ${c.classification}
- **Razão**: ${c.reason}
- **Caminho**: ${c.projectPath}
${c.structure ? `
- **Tipo de Projeto**: ${c.structure.projectType}
- **TypeScript**: ${c.structure.hasTypeScript ? 'Sim' : 'Não'}
- **tRPC**: ${c.structure.usesTrpc ? 'Sim' : 'Não'}
- **App Router**: ${c.structure.appRouterPath || 'Não encontrado'}
- **Routers Dir**: ${c.structure.routersDir || 'Não encontrado'}
- **Schema**: ${c.structure.schemaPath || 'Não encontrado'}
` : ''}
`).join('\n')}
`;

  fs.writeFileSync('/home/ubuntu/APP_STRUCTURE_DETECTION_REPORT.md', report);
  console.log('✅ Relatório gerado: /home/ubuntu/APP_STRUCTURE_DETECTION_REPORT.md');
}

main();
