import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type {
  OpportunityType,
  OpportunityVerificationStatus,
  SourceReliabilityLevel,
} from '@/lib/supabase/app-types'

export type AdminOpportunityFilters = {
  q: string
  status: 'all' | 'active' | 'inactive'
  verification: 'all' | OpportunityVerificationStatus
  source: 'all' | 'manual' | string
  employer: 'all' | string
}

export type AdminOpportunityEmployerOption = {
  id: string
  name: string
  slug: string
  is_verified: boolean
  is_active: boolean
}

export type AdminOpportunitySourceOption = {
  id: string
  name: string
  slug: string
  reliability_level: SourceReliabilityLevel
  is_active: boolean
}

type EmployerRelation = {
  name: string
  slug: string
  is_verified: boolean
  is_active: boolean
}

type SourceRelation = {
  name: string
  slug: string
  reliability_level: SourceReliabilityLevel
  is_active: boolean
}

export type AdminOpportunityReviewItem = {
  id: string
  title: string
  slug: string
  opportunity_type: OpportunityType
  trade_slug: string
  location: string
  state: string
  pay_range: string | null
  schedule: string | null
  description: string
  requirements: string[] | null
  benefits: string[] | null
  application_url: string | null
  external_url: string | null
  source_name: string | null
  source_attribution: string | null
  verification_status: OpportunityVerificationStatus
  last_verified_at: string | null
  expires_at: string | null
  is_active: boolean
  created_at: string
  employer: EmployerRelation | null
  source: SourceRelation | null
  quality_score: number
  quality_issues: string[]
  review_due: boolean
}

export type AdminOpportunitiesPageData = {
  opportunities: AdminOpportunityReviewItem[]
  employers: AdminOpportunityEmployerOption[]
  sources: AdminOpportunitySourceOption[]
  filters: AdminOpportunityFilters
  stats: {
    total: number
    active: number
    inactive: number
    sourced: number
    needsReview: number
    filtered: number
  }
}

function normalizeParam(value: string | string[] | undefined, fallback = '') {
  if (Array.isArray(value)) return value[0] ?? fallback
  return value ?? fallback
}

function normalizeFilters(searchParams?: {
  q?: string | string[]
  status?: string | string[]
  verification?: string | string[]
  source?: string | string[]
  employer?: string | string[]
}): AdminOpportunityFilters {
  const status = normalizeParam(searchParams?.status, 'all')
  const verification = normalizeParam(searchParams?.verification, 'all')
  const source = normalizeParam(searchParams?.source, 'all')
  const employer = normalizeParam(searchParams?.employer, 'all')

  return {
    q: normalizeParam(searchParams?.q, '').trim(),
    status:
      status === 'active' || status === 'inactive'
        ? status
        : 'all',
    verification:
      verification === 'unverified' ||
      verification === 'source_verified' ||
      verification === 'admin_reviewed' ||
      verification === 'employer_verified' ||
      verification === 'stale' ||
      verification === 'expired' ||
      verification === 'rejected'
        ? verification
        : 'all',
    source: source || 'all',
    employer: employer || 'all',
  }
}

function getSingleRelation<T>(relation: T | T[] | null | undefined) {
  if (Array.isArray(relation)) return relation[0] ?? null
  return relation ?? null
}

function computeQualityScore(opportunity: {
  title: string
  opportunity_type: string
  trade_slug: string
  location: string
  state: string
  description: string
  schedule: string | null
  pay_range: string | null
  requirements: string[] | null
  benefits: string[] | null
  application_url: string | null
  external_url: string | null
  employer: EmployerRelation | null
}) {
  const checks = [
    {
      label: 'Missing title',
      complete: Boolean(opportunity.title.trim()),
    },
    {
      label: 'Missing employer',
      complete: Boolean(opportunity.employer?.name),
    },
    {
      label: 'Missing opportunity type',
      complete: Boolean(opportunity.opportunity_type),
    },
    {
      label: 'Missing trade focus',
      complete: Boolean(opportunity.trade_slug),
    },
    {
      label: 'Missing location',
      complete: Boolean(opportunity.location && opportunity.state),
    },
    {
      label: 'Description is too short',
      complete: opportunity.description.trim().length >= 100,
    },
    {
      label: 'Missing schedule',
      complete: Boolean(opportunity.schedule),
    },
    {
      label: 'Missing pay range',
      complete: Boolean(opportunity.pay_range),
    },
    {
      label: 'Missing requirements',
      complete: Boolean(
        opportunity.requirements && opportunity.requirements.length > 0
      ),
    },
    {
      label: 'Missing benefits',
      complete: Boolean(opportunity.benefits && opportunity.benefits.length > 0),
    },
    {
      label: 'Missing application/source URL',
      complete: Boolean(opportunity.application_url || opportunity.external_url),
    },
  ]

  const completeCount = checks.filter((check) => check.complete).length

  return {
    qualityScore: Math.round((completeCount / checks.length) * 100),
    qualityIssues: checks
      .filter((check) => !check.complete)
      .map((check) => check.label),
  }
}

function isReviewDue(expiresAt: string | null, verificationStatus: string) {
  if (verificationStatus === 'stale' || verificationStatus === 'expired') {
    return true
  }

  if (!expiresAt) return false

  return new Date(expiresAt).getTime() <= Date.now()
}

