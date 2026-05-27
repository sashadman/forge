import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  Compass,
  GraduationCap,
  Search,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import NextStepPanel from '@/components/ui/NextStepPanel'
import TradesExplorer from '@/components/trades/TradesExplorer'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Career Paths — ${siteConfig.name}`,
  description:
    'Compare skilled-trades career paths, training options, earnings, and job growth to find the right direction.',
}

const heroCards = [
  {
    title: 'Discover',
    description: 'Understand what each career path actually does.',
    icon: Search,
    href: '#career-paths',
  },
  {
    title: 'Prepare',
    description: 'Connect the path to training and apprenticeship options.',
    icon: GraduationCap,
    href: '/programs',
  },
  {
    title: 'Act',
    description: 'Move toward training programs, jobs, apprenticeships.',
    icon: BriefcaseBusiness,
    href: '/opportunities',
  },
]

export default function TradesPage() {
  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-24">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Career paths</p>

            <h1 className="page-title-dark mt-6">
              Compare skilled-trades career paths before choosing your next move.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Explore high-demand skilled-trades careers, understand training
              pathways, compare earning potential, and build a practical route
              toward jobs, apprenticeships, and long-term growth.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroCards.map((card) => {
                const Icon = card.icon

                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="card-dark group transition hover:-translate-y-1 hover:border-orange-400/30"
                  >
                    <Icon className="h-6 w-6 text-orange-300" />

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="font-bold text-white">{card.title}</p>
                      <ArrowRight className="h-4 w-4 text-orange-300 transition group-hover:translate-x-1" />
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {card.description}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="pt-8">
            <NextStepPanel
              title="Start with direction, then move toward training or work."
              description="Career paths help you choose a direction. Once a path feels right, compare training programs or look for real jobs and apprenticeships."
              primaryHref="/programs"
              primaryLabel="Compare training programs"
              secondaryHref="/opportunities"
              secondaryLabel="View jobs & apprenticeships"
              icon={<Compass className="h-6 w-6" />}
            />
          </div>

          <div id="career-paths" className="mt-8 scroll-mt-28">
            <TradesExplorer />
          </div>
        </div>
      </ThemedPublicSection>

      <ThemedPublicSection className="pb-24">
        <div className="section-shell">
          <div className="dark-panel px-8 py-14 md:px-14">
            <div className="dark-panel-content grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <p className="eyebrow-dark">Need help choosing?</p>

                <h2 className="section-title-dark mt-4">
                  Match your strengths with a practical career path.
                </h2>

                <p className="lead-text-dark mt-5 max-w-2xl">
                  Take the career quiz to compare your interests, work style,
                  and goals with different skilled-trades paths.
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
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}