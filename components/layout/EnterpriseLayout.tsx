'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useATSStore } from '@/store/ats-store';

interface EnterpriseLayoutProps {
  children: React.ReactNode;
  role: 'manager' | 'candidate';
}

export function EnterpriseLayout({ children, role }: EnterpriseLayoutProps) {
  const { isAuthenticated, currentUser } = useATSStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(role === 'manager' ? '/manager-login' : '/candidate-login');
      return;
    }
    if (currentUser && currentUser.role !== role) {
      router.replace(
        currentUser.role === 'manager' ? '/manager/dashboard' : '/candidate/dashboard'
      );
    }
  }, [isAuthenticated, currentUser, role, router]);

  if (!isAuthenticated || !currentUser || currentUser.role !== role) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: '#0f0e17' }}>
        <div className="text-center">
          <div
            className="w-10 h-10 mx-auto mb-4 animate-pulse"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', borderRadius: 10 }}
          />
          <p className="text-sm font-semibold" style={{ color: '#94a3b8' }}>
            Authenticating…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0f0e17' }}>
      <Sidebar role={role} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        <footer
          className="h-7 flex items-center px-5 gap-4 text-xs shrink-0"
          style={{
            background: '#13122a',
            borderTop: '1px solid #2a2850',
            color: '#94a3b8',
          }}
        >
          <span className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 inline-block"
              style={{ background: '#7c3aed', borderRadius: 9999 }}
            />
            HireSync ATS v3.1.4
          </span>
          <span style={{ color: '#2a2850' }}>|</span>
          <span>UT Dallas — Student Employment Portal</span>
          <span style={{ color: '#2a2850' }}>|</span>
          <span className="flex items-center gap-1">
            AI Pipeline: <span style={{ color: '#22c55e' }}>Active</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
