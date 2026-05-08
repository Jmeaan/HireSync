'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ArrowRight, Bot, Filter, Pencil } from 'lucide-react';
import { useATSStore } from '@/store/ats-store';
import { Button } from '@/components/ui/Button';
import { JobStatusBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { formatDate, formatSalaryRange, employmentTypeLabel, seniorityLabel } from '@/lib/utils';
import type { JobStatus } from '@/lib/types';

const STATUS_OPTS = [
  { value: '', label: 'All Statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'OPEN', label: 'Open' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'FILLED', label: 'Filled' },
];

export function RequisitionTable() {
  const { requisitions } = useATSStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | ''>('');
  const [deptFilter, setDeptFilter] = useState('');

  const deptOptions = [
    { value: '', label: 'All Departments' },
    ...Array.from(new Set(requisitions.map((r) => r.department)))
      .sort()
      .map((d) => ({ value: d, label: d })),
  ];

  const filtered = requisitions.filter((r) => {
    const q = search.toLowerCase();
    if (
      q &&
      !r.title.toLowerCase().includes(q) &&
      !r.code.toLowerCase().includes(q) &&
      !r.department.toLowerCase().includes(q)
    )
      return false;
    if (statusFilter && r.status !== statusFilter) return false;
    if (deptFilter && r.department !== deptFilter) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-white" style={{ fontSize: 28 }}>
            Job Requisitions
          </h1>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
            {filtered.length} requisitions · {requisitions.filter((r) => r.status === 'OPEN').length} open
          </p>
        </div>
        <Link href="/manager/requisitions/new">
          <Button icon={<Plus className="w-4 h-4" />}>New Requisition</Button>
        </Link>
      </div>

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
            placeholder="Search title, code, department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-3 text-base text-white placeholder:text-white/25 focus:outline-none transition-all"
            style={{ background: '#13122a', border: '1px solid #2a2850', borderRadius: 8 }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2850'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>
        <div className="w-40">
          <Select
            options={STATUS_OPTS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as JobStatus | '')}
          />
        </div>
        <div className="w-52">
          <Select
            options={deptOptions}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          />
        </div>
        {(search || statusFilter || deptFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); setDeptFilter(''); }}
            className="text-sm font-medium transition-colors"
            style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ border: '1px solid #2a2850', borderRadius: 12, overflowX: 'auto' }}>
        <table className="hs-table w-full">
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Department</th>
              <th>Level</th>
              <th>Type</th>
              <th>Location</th>
              <th>Salary / Rate</th>
              <th className="text-center">HC</th>
              <th className="text-center">Apps</th>
              <th className="text-center">Active</th>
              <th>Status</th>
              <th>AI</th>
              <th>Hiring Manager</th>
              <th>Published</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((req) => (
              <tr key={req.id}>
                <td>
                  <span className="font-mono" style={{ color: '#94a3b8' }}>{req.code}</span>
                </td>
                <td>
                  <Link
                    href={`/manager/requisitions/${req.id}`}
                    className="font-semibold text-white transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
                  >
                    {req.title}
                  </Link>
                </td>
                <td style={{ color: '#94a3b8' }}>{req.department}</td>
                <td style={{ color: '#94a3b8' }}>{seniorityLabel(req.seniorityLevel)}</td>
                <td style={{ color: '#94a3b8' }}>{employmentTypeLabel(req.employmentType)}</td>
                <td style={{ color: '#94a3b8' }}>
                  {req.location}
                  {req.remote && <span className="ml-1 text-sm" style={{ color: '#7c3aed' }}>(R)</span>}
                </td>
                <td className="font-mono" style={{ color: '#94a3b8' }}>
                  {formatSalaryRange(req.salary.min, req.salary.max, req.salary.currency)}
                </td>
                <td className="text-center font-mono text-white">{req.headcount}</td>
                <td className="text-center font-mono text-white">{req.applicationCount}</td>
                <td className="text-center font-mono text-white">{req.activeApplicationCount}</td>
                <td><JobStatusBadge status={req.status} /></td>
                <td>
                  {req.aiScreeningEnabled ? (
                    <Bot className="w-4 h-4" style={{ color: '#22c55e' }} />
                  ) : (
                    <span style={{ color: '#94a3b8' }}>—</span>
                  )}
                </td>
                <td style={{ color: '#94a3b8' }}>{req.hiringManagerName}</td>
                <td className="font-mono" style={{ color: '#94a3b8' }}>
                  {req.publishedAt ? formatDate(req.publishedAt) : '—'}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/manager/requisitions/${req.id}/edit`}
                      className="transition-colors"
                      style={{ color: '#94a3b8' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/manager/requisitions/${req.id}`}
                      className="transition-colors"
                      style={{ color: '#94a3b8' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                      title="View pipeline"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={15} className="text-center py-10" style={{ color: '#94a3b8' }}>
                  No requisitions matching current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
