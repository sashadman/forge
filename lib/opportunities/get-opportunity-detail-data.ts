import 'server-only'

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ApplicationStatus } from '@/lib/supabase/app-types'

export type OpportunityDetailEmployer = {
  name: string
  slug: string
  description: string | null
  industry: string | null
  website_url: string | null
  is_verified: boolean
}

export type OpportunityDetail = {
  id: string
  employer_id: string
  title: string
  slug: string
  opportunity_type: string
  trade_slug: string
  location: string
  state: string
  pay_range: string | null
  schedule: string | null
  description: string
  requirements: string[] | null
  benefits: string[] | null
  application_url: string | null
  employers: OpportunityDetailEmployer | OpportunityDetailEmployer[] | null
}

export type OpportunityDetailApplication = {
  id: string
  status: ApplicationStatus
  submitted_at: string
  withdrawn_at: string | null
}

export type OpportunityDetailPageData = {
  user: {
    id: string
    email?: string | null
  } | null
  opportunity: OpportunityDetail
  employer: OpportunityDetailEmployer | null
  existingApplication: OpportunityDetailApplication | null
  readinessScore: number
  introMessageTemplate: string
}

function getSingleRelation<T>(relation: T | T[] | null | undefined) {
  if (Array.isArray(relation)) return relation[0] ?? null
  return relation ?? null
}

export function formatOpportunityType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export async function getOpportunityDetailPageData(
  slug: string
): Promise<OpportunityDetailPageData> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: opportunityData, error: opportunityError } = await supabase
    .from('opportunities')
    .select(
      `
      id,
      employer_id,
      title,
      slug,
      opportunity_type,
      trade_slug,
      location,
      state,
      pay_range,
      schedule,
      description,
      requirements,
      benefits,
      application_url,
      employers (
        name,
        slug,
        description,
        industry,
        website_url,
        is_verified
      )
    `
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (opportunityError) {
    console.error('Failed to load opportunity detail:', opportunityError)
  }

  if (!opportunityData) {
    notFound()
  }

  const opportunity = opportunityData as OpportunityDetail
  const employer = getSingleRelation(opportunity.employers)

  if (!user) {
    return {
      user: null,
      opportunity,
      employer,
      existingApplication: null,
      readinessScore: 0,
      introMessageTemplate: '',
    }
  }

  const [
    existingApplicationResult,
    readinessScoreResult,
    introMessageResult,
  ] = await Promise.all([
    supabase
      .from('applications')
      .select('id, status, submitted_at, withdrawn_at')
      .eq('user_id', user.id)
      .eq('opportunity_id', opportunity.id)
      .maybeSingle(),

    supabase
      .from('seeker_readiness_scores')
      .select('score_pct')
      .eq('user_id', user.id)
      .maybeSingle(),

    supabase
      .from('seeker_readiness_items')
      .select('text_content')
      .eq('user_id', user.id)
      .eq('type', 'cover_letter_template')
      .maybeSingle(),
  ])

  if (existingApplicationResult.error) {
    console.error(
      'Failed to load existing application:',
      existingApplicationResult.error
    )
  }

  if (readinessScoreResult.error) {
    console.error(
      'Failed to load opportunity readiness score:',
      readinessScoreResult.error
    )
  }

  if (introMessageResult.error) {
    console.error(
      'Failed to load intro message template:',
      introMessageResult.error
    )
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    opportunity,
    employer,
    existingApplication:
      (existingApplicationResult.data as OpportunityDetailApplication | null) ??
      null,
    readinessScore: readinessScoreResult.data?.score_pct ?? 0,
    introMessageTemplate: introMessageResult.data?.text_content ?? '',
  }
}

export async function getOpportunityMetadataData(slug: string) {
  const supabase = createClient()

  const { data: opportunity } = await supabase
    .from('opportunities')
    .select(
      `
      title,
      description,
      employers (
        name
      )
    `
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!opportunity) {
    return null
  }

  const employer = getSingleRelation(opportunity.employers)

  return {
    title: opportunity.title,
    description: opportunity.description,
    employerName: employer?.name || 'Employer',
  }
}