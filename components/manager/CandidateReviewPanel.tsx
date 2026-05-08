'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bot,
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
  XCircle,
  User,
  Briefcase,
  GraduationCap,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Star,
  FileText,
  Download,
  UserX,
  RotateCcw,
  ShieldAlert,
  BadgeCheck,
} from 'lucide-react';
import { useATSStore } from '@/store/ats-store';
import { ApplicationStatusBadge, AiRecommendationBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Input';
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils';
import type { ApplicationStatus, SkillMatch } from '@/lib/types';

const STATUS_OPTS: { value: ApplicationStatus; label: string }[] = [
  { value: 'RECEIVED', label: 'Received' },
  { value: 'SYSTEM_SCREENING', label: 'System Screening' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'DECISION_PENDING', label: 'Decision Pending' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
];

function SkillRow({ skill, match }: SkillMatch) {
  const color = match === 'STRONG' ? '#22c55e' : match === 'PARTIAL' ? '#94a3b8' : 'rgba(148,163,184,0.3)';
  const icon =
    match === 'STRONG' ? (
      <CheckCircle2 className="w-4 h-4" style={{ color: '#22c55e' }} />
    ) : match === 'PARTIAL' ? (
      <MinusCircle className="w-4 h-4" style={{ color: '#94a3b8' }} />
    ) : (
      <XCircle className="w-4 h-4" style={{ color: 'rgba(148,163,184,0.3)' }} />
    );
  return (
    <div
      className="flex items-center justify-between py-2 last:border-0"
      style={{ borderBottom: '1px solid #2a2850' }}
    >
      <span className="text-sm" style={{ color: '#94a3b8' }}>{skill}</span>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-sm font-medium" style={{ color, fontWeight: match === 'STRONG' ? 600 : 400 }}>
          {match}
        </span>
      </div>
    </div>
  );
}

function RatingStars({ rating }: { rating?: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className="w-3.5 h-3.5"
          style={n <= (rating ?? 0) ? { color: '#f59e0b', fill: '#f59e0b' } : { color: '#2a2850' }}
        />
      ))}
    </div>
  );
}

