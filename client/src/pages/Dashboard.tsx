import React, { useState, useEffect } from 'react'

interface AppStatus {
  id: string
  name: string
  status: 'online' | 'offline' | 'maintenance'
  users: number
  lastSync: string
  version: string
}

const APPS_DATA: AppStatus[] = [
  {
    id: 'ai-customer-support',
    name: 'IA - Atendimento ao Cliente',
    status: 'online',
    users: 1250,
    lastSync: '2 min atrás',
    version: '1.2.0'
  },
  {
    id: 'analytics-service',
    name: 'Serviço de Analytics',
    status: 'online',
    users: 3420,
    lastSync: '1 min atrás',
    version: '2.1.0'
  },
  {
    id: 'content-generator',
    name: 'Gerador de Conteúdo',
    status: 'online',
    users: 890,
    lastSync: '5 min atrás',
    version: '1.5.2'
  },
  {
    id: 'dashboard-operacional',
    name: 'Dashboard Operacional',
    status: 'online',
    users: 2100,
    lastSync: '1 min atrás',
    version: '3.0.1'
  },
  {
    id: 'monitoring-service',
    name: 'Serviço de Monitoramento',
    status: 'online',
    users: 450,
    lastSync: '3 min atrás',
    version: '1.8.0'
  },
  {
    id: 'payment-gateway',
    name: 'Gateway de Pagamentos',
    status: 'online',
    users: 5670,
    lastSync: '30 seg atrás',
    version: '2.5.0'
  },
  {
    id: 'trend-radar',
    name: 'Radar de Tendências',
    status: 'online',
    users: 780,
    lastSync: '4 min atrás',
    version: '1.3.0'
  }
]

export default function Dashboard() {
  const [apps, setApps] = useState<AppStatus[]>(APPS_DATA)
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all')

  const filteredApps = apps.filter(app => {
    if (filter === 'all') return true
    return app.status === filter
  })

  const stats = {
    total: apps.length,
    online: apps.filter(a => a.status === 'online').length,
    offline: apps.filter(a => a.status === 'offline').length,
    totalUsers: apps.reduce((sum, a) => sum + a.users, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'offline':
        return 'bg-red-500'
      case 'maintenance':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online'
      case 'offline':
        return 'Offline'
      case 'maintenance':
        return 'Manutenção'
      default:
        return 'Desconhecido'
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Dashboard Consolidado
          </h1>
          <p className="text-muted-foreground">
            Monitoramento em tempo real de todos os 12 apps PSD integrados
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Total de Apps</div>
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Online</div>
            <div className="text-3xl font-bold text-green-500">{stats.online}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Offline</div>
            <div className="text-3xl font-bold text-red-500">{stats.offline}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Total de Usuários</div>
            <div className="text-3xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-card'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('online')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filter === 'online'
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-background text-foreground border-border hover:bg-card'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => setFilter('offline')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filter === 'offline'
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-background text-foreground border-border hover:bg-card'
            }`}
          >
            Offline
          </button>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map(app => (
            <div
              key={app.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{app.name}</h3>
                  <p className="text-sm text-muted-foreground">v{app.version}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(app.status)}`} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-medium text-foreground">
                    {getStatusText(app.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Usuários Ativos</span>
                  <span className="text-sm font-medium text-foreground">
                    {app.users.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Última Sincronização</span>
                  <span className="text-sm font-medium text-foreground">
                    {app.lastSync}
                  </span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                Detalhes
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
