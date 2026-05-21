import type {
  OpportunitySourceType,
  SourceReliabilityLevel,
} from '@/lib/supabase/app-types'

export const OPPORTUNITY_SOURCE_TYPE_OPTIONS: {
  value: OpportunitySourceType
  label: string
  description: string
}[] = [
  {
    value: 'public_job_board',
    label: 'Public job board',
    description: 'General job board or employment listing source.',
  },
  {
    value: 'apprenticeship_directory',
    label: 'Apprenticeship directory',
    description: 'Apprenticeship-specific source or directory.',
  },
  {
    value: 'workforce_board',
    label: 'Workforce board',
    description: 'Local, state, or regional workforce opportunity board.',
  },
  {
    value: 'union_training_center',
    label: 'Union training center',
    description: 'Union apprenticeship or training center source.',
  },
  {
    value: 'employer_career_page',
    label: 'Employer career page',
    description: 'Official employer job or career page.',
  },
  {
    value: 'school_program_page',
    label: 'School program page',
    description: 'Training provider, college, or school program page.',
  },
  {
    value: 'government_resource',
    label: 'Government resource',
    description: 'Official government job, training, or apprenticeship source.',
  },
  {
    value: 'community_partner',
    label: 'Community partner',
    description: 'Trusted nonprofit, workforce, or community partner source.',
  },
  {
    value: 'manual_research',
    label: 'Manual research',
    description: 'Source discovered through manual research.',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Source that does not fit another category.',
  },
]

export const SOURCE_RELIABILITY_OPTIONS: {
  value: SourceReliabilityLevel
  label: string
  description: string
}[] = [
  {
    value: 'official',
    label: 'Official',
    description: 'Official source controlled by employer, government, union, or provider.',
  },
  {
    value: 'trusted',
    label: 'Trusted',
    description: 'Reliable source that still benefits from periodic review.',
  },
  {
    value: 'needs_review',
    label: 'Needs review',
    description: 'Potentially useful source that requires admin review.',
  },
  {
    value: 'experimental',
    label: 'Experimental',
    description: 'Early source being tested before relying on it.',
  },
]

export function getOpportunitySourceTypeLabel(type: OpportunitySourceType) {
  return (
    OPPORTUNITY_SOURCE_TYPE_OPTIONS.find((option) => option.value === type)
      ?.label ?? type
  )
}

export function getSourceReliabilityLabel(level: SourceReliabilityLevel) {
  return (
    SOURCE_RELIABILITY_OPTIONS.find((option) => option.value === level)?.label ??
    level
  )
}

export function getSourceReliabilityBadgeClass(level: SourceReliabilityLevel) {
  if (level === 'official') {
    return 'bg-green-50 text-green-700 ring-1 ring-green-200'
  }

  if (level === 'trusted') {
    return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
  }

  if (level === 'needs_review') {
    return 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
  }

  return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
}