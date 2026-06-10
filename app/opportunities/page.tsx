import type { Metadata } from 'next'
import Link from 'next/link'
import { BriefcaseBusiness, GraduationCap } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import NextStepPanel from '@/components/ui/NextStepPanel'
import OpportunitiesExplorer from '@/components/opportunities/OpportunitiesExplorer'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'

export const metadata: Metadata = {
  title: `Jobs & Apprenticeships — ${siteConfig.name}`,
  description:
    'Browse real skilled-trades jobs, apprenticeships, trainee roles, and workforce opportunities when they become available.',
}

export default async function OpportunitiesPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: opportunities, error: opportunitiesError } = await supabase
    .from('opportunities')
    .select(
      `
      id,
      title,
      slug,
      opportunity_type,
      trade_slug,
      location,
      state,
      pay_range,
      schedule,
      description,
      employers (
        name,
        slug,
        is_verified
      )
    `
    )
    .eq('is_active', true)
    .in('verification_status', [
      'source_verified',
      'admin_reviewed',
      'employer_verified',
    ])
    .order('created_at', { ascending: false })

  if (opportunitiesError) {
    console.error('Failed to load jobs and apprenticeships:', opportunitiesError)
  }

  let savedOpportunityIds: string[] = []

  if (user) {
    const { data: savedOpportunities, error: savedOpportunitiesError } =
      await supabase
        .from('saved_opportunities')
        .select('opportunity_id')
        .eq('user_id', user.id)

    if (savedOpportunitiesError) {
      console.error(
        'Failed to load saved job and apprenticeship IDs:',
        savedOpportunitiesError
      )
    }

    savedOpportunityIds =
      savedOpportunities?.map(
        (savedOpportunity) => savedOpportunity.opportunity_id
      ) ?? []
  }

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-24">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Jobs & apprenticeships</p>

            <h1 className="page-title-dark mt-6">
              Find real skilled-trades openings when they are ready to apply.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Browse active jobs, apprenticeships, trainee roles, and
              pre-apprenticeships that have been reviewed, sourced, or employer
              verified. This directory stays honest: no fake openings, no filler
              listings, and no dead-end records.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="pt-8">
            <NextStepPanel
              title="Ready to take action? Start with reviewed listings."
              description="Use this page when you want apply-now or near-apply jobs and apprenticeships that passed the public visibility gate. If you are still exploring direction or training, start with career paths or training programs first."
              primaryHref="/programs"
              primaryLabel="Compare training programs"
              secondaryHref="/trades"
              secondaryLabel="Compare career paths"
              icon={<BriefcaseBusiness className="h-6 w-6" />}
            />
          </div>

          <div className="mt-8">
            <OpportunitiesExplorer
              opportunities={opportunities ?? []}
              savedOpportunityIds={savedOpportunityIds}
            />
          </div>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950 p-8 text-white shadow-xl">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/15">
                <GraduationCap className="h-8 w-8" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Still preparing?
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Training may be the better next step before applying.
                </h2>

                <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                  If a listing requires experience, certification, tools, or
                  apprenticeship readiness, compare training programs before
                  submitting applications.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/programs" className="btn-light">
                    Compare training programs
                  </Link>

                  <Link
                    href="/trades"
                    className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
                  >
                    Compare career paths
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}