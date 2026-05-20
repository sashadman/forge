import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
} from 'lucide-react'
import type { OpportunityPipelineStatus } from '@/lib/supabase/app-types'
import OpportunityPipelineStatusSelect from '@/components/dashboard/OpportunityPipelineStatusSelect'
import RemoveSavedOpportunityButton from '@/components/dashboard/RemoveSavedOpportunityButton'

export type OpportunityPipelineItem = {
  opportunityId: string
  slug: string
  title: string
  opportunityType: string
  tradeSlug: string
  location: string
  state: string
  schedule: string | null
  description: string
  employerName: string
  status: OpportunityPipelineStatus
  notes: string
  nextAction: string
  followUpOn: string
}

type OpportunityPipelineBoardProps = {
  userId: string
  items: OpportunityPipelineItem[]
}

const ACTIVE_STATUSES: OpportunityPipelineStatus[] = [
  'interested',
  'preparing',
  'applied',
  'interviewing',
  'offer',
]

const STATUS_LABELS: Record<OpportunityPipelineStatus, string> = {
  saved: 'Saved',
  interested: 'Interested',
  preparing: 'Preparing',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  closed: 'Closed',
}

function formatOpportunityType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function getFollowUpPriority(item: OpportunityPipelineItem) {
  if (!item.followUpOn) return Number.MAX_SAFE_INTEGER

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const followUpDate = new Date(`${item.followUpOn}T00:00:00`)
  followUpDate.setHours(0, 0, 0, 0)

  return followUpDate.getTime() - today.getTime()
}

function sortByFollowUpPriority(items: OpportunityPipelineItem[]) {
  return [...items].sort((a, b) => {
    const priorityA = getFollowUpPriority(a)
    const priorityB = getFollowUpPriority(b)

    if (priorityA !== priorityB) return priorityA - priorityB

    return a.title.localeCompare(b.title)
  })
}

function getFollowUpLabel(followUpOn: string) {
  if (!followUpOn) {
    return {
      label: 'No follow-up date',
      tone: 'neutral' as const,
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const followUpDate = new Date(`${followUpOn}T00:00:00`)
  followUpDate.setHours(0, 0, 0, 0)

  const differenceInDays = Math.round(
    (followUpDate.getTime() - today.getTime()) / 86_400_000
  )

  if (differenceInDays < 0) {
    return {
      label: `Overdue by ${Math.abs(differenceInDays)} day${
        Math.abs(differenceInDays) === 1 ? '' : 's'
      }`,
      tone: 'danger' as const,
    }
  }

  if (differenceInDays === 0) {
    return {
      label: 'Due today',
      tone: 'warning' as const,
    }
  }

  if (differenceInDays <= 3) {
    return {
      label: `Due in ${differenceInDays} day${
        differenceInDays === 1 ? '' : 's'
      }`,
      tone: 'warning' as const,
    }
  }

  return {
    label: `Follow up on ${followUpOn}`,
    tone: 'neutral' as const,
  }
}

export default function OpportunityPipelineBoard({
  userId,
  items,
}: OpportunityPipelineBoardProps) {
  const savedForLater = sortByFollowUpPriority(
    items.filter((item) => item.status === 'saved')
  )

  const activePipeline = sortByFollowUpPriority(
    items.filter((item) => ACTIVE_STATUSES.includes(item.status))
  )

  const closedPipeline = sortByFollowUpPriority(
    items.filter((item) => item.status === 'closed')
  )

  const appliedCount = items.filter((item) => item.status === 'applied').length
  const interviewingCount = items.filter(
    (item) => item.status === 'interviewing'
  ).length
  const offerCount = items.filter((item) => item.status === 'offer').length

  const overdueCount = items.filter(
    (item) => item.followUpOn && getFollowUpPriority(item) < 0
  ).length

  const dueSoonCount = items.filter((item) => {
    const priority = getFollowUpPriority(item)
    return priority >= 0 && priority <= 86_400_000 * 3
  }).length

  return (
    <div className="mt-8 space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <p className="eyebrow">Opportunity pipeline</p>

            <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
              {items.length} tracked{' '}
              {items.length === 1 ? 'opportunity' : 'opportunities'}
            </h3>

            <p className="muted-text mt-3 max-w-2xl">
              Organize saved opportunities by progress stage, next action, and
              follow-up date so your shortlist becomes a real career action
              system.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <PipelineStat label="Applied" value={appliedCount} />
            <PipelineStat label="Interviewing" value={interviewingCount} />
            <PipelineStat label="Offer" value={offerCount} />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <PipelineStageSummary
            label="Saved for later"
            count={savedForLater.length}
            description="Bookmarked but not active yet"
          />

          <PipelineStageSummary
            label="Active pipeline"
            count={activePipeline.length}
            description="Interested through offer stage"
          />

          <PipelineStageSummary
            label="Closed"
            count={closedPipeline.length}
            description="No longer active for you"
          />

          <PipelineStageSummary
            label="Overdue"
            count={overdueCount}
            description="Follow-up date passed"
          />

          <PipelineStageSummary
            label="Due soon"
            count={dueSoonCount}
            description="Due within 3 days"
          />
        </div>
      </div>

      <PipelineGroup
        title="Active pipeline"
        description="Sorted by follow-up urgency first, then title. These are opportunities you are actively exploring, preparing for, applying to, interviewing for, or considering."
        emptyTitle="No active pipeline items yet"
        emptyDescription="Move a saved opportunity to Interested, Preparing, Applied, Interviewing, or Offer when you are ready to work on it."
        items={activePipeline}
        userId={userId}
      />

      <PipelineGroup
        title="Saved for later"
        description="These are opportunities you saved but have not moved into active progress yet."
        emptyTitle="No saved-for-later opportunities"
        emptyDescription="Newly saved opportunities will appear here first."
        items={savedForLater}
        userId={userId}
      />

      <PipelineGroup
        title="Closed"
        description="These are opportunities you are no longer pursuing, but may want to keep for your record."
        emptyTitle="No closed opportunities"
        emptyDescription="Move opportunities here when they are no longer active for you."
        items={closedPipeline}
        userId={userId}
      />
    </div>
  )
}

function PipelineStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-orange-600">{value}</p>
    </div>
  )
}

