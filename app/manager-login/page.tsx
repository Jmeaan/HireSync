'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { useATSStore } from '@/store/ats-store';

const BG = '#0f0e17';
const CARD = '#1a1933';
const BORDER = '#2a2850';
const PURPLE = '#7c3aed';
const BLUE = '#3b82f6';

export default function ManagerLoginPage() {
  const { login, logout, authError, clearAuthError } = useATSStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accessError, setAccessError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setAccessError('');
    setLoading(true);
    const result = login(email, password);
    setLoading(false);
    if (result.success && result.role === 'manager') {
      router.replace('/manager/dashboard');
    } else if (result.success && result.role !== 'manager') {
      logout();
      setAccessError('This portal is for hiring managers only. Please use the Candidate Portal to sign in.');
    }
  };

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', fontFamily: 'var(--font-sans), system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BORDER}`, padding: '0 36px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#13122a' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${PURPLE}, ${BLUE})`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>HS</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>HireSync</span>
        </Link>
        <Link
          href="/candidate-login"
          style={{ fontSize: 14, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          Applying? Candidate portal →
        </Link>
      </nav>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div className="hs-fade-in" style={{ width: '100%', maxWidth: 440 }}>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.12)', border: `1px solid rgba(124,58,237,0.3)`, borderRadius: 9999, padding: '6px 16px', marginBottom: 28 }}>
              <Sparkles style={{ width: 14, height: 14, color: '#a78bfa' }} />
              <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Hiring Manager Portal</span>
            </div>
            <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.1, margin: 0 }}>
              Manager sign in.
            </h1>
            <p style={{ fontSize: 16, color: '#94a3b8', marginTop: 12, lineHeight: 1.6 }}>
              Access the recruitment pipeline, AI screening results, and candidate management tools.
            </p>
          </div>

          {/* Card */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <NavyField
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@utdallas.edu"
                autoComplete="email"
                required
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    style={{ width: '100%', height: 48, padding: '0 48px 0 16px', fontSize: 16, background: '#13122a', border: `1px solid ${BORDER}`, borderRadius: 8, color: '#fff', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = PURPLE; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                  >
                    {showPw ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                  </button>
                </div>
              </div>

              {(authError || accessError) && (
                <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 14, color: '#f87171' }}>
                  {accessError || authError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ marginTop: 4, height: 52, background: loading ? 'rgba(124,58,237,0.5)' : `linear-gradient(135deg, ${PURPLE}, ${BLUE})`, color: '#fff', fontSize: 16, fontWeight: 600, border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'opacity 0.15s' }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity = '1'; }}
              >
                {loading ? 'Signing in…' : (<>Sign In <ArrowRight style={{ width: 18, height: 18 }} /></>)}
              </button>
            </form>
          </div>

          {/* Credential hint */}
          <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(42,40,80,0.5)', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: '#94a3b8', fontFamily: 'monospace' }}>
            demo: dal266866@utdallas.edu / UTD@2024
          </div>
        </div>
      </main>
    </div>
  );
}

function NavyField({
  label, type = 'text', value, onChange, placeholder, autoComplete, required,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  autoComplete?: string; required?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        style={{ height: 48, padding: '0 16px', fontSize: 16, background: '#13122a', border: `1px solid ${BORDER}`, borderRadius: 8, color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s' }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = 'none'; }}
      />
    </div>
  );
}
