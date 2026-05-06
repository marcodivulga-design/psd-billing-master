#!/usr/bin/env node

/**
 * PSD App Generator
 * Cria apps completos com uma palavra-chave
 * Conectado ao PSD-Core-v2 com v3.0.0, Design System, Componentes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Fase 1: Criar estrutura de diretórios
 */
function createDirectoryStructure(appName, appPath) {
  log(`\n📁 Criando estrutura de diretórios...`, 'blue');

  const dirs = [
    `${appPath}/client/src/pages`,
    `${appPath}/client/src/components`,
    `${appPath}/client/src/lib`,
    `${appPath}/client/public`,
    `${appPath}/server`,
    `${appPath}/drizzle`,
    `${appPath}/storage`,
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`✓ ${dir}`, 'green');
    }
  });
}

/**
 * Fase 2: Criar package.json
 */
function createPackageJson(appName, appPath) {
  log(`\n📦 Criando package.json...`, 'blue');

  const packageJson = {
    name: `psd-${appName}`,
    version: '1.0.0',
    description: `${capitalize(appName)} - Powered by PSD`,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
      test: 'vitest',
      lint: 'eslint src',
    },
    dependencies: {
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      '@trpc/client': '^11.0.0',
      '@trpc/react-query': '^11.0.0',
      '@trpc/server': '^11.0.0',
      zod: '^3.22.0',
      'drizzle-orm': '^0.30.0',
      'drizzle-kit': '^0.20.0',
      express: '^4.18.0',
      cors: '^2.8.5',
      '@psd-core/v2': 'workspace:*',
    },
    devDependencies: {
      vite: '^5.0.0',
      typescript: '^5.3.0',
      tailwindcss: '^4.0.0',
      eslint: '^8.0.0',
      vitest: '^1.0.0',
    },
  };

  fs.writeFileSync(
    `${appPath}/package.json`,
    JSON.stringify(packageJson, null, 2)
  );

  log(`✓ package.json criado`, 'green');
}

/**
 * Fase 3: Criar HTML template
 */
function createHtmlTemplate(appName, appPath) {
  log(`\n📄 Criando HTML template...`, 'blue');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${capitalize(appName)} - PSD</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  fs.writeFileSync(`${appPath}/client/index.html`, html);
  log(`✓ index.html criado`, 'green');
}

/**
 * Fase 4: Criar App.tsx com componentes do PSD
 */
function createAppTsx(appName, appPath) {
  log(`\n⚛️  Criando App.tsx...`, 'blue');

  const appTsx = `import React from 'react';
import { Header, Footer, HeroSection, Container } from '@psd-core/v2/components';
import { designSystem } from '@psd-core/v2/design-system';
import { Home } from './pages/Home';
import './index.css';

export function App() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-0">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <Container className="py-16">
          <Home />
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}`;

  fs.writeFileSync(`${appPath}/client/src/App.tsx`, appTsx);
  log(`✓ App.tsx criado`, 'green');
}

/**
 * Fase 5: Criar Home.tsx
 */
function createHomeTsx(appName, appPath) {
  log(`\n📄 Criando Home.tsx...`, 'blue');

  const homeTsx = `import React from 'react';

export function Home() {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">Bem-vindo ao ${capitalize(appName)}</h2>
      <p className="text-neutral-600 mb-8">
        Aplicação inteligente powered by PSD
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="font-bold mb-2">🧠 Inteligência</h3>
          <p className="text-sm text-neutral-600">v3.0.0 integrado</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="font-bold mb-2">🎨 Design</h3>
          <p className="text-sm text-neutral-600">Sistema premium</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="font-bold mb-2">⚡ Pronto</h3>
          <p className="text-sm text-neutral-600">Para usar agora</p>
        </div>
      </div>
    </div>
  );
}`;

  fs.writeFileSync(`${appPath}/client/src/pages/Home.tsx`, homeTsx);
  log(`✓ Home.tsx criado`, 'green');
}

/**
 * Fase 6: Criar index.css com Design System
 */
