'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  classifyTrainingSource,
  type SourceType,
} from '@/lib/training-data/source-classification'

type TrainingSourceInput = {
  sourceName: string
  sourceType: SourceType
  baseUrl: string
  sourceState: string
  institutionName: string
  providerName: string
  programIndexUrl: string
  apiEndpoint: string
  adminNotes: string
}

type TrainingSourceStatusInput = {
  sourceId: string
  isActive: boolean
  crawlStatus: string
  adminNotes: string
}

const CRAWL_STATUSES = [
  'not_started',
  'queued',
  'running',
  'completed',
  'failed',
  'paused',
]

function cleanString(value: string) {
  return value.trim()
}

function cleanOptionalString(value: string) {
  const cleaned = cleanString(value)
  return cleaned.length > 0 ? cleaned : null
}

function normalizeUrl(value: string) {
  const cleaned = cleanString(value)

  if (!cleaned) {
    throw new Error('URL is required.')
  }

  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned
  }

  return `https://${cleaned}`
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function requireAdminUser() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be signed in.')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    throw new Error('Only admins can manage training sources.')
  }

  return user
}

export async function createTrainingSource(input: TrainingSourceInput) {
  const supabase = createClient()
  const adminUser = await requireAdminUser()

  const sourceName = cleanString(input.sourceName)
  const baseUrl = normalizeUrl(input.baseUrl)

  if (!sourceName) {
    throw new Error('Source name is required.')
  }

  const sourceSlug = createSlug(sourceName)

  if (!sourceSlug) {
    throw new Error('Source name could not create a valid slug.')
  }

  const classification = classifyTrainingSource({
    baseUrl,
    sourceType: input.sourceType,
  })

  if (classification.trustLevel === 'blocked') {
    throw new Error('This source URL could not be classified as usable.')
  }

  const { error } = await supabase.from('training_sources').insert({
    source_name: sourceName,
    source_slug: sourceSlug,
    source_type: input.sourceType,
    source_authority: classification.sourceAuthority,
    trust_level: classification.trustLevel,
    base_url: baseUrl,
    source_state: cleanOptionalString(input.sourceState)?.toUpperCase() ?? null,
    source_country: 'US',
    institution_name: cleanOptionalString(input.institutionName),
    provider_name: cleanOptionalString(input.providerName),
    crawler_strategy: classification.crawlerStrategy,
    allowed_domains: classification.allowedDomains,
    program_index_url: cleanOptionalString(input.programIndexUrl),
    api_endpoint: cleanOptionalString(input.apiEndpoint),
    crawl_status: 'not_started',
    is_active: true,
    admin_notes: cleanOptionalString(input.adminNotes),
    created_by: adminUser.id,
  })

  if (error) {
    console.error('Failed to create training source:', error)

    if (error.message.toLowerCase().includes('duplicate')) {
      throw new Error('A source with this name already exists.')
    }

    throw new Error('Could not create training source.')
  }

  revalidatePath('/admin/training-sources')
}

export async function updateTrainingSourceStatus(input: TrainingSourceStatusInput) {
  const supabase = createClient()
  await requireAdminUser()

  const crawlStatus = CRAWL_STATUSES.includes(input.crawlStatus)
    ? input.crawlStatus
    : 'not_started'

  const { error } = await supabase
    .from('training_sources')
    .update({
      is_active: input.isActive,
      crawl_status: crawlStatus,
      admin_notes: cleanOptionalString(input.adminNotes),
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.sourceId)

  if (error) {
    console.error('Failed to update training source:', error)
    throw new Error('Could not update training source.')
  }

  revalidatePath('/admin/training-sources')
}