'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  ArrowRight,
  Activity,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Bot,
  CalendarCheck,
  UserCheck,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { useATSStore } from '@/store/ats-store';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { JobStatusBadge } from '@/components/ui/Badge';
import { formatDate, timeAgo, formatSalaryRange, employmentTypeLabel, seniorityLabel } from '@/lib/utils';
import type { ActivityItem } from '@/lib/types';

// ── Pipeline bar ─────────────────────────────────────────────────────────────
function PipelineRow({ label, count, total, accent = false }: { label: string; count: number; total: number; accent?: boolean }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-sm w-32 shrink-0" style={{ color: '#94a3b8' }}>{label}</span>
      <div className="flex-1 h-2" style={{ background: 'rgba(42,40,80,0.8)', borderRadius: 9999 }}>
        <div
          className="h-full"
          style={{ width: `${pct}%`, background: accent ? 'linear-gradient(90deg, #7c3aed, #3b82f6)' : 'rgba(148,163,184,0.4)', borderRadius: 9999 }}
        />
      </div>
      <span className="text-sm font-bold w-8 text-right shrink-0 text-white">{count}</span>
    </div>
  );
}

// ── Activity icon ─────────────────────────────────────────────────────────────
function ActivityIcon({ type }: { type: ActivityItem['type'] }) {
  const map: Record<ActivityItem['type'], React.ReactNode> = {
    APPLICATION_RECEIVED: <Users className="w-3.5 h-3.5" />,
    STATUS_CHANGED: <Activity className="w-3.5 h-3.5" />,
    INTERVIEW_SCHEDULED: <CalendarCheck className="w-3.5 h-3.5" />,
    OFFER_EXTENDED: <FileText className="w-3.5 h-3.5" />,
    HIRED: <UserCheck className="w-3.5 h-3.5" />,
    REJECTED: <AlertCircle className="w-3.5 h-3.5" />,
    JOB_POSTED: <Briefcase className="w-3.5 h-3.5" />,
    AI_SCREENING_COMPLETE: <Bot className="w-3.5 h-3.5" />,
  };
  return (
    <span
      className="w-7 h-7 flex items-center justify-center shrink-0"
      style={{ background: 'rgba(124,58,237,0.12)', borderRadius: 8, color: '#a78bfa' }}
    >
      {map[type]}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function HiringManagerDashboard() {
  const { requisitions, dashboardMetrics, currentUser } = useATSStore();
  const [reqLimit, setReqLimit] = useState(6);

  const openReqs = requisitions.filter((r) => r.status === 'OPEN');
  const displayedReqs = requisitions
    .filter((r) => r.status !== 'FILLED' && r.status !== 'CLOSED')
    .slice(0, reqLimit);

  const {
    totalOpenRequisitions,
    totalHeadcountNeeded,
    totalActiveApplications,
    totalHiredThisMonth,
    totalHiredThisQuarter,
    avgTimeToFillDays,
    offerAcceptanceRate,
    pipelineMetrics,
    recentActivity,
    timeToHireByDept,
    applicationsByDepartment,
  } = dashboardMetrics;

  const pipelineTotal =
    pipelineMetrics.received +
    pipelineMetrics.screening +
    pipelineMetrics.review +
    pipelineMetrics.interview +
    pipelineMetrics.decision;

  return (
    <div className="space-y-6 min-w-0">
      {/* ── Page header ───────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-white" style={{ fontSize: 28 }}>
            Hiring Operations
          </h1>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
            {currentUser?.name} · {currentUser?.title} · {formatDate(new Date().toISOString())}
          </p>
        </div>
        <Link href="/manager/requisitions/new">
          <Button icon={<Plus className="w-4 h-4" />}>New Requisition</Button>
        </Link>
      </div>

      {/* ── KPI row ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="Open Reqs"
          value={totalOpenRequisitions}
          sub={`${totalHeadcountNeeded} headcount`}
          icon={<Briefcase className="w-4 h-4" />}
          emphasis
        />
        <StatCard
          label="Active Apps"
          value={totalActiveApplications}
          sub="across all reqs"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          label="Hired / Month"
          value={totalHiredThisMonth}
          delta={{ value: `${totalHiredThisQuarter} QTD`, positive: true }}
          icon={<UserCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Avg. Time to Fill"
          value={`${avgTimeToFillDays}d`}
          sub="calendar days"
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          label="Offer Acceptance"
          value={`${offerAcceptanceRate}%`}
          sub="trailing 90 days"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          label="AI Screened"
          value={pipelineMetrics.screening + pipelineMetrics.review + pipelineMetrics.interview + pipelineMetrics.decision + pipelineMetrics.hired + pipelineMetrics.rejected}
          sub="total processed"
          icon={<Bot className="w-4 h-4" />}
        />
      </div>

      {/* ── Active Requisitions table ─────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-white" style={{ fontSize: 18 }}>
            Active Requisitions
            <span className="ml-2 text-sm font-normal" style={{ color: '#94a3b8' }}>
              ({openReqs.length} open)
            </span>
          </h2>
          <Link
            href="/manager/requisitions"
            className="text-sm flex items-center gap-1.5 transition-colors"
            style={{ color: '#94a3b8' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            All Requisitions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div style={{ border: '1px solid #2a2850', borderRadius: 12, overflow: 'hidden' }}>
          <table className="hs-table w-full">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Department</th>
                <th>Type</th>
                <th>Level</th>
                <th>Salary Range</th>
                <th className="text-center">HC</th>
                <th className="text-center">Apps</th>
                <th className="text-center">Active</th>
                <th>Status</th>
                <th>AI Screen</th>
                <th>Published</th>
                <th>HM</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {displayedReqs.map((req) => (
                <tr key={req.id}>
                  <td>
                    <span className="font-mono text-sm" style={{ color: '#94a3b8' }}>{req.code}</span>
                  </td>
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
                  <td style={{ color: '#94a3b8' }}>{employmentTypeLabel(req.employmentType)}</td>
                  <td style={{ color: '#94a3b8' }}>{seniorityLabel(req.seniorityLevel)}</td>
                  <td className="font-mono" style={{ color: '#94a3b8' }}>
                    {formatSalaryRange(req.salary.min, req.salary.max, req.salary.currency)}
                  </td>
                  <td className="text-center font-mono text-white">{req.headcount}</td>
                  <td className="text-center font-mono text-white">{req.applicationCount}</td>
                  <td className="text-center font-mono text-white">{req.activeApplicationCount}</td>
                  <td><JobStatusBadge status={req.status} /></td>
                  <td>
                    {req.aiScreeningEnabled ? (
                      <span className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: '#22c55e' }}>
                        <Bot className="w-3.5 h-3.5" /> On
                      </span>
                    ) : (
                      <span className="text-sm" style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </td>
                  <td className="font-mono" style={{ color: '#94a3b8' }}>
                    {req.publishedAt ? formatDate(req.publishedAt) : '—'}
                  </td>
                  <td style={{ color: '#94a3b8' }}>{req.hiringManagerName}</td>
                  <td>
                    <Link
                      href={`/manager/requisitions/${req.id}`}
                      className="transition-colors"
                      style={{ color: '#94a3b8' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                      title="View pipeline"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {displayedReqs.length === 0 && (
                <tr>
                  <td colSpan={14} className="text-center py-8" style={{ color: '#94a3b8' }}>
                    No active requisitions
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {requisitions.filter((r) => r.status !== 'FILLED' && r.status !== 'CLOSED').length > reqLimit && (
            <div className="px-4 py-3" style={{ borderTop: '1px solid #2a2850' }}>
              <button
                onClick={() => setReqLimit((n) => n + 6)}
                className="text-sm font-medium transition-colors"
                style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                Load more…
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom row: Pipeline + Activity + Dept ────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Pipeline overview */}
        <section className="p-5" style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }}>
          <h2 className="font-bold text-white mb-4 pb-3" style={{ fontSize: 16, borderBottom: '1px solid #2a2850' }}>
            Pipeline Overview
          </h2>
          <PipelineRow label="Received" count={pipelineMetrics.received} total={pipelineTotal} />
          <PipelineRow label="Screening" count={pipelineMetrics.screening} total={pipelineTotal} />
          <PipelineRow label="Under Review" count={pipelineMetrics.review} total={pipelineTotal} accent />
          <PipelineRow label="Interview" count={pipelineMetrics.interview} total={pipelineTotal} accent />
          <PipelineRow label="Decision" count={pipelineMetrics.decision} total={pipelineTotal} accent />
          <div className="mt-4 pt-3 flex gap-6" style={{ borderTop: '1px solid #2a2850' }}>
            <span className="text-sm">
              <span style={{ color: '#94a3b8' }}>Hired:</span>{' '}
              <span className="font-bold" style={{ color: '#22c55e' }}>{pipelineMetrics.hired}</span>
            </span>
            <span className="text-sm">
              <span style={{ color: '#94a3b8' }}>Rejected:</span>{' '}
              <span className="font-bold text-white">{pipelineMetrics.rejected}</span>
            </span>
          </div>
        </section>

        {/* Recent activity */}
        <section className="p-5" style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }}>
          <h2 className="font-bold text-white mb-4 pb-3" style={{ fontSize: 16, borderBottom: '1px solid #2a2850' }}>
            Recent Activity
          </h2>
          <div className="space-y-0">
            {recentActivity.length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: '#94a3b8' }}>No activity yet</p>
            ) : (
              recentActivity.slice(0, 8).map((item, i) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 py-2.5"
                  style={i < recentActivity.slice(0, 8).length - 1 ? { borderBottom: '1px solid #2a2850' } : {}}
                >
                  <div className="mt-0.5 shrink-0">
                    <ActivityIcon type={item.type} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug text-white">{item.description}</p>
                    {item.meta && (
                      <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>{item.meta}</p>
                    )}
                  </div>
                  <span className="text-sm whitespace-nowrap shrink-0 mt-0.5" style={{ color: '#94a3b8' }}>
                    {timeAgo(item.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Dept breakdown + Time-to-hire */}
        <div className="space-y-4">
          <section className="p-5" style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }}>
            <h2 className="font-bold text-white mb-4 pb-3" style={{ fontSize: 16, borderBottom: '1px solid #2a2850' }}>
              Apps by Department
            </h2>
            <div className="space-y-2">
              {applicationsByDepartment.length === 0 ? (
                <p className="text-sm py-4 text-center" style={{ color: '#94a3b8' }}>No data yet</p>
              ) : (
                applicationsByDepartment.map((d) => {
                  const max = Math.max(...applicationsByDepartment.map((x) => x.count));
                  const pct = max > 0 ? Math.round((d.count / max) * 100) : 0;
                  return (
                    <div key={d.department} className="flex items-center gap-2">
                      <span className="text-sm w-28 shrink-0 truncate" style={{ color: '#94a3b8' }}>
                        {d.department}
                      </span>
                      <div className="flex-1 h-2" style={{ background: 'rgba(42,40,80,0.8)', borderRadius: 9999 }}>
                        <div className="h-full" style={{ width: `${pct}%`, background: 'rgba(59,130,246,0.5)', borderRadius: 9999 }} />
                      </div>
                      <span className="text-sm font-bold w-5 text-right shrink-0 text-white">{d.count}</span>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="p-5" style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }}>
            <h2 className="font-bold text-white mb-4 pb-3" style={{ fontSize: 16, borderBottom: '1px solid #2a2850' }}>
              Avg. Time to Hire (Days)
            </h2>
            {timeToHireByDept.length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: '#94a3b8' }}>No data yet</p>
            ) : (
              <table className="w-full">
                <tbody>
                  {timeToHireByDept.map((d) => (
                    <tr key={d.department}>
                      <td className="text-sm py-1.5 pr-4" style={{ color: '#94a3b8' }}>{d.department}</td>
                      <td className="text-right">
                        <span className="text-sm font-bold text-white">{d.avgDays}d</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
