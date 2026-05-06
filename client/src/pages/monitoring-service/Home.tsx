import React from 'react';

export function Home() {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">Bem-vindo ao Monitoring-service</h2>
      <p className="text-neutral-600 mb-8">
        Aplicação inteligente powered by PSD
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="font-bold mb-2">🧠 Inteligência</h3>
          <p className="text-sm text-neutral-600">v3.0.0 integrado</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="font-bold mb-2">🎨 Design</h3>
          <p className="text-sm text-neutral-600">Sistema premium</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="font-bold mb-2">⚡ Pronto</h3>
          <p className="text-sm text-neutral-600">Para usar agora</p>
        </div>
      </div>
    </div>
  );
}