import type { Metadata } from 'next'
import { Database, RefreshCw, ShieldCheck } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import PageHero from '@/components/ui/PageHero'
import BackLink from '@/components/ui/BackLink'
import EmptyState from '@/components/ui/EmptyState'
import NextStepPanel from '@/components/ui/NextStepPanel'
import OpportunitySourceForm from '@/components/admin/opportunity-sources/OpportunitySourceForm'
import OpportunitySourceCard from '@/components/admin/opportunity-sources/OpportunitySourceCard'
import { getOpportunitySourcesPageData } from '@/lib/admin/get-opportunity-sources-page-data'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Opportunity Sources — ${siteConfig.name}`,
  description:
    'Admin source directory for trusted skilled-trades opportunity data.',
}

export default async function AdminOpportunitySourcesPage() {
  const { sources, recentBatches, stats } =
    await getOpportunitySourcesPageData()

  return (
    <main className="page-shell">
      <SiteNavbar />

      <PageHero
        eyebrow="Opportunity source management"
        title="Build the trusted source directory before scaling listings."
        description="Manage official directories, workforce boards, apprenticeship sources, employer career pages, and other trusted sources that support real opportunity discovery."
        actions={<BackLink href="/admin" label="Back to admin" variant="light" />}
      />

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Sources" value={stats.totalSources} />
            <StatCard label="Active" value={stats.activeSources} />
            <StatCard label="Due review" value={stats.sourcesDueForReview} />
            <StatCard label="Official" value={stats.officialSources} />
          </div>

          <div className="mt-8">
            <NextStepPanel
              title="Add or review sources before creating broad listings."
              description="Source quality controls the quality of the opportunity database. Review source reliability, region, search URL, and review timing before using a source for public listings."
              primaryHref="/admin/data-expansion"
              primaryLabel="Open data expansion"
              secondaryHref="/admin/opportunities/new"
              secondaryLabel="Create sourced listing"
              icon={<ShieldCheck className="h-6 w-6" />}
            />
          </div>

          <div className="mt-8">
            <OpportunitySourceForm />
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_0.45fr]">
            <section className="space-y-5">
              <div>
                <p className="eyebrow">Sources</p>
                <h2 className="section-title mt-3">Trusted listing sources</h2>
                <p className="muted-text mt-3 max-w-3xl">
                  Use these sources to create real opportunity records with
                  attribution, verification status, and review timing.
                </p>
              </div>

              {sources.length > 0 ? (
                <div className="grid gap-5">
                  {sources.map((source) => (
                    <OpportunitySourceCard key={source.id} source={source} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Database className="h-6 w-6" />}
                  title="No sources yet"
                  description="Add trusted opportunity sources first. After sources are in place, use data expansion and admin opportunity creation to grow real listings safely."
                  primaryHref="/admin/data-expansion"
                  primaryLabel="Open data expansion"
                  secondaryHref="/admin"
                  secondaryLabel="Admin home"
                />
              )}
            </section>

            <aside className="space-y-5">
              <section className="content-panel">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-slate-950">
                  Source quality rules
                </h2>

                <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
                  <p>
                    Prefer official and high-trust sources. Avoid copying stale
                    listings without external verification.
                  </p>

                  <p>
                    Every public listing should keep source attribution,
                    external URL, verification status, and review timing.
                  </p>

                  <p>
                    Broad listings only help users when they remain trustworthy
                    and current.
                  </p>
                </div>
              </section>

              <section className="content-panel">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-orange-600" />

                  <h2 className="text-xl font-bold text-slate-950">
                    Recent import batches
                  </h2>
                </div>

                {recentBatches.length > 0 ? (
                  <div className="mt-5 space-y-3">
                    {recentBatches.map((batch) => {
                      const source = Array.isArray(batch.opportunity_sources)
                        ? batch.opportunity_sources[0]
                        : batch.opportunity_sources

                      return (
                        <div
                          key={batch.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <p className="font-semibold text-slate-950">
                            {source?.name || 'Unknown source'}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            Status: {batch.status}
                          </p>

                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            Imported {batch.imported_count}, updated{' '}
                            {batch.updated_count}, skipped {batch.skipped_count},
                            errors {batch.error_count}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="muted-text mt-5">
                    No import batches yet. Source management comes first; import
                    workflow can be added only after the manual source workflow
                    is stable.
                  </p>
                )}
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="content-panel">
      <p className="eyebrow">{label}</p>
      <h2 className="mt-3 text-3xl font-bold text-slate-950">{value}</h2>
    </div>
  )
}