import Link from 'next/link'
import { ArrowRight, CheckCircle2, ExternalLink, XCircle } from 'lucide-react'
import {
  promoteProgramCandidate,
  rejectProgramCandidate,
} from '@/app/actions/program-candidates'

type ProgramCandidateReviewRow = {
  id: string
  title: string
  provider_name: string
  institution_name: string | null
  program_type: string
  trade_slug: string
  location: string | null
  state: string | null
  country: string
  cip_code: string | null
  source_url: string
  verification_status: string
  trust_level: string
  confidence_score: number
  published_program_id: string | null
  created_at: string
  updated_at: string
}

type ProgramCandidateReviewTableProps = {
  candidates: ProgramCandidateReviewRow[]
}

function formatStatus(status: string) {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function statusClass(status: string) {
  if (status === 'published') {
    return 'bg-blue-50 text-blue-700 ring-blue-100'
  }

  if (status === 'rejected') {
    return 'bg-rose-50 text-rose-700 ring-rose-100'
  }

  if (status === 'trusted_candidate' || status === 'approved') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
  }

  if (status === 'needs_review') {
    return 'bg-amber-50 text-amber-700 ring-amber-100'
  }

  return 'bg-slate-100 text-slate-700 ring-slate-200'
}

export function ProgramCandidateReviewTable({
  candidates,
}: ProgramCandidateReviewTableProps) {
  if (candidates.length === 0) {
    return (
      <div className="content-panel">
        <h2 className="text-xl font-bold text-slate-950">No candidates found</h2>
        <p className="muted-text mt-2">
          Try changing the status, trade, or search filter.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <p className="text-sm font-semibold text-slate-700">
          Candidate review results
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Open a candidate for details, inspect the official source, then decide.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {candidates.map((candidate) => {
          const isPublished = Boolean(candidate.published_program_id)
          const canAct =
            !isPublished &&
            candidate.verification_status !== 'published' &&
            candidate.verification_status !== 'rejected'

          return (
            <article
              key={candidate.id}
              className="grid gap-5 p-6 transition hover:bg-orange-50/40 xl:grid-cols-[1.5fr_0.7fr_0.7fr_auto]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClass(
                      candidate.verification_status
                    )}`}
                  >
                    {formatStatus(candidate.verification_status)}
                  </span>

                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-100">
                    {candidate.trade_slug}
                  </span>

                  {isPublished && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                      Published
                    </span>
                  )}
                </div>

                <Link
                  href={`/admin/program-candidates/${candidate.id}`}
                  className="mt-4 block text-xl font-bold leading-snug text-slate-950 transition hover:text-orange-700"
                >
                  {candidate.title}
                </Link>

                <p className="mt-2 text-base font-semibold text-slate-700">
                  {candidate.provider_name}
                </p>

                {candidate.institution_name &&
                  candidate.institution_name !== candidate.provider_name && (
                    <p className="mt-1 text-sm text-slate-500">
                      Institution: {candidate.institution_name}
                    </p>
                  )}

                <p className="mt-3 text-sm text-slate-500">
                  {candidate.location ?? 'See provider'}
                  {candidate.state ? `, ${candidate.state}` : ''}
                  {candidate.cip_code ? ` · CIP ${candidate.cip_code}` : ''}
                </p>
              </div>

              <div>
                <p className="eyebrow">Type</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {candidate.program_type}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Country: {candidate.country}
                </p>
              </div>

              <div>
                <p className="eyebrow">Confidence</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {Number(candidate.confidence_score).toFixed(0)}%
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {candidate.trust_level}
                </p>
              </div>

              <div className="flex flex-col gap-2 xl:min-w-44">
                <Link
                  href={`/admin/program-candidates/${candidate.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                >
                  Details
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={candidate.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                >
                  Source
                  <ExternalLink className="h-4 w-4" />
                </a>

                {canAct && (
                  <div className="grid grid-cols-2 gap-2">
                    <form action={promoteProgramCandidate}>
                      <input
                        type="hidden"
                        name="candidateId"
                        value={candidate.id}
                      />
                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center gap-1 rounded-2xl bg-slate-950 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Promote
                      </button>
                    </form>

                    <form action={rejectProgramCandidate}>
                      <input
                        type="hidden"
                        name="candidateId"
                        value={candidate.id}
                      />
                      <input
                        type="hidden"
                        name="notes"
                        value="Rejected from admin candidate review queue."
                      />
                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center gap-1 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export type { ProgramCandidateReviewRow }