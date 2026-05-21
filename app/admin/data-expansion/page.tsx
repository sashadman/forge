import type { Metadata } from 'next'
import Link from 'next/link'
import { Database, ShieldCheck } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import PageHero from '@/components/ui/PageHero'
import BackLink from '@/components/ui/BackLink'
import NextStepPanel from '@/components/ui/NextStepPanel'
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

      <PageHero
        eyebrow="Admin data expansion"
        title="Expand real listings without losing trust."
        description="Use official and trusted sources to grow the opportunity database. Every listing should be real, attributed, reviewed, and current."
        actions={<BackLink href="/admin" label="Back to admin" variant="light" />}
      />

      <section className="section-light pb-20">
        <div className="section-shell">
          <DataExpansionMetrics stats={stats} />

          <div className="mt-8">
            <NextStepPanel
              eyebrow="Operating rule"
              title="Broad does not mean careless."
              description="Grow by adding verified sources and real opportunity records, not by dumping scraped or stale listings. Start with trusted sources, preserve attribution, and review public records regularly."
              primaryHref="/admin/opportunity-sources"
              primaryLabel="Manage sources"
              secondaryHref="/admin/opportunities/new"
              secondaryLabel="Create sourced listing"
              icon={<ShieldCheck className="h-6 w-6" />}
            />
          </div>

          <div className="mt-8 grid gap-8">
            <TrustedSourceChecklist sources={sources} />

            <RealListingWorkflow recentOpportunities={recentOpportunities} />
          </div>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/15">
                <Database className="h-8 w-8" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Data integrity
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Every public record should answer: where did this come from?
                </h2>

                <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                  Keep source names, external URLs, verification status, and
                  review timing attached to opportunities. This protects seeker
                  trust and makes future scaling safer.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/admin/opportunity-sources" className="btn-light">
                    Manage sources
                  </Link>

                  <Link
                    href="/admin/opportunities"
                    className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15"
                  >
                    Review opportunities
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}