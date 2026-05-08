export type UserRole = 'candidate' | 'manager';

export type ApplicationStatus =
  | 'RECEIVED'
  | 'SYSTEM_SCREENING'
  | 'UNDER_REVIEW'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_COMPLETED'
  | 'DECISION_PENDING'
  | 'OFFER_EXTENDED'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type JobStatus = 'DRAFT' | 'OPEN' | 'PAUSED' | 'CLOSED' | 'FILLED';

export type Department = string;

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
export type SeniorityLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'PRINCIPAL' | 'DIRECTOR' | 'VP';
export type AiRecommendation = 'STRONG_HIRE' | 'HIRE' | 'NEUTRAL' | 'NO_HIRE' | 'STRONG_NO_HIRE';
export type InterviewType = 'PHONE_SCREEN' | 'TECHNICAL' | 'BEHAVIORAL' | 'PANEL' | 'EXECUTIVE' | 'FINAL';
export type InterviewStatus = 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type NoteType = 'GENERAL' | 'INTERVIEW_FEEDBACK' | 'AI_GENERATED' | 'SYSTEM';
export type ApplicationSource = 'DIRECT' | 'REFERRAL' | 'LINKEDIN' | 'INDEED' | 'AGENCY' | 'INTERNAL';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: Department;
  title?: string;
  initials: string;
  lastLogin: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface JobRequisition {
  id: string;
  code: string;
  title: string;
  department: Department;
  location: string;
  remote: boolean;
  employmentType: EmploymentType;
  seniorityLevel: SeniorityLevel;
  status: JobStatus;
  headcount: number;
  filledCount: number;
  salary: SalaryRange;
  hiringManagerId: string;
  hiringManagerName: string;
  description: string;
  requirements: string[];
  niceToHave: string[];
  aiScreeningEnabled: boolean;
  aiScreeningCriteria?: string;
  createdAt: string;
  publishedAt?: string;
  closedAt?: string;
  applicationCount: number;
  activeApplicationCount: number;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  graduationYear: number;
}

export interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface RescheduleRequest {
  requestedAt: string;
  proposedTime: string;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
}

export interface InterviewStage {
  id: string;
  type: InterviewType;
  scheduledAt?: string;
  completedAt?: string;
  interviewerNames: string[];
  status: InterviewStatus;
  feedback?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  rescheduleRequest?: RescheduleRequest;
}

export interface ApplicationNote {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  type: NoteType;
}

export interface SkillMatch {
  skill: string;
  match: 'STRONG' | 'PARTIAL' | 'MISSING';
}

export interface AiAnalysis {
  score: number;
  recommendation: AiRecommendation;
  summary: string;
  skillsMatch: SkillMatch[];
  flags: string[];
  processedAt: string;
  modelVersion: string;
}

export interface OfferLetter {
  issuedAt: string;
  jobTitle: string;
  department: string;
  location: string;
  employmentType: string;
  salaryDisplay: string;
  startDate: string;
  hiringManagerName: string;
}

export interface Applicant {
  id: string;
  jobId: string;
  candidateId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  coverLetter?: string;
  yearsOfExperience: number;
  currentCompany?: string;
  currentTitle?: string;
  expectedSalary?: number;
  noticePeriod?: string;
  education: Education[];
  workExperience: WorkExperience[];
  skills: string[];
  aiAnalysis?: AiAnalysis;
  notes: ApplicationNote[];
  interviews: InterviewStage[];
  source: ApplicationSource;
  referralName?: string;
  resumeFileName?: string;
  offerLetter?: OfferLetter;
}

export interface PipelineMetrics {
  received: number;
  screening: number;
  review: number;
  interview: number;
  decision: number;
  hired: number;
  rejected: number;
}

export interface ActivityItem {
  id: string;
  type:
    | 'APPLICATION_RECEIVED'
    | 'STATUS_CHANGED'
    | 'INTERVIEW_SCHEDULED'
    | 'OFFER_EXTENDED'
    | 'HIRED'
    | 'REJECTED'
    | 'JOB_POSTED'
    | 'AI_SCREENING_COMPLETE';
  description: string;
  timestamp: string;
  meta?: string;
}

export interface DashboardMetrics {
  totalOpenRequisitions: number;
  totalHeadcountNeeded: number;
  totalActiveApplications: number;
  totalHiredThisMonth: number;
  totalHiredThisQuarter: number;
  avgTimeToFillDays: number;
  offerAcceptanceRate: number;
  applicationsByDepartment: { department: string; count: number }[];
  pipelineMetrics: PipelineMetrics;
  recentActivity: ActivityItem[];
  timeToHireByDept: { department: string; avgDays: number }[];
}
