import type { Metadata } from 'next'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import OpportunitiesExplorer from '@/components/opportunities/OpportunitiesExplorer'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Opportunities — ${siteConfig.name}`,
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
    .order('created_at', { ascending: false })

  if (opportunitiesError) {
    console.error('Failed to load opportunities:', opportunitiesError)
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
        'Failed to load saved opportunity IDs:',
        savedOpportunitiesError
      )
    }

    savedOpportunityIds =
      savedOpportunities?.map(
        (savedOpportunity) => savedOpportunity.opportunity_id
      ) ?? []
  }

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-24">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Real opportunities</p>

            <h1 className="page-title-dark mt-6">
              Find skilled-trades opportunities when real listings become available.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Search active jobs, apprenticeships, trainee roles, and
              pre-apprenticeship opportunities. We keep this directory honest
              and do not show fake openings.
            </p>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <OpportunitiesExplorer
            opportunities={opportunities ?? []}
            savedOpportunityIds={savedOpportunityIds}
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}