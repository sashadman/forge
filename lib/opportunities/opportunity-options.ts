import type {
  OpportunityType,
  OpportunityVerificationStatus,
} from '@/lib/supabase/app-types'

export const OPPORTUNITY_TYPE_OPTIONS: {
  value: OpportunityType
  label: string
  description: string
}[] = [
  {
    value: 'job',
    label: 'Job',
    description: 'A direct employment role or open position.',
  },
  {
    value: 'apprenticeship',
    label: 'Apprenticeship',
    description: 'A paid learning-and-work pathway.',
  },
  {
    value: 'trainee',
    label: 'Trainee role',
    description: 'An entry-level training role connected to employment.',
  },
  {
    value: 'internship',
    label: 'Internship',
    description: 'A short-term learning or work-experience opportunity.',
  },
  {
    value: 'pre_apprenticeship',
    label: 'Pre-apprenticeship',
    description: 'Preparation pathway before a formal apprenticeship.',
  },
]

export const TRADE_OPTIONS = [
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'welding', label: 'Welding' },
  { value: 'solar', label: 'Solar' },
  { value: 'construction', label: 'Construction' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'other', label: 'Other' },
]

export const OPPORTUNITY_VERIFICATION_OPTIONS: {
  value: OpportunityVerificationStatus
  label: string
  description: string
}[] = [
  {
    value: 'unverified',
    label: 'Unverified',
    description: 'Listing has not been reviewed yet.',
  },
  {
    value: 'source_verified',
    label: 'Source verified',
    description: 'Listing was reviewed against an official or trusted source.',
  },
  {
    value: 'admin_reviewed',
    label: 'Admin reviewed',
    description: 'Admin reviewed the listing for completeness and quality.',
  },
  {
    value: 'employer_verified',
    label: 'Employer verified',
    description: 'Employer confirmed the listing details.',
  },
  {
    value: 'stale',
    label: 'Stale',
    description: 'Listing needs review before users rely on it.',
  },
  {
    value: 'expired',
    label: 'Expired',
    description: 'Listing should no longer appear publicly.',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    description: 'Listing should not be used.',
  },
]

export function getOpportunityTypeLabel(type: OpportunityType) {
  return (
    OPPORTUNITY_TYPE_OPTIONS.find((option) => option.value === type)?.label ??
    type
  )
}

export function getOpportunityVerificationLabel(
  status: OpportunityVerificationStatus
) {
  return (
    OPPORTUNITY_VERIFICATION_OPTIONS.find((option) => option.value === status)
      ?.label ?? status
  )
}

export function getOpportunityVerificationBadgeClass(
  status: OpportunityVerificationStatus
) {
  if (status === 'employer_verified' || status === 'admin_reviewed') {
    return 'bg-green-50 text-green-700 ring-1 ring-green-200'
  }

  if (status === 'source_verified') {
    return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
  }

  if (status === 'stale') {
    return 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
  }

  if (status === 'expired' || status === 'rejected') {
    return 'bg-red-50 text-red-700 ring-1 ring-red-200'
  }

  return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
}