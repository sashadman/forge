'use client'

import { useState, useTransition } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Info,
  Loader2,
  Square,
  CheckSquare,
} from 'lucide-react'
import type { ReadinessItemRow as ReadinessItemRowData } from '@/app/actions/readiness'
import {
  markExternalReadinessItem,
  saveReadinessText,
  toggleReadinessCheckbox,
} from '@/app/actions/readiness'
import type { ReadinessItemConfig } from '@/lib/readiness/readiness-config'
import {
  getReadinessStatusLabel,
  isReadinessItemComplete,
} from '@/lib/readiness/readiness-config'

type ReadinessItemRowProps = {
  config: ReadinessItemConfig
  item: ReadinessItemRowData | null
  onUpdated: (item: ReadinessItemRowData) => void
}

function getStatusIcon(status: ReadinessItemRowData['status']) {
  if (status === 'verified') {
    return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
  }

  if (status === 'complete' || status === 'uploaded') {
    return <CheckCircle2 className="h-4 w-4 text-green-600" />
  }

  if (status === 'in_progress') {
    return <Clock className="h-4 w-4 text-orange-600" />
  }

  return <AlertCircle className="h-4 w-4 text-slate-400" />
}

function getStatusBadgeClass(status: ReadinessItemRowData['status']) {
  if (status === 'verified') {
    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
  }

  if (status === 'complete' || status === 'uploaded') {
    return 'bg-green-50 text-green-700 ring-1 ring-green-200'
  }

  if (status === 'in_progress') {
    return 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
  }

  return 'bg-slate-100 text-slate-600'
}

export default function ReadinessItemRow({
  config,
  item,
  onUpdated,
}: ReadinessItemRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [textValue, setTextValue] = useState(item?.text_content ?? '')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const status = item?.status ?? 'missing'
  const complete = isReadinessItemComplete(status)

  function handleCheckboxToggle() {
    setError('')

    startTransition(async () => {
      try {
        const updated = await toggleReadinessCheckbox({
          type: config.type,
          checked: !complete,
        })

        onUpdated(updated)
      } catch (error) {
        console.error('Failed to update readiness checkbox:', error)
        setError('Could not update this item.')
      }
    })
  }

  function handleExternalToggle() {
    setError('')

    startTransition(async () => {
      try {
        const updated = await markExternalReadinessItem({
          type: config.type,
          complete: !complete,
        })

        onUpdated(updated)
      } catch (error) {
        console.error('Failed to update external readiness item:', error)
        setError('Could not update this item.')
      }
    })
  }

  function handleTextSave() {
    setError('')

    startTransition(async () => {
      try {
        const updated = await saveReadinessText({
          type: config.type,
          textContent: textValue,
        })

        onUpdated(updated)
      } catch (error) {
        console.error('Failed to save readiness text:', error)
        setError('Could not save this item.')
      }
    })
  }

  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        complete
          ? 'border-green-100 bg-green-50/40'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
          ) : (
            getStatusIcon(status)
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-950">{config.label}</h3>

            {config.isRequired && (
              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-700">
                Required
              </span>
            )}

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusBadgeClass(
                status
              )}`}
            >
              {getReadinessStatusLabel(status)}
            </span>

            {config.isSensitive && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                Private
              </span>
            )}
          </div>

          <p className="muted-text mt-2 text-sm">{config.description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setShowInfo((current) => !current)}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Why this matters"
          >
            <Info className="h-4 w-4" />
          </button>

          {(config.inputMethod === 'text_editor' ||
            config.inputMethod === 'file_upload') && (
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label={expanded ? 'Collapse item' : 'Expand item'}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}

          {config.inputMethod === 'checkbox' && (
            <button
              type="button"
              onClick={handleCheckboxToggle}
              disabled={isPending}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={complete ? 'Mark incomplete' : 'Mark complete'}
            >
              {complete ? (
                <CheckSquare className="h-5 w-5" />
              ) : (
                <Square className="h-5 w-5" />
              )}
            </button>
          )}

          {config.inputMethod === 'external' && (
            <button
              type="button"
              onClick={handleExternalToggle}
              disabled={isPending}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={complete ? 'Mark incomplete' : 'Mark complete'}
            >
              {complete ? (
                <CheckSquare className="h-5 w-5" />
              ) : (
                <ExternalLink className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {showInfo && (
        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm leading-6 text-blue-800">
            <span className="font-semibold">Why this matters: </span>
            {config.whyItMatters}
          </p>
        </div>
      )}

      {expanded && config.inputMethod === 'text_editor' && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <textarea
            value={textValue}
            onChange={(event) => setTextValue(event.target.value)}
            rows={6}
            className="input-field"
            placeholder={config.placeholder}
          />

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              {textValue.length} characters
            </p>

            <button
              type="button"
              onClick={handleTextSave}
              disabled={isPending}
              className="btn-outline px-4 py-2 text-sm"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {expanded && config.inputMethod === 'file_upload' && (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-950">
            File upload coming next
          </p>

          <p className="muted-text mt-2 text-sm">
            This item is ready for storage integration. For v1, we are building
            the readiness workflow first, then adding secure private uploads.
          </p>
        </div>
      )}

      {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
    </div>
  )
}