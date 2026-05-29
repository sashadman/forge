'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ProviderClaimInput = {
  programId?: string | null
  contactName: string
  contactEmail: string
  organizationName: string
  websiteUrl: string
  phone: string
  city: string
  state: string
  roleTitle: string
  claimType: string
  programNames: string
  evidenceSummary: string
  requestedAccess: string
}

type ProviderClaimStatus = 'pending' | 'approved' | 'rejected' | 'needs_more_info'

type LinkedProgramRecord = {
  id: string
  name: string
  provider_name: string
  location: string
  state: string
  website_url: string | null
}

type LooseProviderClaimTable = {
  insert: (values: Record<string, unknown>) => Promise<{
    error: { message: string } | null
  }>
  update: (values: Record<string, unknown>) => {
    eq: (
      column: string,
      value: string
    ) => Promise<{
      error: { message: string } | null
    }>
  }
}

function cleanString(value: string) {
  return value.trim()
}

function cleanOptionalString(value: string) {
  const cleaned = cleanString(value)
  return cleaned.length > 0 ? cleaned : null
}

function cleanOptionalId(value: string | null | undefined) {
  const cleaned = value?.trim()
  return cleaned && cleaned.length > 0 ? cleaned : null
}

function cleanUrl(value: string) {
  const cleaned = cleanString(value)

  if (!cleaned) return null

  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned
  }

  return `https://${cleaned}`
}

function requireValue(value: string, message: string) {
  const cleaned = cleanString(value)

  if (!cleaned) {
    throw new Error(message)
  }

  return cleaned
}

function getProviderClaimsTable(supabase: Awaited<ReturnType<typeof createClient>>) {
  return supabase.from('provider_claims') as unknown as LooseProviderClaimTable
}

async function getCurrentUserId() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user?.id ?? null
}

async function getLinkedProgram(programId: string | null) {
  if (!programId) return null

  const supabase = createClient()

  const { data, error } = await supabase
    .from('programs')
    .select('id, name, provider_name, location, state, website_url')
    .eq('id', programId)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error('Failed to validate linked program for provider claim:', error)
    throw new Error('Could not verify the selected program.')
  }

  if (!data) {
    throw new Error('The selected program could not be found.')
  }

  return data as LinkedProgramRecord
}

function normalizeClaimType(value: string, hasLinkedProgram: boolean) {
  const allowedClaimTypes = [
    'provider_profile',
    'program_listing',
    'provider_and_programs',
  ]

  if (allowedClaimTypes.includes(value)) {
    return value
  }

  return hasLinkedProgram ? 'program_listing' : 'provider_profile'
}

export async function submitProviderClaim(input: ProviderClaimInput) {
  const supabase = createClient()
  const submittedBy = await getCurrentUserId()

  const programId = cleanOptionalId(input.programId)
  const linkedProgram = await getLinkedProgram(programId)

  const contactName = requireValue(input.contactName, 'Contact name is required.')
  const contactEmail = requireValue(input.contactEmail, 'Contact email is required.')
  const organizationName = requireValue(
    input.organizationName,
    'Organization name is required.'
  )
  const city = requireValue(input.city, 'City is required.')
  const state = requireValue(input.state, 'State is required.')
  const evidenceSummary = requireValue(
    input.evidenceSummary,
    'Please explain your connection to this provider or program.'
  )

  if (!contactEmail.includes('@')) {
    throw new Error('Please enter a valid contact email.')
  }

  const claimType = normalizeClaimType(input.claimType, Boolean(linkedProgram))

  const programNames =
    cleanOptionalString(input.programNames) ??
    (linkedProgram
      ? `${linkedProgram.name} — ${linkedProgram.provider_name}`
      : null)

  const providerClaims = getProviderClaimsTable(supabase)

  const { error } = await providerClaims.insert({
    submitted_by: submittedBy,
    program_id: linkedProgram?.id ?? null,
    contact_name: contactName,
    contact_email: contactEmail,
    organization_name: organizationName,
    website_url: cleanUrl(input.websiteUrl),
    phone: cleanOptionalString(input.phone),
    city,
    state,
    role_title: cleanOptionalString(input.roleTitle),
    claim_type: claimType,
    program_names: programNames,
    evidence_summary: evidenceSummary,
    requested_access: cleanOptionalString(input.requestedAccess),
    status: 'pending',
  })

  if (error) {
    console.error('Failed to submit provider claim:', error)
    throw new Error('Could not submit provider request. Please try again.')
  }

  revalidatePath('/admin/provider-claims')
  revalidatePath('/training-providers/claim')
}

export async function updateProviderClaimStatus({
  claimId,
  status,
  adminNotes,
}: {
  claimId: string
  status: ProviderClaimStatus
  adminNotes: string
}) {
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
    throw new Error('Only admins can update provider claims.')
  }

  const providerClaims = getProviderClaimsTable(supabase)

  const { error } = await providerClaims
    .update({
      status,
      admin_notes: cleanOptionalString(adminNotes),
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', claimId)

  if (error) {
    console.error('Failed to update provider claim:', error)
    throw new Error('Could not update provider claim.')
  }

  revalidatePath('/admin/provider-claims')
}