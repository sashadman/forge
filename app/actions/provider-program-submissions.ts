'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ProviderProgramSubmissionInput = {
  providerProfileId: string
  name: string
  programType: string
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

type ProviderProfileRecord = {
  id: string
  name: string
  city: string
  state: string
}

type ProgramType =
  | 'apprenticeship'
  | 'trade_school'
  | 'community_college'
  | 'workforce_program'
  | 'employer_training'

type LooseTable = {
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      maybeSingle: () => Promise<{
        data: unknown
        error: { message: string } | null
      }>
    }
  }
  insert: (values: Record<string, unknown>) => Promise<{
    error: { message: string } | null
  }>
}

type LooseSupabaseClient = {
  from: (table: string) => LooseTable
}

function asLooseSupabase(client: unknown) {
  return client as LooseSupabaseClient
}

function cleanString(value: string) {
  return value.trim()
}

function cleanOptionalString(value: string) {
  const cleaned = cleanString(value)
  return cleaned.length > 0 ? cleaned : null
}

function cleanLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function cleanUrl(value: string) {
  const cleaned = cleanString(value)

  if (!cleaned) return null

  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned
  }

  return `https://${cleaned}`
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeProgramType(value: string): ProgramType {
  const allowed: ProgramType[] = [
    'apprenticeship',
    'trade_school',
    'community_college',
    'workforce_program',
    'employer_training',
  ]

  return allowed.includes(value as ProgramType)
    ? (value as ProgramType)
    : 'workforce_program'
}

function requireValue(value: string, message: string) {
  const cleaned = cleanString(value)

  if (!cleaned) {
    throw new Error(message)
  }

  return cleaned
}

async function getCurrentUserOrThrow() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be signed in.')
  }

  return user
}

async function loadProviderProfileForUser({
  providerProfileId,
  userId,
}: {
  providerProfileId: string
  userId: string
}) {
  const supabase = createClient()

  const { data: membership, error: membershipError } = await supabase
    .from('training_provider_memberships')
    .select('id, role, status')
    .eq('provider_profile_id', providerProfileId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()

  if (membershipError) {
    console.error('Failed to verify provider membership:', membershipError)
    throw new Error('Could not verify provider access.')
  }

  if (
    !membership ||
    (membership.role !== 'owner' && membership.role !== 'manager')
  ) {
    throw new Error('You do not have permission to submit programs for this provider.')
  }

  const { data: providerProfile, error: providerProfileError } = await supabase
    .from('training_provider_profiles')
    .select('id, name, city, state')
    .eq('id', providerProfileId)
    .maybeSingle()

  if (providerProfileError) {
    console.error('Failed to load provider profile:', providerProfileError)
    throw new Error('Could not load provider profile.')
  }

  if (!providerProfile) {
    throw new Error('Provider profile was not found.')
  }

  return providerProfile as ProviderProfileRecord
}

async function createUniqueProgramSlug(baseValue: string) {
  const supabase = createClient()
  const programs = asLooseSupabase(supabase).from('programs')

  const baseSlug = slugify(baseValue) || `program-${Date.now()}`
  let slug = baseSlug
  let suffix = 1

  while (true) {
    const { data, error } = await programs
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      console.error('Failed to check program slug:', error)
      throw new Error('Could not verify program URL slug.')
    }

    if (!data) return slug

    suffix += 1
    slug = `${baseSlug}-${suffix}`
  }
}

export async function submitProviderProgramForReview(
  input: ProviderProgramSubmissionInput
) {
  const user = await getCurrentUserOrThrow()

  const providerProfileId = requireValue(
    input.providerProfileId,
    'Provider profile ID is required.'
  )

  const providerProfile = await loadProviderProfileForUser({
    providerProfileId,
    userId: user.id,
  })

  const name = requireValue(input.name, 'Program name is required.')
  const tradeSlug = requireValue(input.tradeSlug, 'Career focus is required.')
  const location = requireValue(input.location, 'Location is required.')
  const state = requireValue(input.state, 'State is required.')
  const description = requireValue(
    input.description,
    'Program description is required.'
  )

  if (description.length < 80) {
    throw new Error('Please provide a stronger program description of at least 80 characters.')
  }

  const requirements = cleanLines(input.requirements)
  const outcomes = cleanLines(input.outcomes)

  const slug = await createUniqueProgramSlug(`${providerProfile.name}-${name}`)

  const supabase = createClient()
  const programs = asLooseSupabase(supabase).from('programs')

  const { error } = await programs.insert({
    slug,
    name,
    provider_name: providerProfile.name,
    program_type: normalizeProgramType(input.programType),
    trade_slug: tradeSlug,
    location,
    state,
    duration: cleanOptionalString(input.duration),
    cost: cleanOptionalString(input.cost),
    description,
    requirements,
    outcomes,
    website_url: cleanUrl(input.websiteUrl),
    is_active: false,
    provider_profile_id: providerProfile.id,
    submitted_by: user.id,
    review_status: 'pending',
    review_notes: null,
    published_at: null,
  })

  if (error) {
    console.error('Failed to submit provider program:', error)
    throw new Error('Could not submit program for review.')
  }

  revalidatePath('/training-providers/programs')
  revalidatePath('/admin/provider-programs')
  revalidatePath('/admin/programs')
}