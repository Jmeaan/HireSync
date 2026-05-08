export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  const baseCurrency = currency.split('/')[0];
  const suffix = currency.includes('/') ? `/${currency.split('/')[1]}` : '';
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: baseCurrency,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted}${suffix}`;
}

export function formatSalaryRange(min: number, max: number, currency = 'USD'): string {
  return `${formatCurrency(min, currency)} – ${formatCurrency(max, currency)}`;
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function employmentTypeLabel(type: string): string {
  const map: Record<string, string> = {
    FULL_TIME: 'Full-Time',
    PART_TIME: 'Part-Time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
  };
  return map[type] ?? type;
}

export function seniorityLabel(level: string): string {
  const map: Record<string, string> = {
    ENTRY: 'Entry Level',
    MID: 'Mid Level',
    SENIOR: 'Senior',
    LEAD: 'Lead',
    PRINCIPAL: 'Principal',
    DIRECTOR: 'Director',
    VP: 'VP',
  };
  return map[level] ?? level;
}

export function applicationStatusLabel(status: string): string {
  const map: Record<string, string> = {
    RECEIVED: 'Received',
    SYSTEM_SCREENING: 'System Screening',
    UNDER_REVIEW: 'Under Review',
    INTERVIEW_SCHEDULED: 'Interview Scheduled',
    INTERVIEW_COMPLETED: 'Interview Completed',
    DECISION_PENDING: 'Decision Pending',
    OFFER_EXTENDED: 'Offer Extended',
    HIRED: 'Hired',
    REJECTED: 'Rejected',
    WITHDRAWN: 'Withdrawn',
  };
  return map[status] ?? status;
}
