'use client';

import { create } from 'zustand';
import {
  MOCK_USERS,
  MOCK_CREDENTIALS,
  MOCK_REQUISITIONS,
  MOCK_APPLICANTS,
  MOCK_DASHBOARD_METRICS,
} from '@/lib/mock-data';
import type {
  User,
  JobRequisition,
  Applicant,
  ApplicationStatus,
  JobStatus,
  DashboardMetrics,
  ApplicationNote,
  AiAnalysis,
  AiRecommendation,
  SkillMatch,
  InterviewStage,
  InterviewType,
  OfferLetter,
} from '@/lib/types';

interface ATSState {
  // ── Auth ────────────────────────────────────────────────────
  currentUser: User | null;
  isAuthenticated: boolean;
  authError: string | null;

  // ── Data ────────────────────────────────────────────────────
  requisitions: JobRequisition[];
  applicants: Applicant[];
  dashboardMetrics: DashboardMetrics;

  // ── UI selections ───────────────────────────────────────────
  selectedRequisitionId: string | null;
  selectedApplicantId: string | null;
  sidebarCollapsed: boolean;

  // ── Computed helpers ────────────────────────────────────────
  getRequisitionById: (id: string) => JobRequisition | undefined;
  getApplicantById: (id: string) => Applicant | undefined;
  getApplicantsByJobId: (jobId: string) => Applicant[];
  getApplicantsForCurrentUser: () => Applicant[];

  // ── Auth actions ────────────────────────────────────────────
  login: (email: string, password: string) => { success: boolean; role?: string };
  logout: () => void;
  clearAuthError: () => void;
  registerCandidate: (name: string, email: string, password: string) => { success: boolean; error?: string };

  // ── Requisition actions ─────────────────────────────────────
  setSelectedRequisition: (id: string | null) => void;
  createRequisition: (data: Partial<JobRequisition>) => JobRequisition;
  updateRequisition: (id: string, data: Partial<JobRequisition>) => void;
  updateRequisitionStatus: (id: string, status: JobStatus) => void;

  // ── Applicant actions ───────────────────────────────────────
  setSelectedApplicant: (id: string | null) => void;
  updateApplicantStatus: (id: string, status: ApplicationStatus) => void;
  addNote: (applicantId: string, content: string) => void;
  submitApplication: (data: Partial<Applicant>) => void;

  // ── Hire action ──────────────────────────────────────────────
  hireApplicant: (applicantId: string) => void;

  // ── Interview scheduling ─────────────────────────────────────
  scheduleInterview: (applicantId: string, data: { type: InterviewType; scheduledAt: string; interviewerNames: string[] }) => void;
  requestReschedule: (applicantId: string, interviewId: string, proposedTime: string, reason?: string) => void;
  approveReschedule: (applicantId: string, interviewId: string) => void;
  denyReschedule: (applicantId: string, interviewId: string) => void;

  // ── Batch AI actions ────────────────────────────────────────
  runBatchAiScreening: () => number;

  // ── UI actions ──────────────────────────────────────────────
  toggleSidebar: () => void;
}

// ── localStorage helpers ──────────────────────────────────────────────────────

function loadPersistedCandidates(): { users: User[]; creds: Record<string, string> } {
  if (typeof window === 'undefined') return { users: [], creds: {} };
  try {
    const raw = localStorage.getItem('hs_candidates');
    return raw ? JSON.parse(raw) : { users: [], creds: {} };
  } catch { return { users: [], creds: {} }; }
}

function persistCandidates(users: User[], creds: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const candidateUsers = users.filter((u) => u.role === 'candidate');
  const candidateCreds: Record<string, string> = {};
  candidateUsers.forEach((u) => { if (creds[u.email]) candidateCreds[u.email] = creds[u.email]; });
  localStorage.setItem('hs_candidates', JSON.stringify({ users: candidateUsers, creds: candidateCreds }));
}

