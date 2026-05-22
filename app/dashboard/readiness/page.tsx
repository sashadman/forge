import type { Metadata } from 'next'
import { BriefcaseBusiness, ShieldCheck } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import BackLink from '@/components/ui/BackLink'
import NextStepPanel from '@/components/ui/NextStepPanel'
import {
  getCurrentUserReadinessItems,
  getCurrentUserReadinessScore,
} from '@/app/actions/readiness'
import ReadinessPanel from '@/components/dashboard/readiness/ReadinessPanel'

export const metadata: Metadata = {
  title: 'Readiness Profile',
  description:
    'Complete your readiness profile so you can take action on training programs, jobs, and apprenticeships.',
}

export default async function ReadinessPage() {
  const [items, score] = await Promise.all([
    getCurrentUserReadinessItems(),
    getCurrentUserReadinessScore(),
  ])

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <BackLink href="/dashboard" label="Back to dashboard" variant="light" />

          <div className="mt-10 max-w-4xl">
            <p className="eyebrow-dark">Readiness profile</p>

            <h1 className="page-title-dark mt-6">
              Build the profile you need before applying.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Complete your readiness items so you can move from saved training
              programs and jobs into real applications with fewer blockers.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell max-w-5xl">
          <div className="pt-8">
            <NextStepPanel
              title="Your readiness profile supports stronger applications."
              description="When you apply through the platform, your application can include a readiness snapshot. Complete the required items before applying to serious jobs or apprenticeships."
              primaryHref="/opportunities"
              primaryLabel="View jobs & apprenticeships"
              secondaryHref="/programs"
              secondaryLabel="Review training programs"
              icon={<ShieldCheck className="h-6 w-6" />}
            />
          </div>

          <div className="mt-8">
            <ReadinessPanel initialItems={items} initialScore={score} />
          </div>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/15">
                <BriefcaseBusiness className="h-8 w-8" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Application preparation
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Do not wait until the last second to prepare your profile.
                </h2>

                <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                  Resume information, intro message, experience summary, and
                  work authorization details help you move faster when a real
                  job or apprenticeship is a strong fit.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}