'use client';

import { use } from 'react';
import { useATSStore } from '@/store/ats-store';
import { JobRequisitionForm } from '@/components/manager/JobRequisitionForm';

type Props = { params: Promise<{ id: string }> };

export default function EditRequisitionPage(props: Props) {
  const { id } = use(props.params);
  const { getRequisitionById } = useATSStore();
  const req = getRequisitionById(id);

  if (!req) {
    return (
      <p className="text-xs font-mono p-4" style={{ color: 'rgba(255,255,255,0.35)' }}>REQUISITION NOT FOUND</p>
    );
  }

  return <JobRequisitionForm initialData={req} />;
}