function loadPersistedApplicants(): Applicant[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('hs_applicants');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function persistApplicants(applicants: Applicant[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('hs_applicants', JSON.stringify(applicants));
}

function loadPersistedRequisitions(): JobRequisition[] {
  if (typeof window === 'undefined') return MOCK_REQUISITIONS;
  try {
    const raw = localStorage.getItem('hs_requisitions');
    return raw ? JSON.parse(raw) : MOCK_REQUISITIONS;
  } catch { return MOCK_REQUISITIONS; }
}

function persistRequisitions(requisitions: JobRequisition[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('hs_requisitions', JSON.stringify(requisitions));
}

// ── Mutable auth state ────────────────────────────────────────────────────────
const _persisted = loadPersistedCandidates();
const _users: User[] = [...MOCK_USERS, ..._persisted.users];
const _credentials: Record<string, string> = { ...MOCK_CREDENTIALS, ..._persisted.creds };

// ── Active status check ───────────────────────────────────────────────────────
const INACTIVE_STATUSES: ApplicationStatus[] = ['REJECTED', 'WITHDRAWN', 'HIRED'];

function isActive(status: ApplicationStatus): boolean {
  return !INACTIVE_STATUSES.includes(status);
}

function recalcReqCounts(requisitions: JobRequisition[], applicants: Applicant[]): JobRequisition[] {
  return requisitions.map((req) => {
    const reqApps = applicants.filter((a) => a.jobId === req.id);
    return {
      ...req,
      applicationCount: reqApps.length,
      activeApplicationCount: reqApps.filter((a) => isActive(a.status)).length,
    };
  });
}

// ── AI Screening ──────────────────────────────────────────────────────────────

function runAiScreening(
  app: Applicant,
  req: JobRequisition
): { aiAnalysis: AiAnalysis; nextStatus: ApplicationStatus; autoInterview: boolean } {
  const allRequirements = [...req.requirements, ...req.niceToHave];
  const appSkillsLower = app.skills.map((s) => s.toLowerCase().trim());

  const skillsMatch: SkillMatch[] = allRequirements.map((reqItem) => {
    const reqLower = reqItem.toLowerCase();
    const reqWords = reqLower.split(/\s+/).filter((w) => w.length > 3);

    const strong = appSkillsLower.some(
      (s) =>
        s === reqLower ||
        reqLower.includes(s) ||
        s.includes(reqLower) ||
        reqWords.some((w) => s === w || s.includes(w))
    );
    if (strong) return { skill: reqItem, match: 'STRONG' };

    const partial = appSkillsLower.some((s) => {
      const skillWords = s.split(/\s+/).filter((w) => w.length > 3);
      return skillWords.some((sw) => reqWords.some((rw) => sw.includes(rw) || rw.includes(sw)));
    });
    if (partial) return { skill: reqItem, match: 'PARTIAL' };

    return { skill: reqItem, match: 'MISSING' };
  });

  const reqCount = req.requirements.length;
  const reqMatches = skillsMatch.slice(0, reqCount);
  const niceMatches = skillsMatch.slice(reqCount);

  let reqScore = reqCount === 0 ? 50 : 0;
  if (reqCount > 0) {
    const s = reqMatches.filter((x) => x.match === 'STRONG').length;
    const p = reqMatches.filter((x) => x.match === 'PARTIAL').length;
    reqScore = Math.round(((s + p * 0.5) / reqCount) * 70);
  }

  let niceScore = 0;
  if (niceMatches.length > 0) {
    const s = niceMatches.filter((x) => x.match === 'STRONG').length;
    const p = niceMatches.filter((x) => x.match === 'PARTIAL').length;
    niceScore = Math.round(((s + p * 0.5) / niceMatches.length) * 15);
  }

  const expScore = Math.min(15, app.yearsOfExperience * 3);
  const score = Math.min(100, Math.max(0, reqScore + niceScore + expScore));

  let recommendation: AiRecommendation;
  if (score >= 85) recommendation = 'STRONG_HIRE';
  else if (score >= 70) recommendation = 'HIRE';
  else if (score >= 50) recommendation = 'NEUTRAL';
  else if (score >= 30) recommendation = 'NO_HIRE';
  else recommendation = 'STRONG_NO_HIRE';

  const flags: string[] = [];
  const missingRequired = reqMatches.filter((x) => x.match === 'MISSING');
  if (reqCount > 0 && missingRequired.length >= Math.ceil(reqCount / 2)) {
    flags.push(`Missing ${missingRequired.length} of ${reqCount} required qualifications`);
  }
  if (app.yearsOfExperience === 0) flags.push('No prior work experience listed');
  if (!app.coverLetter) flags.push('No cover letter submitted');

  const autoInterview = score >= 70;
  if (autoInterview) {
    flags.push('AUTO-SCHEDULED FOR INTERVIEW — Manager confirmation required');
  }

  const strongCount = skillsMatch.filter((x) => x.match === 'STRONG').length;
  const partialCount = skillsMatch.filter((x) => x.match === 'PARTIAL').length;
  let summary = `Matched ${strongCount} of ${allRequirements.length} qualifications strongly, ${partialCount} partially. AI Score: ${score}/100.`;

  if (score >= 70) {
    summary += '\n\nStrong candidate profile — auto-scheduled for initial phone screen. Manager should confirm the interview date and time.';
  } else if (score >= 50) {
    summary += '\n\nCandidate meets key requirements. Shortlisted for hiring manager review before interview scheduling.';
  } else {
    summary += '\n\nSignificant skill gaps identified. Manual review recommended before advancing.';
  }

  // Status: ≥70 auto-advance to interview, ≥50 under review, else stay received
  const nextStatus: ApplicationStatus = score >= 70 ? 'INTERVIEW_SCHEDULED' : score >= 50 ? 'UNDER_REVIEW' : 'RECEIVED';

  return {
    aiAnalysis: {
      score,
      recommendation,
      summary,
      skillsMatch,
      flags,
      processedAt: new Date().toISOString(),
      modelVersion: 'HireSync-Screen v2.4.1',
    },
    nextStatus,
    autoInterview,
  };
}

// ── Store ─────────────────────────────────────────────────────────────────────
const _initApplicants = loadPersistedApplicants();
const _initRequisitions = recalcReqCounts(loadPersistedRequisitions(), _initApplicants);

export const useATSStore = create<ATSState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  authError: null,
  requisitions: _initRequisitions,
  applicants: _initApplicants,
  dashboardMetrics: MOCK_DASHBOARD_METRICS,
  selectedRequisitionId: null,
  selectedApplicantId: null,
  sidebarCollapsed: false,

  // ── Computed helpers ──────────────────────────────────────────
  getRequisitionById: (id) => get().requisitions.find((r) => r.id === id),
  getApplicantById: (id) => get().applicants.find((a) => a.id === id),
  getApplicantsByJobId: (jobId) => get().applicants.filter((a) => a.jobId === jobId),
  getApplicantsForCurrentUser: () => {
    const user = get().currentUser;
    if (!user) return [];
    return get().applicants.filter((a) => a.candidateId === user.id);
  },

  // ── Auth ──────────────────────────────────────────────────────
  login: (email, password) => {
    const user = _users.find((u) => u.email === email);
    const expectedPw = _credentials[email];
    if (user && expectedPw && password === expectedPw) {
      set({ currentUser: user, isAuthenticated: true, authError: null });
      return { success: true, role: user.role };
    }
    set({ authError: 'Invalid email or password.' });
    return { success: false };
  },
  logout: () =>
    set({
      currentUser: null,
      isAuthenticated: false,
      selectedRequisitionId: null,
      selectedApplicantId: null,
    }),
  clearAuthError: () => set({ authError: null }),
  registerCandidate: (name, email, password) => {
    if (_users.some((u) => u.email === email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    const newUser: User = {
      id: `cnd-${Date.now()}`,
      email,
      name,
      role: 'candidate',
      initials,
      lastLogin: new Date().toISOString(),
    };
    _users.push(newUser);
    _credentials[email] = password;
    persistCandidates(_users, _credentials);
    set({ currentUser: newUser, isAuthenticated: true, authError: null });
    return { success: true };
  },

  // ── Requisitions ──────────────────────────────────────────────
  setSelectedRequisition: (id) => set({ selectedRequisitionId: id }),
  createRequisition: (data) => {
    const reqs = get().requisitions;
    const newReq: JobRequisition = {
      id: `req-${Date.now()}`,
      code: `REQ-${String(reqs.length + 1).padStart(3, '0')}`,
      title: '',
      department: 'Engineering',
      location: '',
      remote: false,
      employmentType: 'FULL_TIME',
      seniorityLevel: 'MID',
      status: 'DRAFT',
      headcount: 1,
      filledCount: 0,
      salary: { min: 0, max: 0, currency: 'USD' },
      hiringManagerId: get().currentUser?.id ?? '',
      hiringManagerName: get().currentUser?.name ?? '',
      description: '',
      requirements: [],
      niceToHave: [],
      aiScreeningEnabled: false,
      createdAt: new Date().toISOString(),
      applicationCount: 0,
      activeApplicationCount: 0,
      ...data,
    };
    const updated = [newReq, ...reqs];
    persistRequisitions(updated);
    set({ requisitions: updated });
    return newReq;
  },
  updateRequisition: (id, data) => {
    const updated = get().requisitions.map((r) => (r.id === id ? { ...r, ...data } : r));
    persistRequisitions(updated);
    set({ requisitions: updated });
  },
  updateRequisitionStatus: (id, status) => {
    const updated = get().requisitions.map((r) =>
      r.id === id
        ? { ...r, status, closedAt: ['CLOSED', 'FILLED'].includes(status) ? new Date().toISOString() : r.closedAt }
        : r
    );
    persistRequisitions(updated);
    set({ requisitions: updated });
  },

  // ── Applicants ────────────────────────────────────────────────
  setSelectedApplicant: (id) => set({ selectedApplicantId: id }),

  updateApplicantStatus: (id, status) => {
    const updatedApplicants = get().applicants.map((a) =>
      a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
    );
    const updatedReqs = recalcReqCounts(get().requisitions, updatedApplicants);
    persistApplicants(updatedApplicants);
    persistRequisitions(updatedReqs);
    set({ applicants: updatedApplicants, requisitions: updatedReqs });
  },

  addNote: (applicantId, content) => {
    const user = get().currentUser;
    const note: ApplicationNote = {
      id: `note-${Date.now()}`,
      authorName: user?.name ?? 'Unknown',
      content,
      createdAt: new Date().toISOString(),
      type: 'GENERAL',
    };
    const updated = get().applicants.map((a) =>
      a.id === applicantId ? { ...a, notes: [...a.notes, note] } : a
    );
    persistApplicants(updated);
    set({ applicants: updated });
  },

  submitApplication: (data) => {
    const user = get().currentUser;
    // Prevent duplicate applications to the same job
    const jobId = data.jobId ?? '';
    const alreadyApplied = get().applicants.some(
      (a) => a.jobId === jobId && a.candidateId === (user?.id ?? '')
    );
    if (alreadyApplied) return;

    const newApp: Applicant = {
      id: `app-${Date.now()}`,
      jobId: '',
      candidateId: user?.id ?? '',
      firstName: user?.name.split(' ')[0] ?? '',
      lastName: user?.name.split(' ').slice(1).join(' ') ?? '',
      email: user?.email ?? '',
      phone: '',
      location: '',
      status: 'RECEIVED',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      yearsOfExperience: 0,
      education: [],
      workExperience: [],
      skills: [],
      notes: [],
      interviews: [],
      source: 'DIRECT',
      ...data,
    };

    // Run AI screening immediately if enabled on this requisition
    const req = get().requisitions.find((r) => r.id === jobId);
    let finalApp = newApp;
    if (req?.aiScreeningEnabled) {
      const { aiAnalysis, nextStatus, autoInterview } = runAiScreening(newApp, req);
      const statusMsg = autoInterview
        ? 'Auto-scheduled for phone screen — manager confirmation required.'
        : nextStatus === 'UNDER_REVIEW'
        ? 'Shortlisted for hiring manager review.'
        : 'Held for manual review.';
      const aiNote: ApplicationNote = {
        id: `note-${Date.now()}-ai`,
        authorName: 'HireSync AI',
        content: `AI screening complete. Score: ${aiAnalysis.score}/100 · ${aiAnalysis.recommendation.replace(/_/g, ' ')}. ${statusMsg}`,
        createdAt: new Date().toISOString(),
        type: 'AI_GENERATED',
      };
      const interviews: InterviewStage[] = autoInterview
        ? [{ id: `iv-${Date.now()}`, type: 'PHONE_SCREEN', interviewerNames: [req.hiringManagerName], status: 'PENDING' }]
        : [];
      finalApp = { ...newApp, status: nextStatus, aiAnalysis, notes: [aiNote], interviews };
    }

    const updatedApplicants = [finalApp, ...get().applicants];
    const updatedReqs = recalcReqCounts(get().requisitions, updatedApplicants);
    persistApplicants(updatedApplicants);
    persistRequisitions(updatedReqs);
    set({ applicants: updatedApplicants, requisitions: updatedReqs });
  },

  // ── Hire action ───────────────────────────────────────────────
  hireApplicant: (applicantId) => {
    const { applicants, requisitions, currentUser } = get();
    const app = applicants.find((a) => a.id === applicantId);
    if (!app) return;
    const req = requisitions.find((r) => r.id === app.jobId);
    if (!req) return;

    const startDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const offerLetter: OfferLetter = {
      issuedAt: new Date().toISOString(),
      jobTitle: req.title,
      department: req.department,
      location: req.location,
      employmentType: req.employmentType,
      salaryDisplay: req.salary.currency.includes('/hr')
        ? `$${req.salary.min}–$${req.salary.max}/hr`
        : `$${req.salary.min.toLocaleString()}–$${req.salary.max.toLocaleString()} USD/yr`,
      startDate: startDate.toISOString(),
      hiringManagerName: req.hiringManagerName,
    };

    const hireNote: ApplicationNote = {
      id: `note-${Date.now()}-hire`,
      authorName: currentUser?.name ?? 'Hiring Manager',
      content: `Candidate approved and hired by ${currentUser?.name ?? 'hiring manager'}. Offer letter issued.`,
      createdAt: new Date().toISOString(),
      type: 'SYSTEM',
    };

    const now = new Date().toISOString();
    const updatedApplicants = applicants.map((a) => {
      if (a.id === applicantId) {
        return { ...a, status: 'HIRED' as ApplicationStatus, offerLetter, notes: [...a.notes, hireNote], updatedAt: now };
      }
      if (a.jobId === app.jobId && !['HIRED', 'REJECTED', 'WITHDRAWN'].includes(a.status)) {
        return { ...a, status: 'REJECTED' as ApplicationStatus, updatedAt: now };
      }
      return a;
    });

    const updatedReqs = requisitions.map((r) =>
      r.id === app.jobId
        ? { ...r, status: 'FILLED' as JobStatus, filledCount: (r.filledCount ?? 0) + 1, closedAt: now }
        : r
    );

    const finalReqs = recalcReqCounts(updatedReqs, updatedApplicants);
    persistApplicants(updatedApplicants);
    persistRequisitions(finalReqs);
    set({ applicants: updatedApplicants, requisitions: finalReqs });
  },

  // ── Interview scheduling ───────────────────────────────────────
  scheduleInterview: (applicantId, { type, scheduledAt, interviewerNames }) => {
    const newInterview: InterviewStage = {
      id: `iv-${Date.now()}`,
      type,
      scheduledAt,
      interviewerNames,
      status: 'SCHEDULED',
    };
    const updated = get().applicants.map((a) => {
      if (a.id !== applicantId) return a;
      const shouldAdvance = !['INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED', 'DECISION_PENDING', 'OFFER_EXTENDED', 'HIRED', 'REJECTED'].includes(a.status);
      return {
        ...a,
        status: shouldAdvance ? ('INTERVIEW_SCHEDULED' as ApplicationStatus) : a.status,
        interviews: [...a.interviews, newInterview],
        updatedAt: new Date().toISOString(),
      };
    });
    persistApplicants(updated);
    set({ applicants: updated });
  },

  requestReschedule: (applicantId, interviewId, proposedTime, reason) => {
    const updated = get().applicants.map((a) => {
      if (a.id !== applicantId) return a;
      return {
        ...a,
        interviews: a.interviews.map((iv) =>
          iv.id !== interviewId
            ? iv
            : { ...iv, rescheduleRequest: { requestedAt: new Date().toISOString(), proposedTime, reason, status: 'PENDING' as const } }
        ),
        updatedAt: new Date().toISOString(),
      };
    });
    persistApplicants(updated);
    set({ applicants: updated });
  },

  approveReschedule: (applicantId, interviewId) => {
    const updated = get().applicants.map((a) => {
      if (a.id !== applicantId) return a;
      return {
        ...a,
        interviews: a.interviews.map((iv) => {
          if (iv.id !== interviewId || !iv.rescheduleRequest) return iv;
          return { ...iv, scheduledAt: iv.rescheduleRequest.proposedTime, rescheduleRequest: { ...iv.rescheduleRequest, status: 'APPROVED' as const } };
        }),
        updatedAt: new Date().toISOString(),
      };
    });
    persistApplicants(updated);
    set({ applicants: updated });
  },

  denyReschedule: (applicantId, interviewId) => {
    const updated = get().applicants.map((a) => {
      if (a.id !== applicantId) return a;
      return {
        ...a,
        interviews: a.interviews.map((iv) => {
          if (iv.id !== interviewId || !iv.rescheduleRequest) return iv;
          return { ...iv, rescheduleRequest: { ...iv.rescheduleRequest, status: 'DENIED' as const } };
        }),
        updatedAt: new Date().toISOString(),
      };
    });
    persistApplicants(updated);
    set({ applicants: updated });
  },

  // ── Batch AI ──────────────────────────────────────────────────
  runBatchAiScreening: () => {
    const { applicants, requisitions } = get();
    const aiEnabledReqs = new Map(
      requisitions.filter((r) => r.aiScreeningEnabled).map((r) => [r.id, r])
    );

    let processed = 0;
    const ts = Date.now();
    const updatedApplicants = applicants.map((app, idx) => {
      const req = aiEnabledReqs.get(app.jobId);
      if (!req || app.aiAnalysis || app.status !== 'RECEIVED') return app;

      const { aiAnalysis, nextStatus, autoInterview } = runAiScreening(app, req);
      const statusMsg = autoInterview
        ? 'Auto-scheduled for phone screen — manager confirmation required.'
        : nextStatus === 'UNDER_REVIEW'
        ? 'Shortlisted for hiring manager review.'
        : 'Held for manual review.';
      const aiNote: ApplicationNote = {
        id: `note-${ts}-${idx}`,
        authorName: 'HireSync AI',
        content: `Batch AI screening. Score: ${aiAnalysis.score}/100 · ${aiAnalysis.recommendation.replace(/_/g, ' ')}. ${statusMsg}`,
        createdAt: new Date().toISOString(),
        type: 'AI_GENERATED',
      };
      const interviews: InterviewStage[] = autoInterview
        ? [{ id: `iv-${ts}-${idx}`, type: 'PHONE_SCREEN', interviewerNames: [req.hiringManagerName], status: 'PENDING' }]
        : app.interviews;
      processed++;
      return { ...app, status: nextStatus, aiAnalysis, notes: [...app.notes, aiNote], interviews, updatedAt: new Date().toISOString() };
    });

    if (processed === 0) return 0;
    const updatedReqs = recalcReqCounts(requisitions, updatedApplicants);
    persistApplicants(updatedApplicants);
    persistRequisitions(updatedReqs);
    set({ applicants: updatedApplicants, requisitions: updatedReqs });
    return processed;
  },

  // ── UI ────────────────────────────────────────────────────────
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
