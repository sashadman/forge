import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Database, ShieldCheck } from 'lucide-react'
import AdminOpportunityCreateForm from '@/components/admin/opportunities/AdminOpportunityCreateForm'
import { getAdminOpportunityCreatePageData } from '@/lib/admin/get-admin-opportunity-create-page-data'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Create Opportunity — ${siteConfig.name}`,
  description:
    'Create a real admin-reviewed skilled-trades opportunity from a trusted source.',
}

const sourceSafetyRules = [
  'Use only real open positions from sources Ara Skills is allowed to publish.',
  'Do not copy full descriptions from job boards unless licensed.',
  'Always show the source and link to the original apply page.',
  'Do not imply employer partnership unless the employer posted or confirmed it.',
  'Remove expired jobs quickly and keep source-review records current.',
]

export default async function AdminOpportunityNewPage() {
  const { employers, sources } = await getAdminOpportunityCreatePageData()

  return (
    <main className="page-shell">
      <section className="section-light min-h-screen py-12">
        <div className="section-shell">
          <Link
            href="/admin/opportunities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 transition hover:text-orange-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to opportunities
          </Link>

          <div className="mt-8 rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Admin opportunity creation
                </p>

                <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">
                  Add real listings from trusted sources.
                </h1>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                  Create opportunity records only when they connect to a real
                  employer and a trusted external source. Every listing should
                  have source attribution and a review status.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
                <Database className="h-8 w-8 text-orange-300" />
                <p className="mt-3 text-sm font-semibold text-white">
                  {employers.length} employers · {sources.length} active sources
                </p>
              </div>
            </div>
          </div>

          <section className="mt-8 rounded-[2rem] border border-orange-200 bg-orange-50 p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-600 text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-800">
                  Source safety rules
                </p>

                <h2 className="mt-3 text-2xl font-bold text-slate-950">
                  External opportunities must stay clearly attributed.
                </h2>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {sourceSafetyRules.map((rule) => (
                    <div key={rule} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
                      <p className="text-sm font-semibold leading-6 text-slate-800">
                        {rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8">
            <AdminOpportunityCreateForm
              employers={employers}
              sources={sources}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
