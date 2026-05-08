'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  Briefcase,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useATSStore } from '@/store/ats-store';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

const MANAGER_NAV: NavSection[] = [
  {
    heading: 'Workspace',
    items: [
      {
        href: '/manager/dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        href: '/manager/requisitions',
        label: 'Requisitions',
        icon: <FileText className="w-4 h-4" />,
      },
    ],
  },
  {
    heading: 'Reporting',
    items: [
      {
        href: '/manager/analytics',
        label: 'Analytics',
        icon: <BarChart3 className="w-4 h-4" />,
      },
    ],
  },
  {
    heading: 'System',
    items: [
      {
        href: '/manager/settings',
        label: 'Settings',
        icon: <Settings className="w-4 h-4" />,
      },
    ],
  },
];

const CANDIDATE_NAV: NavSection[] = [
  {
    heading: 'My Applications',
    items: [
      {
        href: '/candidate/dashboard',
        label: 'Overview',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        href: '/candidate/jobs',
        label: 'Browse Jobs',
        icon: <Briefcase className="w-4 h-4" />,
      },
      {
        href: '/candidate/applications',
        label: 'My Applications',
        icon: <ClipboardList className="w-4 h-4" />,
      },
    ],
  },
  {
    heading: 'Profile',
    items: [
      {
        href: '/candidate/profile',
        label: 'Account',
        icon: <Users className="w-4 h-4" />,
      },
    ],
  },
];

export function Sidebar({ role }: { role: 'manager' | 'candidate' }) {
  const pathname = usePathname();
  const { currentUser, sidebarCollapsed, toggleSidebar, logout } = useATSStore();
  const nav = role === 'manager' ? MANAGER_NAV : CANDIDATE_NAV;

  return (
    <aside
      className={cn(
        'h-screen flex flex-col shrink-0 transition-all duration-200',
        sidebarCollapsed ? 'w-14' : 'w-60'
      )}
      style={{ background: '#13122a', borderRight: '1px solid #2a2850' }}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center h-14 shrink-0',
          sidebarCollapsed ? 'justify-center px-0' : 'px-4 gap-3'
        )}
        style={{ borderBottom: '1px solid #2a2850' }}
      >
        <div
          className="shrink-0 flex items-center justify-center"
          style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', borderRadius: 8 }}
        >
          <span style={{ fontSize: 11, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>HS</span>
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold tracking-wide text-white whitespace-nowrap">
              HireSync
            </p>
            <p className="text-xs whitespace-nowrap" style={{ color: '#94a3b8' }}>
              ATS v3.1.4
            </p>
          </div>
        )}
      </div>

      {/* AI Pipeline indicator */}
      {!sidebarCollapsed && (
        <div
          className="px-4 py-2.5 flex items-center gap-2"
          style={{ borderBottom: '1px solid #2a2850' }}
        >
          <Bot className="w-3.5 h-3.5 shrink-0" style={{ color: '#7c3aed' }} />
          <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>
            AI Pipeline:{' '}
            <span style={{ color: '#22c55e', fontWeight: 600 }}>Active</span>
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3">
        {nav.map((section) => (
          <div key={section.heading} className="mb-2">
            {!sidebarCollapsed && (
              <p
                className="px-4 pt-2 pb-1.5 text-xs font-bold uppercase tracking-widest"
                style={{ color: 'rgba(148,163,184,0.4)' }}
              >
                {section.heading}
              </p>
            )}
            {section.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 transition-all duration-100 mx-2',
                    sidebarCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 h-10',
                  )}
                  style={{
                    color: active ? '#ffffff' : '#94a3b8',
                    background: active ? 'rgba(124,58,237,0.18)' : 'transparent',
                    borderRadius: 8,
                    fontWeight: active ? 600 : 400,
                    border: active ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(42,40,80,0.7)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = '#94a3b8';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="text-sm truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer: user + collapse toggle */}
      <div className="shrink-0" style={{ borderTop: '1px solid #2a2850' }}>
        {!sidebarCollapsed && currentUser && (
          <div className="px-4 py-3 flex items-center gap-2.5">
            <div
              className="w-8 h-8 flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', borderRadius: 8 }}
            >
              <span className="text-sm font-bold text-white">{currentUser.initials}</span>
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-xs truncate" style={{ color: '#94a3b8' }}>
                {currentUser.role}
              </p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="w-7 h-7 flex items-center justify-center transition-all shrink-0"
              style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#f87171';
                e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.background = 'none';
              }}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center h-9 transition-all"
          style={{
            borderTop: '1px solid #2a2850',
            color: '#94a3b8',
            background: 'none',
            cursor: 'pointer',
            border: 'none',
            borderTop: '1px solid #2a2850',
          }}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
