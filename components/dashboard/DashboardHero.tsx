import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { siteConfig } from '@/config/site'

export default function DashboardHero() {
  return (
    <section className="hero-dark">
      <div className="hero-fade" />

      <div className="section-shell relative py-14">
        <span className="eyebrow">
          <Zap className="h-3 w-3" aria-hidden="true" />
          Dashboard
        </span>

        <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="page-title-dark mt-3">
              Welcome to{' '}
              <span style={{ color: 'var(--cyan)' }}>{siteConfig.name}</span>
            </h1>

            <p className="lead-text-dark mt-4 max-w-xl">
              Continue comparing career paths, review your quiz results, and
              build your career readiness.
            </p>
          </div>

          <Link href="/trades" className="btn-outline shrink-0">
            Explore career paths
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}