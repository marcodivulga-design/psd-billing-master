'use client';

import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'destructive' | 'success';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({
      title,
      description,
      duration = 3000,
      variant = 'default',
    }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = { id, title, description, duration, variant };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toast, dismiss, toasts };
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toasts, dismiss } = useToast();

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-[100]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-lg text-white shadow-lg animate-in slide-in-from-right-full ${
              t.variant === 'destructive'
                ? 'bg-red-500'
                : t.variant === 'success'
                ? 'bg-green-500'
                : 'bg-blue-500'
            }`}
          >
            <div className="font-bold">{t.title}</div>
            {t.description && <div className="text-sm">{t.description}</div>}
          </div>
        ))}
      </div>
    </>
  );
};
