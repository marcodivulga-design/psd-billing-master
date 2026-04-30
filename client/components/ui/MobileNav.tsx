import React from 'react';

interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
  onClick: () => void;
}

interface MobileNavProps {
  items: NavItem[];
}

export const MobileNav: React.FC<MobileNavProps> = ({ items }) => {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 px-8 py-4 flex justify-between items-center z-50 backdrop-blur-lg"
      style={{
        backgroundColor: 'rgba(11, 11, 15, 0.9)',
        borderTop: '1px solid #1A1A22',
      }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className="flex flex-col items-center gap-1 transition-all active:scale-90"
        >
          <div 
            className="text-2xl transition-colors"
            style={{ color: item.active ? '#7C3AED' : '#71717A' }}
          >
            {item.icon}
          </div>
          <span 
            className="text-[9px] font-bold uppercase tracking-[0.15em]"
            style={{ color: item.active ? '#FFFFFF' : '#71717A' }}
          >
            {item.label}
          </span>
          {item.active && (
            <div className="h-1 w-4 bg-[#7C3AED] rounded-full mt-1 shadow-[0_0_8px_#7C3AED]"></div>
          )}
        </button>
      ))}
    </nav>
  );
};
