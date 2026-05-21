import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type {
  OpportunitySourceType,
  SourceReliabilityLevel,
} from '@/lib/supabase/app-types'

export type AdminOpportunityEmployerOption = {
  id: string
  name: string
  slug: string
  location: string
  state: string
  is_verified: boolean
  is_active: boolean
}

export type AdminOpportunitySourceOption = {
  id: string
  name: string
  slug: string
  source_type: OpportunitySourceType
  reliability_level: SourceReliabilityLevel
  website_url: string
  search_url: string | null
  is_active: boolean
}

export type AdminOpportunityCreatePageData = {
  employers: AdminOpportunityEmployerOption[]
  sources: AdminOpportunitySourceOption[]
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
    redirect('/dashboard')
  }

  return user.id
}

export async function getAdminOpportunityCreatePageData(): Promise<AdminOpportunityCreatePageData> {
  const supabase = createClient()

  await requireAdmin()

  const [employersResult, sourcesResult] = await Promise.all([
    supabase
      .from('employers')
      .select('id, name, slug, location, state, is_verified, is_active')
      .eq('is_active', true)
      .order('name', { ascending: true }),

    supabase
      .from('opportunity_sources')
      .select(
        'id, name, slug, source_type, reliability_level, website_url, search_url, is_active'
      )
      .eq('is_active', true)
      .order('name', { ascending: true }),
  ])

  if (employersResult.error) {
    console.error('Failed to load employer options:', employersResult.error)
  }

  if (sourcesResult.error) {
    console.error('Failed to load opportunity source options:', sourcesResult.error)
  }

  return {
    employers: (employersResult.data ?? []) as AdminOpportunityEmployerOption[],
    sources: (sourcesResult.data ?? []) as AdminOpportunitySourceOption[],
  }
}