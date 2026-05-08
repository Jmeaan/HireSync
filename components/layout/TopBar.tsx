'use client';

import { usePathname } from 'next/navigation';
import { ChevronRight, Bell, HelpCircle } from 'lucide-react';
import { useATSStore } from '@/store/ats-store';
import { formatDateTime } from '@/lib/utils';

const ROUTE_LABELS: Record<string, string> = {
  '/manager/dashboard': 'Dashboard',
  '/manager/requisitions': 'Requisitions',
  '/manager/requisitions/new': 'New Requisition',
  '/manager/analytics': 'Analytics',
  '/manager/settings': 'Settings',
  '/candidate/dashboard': 'Overview',
  '/candidate/jobs': 'Browse Jobs',
  '/candidate/applications': 'My Applications',
  '/candidate/profile': 'Account',
};

function getBreadcrumbs(pathname: string): string[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: string[] = [];

  if (segments[0] === 'manager') crumbs.push('Manager Workspace');
  if (segments[0] === 'candidate') crumbs.push('Candidate Portal');

  const full = '/' + segments.join('/');
  const label = ROUTE_LABELS[full];

  if (label) {
    crumbs.push(label);
  } else if (segments.length > 2) {
    const parent = '/' + segments.slice(0, -1).join('/');
    const parentLabel = ROUTE_LABELS[parent];
    if (parentLabel) crumbs.push(parentLabel);
    crumbs.push(segments[segments.length - 1].toUpperCase());
  }

  return crumbs;
}

export function TopBar() {
  const pathname = usePathname();
  const { currentUser } = useATSStore();
  const crumbs = getBreadcrumbs(pathname);
  const now = formatDateTime(new Date().toISOString());

  return (
    <header
      className="h-14 flex items-center justify-between px-6 shrink-0"
      style={{ background: '#13122a', borderBottom: '1px solid #2a2850' }}
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5" style={{ color: '#2a2850' }} />}
            <span
              style={{
                color: i === crumbs.length - 1 ? '#ffffff' : '#94a3b8',
                fontWeight: i === crumbs.length - 1 ? 600 : 400,
              }}
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Right cluster */}
      <div className="flex items-center gap-3">
        <span className="text-sm hidden lg:block" style={{ color: '#94a3b8' }}>
          {now}
        </span>

        <button
          title="Notifications"
          className="relative w-8 h-8 flex items-center justify-center transition-all"
          style={{ color: '#94a3b8', background: 'rgba(42,40,80,0.5)', border: '1px solid #2a2850', cursor: 'pointer', borderRadius: 8 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = '#7c3aed';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.borderColor = '#2a2850';
          }}
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-1 right-1 w-2 h-2"
            style={{ background: '#7c3aed', borderRadius: 9999, border: '1.5px solid #13122a' }}
          />
        </button>

        <button
          title="Help"
          className="w-8 h-8 flex items-center justify-center transition-all"
          style={{ color: '#94a3b8', background: 'rgba(42,40,80,0.5)', border: '1px solid #2a2850', cursor: 'pointer', borderRadius: 8 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = '#7c3aed';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.borderColor = '#2a2850';
          }}
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {currentUser && (
          <div
            className="flex items-center gap-2.5 pl-3"
            style={{ borderLeft: '1px solid #2a2850' }}
          >
            <div
              className="w-8 h-8 flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', borderRadius: 8 }}
            >
              <span className="text-sm font-bold text-white">{currentUser.initials}</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-white leading-none">{currentUser.name}</p>
              <p className="text-xs leading-none mt-0.5" style={{ color: '#94a3b8' }}>
                {currentUser.title ?? currentUser.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
