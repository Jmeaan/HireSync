'use client';

import { use } from 'react';
import { ApplicantPipeline } from '@/components/manager/ApplicantPipeline';

export default function RequisitionPipelinePage(props: PageProps<'/manager/requisitions/[id]'>) {
  const { id } = use(props.params);
  return <ApplicantPipeline jobId={id} />;
}
