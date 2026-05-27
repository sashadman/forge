'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type ProgramType = Database['public']['Enums']['program_type']

type ProgramReviewStatus =
  | 'admin_created'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_more_info'

type ProviderProgramInput = {
  providerProfileId: string
  name: string
  programType: ProgramType
  tradeSlug: string
  location: string
  state: string
  duration: string
  cost: string
  description: string
  requirements: string
  outcomes: string
  websiteUrl: string
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanString(value: string) {
  return value.trim()
}

function cleanOptionalString(value: string) {
  const cleaned = cleanString(value)
  return cleaned.length > 0 ? cleaned : null
}

function cleanUrl(value: string) {
  const cleaned = cleanString(value)

  if (!cleaned) return null

  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned
  }

  return `https://${cleaned}`
}

function splitLines(value: string) {
  const lines = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return lines.length > 0 ? lines : null
}

async function getCurrentUser() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be signed in.')
  }

  return user
}

async function userCanManageProvider(providerProfileId: string, userId: string) {
  const supabase = createClient()

  const { data: membership, error } = await supabase
    .from('training_provider_memberships')
    .select('id, role, status')
    .eq('provider_profile_id', providerProfileId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()

  if (error) {
    console.error('Failed to check provider membership:', error)
    throw new Error('Could not verify provider membership.')
  }

  return Boolean(
    membership &&
      (membership.role === 'owner' || membership.role === 'manager')
  )
}

async function requireAdminUser() {
  const supabase = createClient()
  const user = await getCurrentUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    throw new Error('Only admins can perform this action.')
  }

  return user
}

export async function submitProviderProgram(input: ProviderProgramInput) {
  const supabase = createClient()
  const user = await getCurrentUser()

  const canManage = await userCanManageProvider(input.providerProfileId, user.id)

  if (!canManage) {
    throw new Error('You do not have permission to submit programs for this provider.')
  }

  const { data: providerProfile, error: providerError } = await supabase
    .from('training_provider_profiles')
    .select('id, name, slug, city, state, contact_email, website_url')
    .eq('id', input.providerProfileId)
    .maybeSingle()

  if (providerError) {
    console.error('Failed to load provider profile:', providerError)
    throw new Error('Could not load provider profile.')
  }

  if (!providerProfile) {
    throw new Error('Provider profile was not found.')
  }

  const name = cleanString(input.name)
  const location = cleanString(input.location)
  const state = cleanString(input.state)
  const description = cleanString(input.description)

  if (!name) throw new Error('Program name is required.')
  if (!location) throw new Error('Program city is required.')
  if (!state) throw new Error('Program state is required.')
  if (!description) throw new Error('Program description is required.')

  const slug = createSlug(`${providerProfile.slug}-${name}`)

  if (!slug) {
    throw new Error('Program name cannot create a valid slug.')
  }

  const { data: existingProgram } = await supabase
    .from('programs')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (existingProgram) {
    throw new Error(
      'A program with this provider/name slug already exists. Use a more specific program name.'
    )
  }

  const { error } = await supabase.from('programs').insert({
    provider_profile_id: providerProfile.id,
    submitted_by: user.id,
    provider_name: providerProfile.name,
    slug,
    name,
    program_type: input.programType,
    trade_slug: input.tradeSlug,
    location,
    state,
    duration: cleanOptionalString(input.duration),
    cost: cleanOptionalString(input.cost),
    description,
    requirements: splitLines(input.requirements),
    outcomes: splitLines(input.outcomes),
    website_url: cleanUrl(input.websiteUrl) ?? providerProfile.website_url,
    review_status: 'pending',
    is_active: false,
  })

  if (error) {
    console.error('Failed to submit provider program:', error)
    throw new Error('Could not submit training program.')
  }

  revalidatePath('/training-providers/programs')
  revalidatePath('/admin/provider-programs')
}

export async function updateProviderProgramReviewStatus({
  programId,
  status,
  reviewNotes,
}: {
  programId: string
  status: ProgramReviewStatus
  reviewNotes: string
}) {
  const supabase = createClient()
  const adminUser = await requireAdminUser()

  const approved = status === 'approved'

  const { error } = await supabase
    .from('programs')
    .update({
      review_status: status,
      review_notes: cleanOptionalString(reviewNotes),
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      published_at: approved ? new Date().toISOString() : null,
      is_active: approved,
      updated_at: new Date().toISOString(),
    })
    .eq('id', programId)

  if (error) {
    console.error('Failed to update provider program review:', error)
    throw new Error('Could not update program review status.')
  }

  revalidatePath('/admin/provider-programs')
  revalidatePath('/programs')
}