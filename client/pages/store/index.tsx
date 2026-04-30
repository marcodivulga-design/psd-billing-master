import React from 'react';
import { PSD_STORE_CATALOG, StoreApp } from '../shared/store-data';

export const StoreUI: React.FC = () => {
  return (
    <div className="p-6 bg-[#0B0B0F] min-h-screen text-white">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]">
          PSD STORE
        </h1>
        <p className="text-[#A1A1AA] mt-2">Tecnologia com Alma e Inteligência</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PSD_STORE_CATALOG.map((app: StoreApp) => (
          <div 
            key={app.id}
            className="p-6 rounded-[16px] border border-[#1A1A22] bg-[#111117] hover:border-[#7C3AED] transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]">
                {app.icon}
              </div>
              <div>
                <h3 className="font-bold text-xl">{app.name}</h3>
                <span className="text-[10px] uppercase tracking-widest text-[#7C3AED]">{app.category}</span>
              </div>
            </div>
            <p className="text-[#A1A1AA] text-sm mb-6 leading-relaxed">
              {app.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#FFFFFF]">{app.price}</span>
              <button className="px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-[12px] uppercase tracking-widest transition-all">
                Adquirir
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <footer className="mt-20 text-center text-[10px] text-[#71717A] uppercase tracking-[0.2em]">
        apptipo by Propaga soluções digitais
      </footer>
    </div>
  );
};
