import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { siteConfig } from '@/config/site'

export default function DashboardHero() {
  return (
    <section className="hero-dark">
      <div className="hero-fade" />

      <div className="section-shell relative py-16">
        <p className="eyebrow-dark">Dashboard</p>

        <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="page-title-dark">Welcome to {siteConfig.name}</h1>

            <p className="lead-text-dark mt-4 max-w-2xl">
              Continue exploring skilled trades, review your quiz results, and
              build your career path.
            </p>
          </div>

          <Link href="/trades" className="btn-light">
            Explore trades
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}