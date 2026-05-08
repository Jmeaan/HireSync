'use client';

import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex" style={{ borderBottom: '1px solid #2a2850' }}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="px-5 py-3 text-sm font-semibold transition-all duration-150 -mb-px cursor-pointer"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${active ? '#7c3aed' : 'transparent'}`,
              color: active ? '#ffffff' : '#94a3b8',
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.color = '#94a3b8';
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className="ml-2 px-2 py-0.5 text-xs font-semibold"
                style={
                  active
                    ? { background: 'rgba(124,58,237,0.25)', color: '#a78bfa', borderRadius: 9999 }
                    : { background: 'rgba(42,40,80,0.6)', color: '#94a3b8', borderRadius: 9999 }
                }
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
