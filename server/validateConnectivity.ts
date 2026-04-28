import { InventoryScannerService } from './inventoryScannerService';
import { AppRegistry } from './appRegistry';

/**
 * Script de Validação de Conectividade
 * Testa a conexão com todos os aplicativos registrados
 */

async function validateConnectivity() {
  console.log('\n🚀 Iniciando validação de conectividade do Hub Mentor...\n');

  // Inicializar registry
  const apps = AppRegistry.list();
  console.log(`📋 ${apps.length} aplicativos registrados:`);
  apps.forEach(app => {
    console.log(`   • ${app.name} (${app.id})`);
    console.log(`     URL: ${app.baseUrl}${app.inventoryEndpoint}`);
  });

  console.log('\n🔄 Iniciando scans...\n');

  // Fazer scan de todos os apps
  const results = await InventoryScannerService.scanAll();

  // Processar resultados
  console.log('\n📊 RESULTADOS DA VALIDAÇÃO:\n');

  const summary = InventoryScannerService.getScanSummary(results);

  // Tabela de resultados
  console.log('┌─────────────────────────────────────────────────────────────────┐');
  console.log('│ App                          │ Status       │ Tempo (ms) │ Versão │');
  console.log('├─────────────────────────────────────────────────────────────────┤');

  results.forEach(result => {
    const statusIcon = result.status === 'CONNECTED' ? '✅' : result.status === 'OFFLINE' ? '❌' : '⚠️';
    const appName = result.appName.padEnd(28);
    const status = `${statusIcon} ${result.status}`.padEnd(12);
    const time = (result.responseTime || 0).toString().padEnd(10);
    const version = result.inventory?.version || 'N/A';

    console.log(`│ ${appName} │ ${status} │ ${time} │ ${version} │`);
  });

  console.log('└─────────────────────────────────────────────────────────────────┘');

  // Resumo
  console.log('\n📈 RESUMO:\n');
  console.log(`   Total de Apps:        ${summary.total}`);
  console.log(`   ✅ Conectados:        ${summary.connected}`);
  console.log(`   ❌ Offline:           ${summary.offline}`);
  console.log(`   ⚠️  Não Integrados:    ${summary.notIntegrated}`);

  // Detalhes de cada app
  console.log('\n📝 DETALHES:\n');

  results.forEach(result => {
    console.log(`\n${result.status === 'CONNECTED' ? '✅' : result.status === 'OFFLINE' ? '❌' : '⚠️'} ${result.appName}`);
    console.log(`   ID: ${result.appId}`);
    console.log(`   Status: ${result.status}`);

    if (result.status === 'CONNECTED' && result.inventory) {
      console.log(`   Versão: ${result.inventory.version}`);
      console.log(`   Descrição: ${result.inventory.description || 'N/A'}`);
      console.log(`   Tempo de resposta: ${result.responseTime}ms`);

      if (result.inventory.endpoints && result.inventory.endpoints.length > 0) {
        console.log(`   Endpoints (${result.inventory.endpoints.length}):`);
        result.inventory.endpoints.slice(0, 3).forEach(endpoint => {
          console.log(`      • ${endpoint}`);
        });
        if (result.inventory.endpoints.length > 3) {
          console.log(`      • +${result.inventory.endpoints.length - 3} mais`);
        }
      }
    } else if (result.status === 'OFFLINE') {
      console.log(`   Erro: ${result.error}`);
    }
  });

  // Status final
  console.log('\n' + '='.repeat(65));
  if (summary.connected > 0) {
    console.log(`\n✅ SUCESSO! ${summary.connected} aplicativo(s) conectado(s) com sucesso!\n`);
  } else {
    console.log(`\n⚠️  AVISO: Nenhum aplicativo conectado. Verifique as URLs e se os apps estão rodando.\n`);
  }
  console.log('='.repeat(65) + '\n');

  // Retornar status
  return {
    success: summary.connected > 0,
    summary,
    results,
  };
}

// Executar validação
validateConnectivity().catch(error => {
  console.error('❌ Erro durante validação:', error);
  process.exit(1);
});
