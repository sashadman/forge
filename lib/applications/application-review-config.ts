import type { ApplicationStatus } from '@/lib/supabase/app-types'

export const APPLICATION_STATUS_OPTIONS: {
  value: ApplicationStatus
  label: string
  description: string
}[] = [
  {
    value: 'submitted',
    label: 'Submitted',
    description: 'Application was submitted and is waiting for review.',
  },
  {
    value: 'reviewed',
    label: 'Reviewed',
    description: 'Employer or admin reviewed the application.',
  },
  {
    value: 'contacted',
    label: 'Contacted',
    description: 'Applicant was contacted for follow-up.',
  },
  {
    value: 'interviewing',
    label: 'Interviewing',
    description: 'Applicant is in the interview or screening process.',
  },
  {
    value: 'offered',
    label: 'Offered',
    description: 'Applicant received an offer or next-step invitation.',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    description: 'Application is no longer moving forward.',
  },
  {
    value: 'withdrawn',
    label: 'Withdrawn',
    description: 'Applicant withdrew the application.',
  },
]

export const REVIEWABLE_APPLICATION_STATUS_OPTIONS =
  APPLICATION_STATUS_OPTIONS.filter((option) => option.value !== 'withdrawn')

export function getApplicationStatusLabel(status: ApplicationStatus) {
  return (
    APPLICATION_STATUS_OPTIONS.find((option) => option.value === status)
      ?.label ?? status
  )
}

export function getApplicationStatusDescription(status: ApplicationStatus) {
  return (
    APPLICATION_STATUS_OPTIONS.find((option) => option.value === status)
      ?.description ?? ''
  )
}

export function getApplicationStatusBadgeClass(status: ApplicationStatus) {
  if (status === 'offered') {
    return 'bg-green-50 text-green-700 ring-1 ring-green-200'
  }

  if (status === 'interviewing' || status === 'contacted') {
    return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
  }

  if (status === 'reviewed') {
    return 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
  }

  if (status === 'rejected' || status === 'withdrawn') {
    return 'bg-red-50 text-red-700 ring-1 ring-red-200'
  }

  return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
}