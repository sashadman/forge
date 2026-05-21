import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Database, RefreshCw, ShieldCheck } from 'lucide-react'
import OpportunitySourceForm from '@/components/admin/opportunity-sources/OpportunitySourceForm'
import OpportunitySourceCard from '@/components/admin/opportunity-sources/OpportunitySourceCard'
import { getOpportunitySourcesPageData } from '@/lib/admin/get-opportunity-sources-page-data'

export const metadata: Metadata = {
  title: 'Opportunity Sources',
  description:
    'Admin source directory for trusted skilled-trades opportunity data.',
}

export default async function AdminOpportunitySourcesPage() {
  const { sources, recentBatches, stats } =
    await getOpportunitySourcesPageData()

  return (
    <main className="page-shell">
      <section className="section-light min-h-screen py-12">
        <div className="section-shell">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 transition hover:text-orange-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to admin
          </Link>

          <div className="mt-8 rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Opportunity data foundation
                </p>

                <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">
                  Build a trusted source directory before importing broad listings.
                </h1>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                  Manage official directories, workforce boards, apprenticeship
                  sources, employer career pages, and other trusted sources that
                  power the platform’s opportunity database.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-80">
                <StatCard label="Sources" value={stats.totalSources} />
                <StatCard label="Active" value={stats.activeSources} />
                <StatCard label="Due review" value={stats.sourcesDueForReview} />
                <StatCard label="Official" value={stats.officialSources} />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <OpportunitySourceForm />
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_0.45fr]">
            <section className="space-y-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="eyebrow">Sources</p>
                  <h2 className="section-title mt-3">Trusted listing sources</h2>
                </div>
              </div>

              {sources.length > 0 ? (
                <div className="grid gap-5">
                  {sources.map((source) => (
                    <OpportunitySourceCard key={source.id} source={source} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8">
                  <Database className="h-10 w-10 text-orange-600" />

                  <h3 className="mt-5 text-2xl font-bold text-slate-950">
                    No sources yet
                  </h3>

                  <p className="muted-text mt-3 max-w-2xl">
                    Add trusted opportunity sources first. After sources are in
                    place, imports and listing review can be added safely.
                  </p>
                </div>
              )}
            </section>

            <aside className="space-y-5">
              <section className="content-panel">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-slate-950">
                  Data quality rules
                </h2>

                <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
                  <p>
                    Use official and trusted sources whenever possible. Avoid
                    copying stale listings without external verification.
                  </p>

                  <p>
                    Every imported listing should keep source attribution,
                    external URL, verification status, and review timing.
                  </p>

                  <p>
                    Broad listings are valuable only if they stay trustworthy and
                    current.
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
                    workflow comes next.
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
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  )
}