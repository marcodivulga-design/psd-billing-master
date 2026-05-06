/**
 * PSD-Core Unified Services Index
 * 
 * Exporta todos os serviços consolidados do ecossistema
 */

// ============================================
// Core Services (Simplified)
// ============================================

// Re-export main services
export { PSDAuthService as authService } from './auth-service';
export { PSDNotificationService as notificationService } from './notification-service';
export { PSDPayService as payService } from './pay-service';
export { PSDDatabaseManager as databaseManager } from './database-manager';
export { PSDIntelligenceService as intelligenceService } from './intelligence-service';
export { PSDCreativeEngine as creativeEngine } from './creative-engine';
export { PSDNeuralMesh as neuralMesh } from './neural-mesh';
export { PSDIntentEngine as intentEngine } from './intent-engine';
export { PSDProspectorService as prospectorService } from './prospector-service';
export { PSDSchedulerService as schedulerService } from './scheduler-service';
export { PSDCatalogService as catalogService } from './catalog-service';
export { PSDBuilderService as builderService } from './builder-service';
export { PSDRevenueOptimizer as revenueOptimizer } from './revenue-optimizer';
export { PSDTraderIntelligence as traderIntelligence } from './trader-intelligence';
export { PSDArbitrageEngine as arbitrageEngine } from './arbitrage-engine';
export { PSDTokenEconomy as tokenEconomy } from './token-economy';
export { PSDSwarmProtocol as swarmProtocol } from './swarm-protocol';

// ============================================
// Master Export
// ============================================

export const PSDCore = {
  version: '2.1.0',
  status: 'production',
  services: {
    auth: 'enabled',
    notification: 'enabled',
    payment: 'enabled',
    database: 'enabled',
    intelligence: 'enabled',
    trading: 'enabled',
  },
};

export default PSDCore;
