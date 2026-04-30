import React from 'react';

interface LPProps {
  appName: string;
  tagline: string;
  features: string[];
  ctaText: string;
  price: string;
}

export const LPGenerator: React.FC<LPProps> = ({ appName, tagline, features, ctaText, price }) => {
  return (
    <div className="bg-[#0B0B0F] text-white min-h-screen font-['Inter']">
      {/* Hero Section */}
      <section className="px-6 py-24 text-center bg-gradient-to-b from-[#7C3AED11] to-transparent">
        <h1 className="text-5xl font-extrabold tracking-tighter mb-4 leading-none">
          {appName}
        </h1>
        <p className="text-xl text-[#A1A1AA] max-w-md mx-auto leading-tight">
          {tagline}
        </p>
        <div className="mt-10">
          <button className="px-10 py-5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-[16px] text-lg shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all active:scale-95">
            {ctaText}
          </button>
          <p className="text-[#71717A] text-xs mt-4 uppercase tracking-widest">A partir de {price}</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-[#111117]">
        <h2 className="text-2xl font-bold mb-10 text-center uppercase tracking-widest">Diferenciais Elite</h2>
        <div className="grid gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-[16px] bg-[#1A1A22] border border-[#333] flex items-start gap-4">
              <span className="text-[#7C3AED] text-xl">✓</span>
              <p className="text-[#FFFFFF] font-medium">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 text-center">
        <div className="text-[10px] text-[#71717A] uppercase tracking-[0.3em] mb-2">Desenvolvido por</div>
        <div className="font-bold text-lg tracking-tighter">Propaga Soluções Digitais</div>
        <div className="text-[9px] text-[#7C3AED] mt-4 uppercase font-bold">Protocolo AVI v1.0.5 Ativo</div>
      </footer>
    </div>
  );
};
