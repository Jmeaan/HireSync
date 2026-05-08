'use client';

import { Bot, Bell, Shield } from 'lucide-react';
import { useATSStore } from '@/store/ats-store';

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-start justify-between gap-6 py-4 last:border-0"
      style={{ borderBottom: '1px solid #2a2850' }}
    >
      <div className="flex-1">
        <p className="text-base font-semibold text-white">{label}</p>
        <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div
      className="w-12 h-6 flex items-center cursor-default"
      style={{
        background: on ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'rgba(42,40,80,0.8)',
        border: `1px solid ${on ? 'rgba(124,58,237,0.5)' : '#2a2850'}`,
        borderRadius: 9999,
        transition: 'all 0.2s',
      }}
    >
      <span
        className="w-5 h-5 transition-transform"
        style={{
          background: '#ffffff',
          borderRadius: 9999,
          transform: on ? 'translateX(26px)' : 'translateX(2px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  );
}

export default function ManagerSettingsPage() {
  const { currentUser } = useATSStore();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: 28 }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
          System configuration for {currentUser?.name}
        </p>
      </div>

      {/* AI Pipeline */}
      <section style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12, overflow: 'hidden' }}>
        <div
          className="px-5 py-4 flex items-center gap-2.5"
          style={{ borderBottom: '1px solid #2a2850', background: 'rgba(124,58,237,0.08)' }}
        >
          <Bot className="w-4.5 h-4.5" style={{ color: '#7c3aed' }} />
          <h2 className="text-base font-bold" style={{ color: '#a78bfa' }}>
            AI Screening Pipeline
          </h2>
        </div>
        <div className="px-5">
          <SettingRow
            label="AI Screening Globally Active"
            description="Enables the HireSync AI screening model to process new applications on requisitions where AI is toggled on."
          >
            <Toggle on={true} />
          </SettingRow>
          <SettingRow
            label="Auto-reject Strong No-Hire"
            description="Automatically move STRONG_NO_HIRE candidates to Rejected status without manual review."
          >
            <Toggle on={false} />
          </SettingRow>
          <SettingRow
            label="AI Model Version"
            description="Model used for all AI screening analysis."
          >
            <span
              className="text-sm font-mono px-3 py-1.5"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', borderRadius: 8 }}
            >
              HireSync-Screen v2.4.1
            </span>
          </SettingRow>
        </div>
      </section>

      {/* Notifications */}
      <section style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12, overflow: 'hidden' }}>
        <div
          className="px-5 py-4 flex items-center gap-2.5"
          style={{ borderBottom: '1px solid #2a2850' }}
        >
          <Bell className="w-4 h-4" style={{ color: '#3b82f6' }} />
          <h2 className="text-base font-bold" style={{ color: '#60a5fa' }}>
            Notifications
          </h2>
        </div>
        <div className="px-5">
          <SettingRow
            label="New Application Alerts"
            description="Receive a notification when a new candidate applies to your requisitions."
          >
            <Toggle on={true} />
          </SettingRow>
          <SettingRow
            label="AI Screening Digest"
            description="Daily summary of AI screening results sent to your email."
          >
            <Toggle on={true} />
          </SettingRow>
          <SettingRow
            label="Offer Acceptance Alerts"
            description="Notify when a candidate accepts or declines an offer."
          >
            <Toggle on={false} />
          </SettingRow>
        </div>
      </section>

      {/* Account */}
      <section style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 12, overflow: 'hidden' }}>
        <div
          className="px-5 py-4 flex items-center gap-2.5"
          style={{ borderBottom: '1px solid #2a2850' }}
        >
          <Shield className="w-4 h-4" style={{ color: '#06b6d4' }} />
          <h2 className="text-base font-bold" style={{ color: '#22d3ee' }}>Account</h2>
        </div>
        <div className="px-5">
          <SettingRow label="Email Address" description="Your login email.">
            <span className="text-sm font-mono" style={{ color: '#94a3b8' }}>{currentUser?.email}</span>
          </SettingRow>
          <SettingRow label="Role" description="Your access level in HireSync.">
            <span
              className="text-sm font-semibold px-3 py-1 uppercase"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa', borderRadius: 8 }}
            >
              {currentUser?.role}
            </span>
          </SettingRow>
          <SettingRow
            label="Account ID"
            description="System identifier for your account."
          >
            <span className="text-sm font-mono" style={{ color: '#94a3b8' }}>{currentUser?.id}</span>
          </SettingRow>
        </div>
      </section>

      <p className="text-sm text-center" style={{ color: '#94a3b8' }}>
        Settings are display-only in this demo environment.
      </p>
    </div>
  );
}
