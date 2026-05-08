'use client';

import { use } from 'react';
import { CandidateReviewPanel } from '@/components/manager/CandidateReviewPanel';

export default function CandidateReviewPage(
  props: PageProps<'/manager/requisitions/[id]/candidates/[candidateId]'>
) {
  const { id, candidateId } = use(props.params);
  return <CandidateReviewPanel jobId={id} applicantId={candidateId} />;
}
