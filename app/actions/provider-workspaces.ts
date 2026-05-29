'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ProviderClaimRecord = {
  id: string
  submitted_by: string | null
  organization_name: string
  website_url: string | null
  contact_email: string
  phone: string | null
  city: string
  state: string
  evidence_summary: string
  status: string
  program_id?: string | null
}

type ProviderProfileRecord = {
  id: string
  name: string
  slug: string
}

type LooseSingleQuery = {
  maybeSingle: () => Promise<{
    data: unknown
    error: { message: string } | null
  }>
  single: () => Promise<{
    data: unknown
    error: { message: string } | null
  }>
}

type LooseFilterQuery = {
  eq: (column: string, value: string) => LooseSingleQuery
}

type LooseTable = {
  select: (columns: string) => LooseFilterQuery
  insert: (values: Record<string, unknown>) => {
    select: (columns: string) => {
      single: () => Promise<{
        data: unknown
        error: { message: string } | null
      }>
    }
  }
  upsert: (
    values: Record<string, unknown>,
    options?: Record<string, unknown>
  ) => Promise<{
    data: unknown
    error: { message: string } | null
  }>
  update: (values: Record<string, unknown>) => {
    eq: (
      column: string,
      value: string
    ) => Promise<{
      data: unknown
      error: { message: string } | null
    }>
  }
}

type LooseSupabaseClient = {
  from: (table: string) => LooseTable
}

function asLooseSupabase(client: unknown) {
  return client as LooseSupabaseClient
}

function cleanString(value: string | null | undefined) {
  return value?.trim() ?? ''
}

function cleanOptionalString(value: string | null | undefined) {
  const cleaned = cleanString(value)
  return cleaned.length > 0 ? cleaned : null
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function requireAdminUser(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
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
    throw new Error('Only admins can create provider workspaces.')
  }

  return user
}

async function loadApprovedClaim(
  supabase: Awaited<ReturnType<typeof createClient>>,
  claimId: string
) {
  const providerClaims = asLooseSupabase(supabase).from('provider_claims')

  const { data, error } = await providerClaims
    .select(
      `
      id,
      submitted_by,
      organization_name,
      website_url,
      contact_email,
      phone,
      city,
      state,
      evidence_summary,
      status,
      program_id
      `
    )
    .eq('id', claimId)
    .maybeSingle()

  if (error) {
    console.error('Failed to load provider claim:', error)
    throw new Error('Could not load provider claim.')
  }

  if (!data) {
    throw new Error('Provider claim was not found.')
  }

  const claim = data as ProviderClaimRecord

  if (claim.status !== 'approved') {
    throw new Error('Provider claim must be approved before creating a workspace.')
  }

  if (!claim.submitted_by) {
    throw new Error(
      'This claim has no signed-in submitting user. Ask the provider to submit a signed-in request.'
    )
  }

  return claim
}

async function findOrCreateProviderProfile({
  supabase,
  claim,
  adminUserId,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  claim: ProviderClaimRecord
  adminUserId: string
}) {
  const providerProfiles = asLooseSupabase(supabase).from(
    'training_provider_profiles'
  )

  const baseSlug = slugify(claim.organization_name)
  const fallbackSlug = `provider-${claim.id.slice(0, 8)}`

  const { data: existingProfile, error: existingError } = await providerProfiles
    .select('id, name, slug')
    .eq('source_claim_id', claim.id)
    .maybeSingle()

  if (existingError) {
    console.error('Failed to check existing provider profile:', existingError)
    throw new Error('Could not check existing provider profile.')
  }

  if (existingProfile) {
    return existingProfile as ProviderProfileRecord
  }

  let slug = baseSlug || fallbackSlug
  let suffix = 1

  while (true) {
    const { data: slugMatch, error: slugError } = await providerProfiles
      .select('id, name, slug')
      .eq('slug', slug)
      .maybeSingle()

    if (slugError) {
      console.error('Failed to check provider slug:', slugError)
      throw new Error('Could not verify provider profile slug.')
    }

    if (!slugMatch) break

    suffix += 1
    slug = `${baseSlug || fallbackSlug}-${suffix}`
  }

  const { data: createdProfile, error: createProfileError } =
    await providerProfiles
      .insert({
        name: claim.organization_name,
        slug,
        description: cleanOptionalString(claim.evidence_summary),
        website_url: cleanOptionalString(claim.website_url),
        contact_email: claim.contact_email,
        phone: cleanOptionalString(claim.phone),
        city: claim.city,
        state: claim.state,
        verification_status: 'verified',
        source_claim_id: claim.id,
        is_active: true,
        created_by: adminUserId,
      })
      .select('id, name, slug')
      .single()

  if (createProfileError) {
    console.error('Failed to create provider profile:', createProfileError)
    throw new Error('Could not create provider profile.')
  }

  return createdProfile as ProviderProfileRecord
}

async function ensureOwnerMembership({
  supabase,
  providerProfileId,
  userId,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  providerProfileId: string
  userId: string
}) {
  const memberships = asLooseSupabase(supabase).from(
    'training_provider_memberships'
  )

  const { error } = await memberships.upsert(
    {
      provider_profile_id: providerProfileId,
      user_id: userId,
      role: 'owner',
      status: 'active',
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'provider_profile_id,user_id',
    }
  )

  if (error) {
    console.error('Failed to create provider owner membership:', error)
    throw new Error('Could not create provider owner membership.')
  }
}

async function connectLinkedProgram({
  supabase,
  claim,
  providerProfileId,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  claim: ProviderClaimRecord
  providerProfileId: string
}) {
  if (!claim.program_id) return false

  const programs = asLooseSupabase(supabase).from('programs')

  const { error } = await programs
    .update({
      provider_profile_id: providerProfileId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', claim.program_id)

  if (error) {
    console.error('Failed to connect linked program to provider profile:', error)
    throw new Error(
      'Provider workspace was created, but the linked program could not be connected.'
    )
  }

  return true
}

export async function createProviderWorkspaceFromClaim(claimId: string) {
  const supabase = createClient()
  const adminUser = await requireAdminUser(supabase)
  const claim = await loadApprovedClaim(supabase, claimId)

  const providerProfile = await findOrCreateProviderProfile({
    supabase,
    claim,
    adminUserId: adminUser.id,
  })

  await ensureOwnerMembership({
    supabase,
    providerProfileId: providerProfile.id,
    userId: claim.submitted_by,
  })

  const linkedProgramConnected = await connectLinkedProgram({
    supabase,
    claim,
    providerProfileId: providerProfile.id,
  })

  const providerClaims = asLooseSupabase(supabase).from('provider_claims')

  const programNote = linkedProgramConnected
    ? ' The linked public program was connected to the provider workspace.'
    : ''

  const { error: claimUpdateError } = await providerClaims
    .update({
      admin_notes:
        `Approved provider profile and owner membership were created from this claim.${programNote}`,
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', claim.id)

  if (claimUpdateError) {
    console.error(
      'Failed to update provider claim after workspace creation:',
      claimUpdateError
    )
    throw new Error('Workspace was created, but claim notes could not be updated.')
  }

  revalidatePath('/admin/provider-claims')
  revalidatePath('/training-providers/dashboard')
  revalidatePath('/training-providers/programs')
  revalidatePath('/admin/programs')
  revalidatePath('/programs')
}