import React from 'react';

interface NavItem {
  label: string;
  icon: string; // Pode ser um nome de ícone ou URL
  active?: boolean;
  onClick: () => void;
}

interface MobileNavProps {
  items: NavItem[];
}

export const MobileNav: React.FC<MobileNavProps> = ({ items }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-6 py-3 flex justify-between items-center z-50">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className={`flex flex-col items-center gap-1 ${
            item.active ? 'text-purple-400' : 'text-slate-400'
          }`}
        >
          <div className="text-2xl">{item.icon}</div>
          <span className="text-[10px] font-medium uppercase tracking-wider">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};
