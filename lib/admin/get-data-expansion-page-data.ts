import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type {
  OpportunitySourceType,
  OpportunityVerificationStatus,
  SourceReliabilityLevel,
} from '@/lib/supabase/app-types'

export type DataExpansionSource = {
  id: string
  name: string
  slug: string
  source_type: OpportunitySourceType
  reliability_level: SourceReliabilityLevel
  website_url: string
  search_url: string | null
  region: string | null
  state: string | null
  trade_focus: string[] | null
  description: string | null
  notes: string | null
  is_active: boolean
  last_checked_at: string | null
  next_review_at: string | null
  created_at: string
}

export type DataExpansionOpportunity = {
  id: string
  title: string
  slug: string
  trade_slug: string
  location: string
  state: string
  external_url: string | null
  source_name: string | null
  verification_status: OpportunityVerificationStatus
  last_verified_at: string | null
  expires_at: string | null
  is_active: boolean
  created_at: string
  employers:
    | {
        name: string
        slug: string
      }
    | {
        name: string
        slug: string
      }[]
    | null
}

export type DataExpansionPageData = {
  sources: DataExpansionSource[]
  recentOpportunities: DataExpansionOpportunity[]
  stats: {
    totalSources: number
    officialSources: number
    activeSources: number
    sourcesDueForReview: number
    sourcedOpportunities: number
    activeSourcedOpportunities: number
    staleOrExpiredOpportunities: number
  }
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

function isDueForReview(nextReviewAt: string | null) {
  if (!nextReviewAt) return false
  return new Date(nextReviewAt).getTime() <= Date.now()
}

export async function getDataExpansionPageData(): Promise<DataExpansionPageData> {
  const supabase = createClient()

  await requireAdmin()

  const [
    sourcesResult,
    opportunitiesResult,
    sourcedCountResult,
    activeSourcedCountResult,
    staleOrExpiredResult,
  ] = await Promise.all([
    supabase
      .from('opportunity_sources')
      .select('*')
      .order('reliability_level', { ascending: true })
      .order('name', { ascending: true }),

    supabase
      .from('opportunities')
      .select(
        `
        id,
        title,
        slug,
        trade_slug,
        location,
        state,
        external_url,
        source_name,
        verification_status,
        last_verified_at,
        expires_at,
        is_active,
        created_at,
        employers (
          name,
          slug
        )
      `
      )
      .not('source_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(12),

    supabase
      .from('opportunities')
      .select('id', { count: 'exact', head: true })
      .not('source_id', 'is', null),

    supabase
      .from('opportunities')
      .select('id', { count: 'exact', head: true })
      .not('source_id', 'is', null)
      .eq('is_active', true),

    supabase
      .from('opportunities')
      .select('id', { count: 'exact', head: true })
      .in('verification_status', ['stale', 'expired']),
  ])

  if (sourcesResult.error) {
    console.error('Failed to load data expansion sources:', sourcesResult.error)
  }

  if (opportunitiesResult.error) {
    console.error(
      'Failed to load sourced opportunities:',
      opportunitiesResult.error
    )
  }

  const sources = (sourcesResult.data ?? []) as DataExpansionSource[]

  return {
    sources,
    recentOpportunities:
      (opportunitiesResult.data ?? []) as DataExpansionOpportunity[],
    stats: {
      totalSources: sources.length,
      officialSources: sources.filter(
        (source) => source.reliability_level === 'official'
      ).length,
      activeSources: sources.filter((source) => source.is_active).length,
      sourcesDueForReview: sources.filter((source) =>
        isDueForReview(source.next_review_at)
      ).length,
      sourcedOpportunities: sourcedCountResult.count ?? 0,
      activeSourcedOpportunities: activeSourcedCountResult.count ?? 0,
      staleOrExpiredOpportunities: staleOrExpiredResult.count ?? 0,
    },
  }
}