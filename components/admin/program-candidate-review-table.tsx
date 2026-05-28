import { promoteProgramCandidate, rejectProgramCandidate } from '@/app/actions/program-candidates'

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

export function ProgramCandidateReviewTable({
  candidates,
}: ProgramCandidateReviewTableProps) {
  if (candidates.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">No candidates found</h2>
        <p className="mt-2 text-sm text-slate-600">
          Try changing the status, trade, or search filter.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Candidate
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trade
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Confidence
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Source
              </th>
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {candidates.map((candidate) => {
              const isPublished = Boolean(candidate.published_program_id)

              return (
                <tr key={candidate.id} className="align-top">
                  <td className="px-5 py-5">
                    <div className="max-w-xl">
                      <p className="font-semibold text-slate-950">{candidate.title}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {candidate.provider_name}
                      </p>
                      {candidate.institution_name &&
                        candidate.institution_name !== candidate.provider_name && (
                          <p className="mt-1 text-xs text-slate-500">
                            Institution: {candidate.institution_name}
                          </p>
                        )}
                      <p className="mt-2 text-xs text-slate-500">
                        {candidate.location ?? 'See provider'}
                        {candidate.state ? `, ${candidate.state}` : ''}
                        {candidate.cip_code ? ` · CIP ${candidate.cip_code}` : ''}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {candidate.trade_slug}
                    </span>
                    <p className="mt-2 text-xs text-slate-500">
                      {candidate.program_type}
                    </p>
                  </td>

                  <td className="px-5 py-5">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {formatStatus(candidate.verification_status)}
                    </span>
                    {isPublished && (
                      <p className="mt-2 text-xs font-medium text-blue-700">
                        Published
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-5">
                    <p className="text-sm font-semibold text-slate-950">
                      {Number(candidate.confidence_score).toFixed(0)}%
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {candidate.trust_level}
                    </p>
                  </td>

                  <td className="px-5 py-5">
                    <a
                      href={candidate.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-blue-700 hover:text-blue-900"
                    >
                      View source
                    </a>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex justify-end gap-2">
                      {!isPublished &&
                        candidate.verification_status !== 'published' &&
                        candidate.verification_status !== 'rejected' && (
                          <>
                            <form action={promoteProgramCandidate}>
                              <input
                                type="hidden"
                                name="candidateId"
                                value={candidate.id}
                              />
                              <button
                                type="submit"
                                className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
                              >
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
                                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                              >
                                Reject
                              </button>
                            </form>
                          </>
                        )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export type { ProgramCandidateReviewRow }