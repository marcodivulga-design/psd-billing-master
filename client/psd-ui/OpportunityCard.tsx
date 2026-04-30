import React from 'react';

interface OpportunityCardProps {
  title: string;
  description: string;
  value?: string;
  type: 'app' | 'deal' | 'content';
  onAction: () => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ title, description, value, type, onAction }) => {
  const typeIcons = {
    app: '🚀',
    deal: '💰',
    content: '📚'
  };

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <span className="text-2xl">{typeIcons[type]}</span>
        {value && <span className="text-green-400 font-bold text-sm">{value}</span>}
      </div>
      <div>
        <h4 className="text-white font-bold text-lg leading-tight">{title}</h4>
        <p className="text-slate-400 text-sm mt-1">{description}</p>
      </div>
      <button 
        onClick={onAction}
        className="mt-2 w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all active:scale-95"
      >
        Executar Oportunidade
      </button>
    </div>
  );
};
