'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Briefcase, ArrowRight, ClipboardList, Clock, XCircle, CheckCircle2, FileText } from 'lucide-react';
import { useATSStore } from '@/store/ats-store';
import { ApplicationStatusBadge } from '@/components/ui/Badge';
import { StatusTimeline } from './StatusTimeline';
import { formatDate } from '@/lib/utils';
import type { OfferLetter } from '@/lib/types';

function OfferLetterDocument({ app, jobTitle }: {
  app: { firstName: string; lastName: string; email: string; location: string; offerLetter: OfferLetter };
  jobTitle: string;
}) {
  const ol = app.offerLetter;
  const issueDate = new Date(ol.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const startDate = new Date(ol.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="overflow-auto p-6" style={{ background: '#13122a' }}>
      <div className="mx-auto" style={{ maxWidth: 680, background: '#fff', boxShadow: '0 8px 40px rgba(0,0,0,0.5)', padding: 48 }}>
        {/* Letterhead */}
        <div className="flex items-start justify-between mb-8 pb-6" style={{ borderBottom: '3px solid #000' }}>
          <div>
            <div style={{ width: 20, height: 20, background: '#7c3aed', marginBottom: 8 }} />
            <p style={{ fontSize: 18, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000', marginBottom: 2 }}>HireSync</p>
            <p style={{ fontSize: 11, color: '#666', letterSpacing: '0.06em', textTransform: 'uppercase' }}>UT Dallas Student Employment Office</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: '#999', marginBottom: 2 }}>Date of Issue</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>{issueDate}</p>
          </div>
        </div>

        {/* Address block */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#000', marginBottom: 2 }}>{app.firstName} {app.lastName}</p>
          <p style={{ fontSize: 13, color: '#555' }}>{app.email}</p>
          {app.location && <p style={{ fontSize: 13, color: '#555' }}>{app.location}</p>}
        </div>

        {/* Salutation */}
        <p style={{ fontSize: 14, color: '#000', marginBottom: 20, lineHeight: 1.7 }}>
          Dear {app.firstName},
        </p>

        {/* Body */}
        <p style={{ fontSize: 14, color: '#222', lineHeight: 1.8, marginBottom: 20 }}>
          We are pleased to extend an offer of employment for the position of <strong>{ol.jobTitle}</strong> within
          the <strong>{ol.department}</strong> department at the University of Texas at Dallas Student Employment Office.
        </p>

        <p style={{ fontSize: 14, color: '#222', lineHeight: 1.8, marginBottom: 28 }}>
          This offer is contingent upon your acceptance below and the successful completion of any applicable
          onboarding requirements.
        </p>

        {/* Terms table */}
        <div style={{ border: '1px solid #e0e0e0', marginBottom: 28, overflow: 'hidden' }}>
          {[
            ['Position', ol.jobTitle],
            ['Department', ol.department],
            ['Location', ol.location + (ol.location ? '' : 'On-Campus')],
            ['Employment Type', ol.employmentType.replace('_', '-').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())],
            ['Compensation', ol.salaryDisplay],
            ['Proposed Start Date', startDate],
            ['Reporting To', ol.hiringManagerName],
          ].map(([label, value], i) => (
            <div
              key={label}
              style={{
                display: 'flex',
                background: i % 2 === 0 ? '#fafafa' : '#fff',
                borderBottom: i < 6 ? '1px solid #e0e0e0' : 'none',
              }}
            >
              <div style={{ width: 180, padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0 }}>
                {label}
              </div>
              <div style={{ flex: 1, padding: '10px 14px', fontSize: 13, color: '#000', fontWeight: 500 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Closing */}
        <p style={{ fontSize: 14, color: '#222', lineHeight: 1.8, marginBottom: 28 }}>
          Please confirm your acceptance of this offer. We look forward to having you join our team and
          contributing to the University of Texas at Dallas community.
        </p>

        {/* Signature block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
          <div>
            <div style={{ width: 200, borderTop: '1px solid #000', paddingTop: 6 }}>
              <p style={{ fontSize: 11, color: '#999', marginBottom: 1, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Hiring Manager</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>{ol.hiringManagerName}</p>
              <p style={{ fontSize: 11, color: '#666' }}>UT Dallas Student Employment</p>
            </div>
          </div>
          <div>
            <div style={{ width: 200, borderTop: '1px solid #000', paddingTop: 6 }}>
              <p style={{ fontSize: 11, color: '#999', marginBottom: 1, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Candidate Signature</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>{app.firstName} {app.lastName}</p>
              <p style={{ fontSize: 11, color: '#666' }}>Date: _______________</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 12, borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 10, color: '#aaa' }}>HireSync ATS · UT Dallas Student Employment Office</p>
          <p style={{ fontSize: 10, color: '#aaa' }}>Confidential — Offer Letter</p>
        </div>
      </div>
    </div>
  );
}

export function ApplicationsList() {
  const { getApplicantsForCurrentUser, requisitions } = useATSStore();
  const myApps = getApplicantsForCurrentUser();
  const activeApps = myApps.filter((a) => !['REJECTED', 'WITHDRAWN', 'HIRED'].includes(a.status));
  const rejectedApps = myApps.filter((a) => a.status === 'REJECTED');
  const hiredApps = myApps.filter((a) => a.status === 'HIRED');
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);

  if (myApps.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="font-bold text-white" style={{ fontSize: 28 }}>My Applications</h1>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Track all your submitted applications</p>
        </div>
        <div className="p-14 text-center" style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }}>
          <div
            className="w-14 h-14 flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12 }}
          >
            <ClipboardList className="w-6 h-6" style={{ color: '#7c3aed' }} />
          </div>
          <p className="text-base font-semibold text-white mb-1">No applications yet</p>
          <p className="text-sm mb-5 max-w-xs mx-auto" style={{ color: '#94a3b8' }}>
            You haven't applied to any positions yet. Browse open on-campus jobs and submit your first application.
          </p>
          <Link
            href="/candidate/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-opacity"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: '#ffffff', borderRadius: 8 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Browse Open Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-white" style={{ fontSize: 28 }}>My Applications</h1>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
            {myApps.length} total · {activeApps.length} active
          </p>
        </div>
        <Link
          href="/candidate/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-opacity"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: '#ffffff', borderRadius: 8 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Briefcase className="w-3.5 h-3.5" /> Browse Jobs
        </Link>
      </div>

      {/* Active applications with timelines */}
      {activeApps.length > 0 && (
        <section>
          <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#a78bfa' }}>
            <span className="w-2 h-2 inline-block rounded-full" style={{ background: '#7c3aed' }} />
            Active Applications
          </h2>
          <div className="space-y-4">
            {activeApps.map((app) => {
              const job = requisitions.find((r) => r.id === app.jobId);
              return (
                <div
                  key={app.id}
                  className="overflow-hidden"
                  style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }}
                >
                  <div
                    className="p-4 flex items-start justify-between"
                    style={{ borderBottom: '1px solid #2a2850' }}
                  >
                    <div>
                      <p className="text-base font-bold text-white">{job?.title ?? 'Unknown Position'}</p>
                      <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
                        {job?.department} · {job?.code} · Applied {formatDate(app.appliedAt)}
                      </p>
                    </div>
                    <ApplicationStatusBadge status={app.status} />
                  </div>
                  <div className="p-4">
                    <StatusTimeline status={app.status} updatedAt={app.updatedAt} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Hired / Offer Letters */}
      {hiredApps.length > 0 && (
        <section>
          <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#22c55e' }}>
            <CheckCircle2 className="w-4 h-4" /> Hired — Offer Letter
          </h2>
          <div className="space-y-3">
            {hiredApps.map((app) => {
              const job = requisitions.find((r) => r.id === app.jobId);
              const isExpanded = expandedOffer === app.id;
              return (
                <div
                  key={app.id}
                  className="overflow-hidden"
                  style={{ background: '#1a1933', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12 }}
                >
                  <div className="flex items-center gap-4 px-4 py-3" style={{ borderLeft: '3px solid #22c55e' }}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#22c55e' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-white truncate">
                        {job?.title ?? 'Unknown Position'}
                      </p>
                      <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
                        {job?.department} · {job?.location} · Hired {formatDate(app.updatedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <ApplicationStatusBadge status={app.status} />
                      {app.offerLetter && (
                        <button
                          onClick={() => setExpandedOffer(isExpanded ? null : app.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-all"
                          style={{
                            background: isExpanded ? 'rgba(34,197,94,0.15)' : 'transparent',
                            color: '#22c55e',
                            border: '1px solid rgba(34,197,94,0.4)',
                            borderRadius: 8,
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(34,197,94,0.15)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = isExpanded ? 'rgba(34,197,94,0.15)' : 'transparent')}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {isExpanded ? 'Hide Letter' : 'View Offer Letter'}
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpanded && app.offerLetter && (
                    <div style={{ borderTop: '1px solid rgba(34,197,94,0.15)' }}>
                      <OfferLetterDocument
                        app={{
                          firstName: app.firstName,
                          lastName: app.lastName,
                          email: app.email,
                          location: app.location,
                          offerLetter: app.offerLetter,
                        }}
                        jobTitle={job?.title ?? app.offerLetter.jobTitle}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Rejected applications */}
      {rejectedApps.length > 0 && (
        <section>
          <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#94a3b8' }}>
            <XCircle className="w-4 h-4" /> Not Selected
          </h2>
          <div className="space-y-2">
            {rejectedApps.map((app) => {
              const job = requisitions.find((r) => r.id === app.jobId);
              return (
                <div
                  key={app.id}
                  className="overflow-hidden"
                  style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 10 }}
                >
                  <div className="flex items-center gap-4 px-4 py-3" style={{ borderLeft: '3px solid rgba(239,68,68,0.4)' }}>
                    <XCircle className="w-4 h-4 shrink-0" style={{ color: 'rgba(239,68,68,0.5)' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-white truncate">
                        {job?.title ?? 'Unknown Position'}
                      </p>
                      <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
                        {job?.department} · Applied {formatDate(app.appliedAt)} · Updated {formatDate(app.updatedAt)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <ApplicationStatusBadge status={app.status} />
                      <p className="text-sm mt-1.5 font-medium" style={{ color: '#94a3b8' }}>
                        Thank you for applying. We've moved forward with other candidates.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* All applications table */}
      <section>
        <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#94a3b8' }}>
          <Clock className="w-4 h-4" /> All Submissions
        </h2>
        <div style={{ border: '1px solid #2a2850', overflow: 'hidden', borderRadius: 12 }}>
          <table className="hs-table w-full">
            <thead>
              <tr>
                <th>Position</th>
                <th>Department</th>
                <th>Location</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Last Update</th>
              </tr>
            </thead>
            <tbody>
              {myApps.map((app) => {
                const job = requisitions.find((r) => r.id === app.jobId);
                return (
                  <tr
                    key={app.id}
                    style={app.status === 'REJECTED' ? { opacity: 0.4 } : {}}
                  >
                    <td className="font-semibold text-white">
                      {job?.title ?? 'Unknown Position'}
                    </td>
                    <td style={{ color: '#94a3b8' }}>{job?.department ?? '—'}</td>
                    <td className="font-mono" style={{ color: '#94a3b8' }}>{job?.location ?? '—'}</td>
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
    </div>
  );
}