export function CandidateReviewPanel({ jobId, applicantId }: { jobId: string; applicantId: string }) {
  const { getApplicantById, getRequisitionById, updateApplicantStatus, addNote, currentUser, hireApplicant } = useATSStore();
  const app = getApplicantById(applicantId);
  const req = getRequisitionById(jobId);

  const [activeTab, setActiveTab] = useState('overview');
  const [noteText, setNoteText] = useState('');
  const [aiExpanded, setAiExpanded] = useState(true);
  const [rejectConfirm, setRejectConfirm] = useState(false);
  const [hireConfirm, setHireConfirm] = useState(false);

  if (!app || !req) {
    return <p className="text-sm p-4" style={{ color: '#94a3b8' }}>Applicant not found.</p>;
  }

  const isRejected = app.status === 'REJECTED';
  const isHired = app.status === 'HIRED';
  const aiFlagged =
    app.aiAnalysis?.recommendation === 'NO_HIRE' ||
    app.aiAnalysis?.recommendation === 'STRONG_NO_HIRE';

  const handleReject = () => {
    updateApplicantStatus(applicantId, 'REJECTED');
    addNote(applicantId, `Application rejected by ${currentUser?.name ?? 'manager'}.`);
    setRejectConfirm(false);
  };

  const handleMoveToReview = () => {
    updateApplicantStatus(applicantId, 'UNDER_REVIEW');
    setRejectConfirm(false);
  };

  const handleNoteSubmit = () => {
    if (!noteText.trim()) return;
    addNote(applicantId, noteText.trim());
    setNoteText('');
  };

  const handleHire = () => {
    hireApplicant(applicantId);
    setHireConfirm(false);
  };

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'resume', label: 'Resume' },
    { id: 'experience', label: 'Experience' },
    { id: 'notes', label: 'Notes', count: app.notes.length },
  ];

  return (
    <div className="space-y-5">
      {/* Back nav */}
      <Link
        href={`/manager/requisitions/${jobId}`}
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
        style={{ color: '#94a3b8' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Pipeline
      </Link>

      {/* Candidate header card */}
      <div style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }} className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', borderRadius: 12 }}
            >
              <span className="text-lg font-bold text-white">
                {app.firstName[0]}{app.lastName[0]}
              </span>
            </div>
            <div>
              <h1 className="font-bold text-white" style={{ fontSize: 22 }}>
                {app.firstName} {app.lastName}
              </h1>
              <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
                {app.currentTitle && `${app.currentTitle}`}
                {app.currentCompany && ` · ${app.currentCompany}`}
              </p>
              <div className="flex flex-wrap gap-3 mt-2 text-sm" style={{ color: '#94a3b8' }}>
                <span>{app.email}</span>
                <span>{app.phone}</span>
                <span>{app.location}</span>
                <span>{app.yearsOfExperience} yrs exp</span>
                {app.expectedSalary && <span>Exp. {formatCurrency(app.expectedSalary)}</span>}
                {app.noticePeriod && <span>Notice: {app.noticePeriod}</span>}
              </div>
            </div>
          </div>

          {/* Status control */}
          <div className="flex flex-col items-end gap-2.5 shrink-0">
            <ApplicationStatusBadge status={app.status} />

            {!isRejected && !isHired && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: '#94a3b8' }}>Change:</span>
                  <Select
                    options={STATUS_OPTS}
                    value={app.status}
                    onChange={(e) => updateApplicantStatus(applicantId, e.target.value as ApplicationStatus)}
                  />
                </div>

                {/* Approve & Hire */}
                {!hireConfirm && !rejectConfirm && (
                  <button
                    onClick={() => setHireConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all"
                    style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: 8 }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    <BadgeCheck className="w-4 h-4" /> Approve &amp; Hire
                  </button>
                )}

                {hireConfirm && (
                  <div className="p-4 space-y-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10 }}>
                    <p className="text-base font-semibold text-white">
                      Hire {app.firstName} {app.lastName}?
                    </p>
                    <p className="text-sm" style={{ color: '#94a3b8' }}>
                      This will issue an offer letter and close the position for all other applicants.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleHire}
                        className="text-sm font-semibold px-4 py-2 transition-all"
                        style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: 8 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                      >
                        Yes, Hire &amp; Issue Offer
                      </button>
                      <button
                        onClick={() => setHireConfirm(false)}
                        className="text-sm font-medium transition-colors"
                        style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {!rejectConfirm && !hireConfirm && (
                  <button
                    onClick={() => setRejectConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
                    style={{ border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', background: 'transparent', cursor: 'pointer', borderRadius: 8 }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <UserX className="w-4 h-4" /> Reject Candidate
                  </button>
                )}
                {rejectConfirm && (
                  <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8 }}>
                    <span className="text-sm font-semibold text-white">Confirm rejection?</span>
                    <button
                      onClick={handleReject}
                      className="text-sm font-bold px-3 py-1 transition-all"
                      style={{ background: '#ef4444', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: 6 }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      Yes, Reject
                    </button>
                    <button
                      onClick={() => setRejectConfirm(false)}
                      className="text-sm font-medium transition-colors"
                      style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-4 pt-4 flex flex-wrap gap-5 text-sm" style={{ borderTop: '1px solid #2a2850', color: '#94a3b8' }}>
          <span>Applied: <span className="text-white">{formatDate(app.appliedAt)}</span></span>
          <span>Updated: <span className="text-white">{formatDate(app.updatedAt)}</span></span>
          <span>Source: <span className="text-white uppercase">{app.source}{app.referralName && ` (${app.referralName})`}</span></span>
          <span>For: <span className="text-white">{req.code} — {req.title}</span></span>
        </div>
      </div>

      {/* AI Screening Analysis */}
      {app.aiAnalysis && (
        <section style={{ border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.04)', borderRadius: 12, overflow: 'hidden' }}>
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ background: 'rgba(124,58,237,0.1)', borderBottom: '1px solid rgba(124,58,237,0.2)' }}
          >
            <div className="flex items-center gap-3">
              <Bot className="w-4 h-4" style={{ color: '#7c3aed' }} />
              <span className="text-base font-bold" style={{ color: '#a78bfa' }}>
                HireSync AI Screening Analysis
              </span>
              <span className="text-sm" style={{ color: 'rgba(167,139,250,0.6)' }}>
                {app.aiAnalysis.modelVersion}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ color: '#94a3b8' }}>
                Processed: {formatDateTime(app.aiAnalysis.processedAt)}
              </span>
              <button
                onClick={() => setAiExpanded((v) => !v)}
                style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                {aiExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {aiExpanded && (
            <div className="p-5 grid grid-cols-3 gap-5">
              <div className="col-span-1 flex flex-col gap-4">
                <div className="text-center p-5" style={{ border: '1px solid #2a2850', background: '#13122a', borderRadius: 10 }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>AI Score</p>
                  <p className="font-bold leading-none" style={{ fontSize: 56, color: app.aiAnalysis.score >= 70 ? '#22c55e' : '#ffffff' }}>
                    {app.aiAnalysis.score}
                  </p>
                  <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>/ 100</p>
                </div>
                <div className="text-center p-4" style={{ border: '1px solid #2a2850', background: '#13122a', borderRadius: 10 }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>Recommendation</p>
                  <AiRecommendationBadge recommendation={app.aiAnalysis.recommendation} large />
                </div>

                {app.aiAnalysis.flags.length > 0 && (
                  <div className="p-4" style={{ border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)', borderRadius: 10 }}>
                    <p className="text-sm font-bold mb-3 flex items-center gap-1.5" style={{ color: '#f59e0b' }}>
                      <AlertTriangle className="w-4 h-4" /> Flags ({app.aiAnalysis.flags.length})
                    </p>
                    <ul className="space-y-2">
                      {app.aiAnalysis.flags.map((flag, i) => (
                        <li key={i} className="text-sm leading-snug flex gap-2" style={{ color: '#94a3b8' }}>
                          <span className="shrink-0 mt-0.5" style={{ color: '#f59e0b' }}>•</span>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="col-span-1 p-4" style={{ background: '#13122a', border: '1px solid #2a2850', borderRadius: 10 }}>
                <p className="text-sm font-bold mb-3 pb-2" style={{ color: '#94a3b8', borderBottom: '1px solid #2a2850' }}>
                  AI Summary
                </p>
                <div className="text-sm leading-relaxed space-y-3" style={{ color: '#94a3b8' }}>
                  {app.aiAnalysis.summary.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </div>

              <div className="col-span-1 p-4" style={{ background: '#13122a', border: '1px solid #2a2850', borderRadius: 10 }}>
                <p className="text-sm font-bold mb-3 pb-2" style={{ color: '#94a3b8', borderBottom: '1px solid #2a2850' }}>
                  Skills Match
                  <span className="ml-2 font-normal" style={{ color: '#94a3b8' }}>
                    {app.aiAnalysis.skillsMatch.filter((s) => s.match === 'STRONG').length}/{app.aiAnalysis.skillsMatch.length} strong
                  </span>
                </p>
                <div>
                  {app.aiAnalysis.skillsMatch.map((s) => (
                    <SkillRow key={s.skill} skill={s.skill} match={s.match} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* AI flag — action required banner */}
      {aiFlagged && !isRejected && !isHired && (
        <div style={{ border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)', borderRadius: 12, overflow: 'hidden' }}>
          <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.08)' }}>
            <ShieldAlert className="w-4 h-4 shrink-0" style={{ color: '#f59e0b' }} />
            <p className="text-base font-bold" style={{ color: '#f59e0b' }}>
              AI Flagged — Action Required
            </p>
            <span className="ml-auto text-sm font-medium" style={{ color: '#94a3b8' }}>
              Score {app.aiAnalysis!.score}/100 · {app.aiAnalysis!.recommendation.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="px-5 py-4 flex items-center justify-between gap-6">
            <p className="text-sm leading-relaxed max-w-lg" style={{ color: '#94a3b8' }}>
              The AI screening model does not recommend advancing this candidate. Review their resume and
              profile before deciding. You can override the AI and move them to manual review, or confirm rejection.
            </p>
            {!rejectConfirm ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleMoveToReview}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
                  style={{ border: '1px solid #2a2850', color: '#94a3b8', background: 'transparent', cursor: 'pointer', borderRadius: 8 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2850'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                  <RotateCcw className="w-4 h-4" /> Override — Review
                </button>
                <button
                  onClick={() => setRejectConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', borderRadius: 8 }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <UserX className="w-4 h-4" /> Reject Candidate
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0 px-4 py-2.5" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', borderRadius: 8 }}>
                <span className="text-sm font-semibold text-white">Confirm rejection?</span>
                <button
                  onClick={handleReject}
                  className="text-sm font-bold px-3 py-1 transition-all"
                  style={{ background: '#ef4444', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: 6 }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Yes, Reject
                </button>
                <button
                  onClick={() => setRejectConfirm(false)}
                  className="text-sm font-medium transition-colors"
                  style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejected locked state */}
      {isRejected && (
        <div className="px-5 py-4 flex items-center justify-between gap-4" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', borderRadius: 12 }}>
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 shrink-0" style={{ color: '#f87171' }} />
            <div>
              <p className="text-base font-bold text-white">Application Rejected</p>
              <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
                This candidate has been notified. Rejection is reflected in their portal immediately.
              </p>
            </div>
          </div>
          <button
            onClick={() => updateApplicantStatus(applicantId, 'UNDER_REVIEW')}
            className="shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
            style={{ border: '1px solid #2a2850', color: '#94a3b8', background: 'transparent', cursor: 'pointer', borderRadius: 8 }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2850'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <RotateCcw className="w-4 h-4" /> Undo Rejection
          </button>
        </div>
      )}

      {/* Hired banner */}
      {isHired && app.offerLetter && (
        <div className="px-5 py-4 flex items-center gap-4" style={{ border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.06)', borderRadius: 12 }}>
          <BadgeCheck className="w-5 h-5 shrink-0" style={{ color: '#22c55e' }} />
          <div>
            <p className="text-base font-bold" style={{ color: '#22c55e' }}>Candidate Hired</p>
            <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
              Offer letter issued on {formatDate(app.offerLetter.issuedAt)}. The position has been closed.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12, overflow: 'hidden' }}>
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        <div className="p-5">
          {/* ── Overview tab ─────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-base font-bold mb-3 pb-2 flex items-center gap-2" style={{ color: '#94a3b8', borderBottom: '1px solid #2a2850' }}>
                  <User className="w-4 h-4" /> Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {app.skills.map((s) => (
                    <span key={s} className="px-3 py-1 text-sm" style={{ border: '1px solid #2a2850', color: '#94a3b8', background: 'rgba(42,40,80,0.5)', borderRadius: 6 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold mb-3 pb-2 flex items-center gap-2" style={{ color: '#94a3b8', borderBottom: '1px solid #2a2850' }}>
                  <GraduationCap className="w-4 h-4" /> Education
                </h3>
                <div className="space-y-3">
                  {app.education.map((e, i) => (
                    <div key={i}>
                      <p className="text-base font-semibold text-white">{e.degree} {e.field}</p>
                      <p className="text-sm" style={{ color: '#94a3b8' }}>{e.institution} · {e.graduationYear}</p>
                    </div>
                  ))}
                </div>
              </div>

              {app.coverLetter && (
                <div className="col-span-2">
                  <h3 className="text-base font-bold mb-3 pb-2 flex items-center gap-2" style={{ color: '#94a3b8', borderBottom: '1px solid #2a2850' }}>
                    <MessageSquare className="w-4 h-4" /> Cover Letter
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: '#94a3b8' }}>{app.coverLetter}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Experience tab ────────────────────────────── */}
          {activeTab === 'experience' && (
            <div>
              <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: '#94a3b8' }}>
                <Briefcase className="w-4 h-4" /> Work History
              </h3>
              <div className="space-y-5">
                {app.workExperience.map((w, i) => (
                  <div key={i} className="pl-4" style={{ borderLeft: '2px solid rgba(124,58,237,0.4)' }}>
                    <p className="text-base font-bold text-white">{w.title}</p>
                    <p className="text-sm font-semibold" style={{ color: '#94a3b8' }}>{w.company}</p>
                    <p className="text-sm mt-0.5 font-mono" style={{ color: '#94a3b8' }}>
                      {w.startDate} — {w.current ? 'Present' : (w.endDate ?? '')}
                    </p>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: '#94a3b8' }}>{w.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Resume tab ───────────────────────────────── */}
          {activeTab === 'resume' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" style={{ color: '#7c3aed' }} />
                  <span className="text-base font-bold text-white">Resume Preview</span>
                  {app.resumeFileName && (
                    <span className="text-sm px-3 py-1" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', borderRadius: 9999 }}>
                      {app.resumeFileName}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
                  style={{ border: '1px solid #2a2850', color: '#94a3b8', background: 'transparent', cursor: 'pointer', borderRadius: 8 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2850'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                  <Download className="w-4 h-4" /> Print / Save PDF
                </button>
              </div>

              {/* Document canvas — keep white paper on dark background */}
              <div className="p-8 overflow-auto" style={{ minHeight: 560, background: '#0a0919', borderRadius: 8 }}>
                <div className="mx-auto bg-white flex overflow-hidden" style={{ maxWidth: 720, boxShadow: '0 8px 40px rgba(0,0,0,0.5)', borderRadius: 4 }}>
                  {/* Left sidebar */}
                  <div className="shrink-0 flex flex-col gap-5 p-6" style={{ width: 196, background: '#1e1b4b' }}>
                    <div className="flex justify-center pt-2">
                      <div className="flex items-center justify-center" style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: 8 }}>
                        <span className="text-2xl font-bold text-white">{app.firstName[0]}{app.lastName[0]}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#a5b4fc' }}>Contact</p>
                      <div className="space-y-1.5">
                        {[app.email, app.phone, app.location, app.linkedinUrl].filter(Boolean).map((val, i) => (
                          <p key={i} className="text-xs leading-snug" style={{ color: '#c7d2fe', wordBreak: 'break-all' }}>{val}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#a5b4fc' }}>Availability</p>
                      <p className="text-xs" style={{ color: '#c7d2fe' }}>{app.noticePeriod || 'Not specified'}</p>
                      {app.expectedSalary && (
                        <p className="text-xs mt-1" style={{ color: '#c7d2fe' }}>Expected: ${app.expectedSalary}/hr</p>
                      )}
                    </div>
                    {app.skills.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#a5b4fc' }}>Skills</p>
                        <div className="space-y-1">
                          {app.skills.map((s) => (
                            <div key={s} className="flex items-center gap-1.5">
                              <span className="shrink-0" style={{ width: 4, height: 4, background: '#818cf8', borderRadius: 9999 }} />
                              <span className="text-xs" style={{ color: '#c7d2fe' }}>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {app.education.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#a5b4fc' }}>Education</p>
                        {app.education.map((e, i) => (
                          <div key={i} className="mb-3">
                            <p className="text-xs font-bold" style={{ color: '#e0e7ff' }}>{e.degree} {e.field}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#a5b4fc' }}>{e.institution}</p>
                            <p className="text-xs font-mono mt-0.5" style={{ color: '#6366f1' }}>{e.graduationYear}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right main */}
                  <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
                    <div className="px-7 pt-7 pb-5" style={{ borderBottom: '3px solid #4f46e5' }}>
                      <h2 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">
                        {app.firstName} {app.lastName}
                      </h2>
                      {(app.currentTitle || app.currentCompany) && (
                        <p className="text-sm font-semibold mt-0.5" style={{ color: '#4f46e5' }}>
                          {[app.currentTitle, app.currentCompany].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="text-xs text-slate-500">{app.yearsOfExperience} yr{app.yearsOfExperience !== 1 ? 's' : ''} experience</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="px-7 py-5 space-y-5 flex-1">
                      {app.coverLetter && (
                        <section>
                          <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#4f46e5', letterSpacing: '0.12em' }}>Cover Letter</h3>
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{app.coverLetter}</p>
                        </section>
                      )}
                      {app.workExperience.length > 0 && (
                        <section>
                          <h3 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: '#4f46e5', letterSpacing: '0.12em', borderBottom: '1px solid #e0e7ff' }}>
                            Work Experience
                          </h3>
                          <div className="space-y-3">
                            {app.workExperience.map((w, i) => (
                              <div key={i} style={{ borderLeft: '2px solid #c7d2fe', paddingLeft: 12 }}>
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">{w.title}</p>
                                    <p className="text-xs font-semibold text-slate-600">{w.company}</p>
                                  </div>
                                  <p className="text-xs font-mono text-slate-400 whitespace-nowrap shrink-0">
                                    {w.startDate || '—'} – {w.current ? 'Present' : (w.endDate || '—')}
                                  </p>
                                </div>
                                {w.description && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{w.description}</p>}
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                      {!app.coverLetter && app.workExperience.length === 0 && (
                        <div className="flex items-center justify-center py-10">
                          <p className="text-xs font-mono text-slate-300 uppercase tracking-widest">No work history or cover letter submitted</p>
                        </div>
                      )}
                    </div>
                    <div className="px-7 py-2.5 flex items-center justify-between" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                      <p className="text-xs text-slate-400 font-mono">{req.code} — {req.title}</p>
                      <p className="text-xs text-slate-400 font-mono">HireSync ATS · UT Dallas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Notes tab ────────────────────────────────── */}
          {activeTab === 'notes' && (
            <div className="space-y-5">
              <div className="p-4" style={{ border: '1px solid #2a2850', background: 'rgba(42,40,80,0.3)', borderRadius: 10 }}>
                <p className="text-base font-bold text-white mb-3">Add Note</p>
                <Textarea
                  rows={3}
                  placeholder="Enter note…"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <div className="mt-3 flex justify-end">
                  <Button size="sm" onClick={handleNoteSubmit} disabled={!noteText.trim()}>
                    Save Note
                  </Button>
                </div>
              </div>

              {app.notes.length === 0 ? (
                <p className="text-sm" style={{ color: '#94a3b8' }}>No notes yet.</p>
              ) : (
                <div className="space-y-3">
                  {[...app.notes].reverse().map((note) => (
                    <div key={note.id} className="p-4" style={{ border: '1px solid #2a2850', background: '#13122a', borderRadius: 10 }}>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-base font-bold text-white">{note.authorName}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-medium px-2.5 py-0.5"
                            style={
                              note.type === 'AI_GENERATED'
                                ? { background: 'rgba(124,58,237,0.2)', color: '#a78bfa', borderRadius: 9999 }
                                : note.type === 'SYSTEM'
                                ? { background: 'rgba(42,40,80,0.8)', color: '#94a3b8', borderRadius: 9999 }
                                : { border: '1px solid #2a2850', color: '#94a3b8', borderRadius: 9999 }
                            }
                          >
                            {note.type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-sm" style={{ color: '#94a3b8' }}>
                            {formatDateTime(note.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-base leading-relaxed" style={{ color: '#94a3b8' }}>{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
