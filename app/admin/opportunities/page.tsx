import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BriefcaseBusiness, Database, PlusCircle } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
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

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-4xl">
              <p className="eyebrow-dark">Admin data quality</p>

              <h1 className="page-title-dark mt-6">
                Opportunity review dashboard.
              </h1>

              <p className="lead-text-dark mt-6 max-w-3xl">
                Review real opportunity listings by visibility, verification
                status, employer, source, and data quality. Keep public listings
                useful, current, and trustworthy before seekers rely on them.
              </p>
            </div>

            <Link
              href="/admin"
              className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
            >
              Back to admin
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <AdminOpportunityMetrics stats={stats} />

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
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-8">
              <BriefcaseBusiness className="h-10 w-10 text-orange-600" />

              <h3 className="mt-5 text-2xl font-bold text-slate-950">
                No matching opportunities
              </h3>

              <p className="muted-text mt-3 max-w-2xl">
                No listings match the current filters. Clear filters or create a
                real opportunity from a trusted source.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/admin/opportunities/new" className="btn-dark">
                  <PlusCircle className="h-4 w-4" />
                  Add opportunity
                </Link>

                <Link href="/admin/opportunity-sources" className="btn-outline">
                  Manage sources
                  <Database className="h-4 w-4" />
                </Link>

                <Link href="/admin/opportunities" className="btn-outline">
                  Clear filters
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}