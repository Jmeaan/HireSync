'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

const WIDTH = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export function Modal({ open, onClose, title, subtitle, children, width = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(15,14,23,0.85)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn('relative w-full flex flex-col', WIDTH[width])}
        style={{
          background: '#1a1933',
          border: '1px solid #2a2850',
          borderRadius: 16,
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1)',
          maxHeight: '80vh',
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid #2a2850' }}
        >
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            {subtitle && (
              <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 mt-0.5 w-8 h-8 flex items-center justify-center transition-all"
            style={{ color: '#94a3b8', background: 'rgba(42,40,80,0.5)', border: 'none', cursor: 'pointer', borderRadius: 8 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(124,58,237,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.background = 'rgba(42,40,80,0.5)';
            }}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
