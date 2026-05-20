import Link from 'next/link'
import { AlertCircle, ArrowRight, CalendarDays, CheckCircle2 } from 'lucide-react'
import type { ProgramPipelineItem } from '@/components/dashboard/ProgramPipelineBoard'
import type { OpportunityPipelineItem } from '@/components/dashboard/OpportunityPipelineBoard'

type DashboardActionCenterProps = {
  programItems: ProgramPipelineItem[]
  opportunityItems: OpportunityPipelineItem[]
}

type ActionItem = {
  id: string
  type: 'program' | 'opportunity'
  title: string
  subtitle: string
  href: string
  status: string
  nextAction: string
  followUpOn: string
}

function getDaysUntil(dateValue: string) {
  if (!dateValue) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const targetDate = new Date(`${dateValue}T00:00:00`)
  targetDate.setHours(0, 0, 0, 0)

  return Math.round((targetDate.getTime() - today.getTime()) / 86_400_000)
}

function getUrgencyLabel(followUpOn: string) {
  const daysUntil = getDaysUntil(followUpOn)

  if (daysUntil === null) {
    return {
      label: 'No follow-up date',
      tone: 'neutral' as const,
    }
  }

  if (daysUntil < 0) {
    return {
      label: `Overdue by ${Math.abs(daysUntil)} day${
        Math.abs(daysUntil) === 1 ? '' : 's'
      }`,
      tone: 'danger' as const,
    }
  }

  if (daysUntil === 0) {
    return {
      label: 'Due today',
      tone: 'warning' as const,
    }
  }

  if (daysUntil <= 3) {
    return {
      label: `Due in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`,
      tone: 'warning' as const,
    }
  }

  return {
    label: `Follow up on ${followUpOn}`,
    tone: 'neutral' as const,
  }
}

function getUrgencyScore(item: ActionItem) {
  const daysUntil = getDaysUntil(item.followUpOn)

  if (daysUntil === null) return Number.MAX_SAFE_INTEGER

  return daysUntil
}

function buildActionItems({
  programItems,
  opportunityItems,
}: DashboardActionCenterProps) {
  const programActions: ActionItem[] = programItems
    .filter((item) => item.nextAction || item.followUpOn)
    .map((item) => ({
      id: `program-${item.programId}`,
      type: 'program',
      title: item.name,
      subtitle: item.providerName,
      href: `/programs/${item.slug}`,
      status: item.status,
      nextAction: item.nextAction,
      followUpOn: item.followUpOn,
    }))

  const opportunityActions: ActionItem[] = opportunityItems
    .filter((item) => item.nextAction || item.followUpOn)
    .map((item) => ({
      id: `opportunity-${item.opportunityId}`,
      type: 'opportunity',
      title: item.title,
      subtitle: item.employerName,
      href: `/opportunities/${item.slug}`,
      status: item.status,
      nextAction: item.nextAction,
      followUpOn: item.followUpOn,
    }))

  return [...programActions, ...opportunityActions].sort((a, b) => {
    const urgencyA = getUrgencyScore(a)
    const urgencyB = getUrgencyScore(b)

    if (urgencyA !== urgencyB) return urgencyA - urgencyB

    return a.title.localeCompare(b.title)
  })
}

export default function DashboardActionCenter({
  programItems,
  opportunityItems,
}: DashboardActionCenterProps) {
  const actionItems = buildActionItems({ programItems, opportunityItems })
  const overdueCount = actionItems.filter(
    (item) => getDaysUntil(item.followUpOn) !== null && getDaysUntil(item.followUpOn)! < 0
  ).length
  const dueSoonCount = actionItems.filter((item) => {
    const daysUntil = getDaysUntil(item.followUpOn)
    return daysUntil !== null && daysUntil >= 0 && daysUntil <= 3
  }).length

  return (
    <section className="content-panel">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="eyebrow">Action center</p>

          <h2 className="section-title mt-3">What needs attention next</h2>

          <p className="muted-text mt-3 max-w-2xl">
            A focused view of upcoming program and opportunity follow-ups across
            your training and career pipeline.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-56">
          <ActionStat label="Overdue" value={overdueCount} />
          <ActionStat label="Due soon" value={dueSoonCount} />
        </div>
      </div>

      {actionItems.length > 0 ? (
        <div className="mt-8 grid gap-4">
          {actionItems.slice(0, 6).map((item) => {
            const urgency = getUrgencyLabel(item.followUpOn)

            return (
              <Link
                key={item.id}
                href={item.href}
                className="group block rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-orange-200 hover:bg-orange-50"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="badge-orange">
                        {item.type === 'program' ? 'Program' : 'Opportunity'}
                      </span>

                      <span className="badge-slate">{item.status}</span>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                          urgency.tone === 'danger'
                            ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
                            : urgency.tone === 'warning'
                              ? 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
                              : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {urgency.tone === 'danger' ? (
                          <AlertCircle className="h-3.5 w-3.5" />
                        ) : (
                          <CalendarDays className="h-3.5 w-3.5" />
                        )}

                        {urgency.label}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-slate-950 transition group-hover:text-orange-700">
                      {item.title}
                    </h3>

                    <p className="mt-1 font-semibold text-slate-600">
                      {item.subtitle}
                    </p>

                    {item.nextAction && (
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        <span className="font-semibold text-slate-950">
                          Next action:
                        </span>{' '}
                        {item.nextAction}
                      </p>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-950">
                No action items yet
              </h3>

              <p className="muted-text mt-2">
                Add next actions or follow-up dates to saved programs and
                opportunities to turn this dashboard into a daily command center.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function ActionStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-center ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-orange-600">{value}</p>
    </div>
  )
}