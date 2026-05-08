'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Bot, Info, Pencil } from 'lucide-react';
import { useATSStore } from '@/store/ats-store';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { EmploymentType, SeniorityLevel, JobStatus, JobRequisition } from '@/lib/types';

const DEPT_SUGGESTIONS = [
  'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Finance',
  'Human Resources', 'Operations', 'Legal',
  'Office of Information Technology', 'Erik Jonsson School of Engineering',
  'Eugene McDermott Library', 'Student Affairs — Campus Recreation',
  'Student Affairs', 'Academic Affairs', 'Research',
];

const EMP_OPTS: { value: EmploymentType; label: string }[] = [
  { value: 'FULL_TIME', label: 'Full-Time' },
  { value: 'PART_TIME', label: 'Part-Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

const LEVEL_OPTS: { value: SeniorityLevel; label: string }[] = [
  { value: 'ENTRY', label: 'Entry Level' },
  { value: 'MID', label: 'Mid Level' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead' },
  { value: 'PRINCIPAL', label: 'Principal' },
  { value: 'DIRECTOR', label: 'Director' },
  { value: 'VP', label: 'VP' },
];

const STATUS_OPTS: { value: JobStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'OPEN', label: 'Open — Visible to Candidates' },
  { value: 'PAUSED', label: 'Paused — Hidden from Candidates' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'FILLED', label: 'Filled' },
];

const STEP_LABELS = ['Basic Info', 'Compensation & Location', 'Role Requirements', 'AI Pipeline'];

export function JobRequisitionForm({ initialData }: { initialData?: JobRequisition }) {
  const router = useRouter();
  const { createRequisition, updateRequisition, currentUser } = useATSStore();
  const isEdit = !!initialData;

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const initSalaryUnit = initialData?.salary.currency.includes('/hr') ? 'hourly' : 'annual';

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [department, setDepartment] = useState(initialData?.department ?? '');
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    initialData?.employmentType ?? 'FULL_TIME'
  );
  const [seniorityLevel, setSeniorityLevel] = useState<SeniorityLevel>(
    initialData?.seniorityLevel ?? 'MID'
  );
  const [headcount, setHeadcount] = useState(String(initialData?.headcount ?? 1));
  const [status, setStatus] = useState<JobStatus>(initialData?.status ?? 'DRAFT');
  const [location, setLocation] = useState(initialData?.location ?? '');
  const [remote, setRemote] = useState(initialData?.remote ?? false);
  const [salaryUnit, setSalaryUnit] = useState<'annual' | 'hourly'>(initSalaryUnit);
  const [salaryMin, setSalaryMin] = useState(initialData ? String(initialData.salary.min) : '');
  const [salaryMax, setSalaryMax] = useState(initialData ? String(initialData.salary.max) : '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements.length ? initialData.requirements : ['']
  );
  const [niceToHave, setNiceToHave] = useState<string[]>(
    initialData?.niceToHave.length ? initialData.niceToHave : ['']
  );
  const [aiEnabled, setAiEnabled] = useState(initialData?.aiScreeningEnabled ?? false);
  const [aiCriteria, setAiCriteria] = useState(initialData?.aiScreeningCriteria ?? '');
  const [publishNow, setPublishNow] = useState(false);

  const addReq = () => setRequirements((r) => [...r, '']);
  const removeReq = (i: number) => setRequirements((r) => r.filter((_, j) => j !== i));
  const updateReq = (i: number, v: string) =>
    setRequirements((r) => r.map((x, j) => (j === i ? v : x)));

  const addNice = () => setNiceToHave((r) => [...r, '']);
  const removeNice = (i: number) => setNiceToHave((r) => r.filter((_, j) => j !== i));
  const updateNice = (i: number, v: string) =>
    setNiceToHave((r) => r.map((x, j) => (j === i ? v : x)));

  const canNext = () => {
    if (step === 0) return title.trim() && department.trim();
    if (step === 1) return location.trim() && salaryMin && salaryMax;
    if (step === 2) return description.trim() && requirements.some((r) => r.trim());
    return true;
  };

  const handleSubmit = () => {
    setSubmitting(true);
    const currency = salaryUnit === 'hourly' ? 'USD/hr' : 'USD';
    const payload = {
      title,
      department,
      employmentType,
      seniorityLevel,
      headcount: parseInt(headcount) || 1,
      location,
      remote,
      salary: {
        min: parseFloat(salaryMin) || 0,
        max: parseFloat(salaryMax) || 0,
        currency,
      },
      description,
      requirements: requirements.filter((r) => r.trim()),
      niceToHave: niceToHave.filter((r) => r.trim()),
      aiScreeningEnabled: aiEnabled,
      aiScreeningCriteria: aiEnabled ? aiCriteria : undefined,
    };

    if (isEdit) {
      updateRequisition(initialData.id, {
        ...payload,
        status,
        publishedAt:
          status === 'OPEN' && !initialData.publishedAt
            ? new Date().toISOString()
            : initialData.publishedAt,
      });
      setSubmitting(false);
      router.push(`/manager/requisitions/${initialData.id}`);
    } else {
      const newStatus = publishNow ? 'OPEN' : 'DRAFT';
      const req = createRequisition({
        ...payload,
        status: newStatus,
        publishedAt: publishNow ? new Date().toISOString() : undefined,
        hiringManagerId: currentUser?.id ?? '',
        hiringManagerName: currentUser?.name ?? '',
        filledCount: 0,
      });
      setSubmitting(false);
      router.push(`/manager/requisitions/${req.id}`);
    }
  };

  const listInputStyle: React.CSSProperties = {
    flex: 1,
    height: 38,
    padding: '0 12px',
    fontSize: 14,
    background: '#13122a',
    border: '1px solid #2a2850',
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    borderRadius: 6,
  };

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        {isEdit && <Pencil className="w-4 h-4 mt-1 shrink-0" style={{ color: '#7c3aed' }} />}
        <div>
          <h1 className="font-bold text-white" style={{ fontSize: 28 }}>
            {isEdit ? `Edit: ${initialData.code}` : 'New Job Requisition'}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
            {isEdit
              ? `Editing "${initialData.title}" — save changes on the final step.`
              : 'Complete all steps to create and optionally publish this requisition.'}
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex overflow-hidden" style={{ border: '1px solid #2a2850', borderRadius: 10 }}>
        {STEP_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => i < step && setStep(i)}
            className="flex-1 text-center py-3 text-sm font-semibold transition-colors"
            style={{
              background: i === step
                ? 'linear-gradient(135deg, #7c3aed, #3b82f6)'
                : i < step
                ? 'rgba(124,58,237,0.1)'
                : '#1a1933',
              color: i === step ? '#ffffff' : i < step ? '#a78bfa' : '#94a3b8',
              cursor: i < step ? 'pointer' : 'default',
              borderRight: i < STEP_LABELS.length - 1 ? '1px solid #2a2850' : 'none',
            }}
          >
            <span className="font-mono mr-1.5 opacity-70">{i + 1}.</span>
            {label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12, padding: '24px' }}>
        {step === 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input
                label="Job Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Student IT Support Technician"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8' }}>
                Department <span style={{ color: 'rgba(148,163,184,0.5)' }}>*</span>
              </label>
              <input
                list="dept-suggestions"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Type or pick a department"
                required
                style={{ height: 42, padding: '0 12px', fontSize: 14, background: '#13122a', border: '1px solid #2a2850', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box', borderRadius: 8 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2850'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <datalist id="dept-suggestions">
                {DEPT_SUGGESTIONS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>

            <Input
              label="Headcount"
              type="number"
              min={1}
              value={headcount}
              onChange={(e) => setHeadcount(e.target.value)}
            />
            <Select
              label="Employment Type"
              options={EMP_OPTS}
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
            />
            <Select
              label="Seniority Level"
              options={LEVEL_OPTS}
              value={seniorityLevel}
              onChange={(e) => setSeniorityLevel(e.target.value as SeniorityLevel)}
            />

            {isEdit && (
              <div className="col-span-2">
                <Select
                  label="Status"
                  options={STATUS_OPTS}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as JobStatus)}
                />
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input
                label="Location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Richardson, TX"
              />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="remote"
                checked={remote}
                onChange={(e) => setRemote(e.target.checked)}
                style={{ width: 14, height: 14, accentColor: '#7c3aed', cursor: 'pointer' }}
              />
              <label htmlFor="remote" style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer', userSelect: 'none' }}>
                Remote eligible
              </label>
            </div>

            <div className="col-span-2 flex items-center gap-3">
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8' }}>
                Pay Unit
              </span>
              <div className="flex overflow-hidden" style={{ border: '1px solid #2a2850', borderRadius: 8 }}>
                <button
                  type="button"
                  onClick={() => setSalaryUnit('annual')}
                  className="px-4 py-1.5 text-sm font-semibold transition-colors"
                  style={{
                    background: salaryUnit === 'annual' ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'transparent',
                    color: salaryUnit === 'annual' ? '#fff' : '#94a3b8',
                    borderRight: '1px solid #2a2850',
                  }}
                >
                  Annual
                </button>
                <button
                  type="button"
                  onClick={() => setSalaryUnit('hourly')}
                  className="px-4 py-1.5 text-sm font-semibold transition-colors"
                  style={{
                    background: salaryUnit === 'hourly' ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'transparent',
                    color: salaryUnit === 'hourly' ? '#fff' : '#94a3b8',
                  }}
                >
                  Hourly
                </button>
              </div>
            </div>

            <Input
              label={salaryUnit === 'hourly' ? 'Min Rate ($/hr)' : 'Salary Min (USD)'}
              required
              type="number"
              min={0}
              step={salaryUnit === 'hourly' ? '0.5' : '1000'}
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder={salaryUnit === 'hourly' ? 'e.g. 12' : 'e.g. 80000'}
            />
            <Input
              label={salaryUnit === 'hourly' ? 'Max Rate ($/hr)' : 'Salary Max (USD)'}
              required
              type="number"
              min={0}
              step={salaryUnit === 'hourly' ? '0.5' : '1000'}
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder={salaryUnit === 'hourly' ? 'e.g. 15' : 'e.g. 110000'}
            />
          </div>
        )}

        {step === 2 && (
          <>
            <Textarea
              label="Role Description"
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, team context, and key responsibilities…"
            />

            <div className="mt-5">
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>
                Requirements <span style={{ color: 'rgba(148,163,184,0.5)' }}>*</span>
              </p>
              <div className="space-y-2">
                {requirements.map((r, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={r}
                      onChange={(e) => updateReq(i, e.target.value)}
                      placeholder={`Requirement ${i + 1}`}
                      style={listInputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2850'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    <button
                      onClick={() => removeReq(i)}
                      disabled={requirements.length === 1}
                      style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: requirements.length === 1 ? 'not-allowed' : 'pointer', opacity: requirements.length === 1 ? 0.3 : 1, padding: 0 }}
                      onMouseEnter={(e) => { if (requirements.length > 1) e.currentTarget.style.color = '#ef4444'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addReq}
                className="mt-2 flex items-center gap-1 text-sm transition-colors"
                style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                <Plus className="w-3.5 h-3.5" /> Add requirement
              </button>
            </div>

            <div className="mt-5">
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>
                Nice to Have
              </p>
              <div className="space-y-2">
                {niceToHave.map((r, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={r}
                      onChange={(e) => updateNice(i, e.target.value)}
                      placeholder={`Nice-to-have ${i + 1}`}
                      style={listInputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2850'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    <button
                      onClick={() => removeNice(i)}
                      style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addNice}
                className="mt-2 flex items-center gap-1 text-sm transition-colors"
                style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                <Plus className="w-3.5 h-3.5" /> Add nice-to-have
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ border: '1px solid rgba(124,58,237,0.25)', padding: 20, background: 'rgba(124,58,237,0.04)', borderRadius: 10 }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="w-4 h-4" style={{ color: '#7c3aed' }} />
                    <h3 className="text-base font-bold text-white">
                      Agentic AI Screening Pipeline
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed max-w-md" style={{ color: '#94a3b8' }}>
                    When enabled, incoming applications are automatically processed by the HireSync
                    AI model. Each applicant receives a score (0–100), a recommendation, a skills
                    match analysis, and flags. Human decision authority is always maintained.
                  </p>
                </div>
                <button
                  onClick={() => setAiEnabled((v) => !v)}
                  className="shrink-0 w-12 h-6 flex items-center transition-all"
                  style={{
                    background: aiEnabled ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'rgba(42,40,80,0.8)',
                    border: `1px solid ${aiEnabled ? 'rgba(124,58,237,0.5)' : '#2a2850'}`,
                    borderRadius: 9999,
                  }}
                  role="switch"
                  aria-checked={aiEnabled}
                >
                  <span
                    className="w-5 h-5 transition-transform"
                    style={{
                      background: '#ffffff',
                      borderRadius: 9999,
                      transform: aiEnabled ? 'translateX(26px)' : 'translateX(2px)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                  />
                </button>
              </div>

              {aiEnabled && (
                <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(124,58,237,0.15)' }}>
                  <div className="flex items-start gap-2 mb-3">
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#7c3aed' }} />
                    <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                      Provide specific screening criteria. Include hard requirements, preferred
                      signals, and automatic rejection conditions. Be precise.
                    </p>
                  </div>
                  <Textarea
                    label="AI Screening Criteria"
                    rows={6}
                    value={aiCriteria}
                    onChange={(e) => setAiCriteria(e.target.value)}
                    placeholder="e.g. Require active UT Dallas enrollment. Prioritize candidates with prior technical support experience. Flag any candidate below 2.5 GPA…"
                  />
                </div>
              )}
            </div>

            {!isEdit && (
              <div className="flex items-center gap-3 p-4 mt-4" style={{ border: '1px solid #2a2850', background: 'rgba(42,40,80,0.3)', borderRadius: 8 }}>
                <input
                  type="checkbox"
                  id="publish"
                  checked={publishNow}
                  onChange={(e) => setPublishNow(e.target.checked)}
                  style={{ width: 14, height: 14, accentColor: '#7c3aed', cursor: 'pointer' }}
                />
                <label htmlFor="publish" style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer', userSelect: 'none' }}>
                  <span style={{ fontWeight: 700, color: '#a78bfa' }}>Publish immediately</span> — make
                  this requisition live and visible to candidates now. Leave unchecked to save as
                  Draft.
                </label>
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={() =>
            step === 0
              ? router.push(
                  isEdit ? `/manager/requisitions/${initialData?.id}` : '/manager/requisitions'
                )
              : setStep((s) => s - 1)
          }
        >
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
            Continue
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={submitting}>
            {isEdit ? 'Save Changes' : publishNow ? 'Create & Publish' : 'Save as Draft'}
          </Button>
        )}
      </div>
    </div>
  );
}
