'use client';

import { User, Mail, Shield } from 'lucide-react';
import { useATSStore } from '@/store/ats-store';

export default function CandidateProfilePage() {
  const { currentUser, getApplicantsForCurrentUser } = useATSStore();
  const myApps = getApplicantsForCurrentUser();

  if (!currentUser) return null;

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: 28 }}>My Account</h1>
        <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Your HireSync candidate profile</p>
      </div>

      {/* Profile card */}
      <div style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 16, overflow: 'hidden' }}>
        {/* Header strip */}
        <div className="px-6 py-8 flex items-center gap-5" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.1))', borderBottom: '1px solid #2a2850' }}>
          <div
            className="w-16 h-16 flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', borderRadius: 12 }}
          >
            <span className="text-2xl font-bold text-white">{currentUser.initials}</span>
          </div>
          <div>
            <p className="text-xl font-bold text-white">{currentUser.name}</p>
            <p className="text-base mt-0.5" style={{ color: '#94a3b8' }}>{currentUser.email}</p>
            <span
              className="mt-2 inline-block px-3 py-1 text-sm font-semibold"
              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', borderRadius: 9999 }}
            >
              Candidate
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 text-center" style={{ background: 'rgba(42,40,80,0.5)', border: '1px solid #2a2850', borderRadius: 10 }}>
              <p className="font-bold text-white" style={{ fontSize: 40, lineHeight: 1 }}>{myApps.length}</p>
              <p className="text-sm mt-2" style={{ color: '#94a3b8' }}>Applications</p>
            </div>
            <div className="p-4 text-center" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10 }}>
              <p className="font-bold" style={{ fontSize: 40, color: '#a78bfa', lineHeight: 1 }}>
                {myApps.filter((a) => !['REJECTED', 'WITHDRAWN', 'HIRED'].includes(a.status)).length}
              </p>
              <p className="text-sm mt-2" style={{ color: '#94a3b8' }}>Active</p>
            </div>
          </div>

          <div className="space-y-0">
            <div className="flex items-center gap-4 py-4" style={{ borderBottom: '1px solid #2a2850' }}>
              <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{ background: 'rgba(42,40,80,0.7)', borderRadius: 8 }}>
                <User className="w-4 h-4" style={{ color: '#7c3aed' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#94a3b8' }}>Full Name</p>
                <p className="text-base font-semibold text-white">{currentUser.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-4" style={{ borderBottom: '1px solid #2a2850' }}>
              <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{ background: 'rgba(42,40,80,0.7)', borderRadius: 8 }}>
                <Mail className="w-4 h-4" style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#94a3b8' }}>Email Address</p>
                <p className="text-base font-semibold text-white">{currentUser.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-4">
              <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{ background: 'rgba(42,40,80,0.7)', borderRadius: 8 }}>
                <Shield className="w-4 h-4" style={{ color: '#06b6d4' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#94a3b8' }}>Account Type</p>
                <p className="text-base font-semibold text-white capitalize">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-center" style={{ color: '#94a3b8' }}>
        To update your name or email, contact the Student Employment Office.
      </p>
    </div>
  );
}
