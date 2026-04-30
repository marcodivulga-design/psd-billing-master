import React, { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import { StatusCard } from '../components/ui/StatusCard';
import { MobileNav } from '../components/ui/MobileNav';

/**
 * PSD Command Center - Dashboard de Dominação por Verticais
 * O painel definitivo do Comandante Marco Véio.
 */

type Vertical = 'BRAIN' | 'FINANCE' | 'MEDIA' | 'EDU' | 'LOCAL';

const CommandCenter: React.FC = () => {
  const [activeVertical, setActiveVertical] = useState<Vertical>('BRAIN');
  const [apps, setApps] = useState<any[]>([]);
  const { data: scanResults, isLoading, refetch } = trpc.hubMentor.scanAll.useQuery();

  useEffect(() => {
    if (scanResults) {
      setApps(scanResults);
    }
  }, [scanResults]);

  const verticals: { id: Vertical; label: string; icon: string }[] = [
    { id: 'BRAIN', label: 'Brain', icon: '🧠' },
    { id: 'FINANCE', label: 'Finance', icon: '🏦' },
    { id: 'MEDIA', label: 'Media', icon: '🎵' },
    { id: 'EDU', label: 'Edu', icon: '🎓' },
    { id: 'LOCAL', label: 'Local', icon: '🏘️' },
  ];

  // Lógica de mapeamento de apps para verticais
  const verticalMapping: Record<Vertical, string[]> = {
    BRAIN: ['zapia-ai', 'propaga-core', 'opportunity', 'psd-core-v2', 'copiloto-propaga'],
    FINANCE: ['psd-billing-master', 'lux-trader', 'money-engine', 'hub_mentor'],
    MEDIA: ['showhub', 'gravadora_digital', 'soundpush', 'pequeno-maestro'],
    EDU: ['edumunicipal', 'brincando-e-aprendendo', 'catequizar', 'primeiros-passos'],
    LOCAL: ['psd-local-agent', 'qrpede', 'boostlocal', 'petshop-app', 'facepro-studio']
  };

  const filteredApps = apps.filter(app => 
    verticalMapping[activeVertical].includes(app.appId) || 
    activeVertical === 'BRAIN' // Fallback para mostrar algo se não houver mapeamento exato
  );

  const navItems = [
    { label: 'Dashboard', icon: '📊', active: true, onClick: () => {} },
    { label: 'Apps', icon: '📱', onClick: () => {} },
    { label: 'Oportunidades', icon: '💰', onClick: () => {} },
    { label: 'Config', icon: '⚙️', onClick: () => {} },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white font-sans p-6 pb-24">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] bg-clip-text text-transparent">
            PSD Command Center
          </h1>
          <p className="text-[#71717A] text-sm">Monitorando 47 Apps em 5 Verticais</p>
        </div>
        <button 
          onClick={() => refetch()}
          className={`bg-[#1A1A22] p-3 rounded-full border border-[#333333] transition-all active:scale-90 ${isLoading ? 'animate-spin' : ''}`}
        >
          <span className="text-xl">🔄</span>
        </button>
      </header>

      {/* Seletor de Verticais */}
      <nav className="flex space-x-2 overflow-x-auto mb-8 pb-2 no-scrollbar">
        {verticals.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveVertical(v.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border whitespace-nowrap transition-all ${
              activeVertical === v.id 
                ? 'bg-[#7C3AED] border-[#7C3AED] text-white' 
                : 'bg-[#111117] border-[#333333] text-[#A1A1AA]'
            }`}
          >
            <span>{v.icon}</span>
            <span className="font-medium">{v.label}</span>
          </button>
        ))}
      </nav>

      {/* Conteúdo da Vertical */}
      <main className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          Status da Vertical: <span className="text-[#A78BFA] ml-2">{activeVertical}</span>
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-[#7C3AED] border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApps.length > 0 ? (
              filteredApps.map((app) => (
                <StatusCard
                  key={app.appId}
                  appName={app.appName}
                  status={app.status === 'CONNECTED' ? 'online' : 'offline'}
                  lastSeen={new Date(app.lastScanTime).toLocaleTimeString()}
                  integrations={app.inventory?.integrations ? Object.keys(app.inventory.integrations) : []}
                />
              ))
            ) : (
              <p className="text-[#71717A] italic">Nenhum app ativo nesta vertical no momento.</p>
            )}
          </div>
        )}
      </main>

      <MobileNav items={navItems} />
    </div>
  );
};

export default CommandCenter;