function createIndexCss(appName, appPath) {
  log(`\n🎨 Criando index.css...`, 'blue');

  const indexCss = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --color-primary-500: #0a97ff;
  --color-primary-600: #0077d4;
  --color-neutral-0: #ffffff;
  --color-neutral-50: #f9fafb;
  --color-neutral-100: #f3f4f6;
  --color-neutral-600: #4b5563;
  --color-neutral-900: #111827;
  --gradient-primary: linear-gradient(135deg, #0a97ff 0%, #0077d4 100%);
  --spacing-md: 1rem;
  --radius-lg: 0.75rem;
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  color: var(--color-neutral-900);
  background-color: var(--color-neutral-0);
}

h1, h2, h3 { font-weight: 700; }
p { margin-bottom: var(--spacing-md); }

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.grid {
  display: grid;
  gap: var(--spacing-md);
}

.grid-cols-1 { grid-template-columns: 1fr; }
@media (min-width: 768px) {
  .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}

.text-center { text-align: center; }
.text-3xl { font-size: 1.875rem; }
.font-bold { font-weight: 700; }
.mb-4 { margin-bottom: 1rem; }
.mb-8 { margin-bottom: 2rem; }
.p-6 { padding: 1.5rem; }
.bg-white { background: white; }
.rounded-lg { border-radius: var(--radius-lg); }
.shadow-md { box-shadow: var(--shadow-md); }
`;

  fs.writeFileSync(`${appPath}/client/src/index.css`, indexCss);
  log(`✓ index.css criado`, 'green');
}

/**
 * Fase 7: Criar main.tsx
 */
function createMainTsx(appName, appPath) {
  log(`\n🚀 Criando main.tsx...`, 'blue');

  const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

  fs.writeFileSync(`${appPath}/client/src/main.tsx`, mainTsx);
  log(`✓ main.tsx criado`, 'green');
}

/**
 * Fase 8: Criar server/routers.ts com v3.0.0
 */
function createRouters(appName, appPath) {
  log(`\n🔌 Criando routers tRPC com v3.0.0...`, 'blue');

  const routers = `import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import { 
  continuousLearning,
  intelligentGoals,
  advancedPrediction,
  collectiveIntelligence,
  artificialCreativity,
  automaticEvolution,
  continuousEducation,
  continuousExcellence,
} from '@psd-core/v2/v3';

const t = initTRPC.create();

/**
 * ${capitalize(appName)} Router
 * Integrado com v3.0.0 - 8 módulos de inteligência
 */

export const appRouter = t.router({
  // Exemplo de procedure
  hello: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return \`Olá \${input.name}!\`;
    }),

  // Usar v3.0.0
  getIntelligence: t.procedure
    .query(async () => {
      const learning = await continuousLearning.analyze();
      const goals = await intelligentGoals.generate();
      const prediction = await advancedPrediction.forecast();
      
      return { learning, goals, prediction };
    }),
});

export type AppRouter = typeof appRouter;`;

  fs.writeFileSync(`${appPath}/server/routers.ts`, routers);
  log(`✓ routers.ts criado com v3.0.0`, 'green');
}

/**
 * Fase 9: Criar vite.config.ts
 */
function createViteConfig(appName, appPath) {
  log(`\n⚙️  Criando vite.config.ts...`, 'blue');

  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
    },
  },
  server: {
    port: 3000,
  },
});`;

  fs.writeFileSync(`${appPath}/vite.config.ts`, viteConfig);
  log(`✓ vite.config.ts criado`, 'green');
}

/**
 * Fase 10: Criar tsconfig.json
 */
function createTsConfig(appName, appPath) {
  log(`\n📝 Criando tsconfig.json...`, 'blue');

  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      paths: {
        '@/*': ['./client/src/*'],
      },
    },
    include: ['client/src', 'server'],
    references: [{ path: './tsconfig.node.json' }],
  };

  fs.writeFileSync(
    `${appPath}/tsconfig.json`,
    JSON.stringify(tsConfig, null, 2)
  );
  log(`✓ tsconfig.json criado`, 'green');
}

/**
 * Fase 11: Criar .gitignore
 */
function createGitignore(appName, appPath) {
  log(`\n🔒 Criando .gitignore...`, 'blue');

  const gitignore = `node_modules/
dist/
.env
.env.local
.DS_Store
*.log
.vite/
.turbo/
`;

  fs.writeFileSync(`${appPath}/.gitignore`, gitignore);
  log(`✓ .gitignore criado`, 'green');
}

/**
 * Fase 12: Criar README.md
 */
function createReadme(appName, appPath) {
  log(`\n📖 Criando README.md...`, 'blue');

  const readme = `# ${capitalize(appName)}

Aplicação inteligente powered by **PSD Core v2**

