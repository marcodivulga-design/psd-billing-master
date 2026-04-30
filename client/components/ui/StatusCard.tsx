import React from 'react';

interface StatusCardProps {
  appName: string;
  status: 'online' | 'offline' | 'error';
  lastSeen: string;
  integrations: string[];
}

export const StatusCard: React.FC<StatusCardProps> = ({ appName, status, lastSeen, integrations }) => {
  const statusColor = status === 'online' ? 'bg-green-500' : status === 'offline' ? 'bg-gray-500' : 'bg-red-500';

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{appName}</h3>
        <span className={`h-3 w-3 rounded-full ${statusColor}`} title={status}></span>
      </div>
      <p className="text-sm text-gray-500">Visto por último: {lastSeen}</p>
      <div className="flex gap-1 flex-wrap">
        {integrations.map(integ => (
          <span key={integ} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            {integ}
          </span>
        ))}
      </div>
    </div>
  );
};
