import type { Metadata } from 'next'
import Link from 'next/link'
import { BriefcaseBusiness, Database, PlusCircle } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import PageHero from '@/components/ui/PageHero'
import BackLink from '@/components/ui/BackLink'
import EmptyState from '@/components/ui/EmptyState'
import NextStepPanel from '@/components/ui/NextStepPanel'
import AdminOpportunityMetrics from '@/components/admin/opportunities/AdminOpportunityMetrics'
import AdminOpportunityFilters from '@/components/admin/opportunities/AdminOpportunityFilters'
import AdminOpportunityReviewCard from '@/components/admin/opportunities/AdminOpportunityReviewCard'
import { getAdminOpportunitiesPageData } from '@/lib/admin/get-admin-opportunities-page-data'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Manage Opportunities — ${siteConfig.name}`,
  description: 'Admin review page for opportunity listing data quality.',
}

type AdminOpportunitiesPageProps = {
  searchParams?: {
    q?: string | string[]
    status?: string | string[]
    verification?: string | string[]
    source?: string | string[]
    employer?: string | string[]
  }
}

export default async function AdminOpportunitiesPage({
  searchParams,
}: AdminOpportunitiesPageProps) {
  const { opportunities, employers, sources, filters, stats } =
    await getAdminOpportunitiesPageData(searchParams)

  const hasFilters =
    Boolean(filters.q) ||
    filters.status !== 'all' ||
    filters.verification !== 'all' ||
    filters.source !== 'all' ||
    filters.employer !== 'all'

  return (
    <main className="page-shell">
      <SiteNavbar />

      <PageHero
        eyebrow="Admin opportunity review"
        title="Keep opportunity listings useful, current, and trustworthy."
        description="Review real opportunity listings by visibility, verification status, employer, source, and data quality before seekers rely on them."
        actions={<BackLink href="/admin" label="Back to admin" variant="light" />}
      />

      <section className="section-light pb-20">
        <div className="section-shell">
          <AdminOpportunityMetrics stats={stats} />

          <div className="mt-8">
            <NextStepPanel
              title="Create only real listings from real employers and trusted sources."
              description="If the opportunity pipeline is thin, start by reviewing sources and adding one high-quality sourced listing. Do not add filler records just to increase volume."
              primaryHref="/admin/opportunities/new"
              primaryLabel="Add opportunity"
              secondaryHref="/admin/opportunity-sources"
              secondaryLabel="Manage sources"
              icon={<BriefcaseBusiness className="h-6 w-6" />}
            />
          </div>

          <div className="mt-8">
            <AdminOpportunityFilters
              filters={filters}
              employers={employers}
              sources={sources}
            />
          </div>

          {opportunities.length > 0 ? (
            <div className="mt-8 grid gap-5">
              {opportunities.map((opportunity) => (
                <AdminOpportunityReviewCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                icon={<BriefcaseBusiness className="h-6 w-6" />}
                title={
                  hasFilters
                    ? 'No opportunities match these filters'
                    : 'No opportunities yet'
                }
                description={
                  hasFilters
                    ? 'Clear the filters or adjust the review controls to see more listings.'
                    : 'Start by creating one real opportunity from a trusted source and connecting it to a real employer profile.'
                }
                primaryHref={
                  hasFilters ? '/admin/opportunities' : '/admin/opportunities/new'
                }
                primaryLabel={hasFilters ? 'Clear filters' : 'Add opportunity'}
                secondaryHref="/admin/opportunity-sources"
                secondaryLabel="Manage sources"
              />
            </div>
          )}

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/15">
                <Database className="h-8 w-8" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Review standard
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Quality beats volume.
                </h2>

                <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                  A smaller set of current, sourced, real listings is more
                  valuable than a broad list of stale or unclear opportunities.
                  Review inactive, stale, and unverified records before showing
                  them publicly.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/admin/data-expansion" className="btn-light">
                    Open data expansion
                  </Link>

                  <Link
                    href="/admin/opportunity-sources"
                    className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
                  >
                    Review sources
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}