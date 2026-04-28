import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

/**
 * Hub Mentor Dashboard
 * Exibe status de conectividade e inventário dos aplicativos do ecossistema PSD
 */

interface AppStatus {
  appId: string;
  appName: string;
  status: 'CONNECTED' | 'OFFLINE' | 'NOT_INTEGRATED';
  inventory?: {
    name: string;
    version: string;
    status: string;
    description?: string;
    endpoints?: string[];
  };
  error?: string;
  responseTime?: number;
}

export function HubMentorPage() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  // Query: Obter status geral do ecossistema
  const { data: statusData, isLoading: isLoadingStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['hub-mentor-status'],
    queryFn: () => trpc.hubMentor.getStatus.query(),
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  // Mutation: Fazer scan de todos os apps
  const scanAllMutation = useMutation({
    mutationFn: () => trpc.hubMentor.scanAll.query(),
    onSuccess: () => {
      refetchStatus();
    },
  });

  // Mutation: Fazer scan de um app específico
  const scanAppMutation = useMutation({
    mutationFn: (appId: string) => trpc.hubMentor.scanApp.query({ appId }),
    onSuccess: () => {
      refetchStatus();
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'OFFLINE':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'NOT_INTEGRATED':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return 'bg-green-100 text-green-800';
      case 'OFFLINE':
        return 'bg-red-100 text-red-800';
      case 'NOT_INTEGRATED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const apps = statusData?.lastScanResults || [];
  const summary = statusData?.registry?.statusCounts || { CONNECTED: 0, OFFLINE: 0, NOT_INTEGRATED: 0 };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hub Mentor - Monitoramento de Apps</h1>
          <p className="text-gray-600 mt-2">
            Acompanhe o status de conectividade dos aplicativos do ecossistema PSD
          </p>
        </div>
        <Button
          onClick={() => scanAllMutation.mutate()}
          disabled={scanAllMutation.isPending || isLoadingStatus}
          className="gap-2"
        >
          {scanAllMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Escaneando...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Escanear Tudo
            </>
          )}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conectados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{summary.CONNECTED}</div>
            <p className="text-xs text-gray-500 mt-1">aplicativos online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{summary.OFFLINE}</div>
            <p className="text-xs text-gray-500 mt-1">aplicativos indisponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Não Integrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{summary.NOT_INTEGRATED}</div>
            <p className="text-xs text-gray-500 mt-1">sem endpoint de inventário</p>
          </CardContent>
        </Card>
      </div>

      {/* Apps Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Aplicativos Registrados</h2>

        {isLoadingStatus ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : apps.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              Nenhum aplicativo escaneado ainda. Clique em "Escanear Tudo" para começar.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apps.map((app: AppStatus) => (
              <Card
                key={app.appId}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedApp(selectedApp === app.appId ? null : app.appId)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(app.status)}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{app.appName}</CardTitle>
                        <CardDescription className="text-xs">
                          ID: {app.appId}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status}
                    </Badge>
                  </div>
                </CardHeader>

                {selectedApp === app.appId && (
                  <CardContent className="space-y-4">
                    {app.status === 'CONNECTED' && app.inventory ? (
                      <>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold">Versão:</span> {app.inventory.version}
                          </div>
                          <div>
                            <span className="font-semibold">Status:</span> {app.inventory.status}
                          </div>
                          {app.inventory.description && (
                            <div>
                              <span className="font-semibold">Descrição:</span> {app.inventory.description}
                            </div>
                          )}
                          {app.responseTime && (
                            <div>
                              <span className="font-semibold">Tempo de Resposta:</span> {app.responseTime}ms
                            </div>
                          )}
                        </div>

                        {app.inventory.endpoints && app.inventory.endpoints.length > 0 && (
                          <div>
                            <span className="font-semibold text-sm">Endpoints:</span>
                            <ul className="text-xs text-gray-600 mt-1 space-y-1">
                              {app.inventory.endpoints.slice(0, 3).map((endpoint, idx) => (
                                <li key={idx}>• {endpoint}</li>
                              ))}
                              {app.inventory.endpoints.length > 3 && (
                                <li>• +{app.inventory.endpoints.length - 3} mais</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </>
                    ) : app.status === 'OFFLINE' ? (
                      <div className="text-sm text-red-600">
                        <p className="font-semibold">Erro de Conexão</p>
                        <p className="text-xs mt-1">{app.error || 'Aplicativo não respondeu'}</p>
                      </div>
                    ) : (
                      <div className="text-sm text-yellow-600">
                        <p className="font-semibold">Não Integrado</p>
                        <p className="text-xs mt-1">Endpoint de inventário não encontrado</p>
                      </div>
                    )}

                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        scanAppMutation.mutate(app.appId);
                      }}
                      disabled={scanAppMutation.isPending}
                      className="w-full"
                    >
                      {scanAppMutation.isPending ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin mr-2" />
                          Escaneando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3 mr-2" />
                          Escanear Agora
                        </>
                      )}
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Last Update */}
      {statusData?.timestamp && (
        <div className="text-xs text-gray-500 text-center">
          Última atualização: {new Date(statusData.timestamp).toLocaleString('pt-BR')}
        </div>
      )}
    </div>
  );
}

export default HubMentorPage;
