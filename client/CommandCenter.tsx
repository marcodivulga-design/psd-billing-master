import React, { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
// Importação simulada do nosso novo UI Kit do Core
// Em produção, isso seria importado de '@psd/ui'
import { StatusCard } from '../components/ui/StatusCard';
import { MobileNav } from '../components/ui/MobileNav';

const CommandCenter: React.FC = () => {
  const [apps, setApps] = useState<any[]>([]);
  const { data: scanResults, isLoading, refetch } = trpc.hubMentor.scanAll.useQuery();

  useEffect(() => {
    if (scanResults) {
      setApps(scanResults);
    }
  }, [scanResults]);

  const navItems = [
    { label: 'Dashboard', icon: '📊', active: true, onClick: () => {} },
    { label: 'Apps', icon: '📱', onClick: () => {} },
    { label: 'Oportunidades', icon: '💰', onClick: () => {} },
    { label: 'Config', icon: '⚙️', onClick: () => {} },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Header Cósmico */}
      <header className="p-6 bg-gradient-to-b from-purple-900/20 to-transparent">
        <h1 className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          PSD COMMAND CENTER
        </h1>
        <p className="text-slate-400 text-sm mt-1">Protocolo AVI v1.0.5 Ativo</p>
      </header>

      {/* Grid de Apps Mobile-First */}
      <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          apps.map((app) => (
            <StatusCard
              key={app.appId}
              appName={app.appName}
              status={app.status === 'CONNECTED' ? 'online' : 'offline'}
              lastSeen={new Date(app.lastScanTime).toLocaleTimeString()}
              integrations={app.inventory?.integrations ? Object.keys(app.inventory.integrations) : []}
            />
          ))
        )}
      </main>

      {/* Botão de Scan Flutuante */}
      <button 
        onClick={() => refetch()}
        className="fixed right-6 bottom-28 h-14 w-14 bg-purple-600 rounded-full shadow-2xl flex items-center justify-center text-2xl active:scale-90 transition-all z-40"
      >
        🔄
      </button>

      {/* Navegação Mobile do Core */}
      <MobileNav items={navItems} />
    </div>
  );
};

export default CommandCenter;
