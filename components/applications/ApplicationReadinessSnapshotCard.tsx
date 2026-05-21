import { FileText, ShieldCheck } from 'lucide-react'
import type { ApplicationReadinessSnapshotItem } from '@/lib/employers/get-employer-applications-page-data'

type ApplicationReadinessSnapshotCardProps = {
  snapshot: ApplicationReadinessSnapshotItem
}

function formatFileSize(value: number | null) {
  if (!value) return null
  return `${value} KB`
}

export default function ApplicationReadinessSnapshotCard({
  snapshot,
}: ApplicationReadinessSnapshotCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
          {snapshot.file_name ? (
            <FileText className="h-5 w-5" />
          ) : (
            <ShieldCheck className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-950">{snapshot.label}</p>

            <span className="badge-slate">{snapshot.status}</span>
          </div>

          {snapshot.file_name && (
            <p className="mt-2 text-sm leading-6 text-slate-600">
              File: {snapshot.file_name}
              {formatFileSize(snapshot.file_size_kb)
                ? ` · ${formatFileSize(snapshot.file_size_kb)}`
                : ''}
            </p>
          )}

          {snapshot.text_content && (
            <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
              {snapshot.text_content}
            </p>
          )}

          {snapshot.notes && (
            <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              {snapshot.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}