'use client';

import { EnterpriseLayout } from '@/components/layout/EnterpriseLayout';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <EnterpriseLayout role="manager">{children}</EnterpriseLayout>;
}
