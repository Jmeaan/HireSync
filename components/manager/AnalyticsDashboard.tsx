'use client';

import { BarChart3, Users, Briefcase, TrendingUp, Clock, Bot, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useATSStore } from '@/store/ats-store';
import { JobStatusBadge } from '@/components/ui/Badge';
import { formatSalaryRange } from '@/lib/utils';

function MetricCard({
  label,
  value,
  sub,
  icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className="p-5"
      style={{
        background: accent ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.15))' : '#1a1933',
        border: `1px solid ${accent ? 'rgba(124,58,237,0.4)' : '#2a2850'}`,
        borderRadius: 12,
        boxShadow: accent ? '0 0 24px rgba(124,58,237,0.15)' : 'none',
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold" style={{ color: '#94a3b8' }}>{label}</p>
          <p className="font-bold mt-2" style={{ fontSize: 40, color: accent ? '#a78bfa' : '#ffffff', lineHeight: 1 }}>
            {value}
          </p>
          {sub && <p className="text-sm mt-1.5" style={{ color: '#94a3b8' }}>{sub}</p>}
        </div>
        <div
          className="w-10 h-10 flex items-center justify-center shrink-0"
          style={{ background: accent ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)', borderRadius: 10, color: accent ? '#a78bfa' : '#7c3aed' }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function HBarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-sm w-40 shrink-0 truncate" style={{ color: '#94a3b8' }}>{label}</span>
      <div className="flex-1 h-2.5 overflow-hidden" style={{ background: 'rgba(42,40,80,0.8)', borderRadius: 9999 }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7c3aed, #3b82f6)', borderRadius: 9999 }}
        />
      </div>
      <span className="text-sm font-bold w-6 text-right shrink-0 text-white">{value}</span>
    </div>
  );
}

export function AnalyticsDashboard() {
  const { requisitions, applicants, dashboardMetrics } = useATSStore();

  const openReqs = requisitions.filter((r) => r.status === 'OPEN');
  const totalHeadcount = openReqs.reduce((s, r) => s + r.headcount, 0);
  const totalApps = applicants.length;
  const activeApps = applicants.filter(
    (a) => !['REJECTED', 'WITHDRAWN', 'HIRED'].includes(a.status)
  ).length;
  const hiredCount = applicants.filter((a) => a.status === 'HIRED').length;

  const statusCounts: Record<string, number> = {};
  applicants.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] ?? 0) + 1;
  });

  const deptApps: Record<string, number> = {};
  applicants.forEach((a) => {
    const job = requisitions.find((r) => r.id === a.jobId);
    if (job) deptApps[job.department] = (deptApps[job.department] ?? 0) + 1;
  });
  const deptEntries = Object.entries(deptApps).sort((a, b) => b[1] - a[1]);
  const maxDept = Math.max(...deptEntries.map(([, c]) => c), 1);

  const reqStatusCounts: Record<string, number> = {};
  requisitions.forEach((r) => {
    reqStatusCounts[r.status] = (reqStatusCounts[r.status] ?? 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: 28 }}>
          Hiring Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
          Live data from the HireSync pipeline — updates as applications come in
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Open Positions"
          value={openReqs.length}
          sub={`${totalHeadcount} seats available`}
          icon={<Briefcase className="w-5 h-5" />}
          accent
        />
        <MetricCard
          label="Total Applications"
          value={totalApps}
          sub={`${activeApps} in active pipeline`}
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          label="Hired"
          value={hiredCount}
          sub="this cycle"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          label="Avg. Time to Fill"
          value={dashboardMetrics.avgTimeToFillDays > 0 ? `${dashboardMetrics.avgTimeToFillDays}d` : '—'}
          sub="calendar days"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-3 gap-4">

        {/* Application pipeline funnel */}
        <div className="p-5" style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }}>
          <h2 className="font-bold text-white mb-4 pb-3 flex items-center gap-2" style={{ fontSize: 16, borderBottom: '1px solid #2a2850' }}>
            <BarChart3 className="w-4 h-4" style={{ color: '#7c3aed' }} />
            Application Pipeline
          </h2>
          {totalApps === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: '#94a3b8' }}>No applications yet</p>
              <p className="text-sm mt-2" style={{ color: '#94a3b8' }}>
                Pipeline data will appear here once candidates start applying.
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {[
                ['Received', statusCounts['RECEIVED'] ?? 0],
                ['Screening', statusCounts['SYSTEM_SCREENING'] ?? 0],
                ['Under Review', statusCounts['UNDER_REVIEW'] ?? 0],
                ['Interview', (statusCounts['INTERVIEW_SCHEDULED'] ?? 0) + (statusCounts['INTERVIEW_COMPLETED'] ?? 0)],
                ['Decision', statusCounts['DECISION_PENDING'] ?? 0],
                ['Offer', statusCounts['OFFER_EXTENDED'] ?? 0],
                ['Hired', statusCounts['HIRED'] ?? 0],
              ].map(([label, val]) => (
                <HBarRow key={label as string} label={label as string} value={val as number} max={totalApps} />
              ))}
            </div>
          )}
        </div>

        {/* Apps by department */}
        <div className="p-5" style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }}>
          <h2 className="font-bold text-white mb-4 pb-3 flex items-center gap-2" style={{ fontSize: 16, borderBottom: '1px solid #2a2850' }}>
            <Users className="w-4 h-4" style={{ color: '#3b82f6' }} />
            Applications by Department
          </h2>
          {deptEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: '#94a3b8' }}>No data yet</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {deptEntries.map(([dept, count]) => (
                <HBarRow key={dept} label={dept} value={count} max={maxDept} />
              ))}
            </div>
          )}
        </div>

        {/* Requisition status */}
        <div className="p-5" style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }}>
          <h2 className="font-bold text-white mb-4 pb-3 flex items-center gap-2" style={{ fontSize: 16, borderBottom: '1px solid #2a2850' }}>
            <Briefcase className="w-4 h-4" style={{ color: '#06b6d4' }} />
            Requisitions by Status
          </h2>
          <div className="space-y-3">
            {Object.entries(reqStatusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <JobStatusBadge status={status as any} />
                <span className="text-base font-bold text-white">{count}</span>
              </div>
            ))}
            {requisitions.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: '#94a3b8' }}>No requisitions</p>
            )}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #2a2850' }}>
            <p className="text-sm" style={{ color: '#94a3b8' }}>
              Total headcount authorized:{' '}
              <span className="font-bold text-white">{requisitions.reduce((s, r) => s + r.headcount, 0)}</span>
            </p>
            <p className="text-sm mt-1.5" style={{ color: '#94a3b8' }}>
              AI screening enabled on:{' '}
              <span className="font-bold" style={{ color: '#22c55e' }}>
                {requisitions.filter((r) => r.aiScreeningEnabled).length} reqs
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Open positions summary table */}
      <div style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12, overflow: 'hidden' }}>
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid #2a2850' }}
        >
          <h2 className="font-bold text-white" style={{ fontSize: 16 }}>
            Open Position Summary
          </h2>
          <Link
            href="/manager/requisitions"
            className="text-sm flex items-center gap-1.5 transition-colors"
            style={{ color: '#94a3b8' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            All Requisitions <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <table className="hs-table w-full">
          <thead>
            <tr>
              <th>Code</th>
              <th>Position</th>
              <th>Department</th>
              <th>Pay</th>
              <th className="text-center">Seats</th>
              <th className="text-center">Applications</th>
              <th>AI Screen</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {openReqs.map((req) => (
              <tr key={req.id}>
                <td className="font-mono" style={{ color: '#94a3b8' }}>{req.code}</td>
                <td>
                  <Link
                    href={`/manager/requisitions/${req.id}`}
                    className="font-semibold text-white transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
                  >
                    {req.title}
                  </Link>
                </td>
                <td style={{ color: '#94a3b8' }}>{req.department}</td>
                <td className="font-mono" style={{ color: '#94a3b8' }}>
                  {formatSalaryRange(req.salary.min, req.salary.max, req.salary.currency)}
                </td>
                <td className="text-center font-mono font-bold text-white">{req.headcount}</td>
                <td className="text-center font-mono" style={{ color: '#94a3b8' }}>
                  {applicants.filter((a) => a.jobId === req.id).length}
                </td>
                <td>
                  {req.aiScreeningEnabled ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#22c55e' }}>
                      <Bot className="w-3.5 h-3.5" /> On
                    </span>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>—</span>
                  )}
                </td>
                <td><JobStatusBadge status={req.status} /></td>
              </tr>
            ))}
            {openReqs.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8" style={{ color: '#94a3b8' }}>
                  No open requisitions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
