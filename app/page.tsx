import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import RoleCard, { type RoleCardData } from '@/components/home/RoleCard'

export const metadata: Metadata = {
  title: `${siteConfig.name} — Training Programs, Apprenticeships, and Career Pathways`,
  description:
    'Ara Skills helps career seekers discover training programs, apprenticeships, workforce pathways, and verified opportunities by location and category.',
}

const rolePaths: RoleCardData[] = [
  {
    title: 'Career Seeker',
    label: 'Main player path',
    levelTag: 'LVL 01',
    description:
      'Explore skilled-trades careers, build readiness, compare training programs, save jobs or apprenticeships, and track applications.',
    href: '/career-seeker',
    icon: 'career-seeker',
    size: 'large',
    steps: [
      'Explore career paths',
      'Build readiness',
      'Compare training',
      'Apply to real listings',
    ],
    accentColor: 'var(--cyan)',
    accentMuted: 'var(--cyan-muted)',
    accentBorder: 'var(--border-cyan)',
    glowColor: 'rgba(0,229,255,0.12)',
  },
  {
    title: 'Employer',
    label: 'Hiring path',
    levelTag: 'HIRING',
    description:
      'Create an employer profile, post real jobs or apprenticeships, and review applicants through a dedicated employer workspace.',
    href: '/for-employers',
    icon: 'employer',
    size: 'small',
    steps: ['Create profile', 'Post listings', 'Review applicants'],
    accentColor: 'var(--amber)',
    accentMuted: 'var(--amber-muted)',
    accentBorder: 'rgba(255,179,0,0.28)',
    glowColor: 'rgba(255,179,0,0.10)',
  },
  {
    title: 'Training Provider',
    label: 'Program path',
    levelTag: 'PROVIDER',
    description:
      'Request provider access, manage verified provider information, and submit real training programs for admin review.',
    href: '/for-programs',
    icon: 'training-provider',
    size: 'small',
    steps: ['Request access', 'Verify profile', 'Submit programs'],
    accentColor: 'var(--emerald)',
    accentMuted: 'rgba(0,217,126,0.1)',
    accentBorder: 'rgba(0,217,126,0.28)',
    glowColor: 'rgba(0,217,126,0.10)',
  },
]

export default function HomePage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'var(--bg-void)', color: 'var(--text-primary)' }}
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute" style={{ top: '-12rem', left: '50%', transform: 'translateX(-50%)', width: '48rem', height: '48rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)' }} />
        <div className="absolute" style={{ bottom: '-8rem', right: '-6rem', width: '36rem', height: '36rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,179,0,0.05) 0%, transparent 70%)' }} />
        <div className="absolute" style={{ bottom: '20rem', left: '-8rem', width: '32rem', height: '32rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,217,126,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-10">

        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white" style={{ boxShadow: '0 10px 24px rgba(15,23,42,0.16)' }}>
              <Image
                src="/AraSkills-Logo.png"
                alt={`${siteConfig.name} logo`}
                width={44}
                height={44}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {siteConfig.name}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '1px' }}>
                Skilled-trades platform
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <Link href="/trades" style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Career Paths</Link>
            <Link href="/programs" style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Training</Link>
            <Link href="/opportunities" style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Jobs</Link>
          </nav>

          <Link href="/auth/sign-in" className="btn-outline" style={{ fontSize: '12px', padding: '9px 20px' }}>
            Sign in
          </Link>
        </header>

        {/* Hero content */}
        <section className="grid flex-1 content-center gap-8 py-12">

          {/* Top hero card */}
          <div className="relative overflow-hidden" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-mid)', borderRadius: '2.5rem', padding: 'clamp(28px, 5vw, 56px)' }}>
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 50% at 100% 0%, rgba(0,229,255,0.06) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 0% 100%, rgba(255,179,0,0.04) 0%, transparent 65%)' }} aria-hidden="true" />

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="eyebrow">
                  <Zap className="h-3 w-3" aria-hidden="true" />
                  Choose your path
                </span>

                <h1 className="mt-6" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                  Choose your path.{' '}
                  <span style={{ color: 'var(--cyan)' }}>Build what&apos;s next.</span>
                </h1>

                <p className="mt-6 max-w-xl" style={{ fontSize: '1.125rem', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                  Skilled trades should feel easier to explore, not harder to understand. Choose your role, enter the right path, and move through a focused experience built around careers, training, hiring, and workforce connections.
                </p>
              </div>

              {/* Platform logic panel */}
              <div style={{ background: 'var(--bg-void)', border: '1px solid var(--border)', borderRadius: '1.5rem', padding: '24px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Platform logic
                </p>
                <div style={{ display: 'grid', gap: '14px' }}>
                  {[
                    'Career seekers explore and prepare.',
                    'Employers post and review applicants.',
                    'Training providers verify and submit programs.',
                  ].map((item) => (
                    <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: 'var(--cyan)' }} aria-hidden="true" />
                      <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{item}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '20px', borderRadius: '14px', background: 'var(--cyan-muted)', border: '1px solid var(--border-cyan)', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" style={{ color: 'var(--cyan)' }} aria-hidden="true" />
                  <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                    Each path is kept separate so users do not cross into the wrong dashboard or workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Role cards — client components, hover handled inside */}
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <RoleCard role={rolePaths[0]} />
            <div className="grid gap-6">
              <RoleCard role={rolePaths[1]} />
              <RoleCard role={rolePaths[2]} />
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
