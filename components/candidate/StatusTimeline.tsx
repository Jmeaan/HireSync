'use client';

import { CheckCircle2, Circle, Clock, FileText } from 'lucide-react';
import type { ApplicationStatus } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const STAGES: { status: ApplicationStatus; label: string; description: string }[] = [
  {
    status: 'RECEIVED',
    label: 'Application Received',
    description: 'Your application has been received and is queued for review.',
  },
  {
    status: 'UNDER_REVIEW',
    label: 'Under Review',
    description: 'Your application is being reviewed by the hiring team.',
  },
  {
    status: 'HIRED',
    label: 'Offer Issued',
    description: 'Congratulations — an offer letter has been issued to you.',
  },
];

const ACTIVE_STATUSES: ApplicationStatus[] = [
  'RECEIVED', 'SYSTEM_SCREENING', 'UNDER_REVIEW',
  'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED', 'DECISION_PENDING', 'OFFER_EXTENDED',
];

function getStageIndex(status: ApplicationStatus): number {
  if (status === 'HIRED') return 2;
  if (ACTIVE_STATUSES.includes(status)) {
    if (status === 'RECEIVED' || status === 'SYSTEM_SCREENING') return 0;
    return 1;
  }
  return -1;
}

export function StatusTimeline({ status, updatedAt }: { status: ApplicationStatus; updatedAt: string }) {
  if (status === 'REJECTED') {
    return (
      <div className="p-5" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', borderRadius: 12 }}>
        <p className="text-sm font-semibold mb-3" style={{ color: '#94a3b8' }}>Application Status</p>
        <div className="p-4 text-center" style={{ border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', borderRadius: 8 }}>
          <p className="text-base font-bold text-white">Application Not Progressed</p>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
            The hiring team has decided not to move forward with your application at this time. You
            may apply to other open positions.
          </p>
          <p className="text-sm font-mono mt-2" style={{ color: '#94a3b8' }}>
            {formatDate(updatedAt)}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'WITHDRAWN') {
    return (
      <div className="p-5" style={{ border: '1px solid #2a2850', background: '#1a1933', borderRadius: 12 }}>
        <p className="text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>Application Status</p>
        <p className="text-sm" style={{ color: '#94a3b8' }}>Application Withdrawn</p>
      </div>
    );
  }

  const currentIndex = getStageIndex(status);

  return (
    <div className="p-5" style={{ border: '1px solid #2a2850', background: '#1a1933', borderRadius: 12 }}>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold" style={{ color: '#94a3b8' }}>Application Status</p>
        <span className="text-sm" style={{ color: '#94a3b8' }}>
          Last updated: {formatDate(updatedAt)}
        </span>
      </div>

      <div className="space-y-0">
        {STAGES.map((stage, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <div key={stage.status} className="flex gap-4">
              <div className="flex flex-col items-center w-6 shrink-0">
                <div
                  className="w-6 h-6 flex items-center justify-center shrink-0"
                  style={{
                    color: isCurrent ? '#a78bfa' : isCompleted ? '#22c55e' : 'rgba(148,163,184,0.3)',
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isCurrent && stage.status === 'HIRED' ? (
                    <FileText className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                {i < STAGES.length - 1 && (
                  <div
                    className="w-0.5 flex-1 min-h-5 mt-1"
                    style={{ background: isCompleted ? 'rgba(34,197,94,0.4)' : '#2a2850' }}
                  />
                )}
              </div>

              <div className="pb-5 flex-1">
                <p
                  className="text-base font-semibold"
                  style={{
                    color: isCurrent ? '#a78bfa' : isCompleted ? '#22c55e' : 'rgba(148,163,184,0.35)',
                  }}
                >
                  {stage.label}
                  {isCurrent && (
                    <span className="ml-2 text-sm font-medium" style={{ color: 'rgba(167,139,250,0.7)' }}>
                      ← Current
                    </span>
                  )}
                </p>
                {(isCompleted || isCurrent) && (
                  <p
                    className="text-sm mt-1 leading-snug"
                    style={{ color: isCurrent ? '#94a3b8' : 'rgba(148,163,184,0.5)' }}
                  >
                    {stage.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
