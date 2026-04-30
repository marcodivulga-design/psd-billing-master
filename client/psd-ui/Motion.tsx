import React from 'react';

/**
 * PSD Motion System - Micro-interações de Elite
 * Padroniza animações e feedbacks táteis para percepção de Big Tech.
 */

export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <div 
    className="animate-in fade-in duration-700 fill-mode-both"
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

export const ScalePress: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <button 
    onClick={onClick}
    className="transition-transform active:scale-95 duration-200 ease-out outline-none"
  >
    {children}
  </button>
);

export const SlideUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <div 
    className="animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both"
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);
