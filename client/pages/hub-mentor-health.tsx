import React, { useState, useEffect } from 'react';
import { InventoryScannerService, ScanResult } from '../server/inventoryScannerService';
import { AppRegistry } from '../server/appRegistry';

interface HealthStatus {
  connected: number;
  offline: number;
  notIntegrated: number;
  totalApps: number;
}

interface AppHealthCard {
  id: string;
  name: string;
  status: 'CONNECTED' | 'OFFLINE' | 'NOT_INTEGRATED';
  version?: string;
  responseTime?: number;
  lastScanTime: Date;
  features?: Record<string, boolean>;
  endpointUsed?: string;
}

export default function HubMentorHealth() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    connected: 0,
    offline: 0,
    notIntegrated: 0,
    totalApps: 0,
  });

  const [appCards, setAppCards] = useState<AppHealthCard[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    loadHealthStatus();
    const interval = setInterval(loadHealthStatus, 30000); // Atualizar a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const loadHealthStatus = async () => {
    try {
      const results = InventoryScannerService.getAllCachedResults();
      
      if (results.length === 0) {
        // Se não há cache, fazer um scan completo
        performScan();
        return;
      }

      const status: HealthStatus = {
        connected: results.filter(r => r.status === 'CONNECTED').length,
        offline: results.filter(r => r.status === 'OFFLINE').length,
        notIntegrated: results.filter(r => r.status === 'NOT_INTEGRATED').length,
        totalApps: results.length,
      };

      setHealthStatus(status);

      const cards: AppHealthCard[] = results.map(result => ({
        id: result.appId,
        name: result.appName,
        status: result.status,
        version: result.inventory?.version,
        responseTime: result.responseTime,
        lastScanTime: result.lastScanTime,
        features: result.inventory?.features,
        endpointUsed: result.endpointUsed,
      }));

      setAppCards(cards);
      setLastScanTime(new Date());
    } catch (error) {
      console.error('Erro ao carregar status de saúde:', error);
    }
  };

  const performScan = async () => {
    setIsScanning(true);
    try {
      const results = await InventoryScannerService.scanAll();

      const status: HealthStatus = {
        connected: results.filter(r => r.status === 'CONNECTED').length,
        offline: results.filter(r => r.status === 'OFFLINE').length,
        notIntegrated: results.filter(r => r.status === 'NOT_INTEGRATED').length,
        totalApps: results.length,
      };

      setHealthStatus(status);

      const cards: AppHealthCard[] = results.map(result => ({
        id: result.appId,
        name: result.appName,
        status: result.status,
        version: result.inventory?.version,
        responseTime: result.responseTime,
        lastScanTime: result.lastScanTime,
        features: result.inventory?.features,
        endpointUsed: result.endpointUsed,
      }));

      setAppCards(cards);
      setLastScanTime(new Date());
    } catch (error) {
      console.error('Erro ao fazer scan:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const scanSpecificApp = async (appId: string) => {
    try {
      const result = await InventoryScannerService.scanApp(appId);
      
      // Atualizar o card específico
      setAppCards(prev => 
        prev.map(card => 
          card.id === appId 
            ? {
                ...card,
                status: result.status,
                version: result.inventory?.version,
                responseTime: result.responseTime,
                lastScanTime: result.lastScanTime,
                features: result.inventory?.features,
                endpointUsed: result.endpointUsed,
              }
            : card
        )
      );

      // Atualizar status geral
      const allResults = InventoryScannerService.getAllCachedResults();
      const status: HealthStatus = {
        connected: allResults.filter(r => r.status === 'CONNECTED').length,
        offline: allResults.filter(r => r.status === 'OFFLINE').length,
        notIntegrated: allResults.filter(r => r.status === 'NOT_INTEGRATED').length,
        totalApps: allResults.length,
      };
      setHealthStatus(status);
    } catch (error) {
      console.error('Erro ao fazer scan do app:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return 'bg-green-900 text-green-100';
      case 'OFFLINE':
        return 'bg-red-900 text-red-100';
      case 'NOT_INTEGRATED':
        return 'bg-yellow-900 text-yellow-100';
      default:
        return 'bg-gray-900 text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return '✅';
      case 'OFFLINE':
        return '❌';
      case 'NOT_INTEGRATED':
        return '⚠️';
      default:
        return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🏥 Hub Mentor - Health Dashboard</h1>
        <p className="text-gray-400">Monitoramento em tempo real do ecossistema PSD</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 border border-green-700">
          <div className="text-4xl font-bold text-green-100 mb-2">{healthStatus.connected}</div>
          <div className="text-sm text-green-200">Conectados</div>
        </div>
        <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-lg p-6 border border-red-700">
          <div className="text-4xl font-bold text-red-100 mb-2">{healthStatus.offline}</div>
          <div className="text-sm text-red-200">Offline</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-lg p-6 border border-yellow-700">
          <div className="text-4xl font-bold text-yellow-100 mb-2">{healthStatus.notIntegrated}</div>
          <div className="text-sm text-yellow-200">Não Integrados</div>
        </div>
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-700">
          <div className="text-4xl font-bold text-blue-100 mb-2">{healthStatus.totalApps}</div>
          <div className="text-sm text-blue-200">Total de Apps</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={performScan}
          disabled={isScanning}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition"
        >
          {isScanning ? '🔄 Escaneando...' : '🔄 Escanear Tudo'}
        </button>
        {lastScanTime && (
          <div className="text-sm text-gray-400 flex items-center">
            Último scan: {lastScanTime.toLocaleTimeString('pt-BR')}
          </div>
        )}
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appCards.map(app => (
          <div
            key={app.id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition"
          >
            {/* App Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{getStatusIcon(app.status)}</span>
                  <h3 className="font-semibold text-gray-100">{app.name}</h3>
                </div>
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(app.status)}`}>
                  {app.status}
                </div>
              </div>
            </div>

            {/* App Details */}
            {app.status === 'CONNECTED' && (
              <div className="space-y-2 text-sm text-gray-400 mb-4">
                {app.version && (
                  <div className="flex justify-between">
                    <span>Versão:</span>
                    <span className="text-gray-200">{app.version}</span>
                  </div>
                )}
                {app.responseTime && (
                  <div className="flex justify-between">
                    <span>Tempo de Resposta:</span>
                    <span className="text-gray-200">{app.responseTime}ms</span>
                  </div>
                )}
                {app.endpointUsed && (
                  <div className="flex justify-between">
                    <span>Endpoint:</span>
                    <span className="text-gray-200 text-xs">{app.endpointUsed}</span>
                  </div>
                )}
              </div>
            )}

            {/* Features */}
            {app.features && Object.keys(app.features).length > 0 && (
              <div className="mb-4 text-xs">
                <div className="text-gray-400 mb-2">Funcionalidades:</div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(app.features).map(([key, enabled]) => (
                    <span
                      key={key}
                      className={`px-2 py-1 rounded ${
                        enabled
                          ? 'bg-green-900 text-green-200'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {key}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Scan Button */}
            <button
              onClick={() => scanSpecificApp(app.id)}
              className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm font-medium transition"
            >
              🔍 Escanear Agora
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {appCards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Nenhum aplicativo registrado</p>
          <button
            onClick={performScan}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
          >
            Fazer Scan Inicial
          </button>
        </div>
      )}
    </div>
  );
}
