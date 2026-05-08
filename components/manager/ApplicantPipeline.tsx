'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Bot, Filter, Pencil, Zap } from 'lucide-react';
import { useATSStore } from '@/store/ats-store';
import { ApplicationStatusBadge, AiRecommendationBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import type { ApplicationStatus } from '@/lib/types';

const STATUS_OPTS: { value: ApplicationStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'RECEIVED', label: 'Received' },
  { value: 'SYSTEM_SCREENING', label: 'System Screening' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled' },
  { value: 'INTERVIEW_COMPLETED', label: 'Interview Completed' },
  { value: 'DECISION_PENDING', label: 'Decision Pending' },
  { value: 'OFFER_EXTENDED', label: 'Offer Extended' },
  { value: 'HIRED', label: 'Hired' },
  { value: 'REJECTED', label: 'Rejected' },
];

const AI_OPTS = [
  { value: '', label: 'All AI Recs' },
  { value: 'STRONG_HIRE', label: 'Strong Hire' },
  { value: 'HIRE', label: 'Hire' },
  { value: 'NEUTRAL', label: 'Neutral' },
  { value: 'NO_HIRE', label: 'No Hire' },
  { value: 'STRONG_NO_HIRE', label: 'Strong No Hire' },
];

export function ApplicantPipeline({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { getRequisitionById, getApplicantsByJobId, updateApplicantStatus, runBatchAiScreening } = useATSStore();
  const req = getRequisitionById(jobId);
  const applicants = getApplicantsByJobId(jobId);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [aiFilter, setAiFilter] = useState('');
  const [screeningResult, setScreeningResult] = useState<number | null>(null);

  const unscreenedCount = req?.aiScreeningEnabled
    ? applicants.filter((a) => !a.aiAnalysis && a.status === 'RECEIVED').length
    : 0;

  const handleRunScreening = () => {
    const count = runBatchAiScreening();
    setScreeningResult(count);
    setTimeout(() => setScreeningResult(null), 4000);
  };

  if (!req) return (
    <p className="text-sm p-4" style={{ color: '#94a3b8' }}>Requisition not found.</p>
  );

  const filtered = applicants.filter((a) => {
    const q = search.toLowerCase();
    const name = `${a.firstName} ${a.lastName}`.toLowerCase();
    if (q && !name.includes(q) && !a.email.toLowerCase().includes(q)) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    if (aiFilter && a.aiAnalysis?.recommendation !== aiFilter) return false;
    return true;
  });

  const stageCounts: Partial<Record<ApplicationStatus, number>> = {};
  applicants.forEach((a) => {
    stageCounts[a.status] = (stageCounts[a.status] ?? 0) + 1;
  });

  return (
    <div className="space-y-5">
      {/* Req header */}
      <div style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }} className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm mb-1" style={{ color: '#94a3b8' }}>{req.code}</p>
            <h1 className="font-bold text-white" style={{ fontSize: 24 }}>
              {req.title}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
              {req.department} · {req.location}
              {req.remote && ' (Remote)'} · {req.applicationCount} total applicants
            </p>
          </div>
          <div className="flex items-center gap-2">
            {req.aiScreeningEnabled && (
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: 9999 }}
              >
                <Bot className="w-3.5 h-3.5" /> AI Screening Active
              </span>
            )}
            <Link
              href={`/manager/requisitions/${req.id}/edit`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all"
              style={{ border: '1px solid #2a2850', color: '#94a3b8', borderRadius: 8 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7c3aed';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2a2850';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Link>
          </div>
        </div>

        {/* Stage counter strip */}
        <div
          className="mt-4 flex gap-0 overflow-x-auto"
          style={{ border: '1px solid #2a2850', borderRadius: 10, overflow: 'hidden' }}
        >
          {(
            [
              'RECEIVED',
              'SYSTEM_SCREENING',
              'UNDER_REVIEW',
              'INTERVIEW_SCHEDULED',
              'INTERVIEW_COMPLETED',
              'DECISION_PENDING',
              'OFFER_EXTENDED',
              'HIRED',
              'REJECTED',
            ] as ApplicationStatus[]
          ).map((stage, i) => {
            const active = statusFilter === stage;
            return (
              <button
                key={stage}
                onClick={() => setStatusFilter((f) => (f === stage ? '' : stage))}
                className="flex-1 min-w-max text-center py-3 px-3 transition-all"
                style={{
                  background: active ? 'rgba(124,58,237,0.2)' : 'transparent',
                  borderRight: i < 8 ? '1px solid #2a2850' : 'none',
                  cursor: 'pointer',
                  border: 'none',
                  borderRight: i < 8 ? '1px solid #2a2850' : 'none',
                }}
              >
                <p
                  className="text-xl font-bold leading-none"
                  style={{ color: active ? '#a78bfa' : '#ffffff' }}
                >
                  {stageCounts[stage] ?? 0}
                </p>
                <p
                  className="text-xs uppercase tracking-wide mt-1"
                  style={{ color: active ? '#a78bfa' : '#94a3b8', fontSize: 10 }}
                >
                  {stage.replace(/_/g, ' ')}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI batch screening banner */}
      {req.aiScreeningEnabled && (unscreenedCount > 0 || screeningResult !== null) && (
        <div
          className="flex items-center justify-between gap-4 px-5 py-4"
          style={
            screeningResult !== null
              ? { background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12 }
              : { background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }
          }
        >
          {screeningResult !== null ? (
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 shrink-0" style={{ color: '#22c55e' }} />
              <span className="text-sm font-semibold" style={{ color: '#22c55e' }}>
                {screeningResult === 0
                  ? 'All applicants are already screened.'
                  : `AI screened ${screeningResult} applicant${screeningResult > 1 ? 's' : ''}. Candidates scoring ≥70 auto-scheduled for phone screen.`}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 shrink-0" style={{ color: '#7c3aed' }} />
              <div>
                <span className="text-sm font-semibold text-white">
                  {unscreenedCount} applicant{unscreenedCount > 1 ? 's' : ''} pending AI screening
                </span>
                <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
                  Candidates scoring ≥70 will be auto-scheduled for a phone screen and flagged for your review.
                </p>
              </div>
            </div>
          )}
          {screeningResult === null && (
            <button
              onClick={handleRunScreening}
              className="shrink-0 flex items-center gap-2 text-sm font-semibold px-4 py-2 transition-all"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: 8 }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Zap className="w-4 h-4" /> Run AI Screening
            </button>
          )}
        </div>
      )}

      {/* Filters */}
      <div
        className="flex items-center gap-3 p-4"
        style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }}
      >
        <Filter className="w-4 h-4 shrink-0" style={{ color: '#94a3b8' }} />
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-3 text-base text-white placeholder:text-white/25 focus:outline-none transition-all"
            style={{ background: '#13122a', border: '1px solid #2a2850', borderRadius: 8 }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2850'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>
        <div className="w-48">
          <Select
            options={STATUS_OPTS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | '')}
          />
        </div>
        {req.aiScreeningEnabled && (
          <div className="w-44">
            <Select
              options={AI_OPTS}
              value={aiFilter}
              onChange={(e) => setAiFilter(e.target.value)}
            />
          </div>
        )}
        {(search || statusFilter || aiFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); setAiFilter(''); }}
            className="text-sm font-medium transition-colors"
            style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-sm" style={{ color: '#94a3b8' }}>
          {filtered.length} / {applicants.length} shown
        </span>
      </div>

      {/* Applicant table */}
      <div style={{ border: '1px solid #2a2850', borderRadius: 12, overflowX: 'auto' }}>
        <table className="hs-table w-full">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Current Role</th>
              <th>Exp.</th>
              <th>Location</th>
              <th>Status</th>
              {req.aiScreeningEnabled && <th>AI Score</th>}
              {req.aiScreeningEnabled && <th>AI Rec.</th>}
              <th>Source</th>
              <th>Applied</th>
              <th>Updated</th>
              <th>Notes</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => (
              <tr
                key={app.id}
                className="cursor-pointer"
                onClick={() => router.push(`/manager/requisitions/${jobId}/candidates/${app.id}`)}
              >
                <td>
                  <div>
                    <p className="font-semibold text-white">{app.firstName} {app.lastName}</p>
                    <p className="text-sm" style={{ color: '#94a3b8' }}>{app.email}</p>
                  </div>
                </td>
                <td>
                  <div>
                    <p style={{ color: '#94a3b8' }}>{app.currentTitle ?? '—'}</p>
                    <p className="text-sm" style={{ color: '#94a3b8' }}>{app.currentCompany ?? ''}</p>
                  </div>
                </td>
                <td className="font-mono" style={{ color: '#94a3b8' }}>{app.yearsOfExperience}y</td>
                <td style={{ color: '#94a3b8' }}>{app.location}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <ApplicationStatusBadge status={app.status} />
                    <select
                      value={app.status}
                      onChange={(e) => updateApplicantStatus(app.id, e.target.value as ApplicationStatus)}
                      className="h-8 text-sm px-2 focus:outline-none"
                      style={{
                        background: '#13122a',
                        border: '1px solid #2a2850',
                        borderRadius: 6,
                        color: '#94a3b8',
                        colorScheme: 'dark',
                      }}
                      title="Change status"
                    >
                      {STATUS_OPTS.filter((o) => o.value).map((o) => (
                        <option key={o.value} value={o.value} style={{ background: '#13122a' }}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                {req.aiScreeningEnabled && (
                  <td>
                    {app.aiAnalysis ? (
                      <div
                        className="inline-flex items-center justify-center w-9 h-8 text-sm font-bold"
                        style={{
                          background: app.aiAnalysis.score >= 70 ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'transparent',
                          border: `1px solid ${
                            app.aiAnalysis.score >= 70
                              ? 'transparent'
                              : app.aiAnalysis.score >= 50
                              ? 'rgba(148,163,184,0.4)'
                              : 'rgba(148,163,184,0.2)'
                          }`,
                          color: app.aiAnalysis.score >= 70 ? '#ffffff' : '#94a3b8',
                          borderRadius: 8,
                        }}
                      >
                        {app.aiAnalysis.score}
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </td>
                )}
                {req.aiScreeningEnabled && (
                  <td>
                    {app.aiAnalysis ? (
                      <AiRecommendationBadge recommendation={app.aiAnalysis.recommendation} />
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </td>
                )}
                <td className="uppercase" style={{ color: '#94a3b8' }}>{app.source}</td>
                <td className="font-mono" style={{ color: '#94a3b8' }}>{formatDate(app.appliedAt)}</td>
                <td className="font-mono" style={{ color: '#94a3b8' }}>{formatDate(app.updatedAt)}</td>
                <td style={{ color: '#94a3b8' }}>{app.notes.length || '—'}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <Link
                    href={`/manager/requisitions/${jobId}/candidates/${app.id}`}
                    className="transition-colors"
                    style={{ color: '#94a3b8' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={req.aiScreeningEnabled ? 12 : 10}
                  className="text-center py-10"
                  style={{ color: '#94a3b8' }}
                >
                  No applicants matching current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
