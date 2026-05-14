import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Search,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import TradesExplorer from '@/components/trades/TradesExplorer'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Explore Skilled Trades — ${siteConfig.name}`,
  description:
    'Compare skilled trade careers, training paths, salaries, and job growth to find the right path for you.',
}

const heroCards = [
  {
    title: 'Discover',
    description: 'Learn what each trade actually does.',
    icon: Search,
  },
  {
    title: 'Prepare',
    description: 'Understand training and apprenticeship pathways.',
    icon: GraduationCap,
  },
  {
    title: 'Connect',
    description: 'Move toward programs and employers as the platform grows.',
    icon: BriefcaseBusiness,
  },
]

export default function TradesPage() {
  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-24">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Skilled trades marketplace</p>

            <h1 className="page-title-dark mt-6">
              Compare skilled trade career paths before choosing your next move.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Explore high-demand trades, understand training pathways, compare
              earning potential, and start building a practical route toward
              apprenticeships, programs, and employers.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroCards.map((card) => {
                const Icon = card.icon

                return (
                  <div key={card.title} className="card-dark">
                    <Icon className="h-6 w-6 text-orange-300" />
                    <p className="mt-4 font-bold text-white">{card.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {card.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <TradesExplorer />
        </div>
      </section>

      <section className="section-light pb-24">
        <div className="section-shell">
          <div className="dark-panel px-8 py-14 md:px-14">
            <div className="dark-panel-content grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <p className="eyebrow-dark">Need help choosing?</p>

                <h2 className="section-title-dark mt-4">
                  Find the trade that fits your strengths.
                </h2>

                <p className="lead-text-dark mt-5 max-w-2xl">
                  Take the career quiz to compare your interests, work style,
                  and goals with different skilled trade paths.
                </p>
              </div>

              <div className="flex md:justify-end">
                <Link href="/quiz" className="btn-light px-7 py-4">
                  Take the quiz
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}