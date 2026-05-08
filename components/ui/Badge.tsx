'use client';

import { cn } from '@/lib/utils';
import type { ApplicationStatus, JobStatus, AiRecommendation } from '@/lib/types';

// ── Application status ───────────────────────────────────────────────────────
const STATUS_STYLE: Record<ApplicationStatus, React.CSSProperties> = {
  RECEIVED:             { background: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 9999 },
  SYSTEM_SCREENING:     { background: 'rgba(6,182,212,0.12)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 9999 },
  UNDER_REVIEW:         { background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.35)', borderRadius: 9999 },
  INTERVIEW_SCHEDULED:  { background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 9999 },
  INTERVIEW_COMPLETED:  { background: 'rgba(124,58,237,0.1)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 9999 },
  DECISION_PENDING:     { background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 9999 },
  OFFER_EXTENDED:       { background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 9999 },
  HIRED:                { background: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.5)', borderRadius: 9999, fontWeight: 700 },
  REJECTED:             { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9999, textDecoration: 'line-through' },
  WITHDRAWN:            { background: 'rgba(148,163,184,0.08)', color: 'rgba(148,163,184,0.4)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 9999 },
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  RECEIVED:            'Received',
  SYSTEM_SCREENING:    'Screening',
  UNDER_REVIEW:        'Under Review',
  INTERVIEW_SCHEDULED: 'Interview',
  INTERVIEW_COMPLETED: 'Interviewed',
  DECISION_PENDING:    'Pending',
  OFFER_EXTENDED:      'Offer Out',
  HIRED:               'Hired',
  REJECTED:            'Rejected',
  WITHDRAWN:           'Withdrawn',
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className="inline-block px-3 py-1 text-xs font-semibold whitespace-nowrap"
      style={STATUS_STYLE[status]}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

// ── Job status ───────────────────────────────────────────────────────────────
const JOB_STATUS_STYLE: Record<JobStatus, React.CSSProperties> = {
  DRAFT:  { background: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 9999 },
  OPEN:   { background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 9999, fontWeight: 700 },
  PAUSED: { background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 9999 },
  CLOSED: { background: 'rgba(148,163,184,0.08)', color: 'rgba(148,163,184,0.5)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 9999 },
  FILLED: { background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 9999, fontWeight: 700 },
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide"
      style={JOB_STATUS_STYLE[status]}
    >
      {status}
    </span>
  );
}

// ── AI recommendation ────────────────────────────────────────────────────────
const AI_REC_STYLE: Record<AiRecommendation, React.CSSProperties> = {
  STRONG_HIRE:    { background: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.5)', borderRadius: 9999, fontWeight: 700 },
  HIRE:           { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 9999 },
  NEUTRAL:        { background: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 9999 },
  NO_HIRE:        { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9999 },
  STRONG_NO_HIRE: { background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 9999, fontWeight: 700 },
};

const AI_REC_LABELS: Record<AiRecommendation, string> = {
  STRONG_HIRE:    'Strong Hire',
  HIRE:           'Hire',
  NEUTRAL:        'Neutral',
  NO_HIRE:        'No Hire',
  STRONG_NO_HIRE: 'Strong No Hire',
};

export function AiRecommendationBadge({
  recommendation,
  large = false,
}: {
  recommendation: AiRecommendation;
  large?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-block font-semibold whitespace-nowrap',
        large ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs'
      )}
      style={AI_REC_STYLE[recommendation]}
    >
      {AI_REC_LABELS[recommendation]}
    </span>
  );
}

// ── Generic tag ──────────────────────────────────────────────────────────────
export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn('inline-block px-2.5 py-0.5 text-xs text-white/60', className)}
      style={{ border: '1px solid #2a2850', borderRadius: 6, background: 'rgba(42,40,80,0.5)' }}
    >
      {children}
    </span>
  );
}