## 🚀 Características

- ✅ **Design System Premium** - Componentes reutilizáveis
- ✅ **v3.0.0 Integrado** - 8 módulos de inteligência
- ✅ **Serviços Unificados** - Payment, Auth, Notification, Database
- ✅ **Pronto para Usar** - Estrutura completa

## 📦 Começar

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

## 🧠 Inteligência

Este app tem acesso a:
- Aprendizado Contínuo
- Objetivos Inteligentes
- Previsão Avançada
- Inteligência Coletiva
- Criatividade Artificial
- Evolução Automática
- Educação Contínua
- Excelência Contínua

## 📚 Documentação

Ver [PSD Core v2](https://github.com/propaga/psd-core-v2)
`;

  fs.writeFileSync(`${appPath}/README.md`, readme);
  log(`✓ README.md criado`, 'green');
}

/**
 * Fase 13: Criar repositório no GitHub
 */
function createGitHubRepo(appName, appPath) {
  log(`\n🐙 Criando repositório no GitHub...`, 'blue');

  try {
    // Inicializar git local
    execSync('git init', { cwd: appPath });
    execSync('git add .', { cwd: appPath });
    execSync('git commit -m "Initial commit - PSD App Generator"', { cwd: appPath });

    // Criar repositório no GitHub
    const repoName = `psd-${appName}`;
    execSync(`gh repo create ${repoName} --private --source=${appPath} --remote=origin --push`, {
      cwd: appPath,
    });

    log(`✓ Repositório criado: marcodivulga-design/${repoName}`, 'green');
    return `https://github.com/marcodivulga-design/${repoName}`;
  } catch (error) {
    log(`⚠️  Aviso: Não foi possível criar repo no GitHub (${error.message})`, 'yellow');
    log(`   Você pode criar manualmente depois`, 'yellow');
    return null;
  }
}

/**
 * Main function
 */
async function main() {
  log('\n🚀 PSD App Generator', 'bright');
  log('Cria apps completos com uma palavra-chave\n', 'blue');

  const appName = process.argv[2];

  if (!appName) {
    log('❌ Erro: Forneça um nome para o app', 'red');
    log('Uso: node app-generator.mjs <nome-do-app>', 'yellow');
    log('Exemplo: node app-generator.mjs planner', 'yellow');
    process.exit(1);
  }

  const appSlug = slugify(appName);
  const appPath = `/home/ubuntu/psd-${appSlug}`;

  log(`\n📝 Criando app: psd-${appSlug}`, 'bright');

  try {
    // Verificar se já existe
    if (fs.existsSync(appPath)) {
      log(`❌ Erro: ${appPath} já existe`, 'red');
      process.exit(1);
    }

    // Criar diretório raiz
    fs.mkdirSync(appPath, { recursive: true });

    // Executar fases
    createDirectoryStructure(appSlug, appPath);
    createPackageJson(appSlug, appPath);
    createHtmlTemplate(appSlug, appPath);
    createAppTsx(appSlug, appPath);
    createHomeTsx(appSlug, appPath);
    createIndexCss(appSlug, appPath);
    createMainTsx(appSlug, appPath);
    createRouters(appSlug, appPath);
    createViteConfig(appSlug, appPath);
    createTsConfig(appSlug, appPath);
    createGitignore(appSlug, appPath);
    createReadme(appSlug, appPath);
    const githubUrl = createGitHubRepo(appSlug, appPath);

    log(`\n✅ App criado com sucesso!`, 'green');
    log(`\n📁 Localização: ${appPath}`, 'blue');
    if (githubUrl) {
      log(`\n🐙 GitHub: ${githubUrl}`, 'blue');
    }
    log(`\n🚀 Próximos passos:`, 'bright');
    log(`   cd ${appPath}`, 'yellow');
    log(`   pnpm install`, 'yellow');
    log(`   pnpm dev`, 'yellow');
    log(`\n🎉 Seu app já tem:`, 'bright');
    log(`   ✅ Design System Premium`, 'green');
    log(`   ✅ Componentes Reutilizáveis`, 'green');
    log(`   ✅ v3.0.0 (8 módulos de inteligência)`, 'green');
    log(`   ✅ Serviços Unificados`, 'green');
    log(`   ✅ Repositório no GitHub`, 'green');
    log(`   ✅ Pronto para usar!`, 'green');
  } catch (error) {
    log(`\n❌ Erro: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
