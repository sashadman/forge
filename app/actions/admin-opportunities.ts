'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  OpportunityType,
  OpportunityVerificationStatus,
} from '@/lib/supabase/app-types'

type CreateAdminOpportunityInput = {
  employerId: string
  sourceId?: string
  title: string
  opportunityType: OpportunityType
  tradeSlug: string
  location: string
  state: string
  payRange?: string
  schedule?: string
  description: string
  requirements?: string
  benefits?: string
  applicationUrl?: string
  externalUrl: string
  verificationStatus: OpportunityVerificationStatus
  isActive: boolean
  expiresAt?: string
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanOptionalText(value?: string) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function cleanUrl(value: string, label: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    throw new Error(`${label} is required.`)
  }

  try {
    const url = new URL(
      trimmed.startsWith('http://') || trimmed.startsWith('https://')
        ? trimmed
        : `https://${trimmed}`
    )

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error()
    }

    return url.toString()
  } catch {
    throw new Error(`${label} must be a valid URL.`)
  }
}

function cleanOptionalUrl(value?: string) {
  const trimmed = value?.trim()

  if (!trimmed) return null

  return cleanUrl(trimmed, 'Application URL')
}

function splitLines(value?: string) {
  const lines =
    value
      ?.split('\n')
      .map((line) => line.trim())
      .filter(Boolean) ?? []

  return lines.length > 0 ? lines : null
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

async function getEmployerSlug(employerId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('employers')
    .select('slug, name, is_active')
    .eq('id', employerId)
    .single()

  if (error || !data) {
    throw new Error('Selected employer could not be found.')
  }

  if (!data.is_active) {
    throw new Error('Selected employer is inactive.')
  }

  return {
    slug: data.slug,
    name: data.name,
  }
}

async function getSourceAttribution(sourceId?: string) {
  if (!sourceId) {
    return {
      sourceId: null,
      sourceName: 'Manual admin research',
      sourceAttribution: 'Created from admin-reviewed manual research.',
    }
  }

  const supabase = createClient()

  const { data, error } = await supabase
    .from('opportunity_sources')
    .select('id, name, website_url, is_active')
    .eq('id', sourceId)
    .single()

  if (error || !data) {
    throw new Error('Selected source could not be found.')
  }

  if (!data.is_active) {
    throw new Error('Selected source is inactive.')
  }

  return {
    sourceId: data.id,
    sourceName: data.name,
    sourceAttribution: `${data.name}: ${data.website_url}`,
  }
}

export async function createAdminOpportunity(input: CreateAdminOpportunityInput) {
  const supabase = createClient()
  const adminUserId = await requireAdminUserId()

  const title = input.title.trim()
  const location = input.location.trim()
  const state = input.state.trim()
  const description = input.description.trim()

  if (!title) throw new Error('Opportunity title is required.')
  if (!location) throw new Error('City is required.')
  if (!state) throw new Error('State is required.')
  if (description.length < 80) {
    throw new Error('Description should be at least 80 characters for quality.')
  }

  const employer = await getEmployerSlug(input.employerId)
  const source = await getSourceAttribution(input.sourceId)

  const baseSlug = createSlug(`${employer.slug}-${title}`)

  if (!baseSlug) {
    throw new Error('Opportunity title must contain letters or numbers.')
  }

  const externalUrl = cleanUrl(input.externalUrl, 'External source URL')
  const applicationUrl = cleanOptionalUrl(input.applicationUrl) ?? externalUrl

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('opportunities')
    .insert({
      employer_id: input.employerId,
      title,
      slug: baseSlug,
      opportunity_type: input.opportunityType,
      trade_slug: input.tradeSlug,
      location,
      state,
      pay_range: cleanOptionalText(input.payRange),
      schedule: cleanOptionalText(input.schedule),
      description,
      requirements: splitLines(input.requirements),
      benefits: splitLines(input.benefits),
      application_url: applicationUrl,
      is_active: input.isActive,
      source_id: source.sourceId,
      external_url: externalUrl,
      source_name: source.sourceName,
      source_attribution: source.sourceAttribution,
      verification_status: input.verificationStatus,
      last_verified_at:
        input.verificationStatus === 'unverified' ? null : now,
      expires_at: cleanOptionalText(input.expiresAt),
      reviewed_at: now,
      reviewed_by: adminUserId,
      imported_at: null,
      source_payload: null,
    })
    .select('id, slug')
    .single()

  if (error) {
    if (error.message.toLowerCase().includes('duplicate')) {
      throw new Error(
        'A listing with this slug or external URL already exists. Use a more specific title or confirm this is not a duplicate.'
      )
    }

    throw new Error(`Could not create opportunity: ${error.message}`)
  }

  revalidatePath('/admin/opportunities')
  revalidatePath('/opportunities')
  revalidatePath(`/opportunities/${data.slug}`)

  return data
}