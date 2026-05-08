'use client';

import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold"
          style={{ color: '#94a3b8' }}
        >
          {label}
          {props.required && <span className="ml-1" style={{ color: '#7c3aed' }}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={cn(
          'h-10 px-3.5 text-base text-white placeholder:text-white/25',
          'focus:outline-none transition-all duration-150',
          props.disabled && 'opacity-40 cursor-not-allowed',
          className
        )}
        style={{
          background: '#13122a',
          border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : '#2a2850'}`,
          borderRadius: 8,
          ...(props.style || {}),
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
      />
      {error && <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>}
      {hint && !error && <p className="text-sm" style={{ color: '#94a3b8' }}>{hint}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className, id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold"
          style={{ color: '#94a3b8' }}
        >
          {label}
          {props.required && <span className="ml-1" style={{ color: '#7c3aed' }}>*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        {...props}
        className={cn(
          'px-3.5 py-2.5 text-base text-white placeholder:text-white/25 resize-none',
          'focus:outline-none transition-all duration-150',
          className
        )}
        style={{
          background: '#13122a',
          border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : '#2a2850'}`,
          borderRadius: 8,
          ...(props.style || {}),
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
      />
      {error && <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>}
      {hint && !error && <p className="text-sm" style={{ color: '#94a3b8' }}>{hint}</p>}
    </div>
  );
}
