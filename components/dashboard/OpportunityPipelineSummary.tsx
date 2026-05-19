import type { OpportunityPipelineStatus } from '@/lib/supabase/app-types'

type OpportunityPipelineSummaryProps = {
  statuses: OpportunityPipelineStatus[]
}

const PIPELINE_STAGES: {
  value: OpportunityPipelineStatus
  label: string
  description: string
}[] = [
  {
    value: 'saved',
    label: 'Saved',
    description: 'Bookmarked',
  },
  {
    value: 'interested',
    label: 'Interested',
    description: 'Worth exploring',
  },
  {
    value: 'preparing',
    label: 'Preparing',
    description: 'Getting ready',
  },
  {
    value: 'applied',
    label: 'Applied',
    description: 'Submitted',
  },
  {
    value: 'interviewing',
    label: 'Interviewing',
    description: 'In contact',
  },
  {
    value: 'offer',
    label: 'Offer',
    description: 'Offer stage',
  },
  {
    value: 'closed',
    label: 'Closed',
    description: 'No longer active',
  },
]

export default function OpportunityPipelineSummary({
  statuses,
}: OpportunityPipelineSummaryProps) {
  const total = statuses.length

  const statusCounts = PIPELINE_STAGES.map((stage) => {
    const count = statuses.filter((status) => status === stage.value).length

    return {
      ...stage,
      count,
    }
  })

  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="eyebrow">Opportunity pipeline</p>

          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            {total} tracked {total === 1 ? 'opportunity' : 'opportunities'}
          </h3>

          <p className="muted-text mt-2 max-w-2xl">
            Use your pipeline to move saved opportunities from interest to
            application, interview, offer, or closed.
          </p>
        </div>

        <div className="rounded-2xl bg-white px-5 py-4 text-center ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Active pipeline
          </p>

          <p className="mt-1 text-3xl font-bold text-orange-600">{total}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statusCounts.map((stage) => (
          <div
            key={stage.value}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{stage.label}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {stage.description}
                </p>
              </div>

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                {stage.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}