function matchesSearch(opportunity: AdminOpportunityReviewItem, query: string) {
  if (!query) return true

  const searchable = [
    opportunity.title,
    opportunity.description,
    opportunity.trade_slug,
    opportunity.location,
    opportunity.state,
    opportunity.source_name,
    opportunity.employer?.name,
    opportunity.verification_status,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return searchable.includes(query.toLowerCase())
}

async function requireAdmin() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || profile?.role !== 'admin') {
    redirect('/')
  }
}

export async function getAdminOpportunitiesPageData(searchParams?: {
  q?: string | string[]
  status?: string | string[]
  verification?: string | string[]
  source?: string | string[]
  employer?: string | string[]
}): Promise<AdminOpportunitiesPageData> {
  const supabase = createClient()
  const filters = normalizeFilters(searchParams)

  await requireAdmin()

  const [
    opportunitiesResult,
    employersResult,
    sourcesResult,
    totalResult,
    activeResult,
    inactiveResult,
    sourcedResult,
    needsReviewResult,
  ] = await Promise.all([
    supabase
      .from('opportunities')
      .select(
        `
        id,
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
        external_url,
        source_id,
        source_name,
        source_attribution,
        verification_status,
        last_verified_at,
        expires_at,
        is_active,
        created_at,
        employer_id,
        employers (
          name,
          slug,
          is_verified,
          is_active
        ),
        opportunity_sources (
          name,
          slug,
          reliability_level,
          is_active
        )
      `
      )
      .order('created_at', { ascending: false }),

    supabase
      .from('employers')
      .select('id, name, slug, is_verified, is_active')
      .order('name', { ascending: true }),

    supabase
      .from('opportunity_sources')
      .select('id, name, slug, reliability_level, is_active')
      .order('name', { ascending: true }),

    supabase.from('opportunities').select('id', { count: 'exact', head: true }),

    supabase
      .from('opportunities')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),

    supabase
      .from('opportunities')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', false),

    supabase
      .from('opportunities')
      .select('id', { count: 'exact', head: true })
      .not('source_id', 'is', null),

    supabase
      .from('opportunities')
      .select('id', { count: 'exact', head: true })
      .in('verification_status', ['unverified', 'stale', 'expired']),
  ])

  if (opportunitiesResult.error) {
    console.error('Failed to load admin opportunities:', opportunitiesResult.error)
  }

  if (employersResult.error) {
    console.error('Failed to load opportunity filter employers:', employersResult.error)
  }

  if (sourcesResult.error) {
    console.error('Failed to load opportunity filter sources:', sourcesResult.error)
  }

  let opportunities = (opportunitiesResult.data ?? []).map((raw) => {
    const employer = getSingleRelation<EmployerRelation>(raw.employers)
    const source = getSingleRelation<SourceRelation>(raw.opportunity_sources)

    const quality = computeQualityScore({
      title: raw.title,
      opportunity_type: raw.opportunity_type,
      trade_slug: raw.trade_slug,
      location: raw.location,
      state: raw.state,
      description: raw.description,
      schedule: raw.schedule,
      pay_range: raw.pay_range,
      requirements: raw.requirements,
      benefits: raw.benefits,
      application_url: raw.application_url,
      external_url: raw.external_url,
      employer,
    })

    return {
      id: raw.id,
      title: raw.title,
      slug: raw.slug,
      opportunity_type: raw.opportunity_type,
      trade_slug: raw.trade_slug,
      location: raw.location,
      state: raw.state,
      pay_range: raw.pay_range,
      schedule: raw.schedule,
      description: raw.description,
      requirements: raw.requirements,
      benefits: raw.benefits,
      application_url: raw.application_url,
      external_url: raw.external_url,
      source_name: raw.source_name,
      source_attribution: raw.source_attribution,
      verification_status: raw.verification_status,
      last_verified_at: raw.last_verified_at,
      expires_at: raw.expires_at,
      is_active: raw.is_active,
      created_at: raw.created_at,
      employer,
      source,
      quality_score: quality.qualityScore,
      quality_issues: quality.qualityIssues,
      review_due: isReviewDue(raw.expires_at, raw.verification_status),
    } satisfies AdminOpportunityReviewItem
  })

  if (filters.status === 'active') {
    opportunities = opportunities.filter((opportunity) => opportunity.is_active)
  }

  if (filters.status === 'inactive') {
    opportunities = opportunities.filter((opportunity) => !opportunity.is_active)
  }

  if (filters.verification !== 'all') {
    opportunities = opportunities.filter(
      (opportunity) => opportunity.verification_status === filters.verification
    )
  }

  if (filters.source === 'manual') {
    opportunities = opportunities.filter(
      (opportunity) => !opportunity.source_name
    )
  } else if (filters.source !== 'all') {
    opportunities = opportunities.filter(
      (opportunity) => opportunity.source?.slug === filters.source
    )
  }

  if (filters.employer !== 'all') {
    opportunities = opportunities.filter(
      (opportunity) => opportunity.employer?.slug === filters.employer
    )
  }

  opportunities = opportunities.filter((opportunity) =>
    matchesSearch(opportunity, filters.q)
  )

  return {
    opportunities,
    filters,
    employers: (employersResult.data ?? []) as AdminOpportunityEmployerOption[],
    sources: (sourcesResult.data ?? []) as AdminOpportunitySourceOption[],
    stats: {
      total: totalResult.count ?? 0,
      active: activeResult.count ?? 0,
      inactive: inactiveResult.count ?? 0,
      sourced: sourcedResult.count ?? 0,
      needsReview: needsReviewResult.count ?? 0,
      filtered: opportunities.length,
    },
  }
}