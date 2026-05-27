'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

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

function cleanUrl(value: string | null) {
  const cleaned = value?.trim() ?? ''

  if (!cleaned) return null

  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned
  }

  return `https://${cleaned}`
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
    throw new Error('Only admins can perform this action.')
  }

  return user
}

export async function createProviderProfileFromClaim(claimId: string) {
  const supabase = createClient()
  const adminUser = await requireAdminUser()

  const { data: claim, error: claimError } = await supabase
    .from('provider_claims')
    .select(
      `
      id,
      submitted_by,
      contact_name,
      contact_email,
      organization_name,
      website_url,
      phone,
      city,
      state,
      evidence_summary,
      status
      `
    )
    .eq('id', claimId)
    .maybeSingle()

  if (claimError) {
    console.error('Failed to load provider claim:', claimError)
    throw new Error('Could not load provider claim.')
  }

  if (!claim) {
    throw new Error('Provider claim was not found.')
  }

  if (claim.status !== 'approved') {
    throw new Error('Only approved provider claims can create provider profiles.')
  }

  if (!claim.submitted_by) {
    throw new Error(
      'This claim was submitted without a signed-in user. Ask the provider to sign in and submit a new request before creating a workspace.'
    )
  }

  const baseSlug = createSlug(claim.organization_name)

  if (!baseSlug) {
    throw new Error('Provider organization name cannot create a valid slug.')
  }

  const { data: existingProvider } = await supabase
    .from('training_provider_profiles')
    .select('id')
    .eq('source_claim_id', claim.id)
    .maybeSingle()

  if (existingProvider) {
    throw new Error('A provider profile has already been created from this claim.')
  }

  const { data: providerProfile, error: providerError } = await supabase
    .from('training_provider_profiles')
    .insert({
      name: claim.organization_name,
      slug: baseSlug,
      description: claim.evidence_summary,
      website_url: cleanUrl(claim.website_url),
      contact_email: claim.contact_email,
      phone: cleanOptionalString(claim.phone ?? ''),
      city: claim.city,
      state: claim.state,
      verification_status: 'verified',
      source_claim_id: claim.id,
      is_active: true,
      created_by: adminUser.id,
    })
    .select('id')
    .single()

  if (providerError) {
    console.error('Failed to create provider profile:', providerError)

    if (providerError.message.toLowerCase().includes('duplicate')) {
      throw new Error(
        'A provider profile with this slug already exists. Rename the provider claim organization before creating the profile.'
      )
    }

    throw new Error('Could not create provider profile.')
  }

  const { error: membershipError } = await supabase
    .from('training_provider_memberships')
    .insert({
      provider_profile_id: providerProfile.id,
      user_id: claim.submitted_by,
      role: 'owner',
      status: 'active',
    })

  if (membershipError) {
    console.error('Failed to create provider membership:', membershipError)
    throw new Error('Provider profile was created, but membership could not be created.')
  }

  await supabase
    .from('provider_claims')
    .update({
      admin_notes:
        'Approved provider profile and owner membership were created from this claim.',
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', claim.id)

  revalidatePath('/admin/provider-claims')
  revalidatePath('/training-providers/dashboard')
}

export async function updateTrainingProviderProfile({
  providerProfileId,
  name,
  description,
  websiteUrl,
  contactEmail,
  phone,
  city,
  state,
}: {
  providerProfileId: string
  name: string
  description: string
  websiteUrl: string
  contactEmail: string
  phone: string
  city: string
  state: string
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be signed in.')
  }

  const cleanedName = cleanString(name)
  const cleanedCity = cleanString(city)
  const cleanedState = cleanString(state)
  const cleanedContactEmail = cleanString(contactEmail)

  if (!cleanedName) throw new Error('Provider name is required.')
  if (!cleanedCity) throw new Error('City is required.')
  if (!cleanedState) throw new Error('State is required.')
  if (!cleanedContactEmail.includes('@')) {
    throw new Error('Please enter a valid contact email.')
  }

  const { data: membership } = await supabase
    .from('training_provider_memberships')
    .select('id, role, status')
    .eq('provider_profile_id', providerProfileId)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const canEdit =
    profile?.role === 'admin' ||
    (membership &&
      (membership.role === 'owner' || membership.role === 'manager'))

  if (!canEdit) {
    throw new Error('You do not have permission to update this provider profile.')
  }

  const { error } = await supabase
    .from('training_provider_profiles')
    .update({
      name: cleanedName,
      description: cleanOptionalString(description),
      website_url: cleanUrl(websiteUrl),
      contact_email: cleanedContactEmail,
      phone: cleanOptionalString(phone),
      city: cleanedCity,
      state: cleanedState,
      updated_at: new Date().toISOString(),
    })
    .eq('id', providerProfileId)

  if (error) {
    console.error('Failed to update provider profile:', error)
    throw new Error('Could not update provider profile.')
  }

  revalidatePath('/training-providers/dashboard')
  revalidatePath('/training-providers/profile')
}