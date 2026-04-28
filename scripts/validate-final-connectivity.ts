#!/usr/bin/env npx tsx

/**
 * Script de Validação Final de Conectividade
 * 
 * Valida que todos os endpoints de inventário estão respondendo corretamente
 * com JSON válido e marca o status como CONNECTED no Hub Mentor.
 */

import { InventoryScannerService } from '../server/inventoryScannerService';
import { AppRegistry, initializeAppRegistry } from '../server/appRegistry';

async function validateConnectivity() {
  initializeAppRegistry();
  console.log(`
================================================================================
🔍 VALIDAÇÃO FINAL DE CONECTIVIDADE DO ECOSSISTEMA PSD
================================================================================
`);

  // Executar scan completo
  const results = await InventoryScannerService.scanAll();

  // Gerar relatório
  console.log(`
================================================================================
📊 RELATÓRIO DE VALIDAÇÃO FINAL
================================================================================
`);

  const summary = InventoryScannerService.getScanSummary(results);

  console.log(`
Total de Aplicativos: ${summary.total}
✅ Conectados: ${summary.connected}
❌ Offline: ${summary.offline}
⚠️  Não Integrados: ${summary.notIntegrated}
`);

  // Detalhes de cada app
  console.log(`
================================================================================
📱 DETALHES DE CADA APLICATIVO
================================================================================
`);

  results.forEach((result, index) => {
    const statusIcon = result.status === 'CONNECTED' ? '✅' : result.status === 'OFFLINE' ? '❌' : '⚠️ ';
    console.log(`
${index + 1}. ${statusIcon} ${result.appName}
   ID: ${result.appId}
   Status: ${result.status}
   Endpoint: ${result.endpointUsed || 'N/A'}
   Response Time: ${result.responseTime || 'N/A'}ms
   Last Scan: ${result.lastScanTime.toISOString()}
   ${result.error ? `Erro: ${result.error}` : ''}
   ${result.inventory ? `Versão: ${result.inventory.version}` : ''}
`);
  });

  // Apps conectados
  if (summary.connected > 0) {
    console.log(`
================================================================================
✅ APLICATIVOS RESPONDENDO (CONNECTED)
================================================================================
`);

    results
      .filter(r => r.status === 'CONNECTED')
      .forEach(result => {
        console.log(`
✅ ${result.appName}
   URL: ${result.endpointUsed}
   Response Time: ${result.responseTime}ms
   Inventory Data: ${JSON.stringify(result.inventory, null, 2)}
`);
      });
  }

  // Apps offline
  if (summary.offline > 0) {
    console.log(`
================================================================================
❌ APLICATIVOS OFFLINE
================================================================================
`);

    results
      .filter(r => r.status === 'OFFLINE')
      .forEach(result => {
        console.log(`
❌ ${result.appName}
   Erro: ${result.error}
`);
      });
  }

  // Resumo final
  console.log(`
================================================================================
📋 RESUMO FINAL
================================================================================
`);

  if (summary.connected === summary.total) {
    console.log(`
🎉 SUCESSO! Todos os ${summary.total} aplicativos estão CONECTADOS e respondendo!

O ecossistema PSD está pronto para monitoramento em tempo real pelo Hub Mentor.
`);
  } else if (summary.connected > 0) {
    console.log(`
⚠️  PARCIALMENTE CONECTADO: ${summary.connected} de ${summary.total} aplicativos estão respondendo.

Aplicativos offline precisam de atenção:
- Verificar se os servidores estão rodando
- Confirmar se as URLs de produção estão corretas
- Verificar logs de deploy para erros
`);
  } else {
    console.log(`
❌ NENHUM APLICATIVO CONECTADO

Próximas ações:
1. Verificar se os aplicativos estão em execução em produção
2. Confirmar se as URLs de deploy estão corretas
3. Testar manualmente os endpoints com curl
4. Verificar logs de servidor para erros
5. Garantir que o endpoint /api/system/inventory está acessível publicamente
`);
  }

  console.log(`
================================================================================
📅 Validação concluída em: ${new Date().toISOString()}
================================================================================
`);

  // Retornar código de saída apropriado
  process.exit(summary.connected === summary.total ? 0 : 1);
}

// Executar validação
validateConnectivity().catch(error => {
  console.error('❌ Erro durante validação:', error);
  process.exit(1);
});
