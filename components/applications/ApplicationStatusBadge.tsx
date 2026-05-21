import type { ApplicationStatus } from '@/lib/supabase/app-types'
import {
  getApplicationStatusBadgeClass,
  getApplicationStatusLabel,
} from '@/lib/applications/application-review-config'

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus
}

export default function ApplicationStatusBadge({
  status,
}: ApplicationStatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getApplicationStatusBadgeClass(
        status
      )}`}
    >
      {getApplicationStatusLabel(status)}
    </span>
  )
}