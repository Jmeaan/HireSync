'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useATSStore } from '@/store/ats-store';
import { Bot, BarChart3, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

// ── scroll-reveal hook ────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const BG = '#0f0e17';
const CARD = '#1a1933';
const BORDER = '#2a2850';
const PURPLE = '#7c3aed';
const BLUE = '#3b82f6';
const CYAN = '#06b6d4';
const WHITE = '#ffffff';

const FEATURES = [
  {
    icon: Bot,
    tag: 'AI Screening',
    headline: 'Resume scored in seconds.',
    body: 'Keyword matching against job requirements, auto-shortlisting top candidates, and instant flagging of poor fits — zero manual pass required.',
    color: PURPLE,
  },
  {
    icon: ShieldCheck,
    tag: 'Hire Flow',
    headline: 'One click to hire.',
    body: 'When you\'re ready, approve a candidate with a single click. An offer letter is auto-generated and the position closes for all other applicants instantly.',
    color: BLUE,
  },
  {
    icon: BarChart3,
    tag: 'Live Pipeline',
    headline: 'Every stage, every applicant.',
    body: 'Track from Received to Hired in real time. Rejections and status changes reflect instantly on the candidate portal — no refresh needed.',
    color: CYAN,
  },
];

const STATS = [
  { value: '< 5s', label: 'AI screening time' },
  { value: '70%', label: 'Auto-shortlist threshold' },
  { value: '100%', label: 'Pipeline transparency' },
];

export default function RootPage() {
  const { currentUser, isAuthenticated } = useATSStore();
  const router = useRouter();
  const features = useInView(0.12);
  const stats = useInView(0.2);
  const bottom = useInView(0.2);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      router.replace(currentUser.role === 'manager' ? '/manager/dashboard' : '/candidate/dashboard');
    }
  }, [isAuthenticated, currentUser, router]);

  return (
    <div style={{ background: BG, minHeight: '100vh', color: WHITE, fontFamily: 'var(--font-sans), system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: `1px solid ${BORDER}`,
        backdropFilter: 'blur(20px)',
        background: 'rgba(19,18,42,0.90)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 36px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${PURPLE}, ${BLUE})`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: WHITE }}>HS</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: WHITE }}>HireSync</span>
          </div>

          {/* Center links */}
          <div style={{ display: 'flex', gap: 40, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {['Features', 'Pipeline', 'Portals'].map((label) => (
              <NavLink key={label} label={label} />
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/candidate-login"
            style={{ background: `linear-gradient(135deg, ${PURPLE}, ${BLUE})`, color: WHITE, padding: '10px 24px', fontSize: 14, fontWeight: 600, borderRadius: 8, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'opacity 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Get Started <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{ minHeight: '93vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 32px 120px', textAlign: 'center', position: 'relative' }}>

        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: 300, height: 300, background: `radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', right: '15%', width: 260, height: 260, background: `radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)`, pointerEvents: 'none' }} />

        {/* Badge */}
        <div
          className="hs-fade-in hs-fade-in-1"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.12)', border: `1px solid rgba(124,58,237,0.3)`, borderRadius: 9999, padding: '8px 20px', marginBottom: 40 }}
        >
          <span style={{ width: 7, height: 7, background: PURPLE, borderRadius: 9999, flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600, letterSpacing: '0.04em' }}>
            AI-Powered Talent Acquisition
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="hs-fade-in hs-fade-in-2"
          style={{ fontSize: 'clamp(52px, 8vw, 88px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.035em', color: WHITE, maxWidth: 900, margin: '0 auto 30px' }}
        >
          Hire smarter.<br />
          <span style={{ background: `linear-gradient(135deg, ${PURPLE}, ${CYAN})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Move faster.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="hs-fade-in hs-fade-in-3"
          style={{ fontSize: 18, color: '#94a3b8', maxWidth: 540, lineHeight: 1.7, margin: '0 auto 52px' }}
        >
          The intelligent applicant tracking system built for UT Dallas student employment — from application to offer in one seamless pipeline.
        </p>

        {/* CTA buttons */}
        <div className="hs-fade-in hs-fade-in-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            href="/candidate-login"
            style={{ background: `linear-gradient(135deg, ${PURPLE}, ${BLUE})`, color: WHITE, padding: '16px 40px', fontSize: 16, fontWeight: 600, borderRadius: 10, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'opacity 0.15s', boxShadow: '0 0 32px rgba(124,58,237,0.35)' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            I'm a Student <ArrowRight style={{ width: 18, height: 18 }} />
          </Link>
          <Link
            href="/manager-login"
            style={{ background: 'transparent', color: WHITE, padding: '16px 40px', fontSize: 16, fontWeight: 600, borderRadius: 10, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, border: `1px solid ${BORDER}`, transition: 'border-color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = PURPLE)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
          >
            Hiring Team
          </Link>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.3 }}>
          <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, transparent, ${PURPLE})` }} />
          <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8' }}>Scroll</span>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────── */}
      <div ref={stats.ref} style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: '#13122a' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: '48px 40px', textAlign: 'center',
                borderRight: i < 2 ? `1px solid ${BORDER}` : 'none',
                opacity: stats.visible ? 1 : 0,
                transform: stats.visible ? 'none' : 'translateY(28px)',
                transition: `opacity 0.65s ease ${i * 0.1}s, transform 0.65s ease ${i * 0.1}s`,
              }}
            >
              <p style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-0.03em', background: `linear-gradient(135deg, ${PURPLE}, ${CYAN})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 10 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ───────────────────────────────────────── */}
      <section ref={features.ref} style={{ padding: '120px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 72, textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: WHITE, marginBottom: 12 }}>What HireSync does</p>
            <p style={{ fontSize: 16, color: '#94a3b8' }}>Everything you need from application to offer letter.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.tag}
                  style={{
                    background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '40px 36px',
                    opacity: features.visible ? 1 : 0,
                    transform: features.visible ? 'none' : 'translateY(52px)',
                    transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${i * 0.13}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${i * 0.13}s`,
                  }}
                >
                  <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `rgba(${f.color === PURPLE ? '124,58,237' : f.color === BLUE ? '59,130,246' : '6,182,212'},0.15)`, borderRadius: 10, marginBottom: 24 }}>
                    <Icon style={{ width: 22, height: 22, color: f.color }} />
                  </div>
                  <p style={{ fontSize: 12, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>{f.tag}</p>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: WHITE, lineHeight: 1.3, marginBottom: 14, letterSpacing: '-0.02em' }}>{f.headline}</h3>
                  <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────── */}
      <section
        ref={bottom.ref}
        style={{
          padding: '120px 32px', textAlign: 'center',
          borderTop: `1px solid ${BORDER}`,
          opacity: bottom.visible ? 1 : 0,
          transform: bottom.visible ? 'none' : 'translateY(40px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.1)', border: `1px solid rgba(124,58,237,0.25)`, borderRadius: 9999, padding: '6px 16px', marginBottom: 28 }}>
          <Zap style={{ width: 14, height: 14, color: '#a78bfa' }} />
          <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Ready to start?</span>
        </div>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, letterSpacing: '-0.03em', color: WHITE, lineHeight: 1.1, marginBottom: 52 }}>
          Your next great hire<br />is one click away.
        </h2>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/candidate-login"
            style={{ background: `linear-gradient(135deg, ${PURPLE}, ${BLUE})`, color: WHITE, padding: '16px 44px', fontSize: 16, fontWeight: 600, borderRadius: 10, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'opacity 0.15s', boxShadow: '0 0 32px rgba(124,58,237,0.3)' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Apply for a Position <ArrowRight style={{ width: 18, height: 18 }} />
          </Link>
          <Link
            href="/manager-login"
            style={{ background: 'transparent', color: WHITE, padding: '16px 44px', fontSize: 16, fontWeight: 600, borderRadius: 10, textDecoration: 'none', border: `1px solid ${BORDER}`, display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'border-color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = PURPLE)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
          >
            Manager Login
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, background: '#13122a', padding: '28px 36px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, background: `linear-gradient(135deg, ${PURPLE}, ${BLUE})`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 900, color: WHITE }}>HS</span>
            </div>
            <span style={{ fontSize: 14, color: '#94a3b8' }}>
              HireSync · UT Dallas Student Employment
            </span>
          </div>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>v3.1.4</span>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="#"
      style={{ fontSize: 15, color: hovered ? '#ffffff' : '#94a3b8', textDecoration: 'none', transition: 'color 0.15s' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </a>
  );
}
