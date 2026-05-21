import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type {
  ImportBatchStatus,
  OpportunitySourceType,
  SourceReliabilityLevel,
} from '@/lib/supabase/app-types'

export type OpportunitySourceItem = {
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
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export type OpportunityImportBatchItem = {
  id: string
  source_id: string | null
  status: ImportBatchStatus
  started_at: string | null
  completed_at: string | null
  imported_count: number
  updated_count: number
  skipped_count: number
  error_count: number
  notes: string | null
  error_summary: string | null
  created_at: string
  opportunity_sources:
    | {
        name: string
      }
    | {
        name: string
      }[]
    | null
}

export type OpportunitySourcesPageData = {
  sources: OpportunitySourceItem[]
  recentBatches: OpportunityImportBatchItem[]
  stats: {
    totalSources: number
    activeSources: number
    sourcesDueForReview: number
    officialSources: number
  }
}

function isAdminRole(role: string | null | undefined) {
  return role === 'admin'
}

export async function getOpportunitySourcesPageData(): Promise<OpportunitySourcesPageData> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !isAdminRole(profile?.role)) {
    redirect('/dashboard')
  }

  const [sourcesResult, batchesResult] = await Promise.all([
    supabase
      .from('opportunity_sources')
      .select('*')
      .order('created_at', { ascending: false }),

    supabase
      .from('opportunity_import_batches')
      .select(
        `
        id,
        source_id,
        status,
        started_at,
        completed_at,
        imported_count,
        updated_count,
        skipped_count,
        error_count,
        notes,
        error_summary,
        created_at,
        opportunity_sources (
          name
        )
      `
      )
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  if (sourcesResult.error) {
    console.error('Failed to load opportunity sources:', sourcesResult.error)
  }

  if (batchesResult.error) {
    console.error('Failed to load opportunity import batches:', batchesResult.error)
  }

  const sources = (sourcesResult.data ?? []) as OpportunitySourceItem[]
  const recentBatches = (batchesResult.data ?? []) as OpportunityImportBatchItem[]

  const now = Date.now()

  const sourcesDueForReview = sources.filter((source) => {
    if (!source.next_review_at) return false
    return new Date(source.next_review_at).getTime() <= now
  }).length

  return {
    sources,
    recentBatches,
    stats: {
      totalSources: sources.length,
      activeSources: sources.filter((source) => source.is_active).length,
      sourcesDueForReview,
      officialSources: sources.filter(
        (source) => source.reliability_level === 'official'
      ).length,
    },
  }
}