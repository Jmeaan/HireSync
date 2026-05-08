'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useATSStore } from '@/store/ats-store';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { formatSalaryRange } from '@/lib/utils';

const STEPS = ['Personal Info', 'Employment & Resume', 'Education & Skills', 'Review & Submit'];

export function ApplicationForm({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { getRequisitionById, submitApplication, currentUser } = useATSStore();
  const req = getRequisitionById(jobId);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Step 0 — Personal Info
  const [firstName, setFirstName] = useState(currentUser?.name.split(' ')[0] ?? '');
  const [lastName, setLastName] = useState(currentUser?.name.split(' ').slice(1).join(' ') ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Step 1 — Employment & Resume
  const [isEmployed, setIsEmployed] = useState(true);
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeName, setResumeName] = useState('');

  // Step 2 — Education & Skills
  const [degree, setDegree] = useState('');
  const [field, setField] = useState('');
  const [institution, setInstitution] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [skills, setSkills] = useState('');

  const canNext = () => {
    if (step === 0) return firstName.trim() && lastName.trim() && email.trim() && phone.trim() && location.trim();
    if (step === 1) return yearsExp.trim() && resumeName;
    return true;
  };

  const handleSubmit = () => {
    setSubmitting(true);
    submitApplication({
      jobId,
      candidateId: currentUser?.id ?? '',
      firstName,
      lastName,
      email,
      phone,
      location,
      linkedinUrl: linkedinUrl || undefined,
      currentCompany: isEmployed && currentCompany ? currentCompany : undefined,
      currentTitle: isEmployed && currentTitle ? currentTitle : undefined,
      yearsOfExperience: parseInt(yearsExp) || 0,
      expectedSalary: expectedSalary ? parseInt(expectedSalary) : undefined,
      noticePeriod: isEmployed ? (noticePeriod || undefined) : 'Available immediately',
      coverLetter: coverLetter || undefined,
      education: degree
        ? [{ degree, field, institution, graduationYear: parseInt(gradYear) || new Date().getFullYear() }]
        : [],
      workExperience:
        isEmployed && currentCompany
          ? [{ company: currentCompany, title: currentTitle, startDate: '', current: true, description: '' }]
          : [],
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      source: 'DIRECT',
      resumeFileName: resumeName || undefined,
    });
    setSubmitting(false);
    router.push('/candidate/applications');
  };

  if (!req) return (
    <p className="text-sm font-mono p-4" style={{ color: '#94a3b8' }}>Position not found.</p>
  );

  return (
    <div className="max-w-2xl space-y-5">
      <Link
        href="/candidate/jobs"
        className="inline-flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: '#94a3b8', textDecoration: 'none' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Jobs
      </Link>

      {/* Job header */}
      <div style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12, padding: 20 }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-mono mb-1" style={{ color: '#a78bfa' }}>{req.code}</p>
            <h1 className="text-xl font-bold text-white tracking-tight">{req.title}</h1>
            <p className="text-sm mt-1.5" style={{ color: '#94a3b8' }}>
              {req.department} · {req.location}{req.remote && ' (Remote)'} ·{' '}
              <span className="font-mono font-semibold" style={{ color: '#cbd5e1' }}>
                {formatSalaryRange(req.salary.min, req.salary.max, req.salary.currency)}
              </span>
            </p>
          </div>
          <span
            className="text-sm font-semibold px-3 py-1"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: 9999 }}
          >
            OPEN
          </span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex overflow-hidden" style={{ border: '1px solid #2a2850', borderRadius: 10 }}>
        {STEPS.map((label, i) => (
          <div
            key={i}
            className="flex-1 text-center py-3 text-sm font-semibold"
            style={{
              background: i === step
                ? 'linear-gradient(135deg, #7c3aed, #3b82f6)'
                : i < step
                ? 'rgba(124,58,237,0.1)'
                : '#1a1933',
              color: i === step ? '#fff' : i < step ? '#a78bfa' : '#94a3b8',
              borderRight: i < STEPS.length - 1 ? '1px solid #2a2850' : 'none',
            }}
          >
            <span className="font-mono mr-1 opacity-70">{i + 1}.</span>
            <span className="hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>

      {/* Form steps */}
      <div style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12, padding: 24 }}>
        {step === 0 && (
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input label="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <div className="col-span-2">
              <Input label="Email Address" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Input label="Phone Number" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (214) 555-0100" />
            <Input label="Current Location" required placeholder="City, State" value={location} onChange={(e) => setLocation(e.target.value)} />
            <div className="col-span-2">
              <Input label="LinkedIn URL" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="linkedin.com/in/yourname" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            {/* Resume upload */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>
                Resume <span style={{ color: 'rgba(148,163,184,0.5)' }}>*</span>
              </p>
              <label
                className="flex items-center gap-4 p-5 cursor-pointer transition-all"
                style={{
                  border: resumeName
                    ? '2px dashed rgba(34,197,94,0.4)'
                    : '2px dashed #2a2850',
                  background: resumeName ? 'rgba(34,197,94,0.04)' : 'rgba(42,40,80,0.3)',
                  borderRadius: 10,
                }}
              >
                {resumeName ? (
                  <>
                    <CheckCircle className="w-5 h-5 shrink-0" style={{ color: '#22c55e' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: '#22c55e' }}>{resumeName}</p>
                      <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>File selected — click to replace</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setResumeName(''); }}
                      style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ background: 'rgba(124,58,237,0.1)', borderRadius: 8 }}>
                      <Upload className="w-5 h-5" style={{ color: '#7c3aed' }} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">Upload your resume</p>
                      <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>PDF, DOC, or DOCX — max 5 MB</p>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setResumeName(file.name);
                  }}
                />
              </label>
            </div>

            {/* Employment status */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>
                Current Employment Status
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEmployed(true)}
                  className="flex-1 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    background: isEmployed ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'transparent',
                    color: isEmployed ? '#fff' : '#94a3b8',
                    border: `1px solid ${isEmployed ? 'rgba(124,58,237,0.5)' : '#2a2850'}`,
                    borderRadius: 8,
                  }}
                >
                  Currently Employed
                </button>
                <button
                  type="button"
                  onClick={() => setIsEmployed(false)}
                  className="flex-1 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    background: !isEmployed ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'transparent',
                    color: !isEmployed ? '#fff' : '#94a3b8',
                    border: `1px solid ${!isEmployed ? 'rgba(124,58,237,0.5)' : '#2a2850'}`,
                    borderRadius: 8,
                  }}
                >
                  Not Currently Employed
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {isEmployed ? (
                <>
                  <Input
                    label="Current Company"
                    value={currentCompany}
                    onChange={(e) => setCurrentCompany(e.target.value)}
                    placeholder="e.g. UT Dallas Library"
                  />
                  <Input
                    label="Current Job Title"
                    value={currentTitle}
                    onChange={(e) => setCurrentTitle(e.target.value)}
                    placeholder="e.g. Part-Time Associate"
                  />
                  <Input
                    label="Notice Period"
                    placeholder="e.g. 2 weeks, immediate"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                  />
                </>
              ) : (
                <div className="col-span-2 p-3 text-sm font-mono" style={{ background: 'rgba(42,40,80,0.5)', border: '1px solid #2a2850', color: '#94a3b8', borderRadius: 8 }}>
                  Notice Period: Available immediately
                </div>
              )}

              <Input
                label="Years of Experience"
                required
                type="number"
                min={0}
                value={yearsExp}
                onChange={(e) => setYearsExp(e.target.value)}
                hint="Total relevant work experience in years (0 is fine for first-time applicants)."
              />
              <Input
                label="Expected Pay ($/hr)"
                type="number"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="e.g. 13"
              />
            </div>

            <Textarea
              label="Cover Letter"
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Optional: explain your motivation and fit for this role — why you're a great match, relevant experience, availability…"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8' }}>
              Highest Education
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Degree" placeholder="e.g. B.S., M.S., In Progress" value={degree} onChange={(e) => setDegree(e.target.value)} />
              <Input label="Field of Study" placeholder="e.g. Computer Science" value={field} onChange={(e) => setField(e.target.value)} />
              <div className="col-span-2">
                <Input label="Institution" placeholder="e.g. University of Texas at Dallas" value={institution} onChange={(e) => setInstitution(e.target.value)} />
              </div>
              <Input label="Graduation Year" type="number" placeholder="e.g. 2026" value={gradYear} onChange={(e) => setGradYear(e.target.value)} />
            </div>
            <Input
              label="Skills & Competencies"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Comma-separated: Microsoft Office, Python, Customer Service, Spanish…"
              hint="List any skills relevant to this position, separated by commas."
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>
              Review Your Application
            </p>
            <dl style={{ border: '1px solid #2a2850', overflow: 'hidden', borderRadius: 10 }} className="space-y-0 text-sm">
              {[
                ['Name', `${firstName} ${lastName}`],
                ['Email', email],
                ['Phone', phone],
                ['Location', location],
                ['Employment Status', isEmployed ? `Employed${currentCompany ? ` at ${currentCompany}` : ''}${currentTitle ? ` — ${currentTitle}` : ''}` : 'Not currently employed'],
                ['Notice Period', isEmployed ? (noticePeriod || '—') : 'Available immediately'],
                ['Experience', yearsExp ? `${yearsExp} years` : '—'],
                ['Expected Pay', expectedSalary ? `$${expectedSalary}/hr` : '—'],
                ['Education', degree ? `${degree} ${field}${institution ? `, ${institution}` : ''}${gradYear ? ` (${gradYear})` : ''}` : '—'],
                ['Skills', skills || '—'],
                ['Resume', resumeName || '—'],
              ].map(([label, value], i) => (
                <div
                  key={label}
                  className="flex gap-3 px-4 py-2.5"
                  style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(42,40,80,0.3)' }}
                >
                  <dt className="w-36 shrink-0 font-semibold uppercase tracking-wide text-xs" style={{ color: '#94a3b8' }}>{label}</dt>
                  <dd
                    className="flex-1"
                    style={{
                      color: label === 'Resume' && value !== '—' ? '#22c55e' : '#e2e8f0',
                      fontWeight: label === 'Resume' && value !== '—' ? 600 : 400,
                    }}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="p-4" style={{ background: 'rgba(42,40,80,0.3)', border: '1px solid #2a2850', borderRadius: 8 }}>
              <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                By submitting, you confirm that all information is accurate. UT Dallas is an equal
                opportunity employer. Submission of false information is grounds for disqualification.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={() => (step === 0 ? router.push('/candidate/jobs') : setStep((s) => s - 1))}
        >
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
            Continue
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={submitting}>
            Submit Application
          </Button>
        )}
      </div>
    </div>
  );
}
