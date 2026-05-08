'use client';

import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  delta?: { value: string; positive: boolean };
  icon?: React.ReactNode;
  emphasis?: boolean;
}

export function StatCard({ label, value, sub, delta, icon, emphasis }: StatCardProps) {
  return (
    <div
      className={cn('p-5 flex flex-col gap-3 min-w-0')}
      style={{
        background: emphasis ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.15))' : '#1a1933',
        border: `1px solid ${emphasis ? 'rgba(124,58,237,0.4)' : '#2a2850'}`,
        borderRadius: 12,
        boxShadow: emphasis ? '0 0 24px rgba(124,58,237,0.15)' : 'none',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold truncate" style={{ color: '#94a3b8' }}>
          {label}
        </p>
        {icon && (
          <span
            className="w-9 h-9 flex items-center justify-center shrink-0"
            style={{
              background: emphasis ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.12)',
              borderRadius: 8,
              color: emphasis ? '#a78bfa' : '#7c3aed',
            }}
          >
            {icon}
          </span>
        )}
      </div>
      <p
        className="font-bold tracking-tight leading-none"
        style={{ fontSize: 40, color: emphasis ? '#a78bfa' : '#ffffff' }}
      >
        {value}
      </p>
      <div className="flex items-center gap-2 min-h-[1.25rem]">
        {delta && (
          <span
            className="text-sm font-semibold"
            style={{ color: delta.positive ? '#22c55e' : '#f87171' }}
          >
            {delta.positive ? '▲' : '▼'} {delta.value}
          </span>
        )}
        {sub && (
          <span className="text-sm" style={{ color: '#94a3b8' }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}
