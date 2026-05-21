import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Database, ShieldCheck } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import DataExpansionMetrics from '@/components/admin/data-expansion/DataExpansionMetrics'
import TrustedSourceChecklist from '@/components/admin/data-expansion/TrustedSourceChecklist'
import RealListingWorkflow from '@/components/admin/data-expansion/RealListingWorkflow'
import { getDataExpansionPageData } from '@/lib/admin/get-data-expansion-page-data'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Data Expansion — ${siteConfig.name}`,
  description:
    'Admin workflow for expanding real skilled-trades listings from trusted sources.',
}

export default async function AdminDataExpansionPage() {
  const { sources, recentOpportunities, stats } =
    await getDataExpansionPageData()

  return (
    <main className="page-shell">
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-4xl">
              <p className="eyebrow-dark">Admin data expansion</p>

              <h1 className="page-title-dark mt-6">
                Expand real listings without losing trust.
              </h1>

              <p className="lead-text-dark mt-6 max-w-3xl">
                Use official and trusted sources to grow the platform’s
                opportunity database. Every listing should be real, attributed,
                reviewed, and current.
              </p>
            </div>

            <Link
              href="/admin"
              className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to admin
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light pb-20">
        <div className="section-shell">
          <DataExpansionMetrics stats={stats} />

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                <ShieldCheck className="h-8 w-8" />
              </div>

              <div>
                <p className="eyebrow">Operating rule</p>

                <h2 className="section-title mt-3">
                  Broad does not mean careless.
                </h2>

                <p className="muted-text mt-3 max-w-4xl">
                  The platform should grow by adding verified sources and real
                  opportunity records, not by dumping scraped or stale listings.
                  Start with official sources, preserve attribution, and review
                  public listings regularly.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link href="/admin/opportunity-sources" className="btn-primary">
                    Manage sources
                    <Database className="h-4 w-4" />
                  </Link>

                  <Link href="/admin/opportunities/new" className="btn-outline">
                    Create sourced listing
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8 grid gap-8">
            <TrustedSourceChecklist sources={sources} />

            <RealListingWorkflow recentOpportunities={recentOpportunities} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}