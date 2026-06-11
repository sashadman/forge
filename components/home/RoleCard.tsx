'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  UserRound,
} from 'lucide-react'

type RoleIcon = 'career-seeker' | 'employer' | 'training-provider'

const roleIcons = {
  'career-seeker': UserRound,
  employer: BriefcaseBusiness,
  'training-provider': GraduationCap,
} satisfies Record<RoleIcon, typeof UserRound>

export type RoleCardData = {
  title: string
  label: string
  levelTag: string
  description: string
  href: string
  icon: RoleIcon
  size: 'large' | 'small'
  steps: string[]
  accentColor: string
  accentMuted: string
  accentBorder: string
  glowColor: string
}

export default function RoleCard({ role }: { role: RoleCardData }) {
  const Icon = roleIcons[role.icon]
  const isLarge = role.size === 'large'

  return (
    <Link
      href={role.href}
      className="group relative overflow-hidden block"
      style={{
        borderRadius: '2.25rem',
        border: '1px solid var(--border-mid)',
        background: 'var(--bg-raised)',
        minHeight: isLarge ? '30rem' : undefined,
        padding: isLarge ? 'clamp(24px, 3.5vw, 40px)' : '28px',
        transition: 'border-color 200ms, transform 200ms, box-shadow 200ms',
        textDecoration: 'none',
        color: 'inherit',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = role.accentBorder
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = `0 16px 48px rgba(0,0,0,0.3), 0 0 32px ${role.glowColor}`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border-mid)'
        el.style.transform = 'none'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Corner glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: '-5rem',
          right: '-5rem',
          width: '18rem',
          height: '18rem',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${role.glowColor} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative flex h-full flex-col">
        {/* Top row: icon + arrow */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div
            style={{
              width: isLarge ? '60px' : '52px',
              height: isLarge ? '60px' : '52px',
              borderRadius: '16px',
              background: role.accentMuted,
              border: `1px solid ${role.accentBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: role.accentColor,
              flexShrink: 0,
            }}
          >
            <Icon style={{ width: isLarge ? '28px' : '22px', height: isLarge ? '28px' : '22px' }} />
          </div>

          {/* Arrow button */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-mid)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              flexShrink: 0,
              transition: 'background 200ms, border-color 200ms, color 200ms',
            }}
          >
            <ArrowRight style={{ width: '18px', height: '18px' }} />
          </div>
        </div>

        {/* Level tag + title + description */}
        <div style={{ marginTop: isLarge ? '36px' : '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: role.accentColor,
              background: role.accentMuted,
              border: `1px solid ${role.accentBorder}`,
              borderRadius: '6px',
              padding: '3px 8px',
              marginBottom: '14px',
            }}
          >
            {role.levelTag}
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: isLarge ? 'clamp(2rem, 4vw, 3rem)' : 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 900,
              lineHeight: 1.06,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              marginBottom: '14px',
            }}
          >
            {role.title}
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: isLarge ? '1.0625rem' : '14px',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: '480px',
            }}
          >
            {role.description}
          </p>
        </div>

        {/* Steps */}
        <div style={{ marginTop: '24px', display: 'grid', gap: '8px' }}>
          {role.steps.map((step, i) => (
            <div
              key={step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'var(--bg-base)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '12px 16px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: role.accentColor,
                  opacity: 0.8,
                  minWidth: '18px',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {step}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 'auto', paddingTop: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-display)',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: role.accentColor,
            }}
          >
            Enter {role.title} path
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </div>
        </div>
      </div>
    </Link>
  )
}
