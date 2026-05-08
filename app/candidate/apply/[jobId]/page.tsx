'use client';

import { use } from 'react';
import { ApplicationForm } from '@/components/candidate/ApplicationForm';

export default function ApplyPage(props: PageProps<'/candidate/apply/[jobId]'>) {
  const { jobId } = use(props.params);
  return <ApplicationForm jobId={jobId} />;
}
