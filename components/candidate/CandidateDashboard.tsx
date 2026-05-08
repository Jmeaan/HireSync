'use client';

import Link from 'next/link';
import { ArrowRight, Briefcase } from 'lucide-react';
import { useATSStore } from '@/store/ats-store';
import { ApplicationStatusBadge } from '@/components/ui/Badge';
import { StatusTimeline } from './StatusTimeline';
import { formatDate } from '@/lib/utils';

export function CandidateDashboard() {
  const { currentUser, getApplicantsForCurrentUser, requisitions } = useATSStore();
  const myApps = getApplicantsForCurrentUser();
  const activeApp = myApps.find((a) => !['REJECTED', 'WITHDRAWN', 'HIRED'].includes(a.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: 28 }}>My Application Overview</h1>
        <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
          Signed in as {currentUser?.email}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: myApps.length, color: '#7c3aed' },
          { label: 'Active', value: myApps.filter((a) => !['REJECTED', 'WITHDRAWN', 'HIRED'].includes(a.status)).length, color: '#3b82f6' },
          { label: 'Interviews', value: myApps.filter((a) => ['INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED'].includes(a.status)).length, color: '#06b6d4' },
          { label: 'Offers', value: myApps.filter((a) => ['OFFER_EXTENDED', 'HIRED'].includes(a.status)).length, color: '#22c55e' },
        ].map((s) => (
          <div key={s.label} className="p-5" style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }}>
            <p className="text-sm font-semibold" style={{ color: '#94a3b8' }}>{s.label}</p>
            <p className="font-bold mt-2" style={{ fontSize: 40, color: s.color, lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Active application status timeline */}
      {activeApp && (() => {
        const job = requisitions.find((r) => r.id === activeApp.jobId);
        return (
          <div>
            <h2 className="font-bold text-white mb-3" style={{ fontSize: 18 }}>Active Application</h2>
            <div
              className="p-4 mb-3"
              style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-base">{job?.title ?? activeApp.jobId}</p>
                  <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
                    {job?.department} · {job?.code} · Applied {formatDate(activeApp.appliedAt)}
                  </p>
                </div>
                <ApplicationStatusBadge status={activeApp.status} />
              </div>
            </div>
            <StatusTimeline status={activeApp.status} updatedAt={activeApp.updatedAt} />
          </div>
        );
      })()}

      {/* All applications table */}
      {myApps.length > 0 && (
        <section>
          <h2 className="font-bold text-white mb-3" style={{ fontSize: 18 }}>All Applications</h2>
          <div style={{ border: '1px solid #2a2850', borderRadius: 12, overflow: 'hidden' }}>
            <table className="hs-table w-full">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody>
                {myApps.map((app) => {
                  const job = requisitions.find((r) => r.id === app.jobId);
                  return (
                    <tr key={app.id}>
                      <td className="font-semibold text-white">{job?.title ?? 'Unknown Position'}</td>
                      <td style={{ color: '#94a3b8' }}>{job?.department ?? '—'}</td>
                      <td className="font-mono" style={{ color: '#94a3b8' }}>{formatDate(app.appliedAt)}</td>
                      <td><ApplicationStatusBadge status={app.status} /></td>
                      <td className="font-mono" style={{ color: '#94a3b8' }}>{formatDate(app.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {myApps.length === 0 && (
        <div
          className="p-12 text-center"
          style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }}
        >
          <div
            className="w-14 h-14 flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(124,58,237,0.12)', borderRadius: 12 }}
          >
            <Briefcase className="w-7 h-7" style={{ color: '#7c3aed' }} />
          </div>
          <p className="text-lg font-semibold text-white mb-2">No applications yet</p>
          <p className="text-base mb-6" style={{ color: '#94a3b8' }}>
            Browse open positions and submit your first application.
          </p>
          <Link
            href="/candidate/jobs"
            className="inline-flex items-center gap-2 text-base font-semibold px-5 py-2.5 transition-all"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: '#ffffff', borderRadius: 8 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Browse Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
