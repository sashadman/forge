'use client'

import { FormEvent, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  Loader2,
  MapPin,
  Trash2,
} from 'lucide-react'
import {
  removeSavedProgram,
  updateSavedProgramPlan,
} from '@/app/actions/saved-program-planning'

export type SavedProgramPlan = {
  id: string
  pipelineStatus: string
  priority: string
  targetStartDate: string | null
  lastContactedAt: string | null
  notes: string | null
  createdAt: string
  updatedAt: string | null
  program: {
    id: string
    slug: string
    name: string
    providerName: string
    programType: string
    tradeSlug: string
    location: string
    state: string
    duration: string | null
    cost: string | null
    description: string
  } | null
}

const PIPELINE_STATUS_OPTIONS = [
  { value: 'saved', label: 'Saved' },
  { value: 'researching', label: 'Researching' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'applying', label: 'Applying' },
  { value: 'enrolled', label: 'Enrolled' },
  { value: 'completed', label: 'Completed' },
  { value: 'closed', label: 'Closed' },
]

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low priority' },
  { value: 'medium', label: 'Medium priority' },
  { value: 'high', label: 'High priority' },
]

function formatLabel(value: string) {
  return value
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function formatProgramType(value: string) {
  return formatLabel(value)
}

function formatDate(value: string | null) {
  if (!value) return 'Not set'

  return new Date(`${value}T00:00:00`).toLocaleDateString()
}

function statusBadgeClass(status: string) {
  if (status === 'enrolled' || status === 'completed') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
  }

  if (status === 'applying' || status === 'contacted') {
    return 'bg-orange-50 text-orange-700 ring-orange-100'
  }

  if (status === 'closed') {
    return 'bg-slate-100 text-slate-600 ring-slate-200'
  }

  return 'bg-blue-50 text-blue-700 ring-blue-100'
}

function priorityBadgeClass(priority: string) {
  if (priority === 'high') {
    return 'bg-red-50 text-red-700 ring-red-100'
  }

  if (priority === 'low') {
    return 'bg-slate-100 text-slate-600 ring-slate-200'
  }

  return 'bg-orange-50 text-orange-700 ring-orange-100'
}

