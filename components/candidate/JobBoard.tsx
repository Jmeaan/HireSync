'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Filter, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useATSStore } from '@/store/ats-store';
import { Select } from '@/components/ui/Select';
import { formatSalaryRange, employmentTypeLabel, seniorityLabel } from '@/lib/utils';

const EMP_OPTS = [
  { value: '', label: 'All Types' },
  { value: 'FULL_TIME', label: 'Full-Time' },
  { value: 'PART_TIME', label: 'Part-Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

export function JobBoard() {
  const { requisitions, getApplicantsForCurrentUser } = useATSStore();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const myApps = getApplicantsForCurrentUser();
  const appliedJobIds = new Set(myApps.map((a) => a.jobId));

  const openJobs = requisitions.filter((r) => r.status === 'OPEN' && !appliedJobIds.has(r.id));
  const appliedJobs = requisitions.filter((r) => r.status === 'OPEN' && appliedJobIds.has(r.id));

  const allOpenJobs = requisitions.filter((r) => r.status === 'OPEN');
  const deptSet = new Set(allOpenJobs.map((r) => r.department));
  const deptOpts = [
    { value: '', label: 'All Departments' },
    ...Array.from(deptSet).map((d) => ({ value: d, label: d })),
  ];

  const filtered = openJobs.filter((r) => {
    const q = search.toLowerCase();
    if (q && !r.title.toLowerCase().includes(q) && !r.department.toLowerCase().includes(q))
      return false;
    if (deptFilter && r.department !== deptFilter) return false;
    if (typeFilter && r.employmentType !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: 28 }}>Open Positions</h1>
        <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
          {openJobs.length} positions available · UT Dallas Student Employment
        </p>
      </div>

      {/* Filters */}
      <div
        className="flex items-center gap-3 p-4"
        style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12 }}
      >
        <Filter className="w-4 h-4 shrink-0" style={{ color: '#94a3b8' }} />
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search title or department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-3 text-base text-white placeholder:text-white/25 focus:outline-none transition-all"
            style={{ background: '#13122a', border: '1px solid #2a2850', borderRadius: 8 }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2850'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>
        <div className="w-44">
          <Select options={deptOpts} value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} />
        </div>
        <div className="w-40">
          <Select options={EMP_OPTS} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} />
        </div>
        <span className="ml-auto text-sm" style={{ color: '#94a3b8' }}>
          {filtered.length} positions
        </span>
      </div>

      {/* Job table */}
      <div style={{ border: '1px solid #2a2850', borderRadius: 12, overflowX: 'auto' }}>
        <table className="hs-table w-full">
          <thead>
            <tr>
              <th>Position</th>
              <th>Department</th>
              <th>Level</th>
              <th>Type</th>
              <th>Location</th>
              <th>Pay Range</th>
              <th>Openings</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((job) => (
              <tr key={job.id}>
                <td>
                  <div>
                    <p className="font-semibold text-white">{job.title}</p>
                    <p className="text-sm font-mono" style={{ color: '#94a3b8' }}>{job.code}</p>
                  </div>
                </td>
                <td style={{ color: '#94a3b8' }}>{job.department}</td>
                <td style={{ color: '#94a3b8' }}>{seniorityLabel(job.seniorityLevel)}</td>
                <td style={{ color: '#94a3b8' }}>{employmentTypeLabel(job.employmentType)}</td>
                <td>
                  <div className="flex items-center gap-1.5" style={{ color: '#94a3b8' }}>
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {job.location}
                    {job.remote && (
                      <span className="text-sm" style={{ color: '#7c3aed' }}>(Remote)</span>
                    )}
                  </div>
                </td>
                <td className="font-mono" style={{ color: '#94a3b8' }}>
                  {formatSalaryRange(job.salary.min, job.salary.max, job.salary.currency)}
                </td>
                <td className="font-mono text-center text-white">
                  {job.headcount - job.filledCount}
                </td>
                <td>
                  <Link
                    href={`/candidate/apply/${job.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 transition-all"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: '#ffffff', borderRadius: 6 }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    Apply <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && openJobs.length > 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10" style={{ color: '#94a3b8' }}>
                  No positions matching current filters
                </td>
              </tr>
            )}
            {openJobs.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10">
                  <p className="text-base font-semibold" style={{ color: '#94a3b8' }}>No new positions available</p>
                  <p className="text-sm mt-1.5" style={{ color: '#94a3b8' }}>
                    You've applied to all open positions. Check back soon for new openings.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Applied jobs section */}
      {appliedJobs.length > 0 && (
        <div>
          <h2 className="font-bold text-white mb-3 flex items-center gap-2" style={{ fontSize: 16 }}>
            <CheckCircle2 className="w-4 h-4" style={{ color: '#22c55e' }} />
            Already Applied
          </h2>
          <div style={{ border: '1px solid #2a2850', borderRadius: 12, overflowX: 'auto', opacity: 0.6 }}>
            <table className="hs-table w-full">
              <tbody>
                {appliedJobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div>
                        <p className="font-semibold text-white">{job.title}</p>
                        <p className="text-sm font-mono" style={{ color: '#94a3b8' }}>{job.code}</p>
                      </div>
                    </td>
                    <td style={{ color: '#94a3b8' }}>{job.department}</td>
                    <td style={{ color: '#94a3b8' }}>{job.location}</td>
                    <td className="font-mono" style={{ color: '#94a3b8' }}>
                      {formatSalaryRange(job.salary.min, job.salary.max, job.salary.currency)}
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#22c55e' }}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
