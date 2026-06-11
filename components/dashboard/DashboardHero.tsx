import Link from 'next/link'
import { ArrowRight, Compass, Rocket, Trophy, Zap } from 'lucide-react'
import { siteConfig } from '@/config/site'

export default function DashboardHero() {
  return (
    <section className="hero-dark border-b border-[var(--border)]">
      <div className="hero-fade" />

      <div className="section-shell relative py-16 md:py-20">
        <div className="max-w-4xl">
          <p className="eyebrow-dark">
            <Zap className="h-3.5 w-3.5 text-[var(--amber)]" />
            Dashboard
          </p>

          <h1 className="mt-6 font-display text-5xl font-black leading-none tracking-tight text-[var(--text-primary)] sm:text-6xl">
            Welcome to <span className="text-[var(--cyan)]">{siteConfig.name}</span>
          </h1>

          <p className="mt-5 max-w-3xl text-xl leading-8 text-[var(--text-secondary)]">
            Continue comparing career paths, review your quiz results, and build
            your career readiness.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/dashboard/profile" className="btn-outline rounded-[var(--radius-md)] sm:min-w-64">
              Start mission
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link href="/trades" className="btn-outline rounded-[var(--radius-md)] sm:min-w-64">
              Explore careers
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <HeroStat icon={Compass} label="Path clarity" value="Compare" />
          <HeroStat icon={Trophy} label="Readiness XP" value="Build" />
          <HeroStat icon={Rocket} label="Applications" value="Launch" />
        </div>
      </div>
    </section>
  )
}

function HeroStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Compass
  label: string
  value: string
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-base)]/70 p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] bg-[var(--cyan-muted)] text-[var(--cyan)]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">
            {label}
          </p>
          <p className="font-display text-xl font-black text-[var(--text-primary)]">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}
