'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const SIZE: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
};

const VARIANT_CLASS: Record<Variant, string> = {
  primary:   'text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed',
  secondary: 'text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed',
  ghost:     'text-white/60 font-medium disabled:opacity-40 disabled:cursor-not-allowed',
  danger:    'text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed',
};

const VARIANT_STYLE: Record<Variant, React.CSSProperties> = {
  primary:   { background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', borderRadius: 8, border: 'none' },
  secondary: { background: 'transparent', border: '1px solid #2a2850', borderRadius: 8 },
  ghost:     { background: 'transparent', border: '1px solid transparent', borderRadius: 8 },
  danger:    { background: 'transparent', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, color: '#f87171' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  children,
  className,
  disabled,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 tracking-wide transition-all duration-150 cursor-pointer',
        VARIANT_CLASS[variant],
        SIZE[size],
        className
      )}
      style={{ ...VARIANT_STYLE[variant], ...style }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          if (variant === 'primary') e.currentTarget.style.opacity = '0.88';
          if (variant === 'secondary') e.currentTarget.style.borderColor = '#7c3aed';
          if (variant === 'ghost') e.currentTarget.style.color = '#ffffff';
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          if (variant === 'primary') e.currentTarget.style.opacity = '1';
          if (variant === 'secondary') e.currentTarget.style.borderColor = '#2a2850';
          if (variant === 'ghost') e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
        }
        onMouseLeave?.(e);
      }}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}
