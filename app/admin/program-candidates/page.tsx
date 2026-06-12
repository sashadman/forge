import type { Metadata } from 'next'
import Link from 'next/link'
import { ClipboardCheck, Database, GraduationCap, Search } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import PageHero from '@/components/ui/PageHero'
import NextStepPanel from '@/components/ui/NextStepPanel'
import { getProgramCandidatesForReview } from '@/app/actions/program-candidates'
import {
  ProgramCandidateReviewTable,
  type ProgramCandidateReviewRow,
} from '@/components/admin/program-candidate-review-table'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Program Candidate Review — ${siteConfig.name}`,
  description:
    'Review imported training program candidates before publishing them into the public program directory.',
}

type AdminProgramCandidatesPageProps = {
  searchParams?: Promise<{
    status?: string
    trade?: string
    search?: string
  }>
}

const statusOptions = [
  { label: 'Trusted candidates', value: 'trusted_candidate' },
  { label: 'Candidates', value: 'candidate' },
  { label: 'Needs review', value: 'needs_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Published', value: 'published' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Duplicates', value: 'duplicate' },
]

const tradeOptions = [
  { label: 'All trades', value: '' },
  { label: 'Electrical', value: 'electrical' },
  { label: 'HVAC', value: 'hvac' },
  { label: 'Plumbing', value: 'plumbing' },
  { label: 'Construction', value: 'construction' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Welding', value: 'welding' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Other', value: 'other' },
]

function getStatusLabel(value: string) {
  return statusOptions.find((option) => option.value === value)?.label ?? value
}

function getTradeLabel(value: string) {
  if (!value) return 'All trades'

  return tradeOptions.find((option) => option.value === value)?.label ?? value
}

export default async function AdminProgramCandidatesPage({
  searchParams,
}: AdminProgramCandidatesPageProps) {
  const params = await searchParams

  const status = params?.status ?? 'trusted_candidate'
  const trade = params?.trade ?? ''
  const search = params?.search ?? ''

  const candidates = (await getProgramCandidatesForReview({
    status,
    trade: trade || undefined,
    search: search || undefined,
    limit: 50,
    offset: 0,
  })) as ProgramCandidateReviewRow[]

  return (
    <main className="page-shell">
      <SiteNavbar />

      <PageHero
        eyebrow="Admin training data"
        title="Review imported program candidates before publishing."
        description="Use this queue to inspect trusted public-source records, promote useful training pathways into the public directory, and reject records outside the platform scope."
      />

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-6 md:grid-cols-3">
            <ReviewMetricCard
              icon={<ClipboardCheck className="h-7 w-7" />}
              eyebrow="Current queue"
              value={candidates.length}
              description={`Showing ${getStatusLabel(status).toLowerCase()} for ${getTradeLabel(trade).toLowerCase()}.`}
            />

            <ReviewMetricCard
              icon={<GraduationCap className="h-7 w-7" />}
              eyebrow="Publishing rule"
              value="1x"
              description="Promote one candidate at a time until bulk review tools are ready."
            />

            <ReviewMetricCard
              icon={<Database className="h-7 w-7" />}
              eyebrow="Source quality"
              value="Trusted"
              description="Candidates are staged first and published only after review."
            />
          </div>

          <div className="mt-8">
            <NextStepPanel
              eyebrow="Review workflow"
              title="Start narrow, verify carefully, then publish."
              description="Filter by trade or provider, open the source link, inspect the candidate, and only promote records that clearly serve career seekers."
              primaryHref="/admin/programs"
              primaryLabel="View published programs"
              secondaryHref="/admin/training-sources"
              secondaryLabel="Review training sources"
              icon={<ClipboardCheck className="h-6 w-6" />}
            />
          </div>

          <section className="mt-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Link
                  href="/admin"
                  className="text-sm font-semibold text-orange-700 hover:text-orange-800"
                >
                  ← Back to admin
                </Link>

                <p className="eyebrow mt-5">Candidate review queue</p>

                <h2 className="section-title mt-3">
                  Review, promote, or reject imported candidates.
                </h2>

                <p className="muted-text mt-3 max-w-3xl">
                  These are staged records from official or trusted sources.
                  They are not automatically final public programs until an
                  admin promotes them.
                </p>
              </div>
            </div>

            <div className="content-panel mt-6">
              <form className="grid gap-4 lg:grid-cols-[1fr_1fr_2fr_auto] lg:items-end">
                <label className="block">
                  <span className="eyebrow">Status</span>
                  <select
                    name="status"
                    defaultValue={status}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-600 focus:ring-4 focus:ring-orange-100"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="eyebrow">Trade</span>
                  <select
                    name="trade"
                    defaultValue={trade}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-600 focus:ring-4 focus:ring-orange-100"
                  >
                    {tradeOptions.map((option) => (
                      <option key={option.value || 'all'} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="eyebrow">Search</span>
                  <div className="relative mt-2">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="search"
                      defaultValue={search}
                      placeholder="Provider, title, institution, or CIP..."
                      className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-600 focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  className="rounded-2xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700"
                >
                  Filter queue
                </button>
              </form>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="muted-text">
                Showing{' '}
                <span className="font-bold text-slate-950">
                  {candidates.length}
                </span>{' '}
                candidates.
              </p>

              <p className="text-sm font-medium text-slate-500">
                Admin actions are protected by database functions.
              </p>
            </div>

            <div className="mt-5">
              <ProgramCandidateReviewTable candidates={candidates} />
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function ReviewMetricCard({
  icon,
  eyebrow,
  value,
  description,
}: {
  icon: React.ReactNode
  eyebrow: string
  value: number | string
  description: string
}) {
  return (
    <div className="content-panel">
      <div className="text-orange-600">{icon}</div>
      <p className="eyebrow mt-5">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold text-slate-950">{value}</h2>
      <p className="muted-text mt-3">{description}</p>
    </div>
  )
}