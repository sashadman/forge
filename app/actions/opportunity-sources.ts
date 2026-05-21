'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  OpportunitySourceType,
  SourceReliabilityLevel,
} from '@/lib/supabase/app-types'

type CreateOpportunitySourceInput = {
  name: string
  sourceType: OpportunitySourceType
  reliabilityLevel: SourceReliabilityLevel
  websiteUrl: string
  searchUrl?: string
  region?: string
  state?: string
  tradeFocus?: string
  description?: string
  notes?: string
}

type UpdateSourceStatusInput = {
  sourceId: string
  isActive: boolean
}

type MarkSourceCheckedInput = {
  sourceId: string
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseOptionalText(value?: string) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function parseTradeFocus(value?: string) {
  return (
    value
      ?.split(',')
      .map((item) => item.trim())
      .filter(Boolean) ?? []
  )
}

function validateUrl(value: string, label: string) {
  try {
    const url = new URL(value)

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error()
    }

    return url.toString()
  } catch {
    throw new Error(`${label} must be a valid URL.`)
  }
}

async function requireAdminUserId() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must sign in first.')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || profile?.role !== 'admin') {
    throw new Error('Admin access required.')
  }

  return user.id
}

export async function createOpportunitySource(input: CreateOpportunitySourceInput) {
  const supabase = createClient()
  const adminUserId = await requireAdminUserId()

  const name = input.name.trim()

  if (!name) {
    throw new Error('Source name is required.')
  }

  const slug = slugify(name)

  if (!slug) {
    throw new Error('Source name must contain letters or numbers.')
  }

  const websiteUrl = validateUrl(input.websiteUrl, 'Website URL')
  const searchUrl = input.searchUrl
    ? validateUrl(input.searchUrl, 'Search URL')
    : null

  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + 30)

  const { data, error } = await supabase
    .from('opportunity_sources')
    .insert({
      name,
      slug,
      source_type: input.sourceType,
      reliability_level: input.reliabilityLevel,
      website_url: websiteUrl,
      search_url: searchUrl,
      region: parseOptionalText(input.region),
      state: parseOptionalText(input.state),
      trade_focus: parseTradeFocus(input.tradeFocus),
      description: parseOptionalText(input.description),
      notes: parseOptionalText(input.notes),
      is_active: true,
      created_by: adminUserId,
      reviewed_by: adminUserId,
      reviewed_at: new Date().toISOString(),
      next_review_at: nextReviewDate.toISOString(),
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to create opportunity source: ${error.message}`)
  }

  revalidatePath('/admin/opportunity-sources')

  return data
}

export async function updateOpportunitySourceStatus({
  sourceId,
  isActive,
}: UpdateSourceStatusInput) {
  const supabase = createClient()
  await requireAdminUserId()

  const { data, error } = await supabase
    .from('opportunity_sources')
    .update({
      is_active: isActive,
    })
    .eq('id', sourceId)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to update source status: ${error.message}`)
  }

  revalidatePath('/admin/opportunity-sources')

  return data
}

export async function markOpportunitySourceChecked({
  sourceId,
}: MarkSourceCheckedInput) {
  const supabase = createClient()
  const adminUserId = await requireAdminUserId()

  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + 30)

  const { data, error } = await supabase
    .from('opportunity_sources')
    .update({
      last_checked_at: new Date().toISOString(),
      next_review_at: nextReviewDate.toISOString(),
      reviewed_by: adminUserId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', sourceId)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to mark source checked: ${error.message}`)
  }

  revalidatePath('/admin/opportunity-sources')

  return data
}