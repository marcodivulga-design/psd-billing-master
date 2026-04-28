import { AppRegistry, initializeAppRegistry } from './appRegistry';
import { InventoryScannerService } from './inventoryScannerService';

/**
 * Script para Gerar Relatório Detalhado de Status de Todos os Apps
 * Executa scan em tempo real e consolida os dados
 */

interface AppStatusReport {
  appId: string;
  appName: string;
  baseUrl: string;
  inventoryEndpoint: string;
  status: 'CONNECTED' | 'OFFLINE' | 'NOT_INTEGRATED';
  responseTime?: number;
  lastScan?: Date;
  inventory?: {
    name: string;
    version: string;
    status: string;
    description?: string;
    endpoints?: string[];
    database?: any;
    features?: Record<string, boolean>;
  };
  error?: string;
}

async function generateAppStatusReport(): Promise<AppStatusReport[]> {
  console.log('\n' + '='.repeat(80));
  console.log('📊 RELATÓRIO DE STATUS DOS APPS REGISTRADOS NO HUB MENTOR');
  console.log('='.repeat(80) + '\n');

  // Inicializar registry
  initializeAppRegistry();

  // Fazer scan de todos os apps
  console.log('🔄 Executando scan de todos os aplicativos...\n');
  const scanResults = await InventoryScannerService.scanAll();

  // Consolidar dados
  const report: AppStatusReport[] = [];

  scanResults.forEach(result => {
    const app = AppRegistry.get(result.appId);

    if (app) {
      report.push({
        appId: result.appId,
        appName: result.appName,
        baseUrl: app.baseUrl,
        inventoryEndpoint: app.inventoryEndpoint,
        status: result.status,
        responseTime: result.responseTime,
        lastScan: result.lastScanTime,
        inventory: result.inventory,
        error: result.error,
      });
    }
  });

  // Exibir relatório em formato tabular
  console.log('\n' + '='.repeat(80));
  console.log('📋 RESUMO DE CONECTIVIDADE');
  console.log('='.repeat(80) + '\n');

  const summary = InventoryScannerService.getScanSummary(scanResults);
  console.log(`Total de Aplicativos: ${summary.total}`);
  console.log(`✅ Conectados: ${summary.connected}`);
  console.log(`❌ Offline: ${summary.offline}`);
  console.log(`⚠️  Não Integrados: ${summary.notIntegrated}\n`);

  // Tabela de apps
  console.log('='.repeat(80));
  console.log('📱 DETALHES DE CADA APLICATIVO');
  console.log('='.repeat(80) + '\n');

  report.forEach((app, index) => {
    const statusIcon = app.status === 'CONNECTED' ? '✅' : app.status === 'OFFLINE' ? '❌' : '⚠️';

    console.log(`${index + 1}. ${statusIcon} ${app.appName}`);
    console.log(`   ID: ${app.appId}`);
    console.log(`   Base URL: ${app.baseUrl}`);
    console.log(`   Endpoint: ${app.inventoryEndpoint}`);
    console.log(`   Status: ${app.status}`);

    if (app.status === 'CONNECTED') {
      console.log(`   Tempo de Resposta: ${app.responseTime}ms`);
      console.log(`   Último Scan: ${app.lastScan?.toLocaleString('pt-BR')}`);

      if (app.inventory) {
        console.log(`   \n   📦 Dados de Inventário Recebidos:`);
        console.log(`      Nome: ${app.inventory.name}`);
        console.log(`      Versão: ${app.inventory.version}`);
        console.log(`      Status: ${app.inventory.status}`);

        if (app.inventory.description) {
          console.log(`      Descrição: ${app.inventory.description}`);
        }

        if (app.inventory.endpoints && app.inventory.endpoints.length > 0) {
          console.log(`      Endpoints (${app.inventory.endpoints.length}):`);
          app.inventory.endpoints.slice(0, 5).forEach(endpoint => {
            console.log(`         • ${endpoint}`);
          });
          if (app.inventory.endpoints.length > 5) {
            console.log(`         • +${app.inventory.endpoints.length - 5} mais`);
          }
        }

        if (app.inventory.database) {
          console.log(`      Banco de Dados:`);
          console.log(`         Conectado: ${app.inventory.database.connected ? 'Sim' : 'Não'}`);
          if (app.inventory.database.tables && app.inventory.database.tables.length > 0) {
            console.log(`         Tabelas (${app.inventory.database.tables.length}):`);
            app.inventory.database.tables.slice(0, 5).forEach((table: string) => {
              console.log(`            • ${table}`);
            });
            if (app.inventory.database.tables.length > 5) {
              console.log(`            • +${app.inventory.database.tables.length - 5} mais`);
            }
          }
        }

        if (app.inventory.features && Object.keys(app.inventory.features).length > 0) {
          console.log(`      Features Ativas:`);
          Object.entries(app.inventory.features).forEach(([feature, enabled]) => {
            const icon = enabled ? '✅' : '❌';
            console.log(`         ${icon} ${feature}`);
          });
        }
      }
    } else if (app.status === 'OFFLINE') {
      console.log(`   Erro: ${app.error}`);
      console.log(`   Último Scan: ${app.lastScan?.toLocaleString('pt-BR')}`);
    } else {
      console.log(`   Motivo: Endpoint de inventário não configurado ou app não registrado`);
    }

    console.log('');
  });

  // Resumo final
  console.log('='.repeat(80));
  console.log('✅ APLICATIVOS RESPONDENDO (CONNECTED)');
  console.log('='.repeat(80) + '\n');

  const connectedApps = report.filter(app => app.status === 'CONNECTED');
  if (connectedApps.length > 0) {
    connectedApps.forEach(app => {
      console.log(`✅ ${app.appName} (${app.responseTime}ms)`);
      console.log(`   URL: ${app.baseUrl}${app.inventoryEndpoint}`);
      console.log(`   Versão: ${app.inventory?.version}`);
      console.log('');
    });
  } else {
    console.log('⚠️  Nenhum aplicativo conectado no momento.\n');
  }

  // Resumo de offline
  console.log('='.repeat(80));
  console.log('❌ APLICATIVOS OFFLINE');
  console.log('='.repeat(80) + '\n');

  const offlineApps = report.filter(app => app.status === 'OFFLINE');
  if (offlineApps.length > 0) {
    offlineApps.forEach(app => {
      console.log(`❌ ${app.appName}`);
      console.log(`   URL: ${app.baseUrl}${app.inventoryEndpoint}`);
      console.log(`   Erro: ${app.error}`);
      console.log('');
    });
  } else {
    console.log('✅ Nenhum aplicativo offline.\n');
  }

  // Resumo de não integrados
  console.log('='.repeat(80));
  console.log('⚠️  APLICATIVOS NÃO INTEGRADOS');
  console.log('='.repeat(80) + '\n');

  const notIntegratedApps = report.filter(app => app.status === 'NOT_INTEGRATED');
  if (notIntegratedApps.length > 0) {
    notIntegratedApps.forEach(app => {
      console.log(`⚠️  ${app.appName}`);
      console.log(`   ID: ${app.appId}`);
      console.log('');
    });
  } else {
    console.log('✅ Todos os aplicativos estão integrados.\n');
  }

  console.log('='.repeat(80));
  console.log(`📅 Relatório gerado em: ${new Date().toLocaleString('pt-BR')}`);
  console.log('='.repeat(80) + '\n');

  return report;
}

// Executar e exportar
export async function runReport() {
  try {
    const report = await generateAppStatusReport();
    return report;
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error);
    process.exit(1);
  }
}

// Se executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runReport();
}
