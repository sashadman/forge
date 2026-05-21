import { Clock } from 'lucide-react'
import type { ApplicationEventItem } from '@/lib/employers/get-employer-applications-page-data'
import { getApplicationStatusLabel } from '@/lib/applications/application-review-config'

type ApplicationTimelineProps = {
  events: ApplicationEventItem[]
  submittedAt: string
}

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

export default function ApplicationTimeline({
  events,
  submittedAt,
}: ApplicationTimelineProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-orange-600" />
        <p className="font-semibold text-slate-950">Application timeline</p>
      </div>

      <div className="mt-4 space-y-3">
        <TimelineRow
          title="Application submitted"
          detail={formatDate(submittedAt)}
        />

        {events.map((event) => (
          <TimelineRow
            key={event.id}
            title={
              event.new_status
                ? `Status: ${getApplicationStatusLabel(event.new_status)}`
                : 'Application event'
            }
            detail={`${formatDate(event.created_at)}${
              event.note ? ` · ${event.note}` : ''
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function TimelineRow({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  )
}