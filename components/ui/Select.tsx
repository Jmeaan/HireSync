'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-semibold"
          style={{ color: '#94a3b8' }}
        >
          {label}
          {props.required && <span className="ml-1" style={{ color: '#7c3aed' }}>*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          {...props}
          className={cn(
            'w-full h-10 pl-3.5 pr-9 text-base text-white appearance-none cursor-pointer focus:outline-none transition-all duration-150',
            props.disabled && 'opacity-40 cursor-not-allowed',
            className
          )}
          style={{
            background: '#13122a',
            border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : '#2a2850'}`,
            borderRadius: 8,
            colorScheme: 'dark',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#7c3aed';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)';
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.5)' : '#2a2850';
            e.currentTarget.style.boxShadow = 'none';
            props.onBlur?.(e);
          }}
        >
          {placeholder && (
            <option value="" disabled style={{ background: '#13122a' }}>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: '#13122a' }}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: '#94a3b8' }}
        />
      </div>
      {error && <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>}
      {hint && !error && <p className="text-sm" style={{ color: '#94a3b8' }}>{hint}</p>}
    </div>
  );
}