function PipelineStageSummary({
  label,
  count,
  description,
}: {
  label: string
  count: number
  description: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-950">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
          {count}
        </span>
      </div>
    </div>
  )
}

function PipelineGroup({
  title,
  description,
  emptyTitle,
  emptyDescription,
  items,
  userId,
}: {
  title: string
  description: string
  emptyTitle: string
  emptyDescription: string
  items: OpportunityPipelineItem[]
  userId: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-950">
          {title}
        </h3>

        <p className="muted-text mt-2 max-w-3xl">{description}</p>
      </div>

      {items.length > 0 ? (
        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          {items.map((item) => (
            <OpportunityPipelineCard
              key={item.opportunityId}
              item={item}
              userId={userId}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-950">
                {emptyTitle}
              </h4>

              <p className="muted-text mt-2">{emptyDescription}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function OpportunityPipelineCard({
  item,
  userId,
}: {
  item: OpportunityPipelineItem
  userId: string
}) {
  const followUp = getFollowUpLabel(item.followUpOn)

  return (
    <div className="card bg-slate-50">
      <Link href={`/opportunities/${item.slug}`} className="group block">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="badge-orange">
                {formatOpportunityType(item.opportunityType)}
              </span>

              <span className="badge-slate">{STATUS_LABELS[item.status]}</span>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  followUp.tone === 'danger'
                    ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
                    : followUp.tone === 'warning'
                      ? 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
                      : 'bg-slate-100 text-slate-700'
                }`}
              >
                {followUp.tone === 'danger' ? (
                  <AlertCircle className="h-3.5 w-3.5" />
                ) : (
                  <CalendarDays className="h-3.5 w-3.5" />
                )}
                {followUp.label}
              </span>
            </div>

            <h4 className="mt-4 text-2xl font-bold text-slate-950 transition group-hover:text-orange-700">
              {item.title}
            </h4>

            <p className="mt-2 font-semibold text-slate-600">
              {item.employerName}
            </p>
          </div>

          <div className="rounded-full bg-white p-3 ring-1 ring-slate-200 transition group-hover:ring-orange-200">
            <ArrowRight className="h-5 w-5 text-slate-700 group-hover:text-orange-700" />
          </div>
        </div>
      </Link>

      <p className="muted-text mt-5 line-clamp-3">{item.description}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="mini-card-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Location
          </p>

          <p className="mt-1 font-bold text-slate-950">
            {item.location}, {item.state}
          </p>
        </div>

        <div className="mini-card-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Schedule
          </p>

          <p className="mt-1 font-bold text-slate-950">
            {item.schedule || 'See listing'}
          </p>
        </div>
      </div>

      {item.nextAction && (
        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-900">
            Next action
          </p>

          <p className="mt-1 text-sm font-semibold leading-6 text-orange-900">
            {item.nextAction}
          </p>
        </div>
      )}

      <div className="mt-6 border-t border-slate-200 pt-5">
        <OpportunityPipelineStatusSelect
          userId={userId}
          opportunityId={item.opportunityId}
          initialStatus={item.status}
          initialNotes={item.notes}
          initialNextAction={item.nextAction}
          initialFollowUpOn={item.followUpOn}
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/opportunities/${item.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
          >
            View listing
            <BriefcaseBusiness className="h-4 w-4" />
          </Link>

          <RemoveSavedOpportunityButton opportunityId={item.opportunityId} />
        </div>
      </div>
    </div>
  )
}