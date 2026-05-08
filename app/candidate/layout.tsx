'use client';

import { EnterpriseLayout } from '@/components/layout/EnterpriseLayout';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return <EnterpriseLayout role="candidate">{children}</EnterpriseLayout>;
}
