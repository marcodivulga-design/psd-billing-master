import React from 'react';

interface StatusCardProps {
  appName: string;
  status: 'online' | 'offline' | 'error';
  lastSeen: string;
  integrations: string[];
}

export const StatusCard: React.FC<StatusCardProps> = ({ appName, status, lastSeen, integrations }) => {
  const statusColor = status === 'online' ? '#22C55E' : status === 'offline' ? '#71717A' : '#EF4444';

  return (
    <div 
      className="p-6 transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{
        backgroundColor: '#1A1A22',
        borderRadius: '16px',
        border: '1px solid #333333',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl text-white tracking-tight">{appName}</h3>
          <p className="text-xs text-[#A1A1AA] uppercase tracking-widest mt-1">AVI Protocol v1.0.5</p>
        </div>
        <div 
          className="h-3 w-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]"
          style={{ backgroundColor: statusColor, boxShadow: `0 0 10px ${statusColor}` }}
        ></div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {integrations.map(integ => (
          <span 
            key={integ} 
            className="px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-tighter"
            style={{ backgroundColor: '#111117', color: '#A78BFA', border: '1px solid #7C3AED33' }}
          >
            {integ}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-[#333333]">
        <span className="text-[10px] text-[#71717A] uppercase font-medium">Visto: {lastSeen}</span>
        <button className="text-[10px] font-bold text-[#7C3AED] hover:text-[#A78BFA] transition-colors uppercase tracking-widest">
          Detalhes →
        </button>
      </div>
    </div>
  );
};
