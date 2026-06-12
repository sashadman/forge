import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2, GraduationCap, ShieldCheck } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import PricingCards from '@/components/pricing/PricingCards'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Pricing — ${siteConfig.name}`,
  description:
    'Pricing for employers, training providers, and workforce partners using Ara Skills.',
}

const pricingPrinciples = [
  {
    title: 'Free for career seekers',
    description:
      'Career seekers should be able to explore pathways, save programs, and apply without a paywall.',
    icon: ShieldCheck,
  },
  {
    title: 'Paid employer tools',
    description:
      'Employers pay for reviewed opportunities, applicant workflows, and stronger hiring visibility.',
    icon: Building2,
  },
  {
    title: 'Provider visibility and accuracy',
    description:
      'Training providers pay for enhanced profiles, program updates, inquiry tracking, and analytics.',
    icon: GraduationCap,
  },
]

export default function PricingPage() {
  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative grid gap-12 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow-dark">Pricing</p>

            <h1 className="page-title-dark mt-6">
              Simple plans for organizations building skilled-trades pathways.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Career seekers use {siteConfig.name} for free. Employers, training
              providers, and workforce partners pay for visibility, workflow tools,
              verified data, and stronger hiring or training pipelines.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/employers/sign-up" className="btn-primary px-7 py-4">
                Start as employer
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="/training-providers/claim" className="btn-outline-dark px-7 py-4">
                Request provider access
              </Link>
            </div>
          </div>

          <div className="card-dark p-6 shadow-2xl shadow-black/30">
            <div className="grid gap-4">
              {pricingPrinciples.map((principle) => {
                const Icon = principle.icon

                return (
                  <div key={principle.title} className="mini-card flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border-cyan)] bg-[var(--cyan-muted)] text-[var(--cyan)]">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <h2 className="font-display text-lg font-bold tracking-tight text-[var(--text-primary)]">
                        {principle.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="section-padding">
        <div className="section-shell">
          <PricingCards />
        </div>
      </ThemedPublicSection>
    </ThemedPublicPage>
  )
}