export default function SavedProgramPlanner({
  savedPrograms,
}: {
  savedPrograms: SavedProgramPlan[]
}) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const filteredPrograms = useMemo(() => {
    return savedPrograms.filter((savedProgram) => {
      const matchesStatus =
        statusFilter === 'all' ||
        savedProgram.pipelineStatus === statusFilter

      const matchesPriority =
        priorityFilter === 'all' ||
        savedProgram.priority === priorityFilter

      return matchesStatus && matchesPriority
    })
  }, [savedPrograms, statusFilter, priorityFilter])

  const statusCounts = useMemo(() => {
    return PIPELINE_STATUS_OPTIONS.map((status) => ({
      ...status,
      count: savedPrograms.filter(
        (savedProgram) => savedProgram.pipelineStatus === status.value
      ).length,
    }))
  }, [savedPrograms])

  return (
    <div className="space-y-8">
      <section className="content-panel">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow">Saved program planner</p>

            <h2 className="section-title mt-3">
              Track training programs from research to enrollment.
            </h2>

            <p className="muted-text mt-3 max-w-3xl">
              Use this page to compare saved programs, track outreach, and decide
              which pathway is worth your time and money.
            </p>
          </div>

          <Link href="/programs" className="btn-primary">
            Find more programs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {statusCounts.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => setStatusFilter(status.value)}
              className={`rounded-2xl border p-4 text-left transition hover:border-orange-300 ${
                statusFilter === status.value
                  ? 'border-orange-300 bg-orange-50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {status.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {status.count}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="input-field"
          >
            <option value="all">All statuses</option>
            {PIPELINE_STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="input-field"
          >
            <option value="all">All priorities</option>
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {filteredPrograms.length > 0 ? (
        <div className="grid gap-6">
          {filteredPrograms.map((savedProgram) => (
            <SavedProgramCard
              key={savedProgram.id}
              savedProgram={savedProgram}
            />
          ))}
        </div>
      ) : (
        <section className="content-panel text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <GraduationCap className="h-8 w-8" />
          </div>

          <h2 className="section-title mt-6">No saved programs found</h2>

          <p className="muted-text mx-auto mt-4 max-w-2xl">
            Save programs from the public program directory, then use this page
            to track your research and application progress.
          </p>

          <div className="mt-8 flex justify-center">
            <Link href="/programs" className="btn-primary">
              Browse training programs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

function SavedProgramCard({
  savedProgram,
}: {
  savedProgram: SavedProgramPlan
}) {
  const [pipelineStatus, setPipelineStatus] = useState(
    savedProgram.pipelineStatus
  )
  const [priority, setPriority] = useState(savedProgram.priority)
  const [targetStartDate, setTargetStartDate] = useState(
    savedProgram.targetStartDate ?? ''
  )
  const [lastContactedAt, setLastContactedAt] = useState(
    savedProgram.lastContactedAt ?? ''
  )
  const [notes, setNotes] = useState(savedProgram.notes ?? '')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [isUpdating, startUpdateTransition] = useTransition()
  const [isRemoving, startRemoveTransition] = useTransition()

  const program = savedProgram.program

  function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('')
    setError('')

    startUpdateTransition(async () => {
      try {
        await updateSavedProgramPlan({
          savedProgramId: savedProgram.id,
          pipelineStatus,
          priority,
          targetStartDate,
          lastContactedAt,
          notes,
        })

        setNotice('Saved program plan updated.')
      } catch (caughtError) {
        console.error('Saved program update failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not update saved program.'
        )
      }
    })
  }

  function handleRemove() {
    setNotice('')
    setError('')

    startRemoveTransition(async () => {
      try {
        await removeSavedProgram(savedProgram.id)
      } catch (caughtError) {
        console.error('Saved program remove failed:', caughtError)

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Could not remove saved program.'
        )
      }
    })
  }

  if (!program) {
    return (
      <section className="content-panel">
        <h3 className="text-xl font-bold text-slate-950">
          Saved program unavailable
        </h3>

        <p className="muted-text mt-3">
          This saved program no longer appears to be available.
        </p>

        <button
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
          className="btn-outline mt-5"
        >
          {isRemoving && <Loader2 className="h-4 w-4 animate-spin" />}
          Remove unavailable save
        </button>
      </section>
    )
  }

  return (
    <article className="content-panel">
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusBadgeClass(
                pipelineStatus
              )}`}
            >
              {formatLabel(pipelineStatus)}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${priorityBadgeClass(
                priority
              )}`}
            >
              {formatLabel(priority)} priority
            </span>

            <span className="badge-slate">
              {formatProgramType(program.programType)}
            </span>
          </div>

          <h3 className="section-title mt-4">{program.name}</h3>

          <p className="mt-2 text-lg font-semibold text-slate-700">
            {program.providerName}
          </p>

          <p className="mt-4 line-clamp-3 leading-7 text-slate-600">
            {program.description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <InfoCard
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              value={`${program.location}, ${program.state}`}
            />

            <InfoCard
              icon={<CalendarDays className="h-4 w-4" />}
              label="Target start"
              value={formatDate(targetStartDate || null)}
            />

            <InfoCard
              icon={<GraduationCap className="h-4 w-4" />}
              label="Duration"
              value={program.duration || 'See provider'}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/programs/${program.slug}`} className="btn-dark">
              View program
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link href="/programs" className="btn-outline">
              Compare more programs
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleUpdate}
          className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <p className="text-sm font-bold text-slate-950">
            Planning details
          </p>

          <div className="mt-5 grid gap-4">
            <label>
              <span className="label">Status</span>
              <select
                value={pipelineStatus}
                onChange={(event) => setPipelineStatus(event.target.value)}
                className="input-field"
              >
                {PIPELINE_STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="label">Priority</span>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="input-field"
              >
                {PRIORITY_OPTIONS.map((priorityOption) => (
                  <option key={priorityOption.value} value={priorityOption.value}>
                    {priorityOption.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="label">Target start date</span>
              <input
                type="date"
                value={targetStartDate}
                onChange={(event) => setTargetStartDate(event.target.value)}
                className="input-field"
              />
            </label>

            <label>
              <span className="label">Last contacted</span>
              <input
                type="date"
                value={lastContactedAt}
                onChange={(event) => setLastContactedAt(event.target.value)}
                className="input-field"
              />
            </label>

            <label>
              <span className="label">Private notes</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={5}
                className="input-field"
                placeholder="Add notes about admissions, deadlines, cost, contacts, or next steps."
              />
            </label>
          </div>

          {notice && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {notice}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isUpdating || isRemoving}
              className="btn-primary flex-1"
            >
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
              {isUpdating ? 'Saving...' : 'Save plan'}
            </button>

            <button
              type="button"
              onClick={handleRemove}
              disabled={isUpdating || isRemoving}
              className="btn-outline border-red-200 text-red-700 hover:bg-red-50"
            >
              {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Remove
            </button>
          </div>
        </form>
      </div>
    </article>
  )
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="mini-card">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-orange-600">{icon}</span>
        <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
      </div>

      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  )
}