import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react'
import type { ProgramPipelineStatus } from '@/lib/supabase/app-types'
import ProgramPipelineStatusSelect from '@/components/dashboard/ProgramPipelineStatusSelect'
import RemoveSavedProgramButton from '@/components/dashboard/RemoveSavedProgramButton'

export type ProgramPipelineItem = {
  programId: string
  slug: string
  name: string
  providerName: string
  programType: string
  tradeSlug: string
  location: string
  state: string
  duration: string | null
  description: string
  status: ProgramPipelineStatus
  notes: string
  nextAction: string
  followUpOn: string
}

type ProgramPipelineBoardProps = {
  userId: string
  items: ProgramPipelineItem[]
}

const ACTIVE_STATUSES: ProgramPipelineStatus[] = [
  'researching',
  'contacted',
  'applying',
  'enrolled',
]

const STATUS_LABELS: Record<ProgramPipelineStatus, string> = {
  saved: 'Saved',
  researching: 'Researching',
  contacted: 'Contacted',
  applying: 'Applying',
  enrolled: 'Enrolled',
  completed: 'Completed',
  closed: 'Closed',
}

function formatProgramType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function getFollowUpPriority(item: ProgramPipelineItem) {
  if (!item.followUpOn) return Number.MAX_SAFE_INTEGER

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const followUpDate = new Date(`${item.followUpOn}T00:00:00`)
  followUpDate.setHours(0, 0, 0, 0)

  return followUpDate.getTime() - today.getTime()
}

function sortByFollowUpPriority(items: ProgramPipelineItem[]) {
  return [...items].sort((a, b) => {
    const priorityA = getFollowUpPriority(a)
    const priorityB = getFollowUpPriority(b)

    if (priorityA !== priorityB) return priorityA - priorityB

    return a.name.localeCompare(b.name)
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

export default function ProgramPipelineBoard({
  userId,
  items,
}: ProgramPipelineBoardProps) {
  const savedForLater = sortByFollowUpPriority(
    items.filter((item) => item.status === 'saved')
  )

  const activePipeline = sortByFollowUpPriority(
    items.filter((item) => ACTIVE_STATUSES.includes(item.status))
  )

  const completedPipeline = sortByFollowUpPriority(
    items.filter((item) => item.status === 'completed')
  )

  const closedPipeline = sortByFollowUpPriority(
    items.filter((item) => item.status === 'closed')
  )

  const applyingCount = items.filter((item) => item.status === 'applying').length
  const enrolledCount = items.filter((item) => item.status === 'enrolled').length
  const completedCount = items.filter(
    (item) => item.status === 'completed'
  ).length

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
            <p className="eyebrow">Training pipeline</p>

            <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
              {items.length} tracked {items.length === 1 ? 'program' : 'programs'}
            </h3>

            <p className="muted-text mt-3 max-w-2xl">
              Organize saved programs by research, contact, application,
              enrollment, completion, next action, and follow-up date.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <PipelineStat label="Applying" value={applyingCount} />
            <PipelineStat label="Enrolled" value={enrolledCount} />
            <PipelineStat label="Completed" value={completedCount} />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <PipelineStageSummary
            label="Saved"
            count={savedForLater.length}
            description="Bookmarked"
          />

          <PipelineStageSummary
            label="Active"
            count={activePipeline.length}
            description="Researching to enrolled"
          />

          <PipelineStageSummary
            label="Completed"
            count={completedPipeline.length}
            description="Training finished"
          />

          <PipelineStageSummary
            label="Closed"
            count={closedPipeline.length}
            description="No longer active"
          />

          <PipelineStageSummary
            label="Overdue"
            count={overdueCount}
            description="Follow-up passed"
          />

          <PipelineStageSummary
            label="Due soon"
            count={dueSoonCount}
            description="Within 3 days"
          />
        </div>
      </div>

      <PipelineGroup
        title="Active training pipeline"
        description="Sorted by follow-up urgency first, then program name. These are programs you are researching, contacting, applying to, or enrolled in."
        emptyTitle="No active training pipeline items yet"
        emptyDescription="Move a saved program to Researching, Contacted, Applying, or Enrolled when you are ready to work on it."
        items={activePipeline}
        userId={userId}
      />

      <PipelineGroup
        title="Saved for later"
        description="These are programs you saved but have not moved into active progress yet."
        emptyTitle="No saved-for-later programs"
        emptyDescription="Newly saved programs will appear here first."
        items={savedForLater}
        userId={userId}
      />

      <PipelineGroup
        title="Completed"
        description="These are programs you completed or finished."
        emptyTitle="No completed programs yet"
        emptyDescription="Move programs here when you complete a training pathway."
        items={completedPipeline}
        userId={userId}
      />

      <PipelineGroup
        title="Closed"
        description="These are programs you are no longer pursuing, but may want to keep for your record."
        emptyTitle="No closed programs"
        emptyDescription="Move programs here when they are no longer active for you."
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
  items: ProgramPipelineItem[]
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
            <ProgramPipelineCard
              key={item.programId}
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

function ProgramPipelineCard({
  item,
  userId,
}: {
  item: ProgramPipelineItem
  userId: string
}) {
  const followUp = getFollowUpLabel(item.followUpOn)

  return (
    <div className="card bg-slate-50">
      <Link href={`/programs/${item.slug}`} className="group block">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="badge-orange">
                {formatProgramType(item.programType)}
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
              {item.name}
            </h4>

            <p className="mt-2 font-semibold text-slate-600">
              {item.providerName}
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
            Duration
          </p>

          <p className="mt-1 font-bold text-slate-950">
            {item.duration || 'See provider'}
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
        <ProgramPipelineStatusSelect
          userId={userId}
          programId={item.programId}
          initialStatus={item.status}
          initialNotes={item.notes}
          initialNextAction={item.nextAction}
          initialFollowUpOn={item.followUpOn}
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/programs/${item.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
          >
            View program
            <GraduationCap className="h-4 w-4" />
          </Link>

          <RemoveSavedProgramButton programId={item.programId} />
        </div>
      </div>
    </div>
  )
}