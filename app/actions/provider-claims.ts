'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ProviderClaimInput = {
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

function requireValue(value: string, message: string) {
  const cleaned = cleanString(value)

  if (!cleaned) {
    throw new Error(message)
  }

  return cleaned
}

async function getCurrentUserId() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user?.id ?? null
}

export async function submitProviderClaim(input: ProviderClaimInput) {
  const supabase = createClient()
  const submittedBy = await getCurrentUserId()

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

  const claimType = ['provider_profile', 'program_listing', 'provider_and_programs'].includes(
    input.claimType
  )
    ? input.claimType
    : 'provider_profile'

  const { error } = await supabase.from('provider_claims').insert({
    submitted_by: submittedBy,
    contact_name: contactName,
    contact_email: contactEmail,
    organization_name: organizationName,
    website_url: cleanUrl(input.websiteUrl),
    phone: cleanOptionalString(input.phone),
    city,
    state,
    role_title: cleanOptionalString(input.roleTitle),
    claim_type: claimType,
    program_names: cleanOptionalString(input.programNames),
    evidence_summary: evidenceSummary,
    requested_access: cleanOptionalString(input.requestedAccess),
    status: 'pending',
  })

  if (error) {
    console.error('Failed to submit provider claim:', error)
    throw new Error('Could not submit provider request. Please try again.')
  }

  revalidatePath('/admin/provider-claims')
}

export async function updateProviderClaimStatus({
  claimId,
  status,
  adminNotes,
}: {
  claimId: string
  status: 'pending' | 'approved' | 'rejected' | 'needs_more_info'
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

  const { error } = await supabase
    .from('provider_claims')
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