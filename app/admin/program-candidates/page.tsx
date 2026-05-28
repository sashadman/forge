import Link from 'next/link'
import { getProgramCandidatesForReview } from '@/app/actions/program-candidates'
import {
  ProgramCandidateReviewTable,
  type ProgramCandidateReviewRow,
} from '@/components/admin/program-candidate-review-table'

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
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-slate-600 hover:text-slate-950"
            >
              ← Back to admin
            </Link>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
              Program Candidate Review
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Review imported training program candidates before publishing them
              into the public program directory. Promote one candidate at a time
              until bulk review tools are ready.
            </p>
          </div>

          <Link
            href="/admin/programs"
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
          >
            View published programs
          </Link>
        </div>

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <form className="grid gap-4 md:grid-cols-[1fr_1fr_2fr_auto] md:items-end">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </span>
              <select
                name="status"
                defaultValue={status}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trade
              </span>
              <select
                name="trade"
                defaultValue={trade}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              >
                {tradeOptions.map((option) => (
                  <option key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Search
              </span>
              <input
                name="search"
                defaultValue={search}
                placeholder="Search provider, title, institution, or CIP..."
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
              />
            </label>

            <button
              type="submit"
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Filter
            </button>
          </form>
        </section>

        <section className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold">{candidates.length}</span>{' '}
            candidates.
          </p>

          <p className="text-xs text-slate-500">
            Actions are admin-only and backed by database functions.
          </p>
        </section>

        <ProgramCandidateReviewTable candidates={candidates} />
      </div>
    </main>
  )
}