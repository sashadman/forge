'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type ProgramType = Database['public']['Enums']['program_type']

type CandidateReviewStatus =
  | 'candidate'
  | 'trusted_candidate'
  | 'needs_review'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'duplicate'

type PublishCandidateInput = {
  candidateId: string
  programType: ProgramType
  tradeSlug: string
  reviewNotes: string
}

type UpdateCandidateInput = {
  candidateId: string
  verificationStatus: CandidateReviewStatus
  reviewNotes: string
}

function cleanString(value: string) {
  return value.trim()
}

function cleanOptionalString(value: string | null | undefined) {
  const cleaned = value?.trim() ?? ''
  return cleaned.length > 0 ? cleaned : null
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeProgramType(value: string): ProgramType {
  const allowedTypes: ProgramType[] = [
    'apprenticeship',
    'trade_school',
    'community_college',
    'workforce_program',
    'employer_training',
  ]

  return allowedTypes.includes(value as ProgramType)
    ? (value as ProgramType)
    : 'workforce_program'
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
    throw new Error('Only admins can manage program candidates.')
  }

  return user
}

export async function updateProgramCandidateStatus(input: UpdateCandidateInput) {
  const supabase = createClient()
  const adminUser = await requireAdminUser()

  const { error } = await supabase
    .from('training_program_candidates')
    .update({
      verification_status: input.verificationStatus,
      review_notes: cleanOptionalString(input.reviewNotes),
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.candidateId)

  if (error) {
    console.error('Failed to update program candidate:', error)
    throw new Error('Could not update program candidate.')
  }

  revalidatePath('/admin/program-candidates')
}

export async function publishProgramCandidate(input: PublishCandidateInput) {
  const supabase = createClient()
  const adminUser = await requireAdminUser()

  const { data: candidate, error: candidateError } = await supabase
    .from('training_program_candidates')
    .select(
      `
      id,
      source_id,
      source_url,
      title,
      provider_name,
      program_type,
      trade_slug,
      location,
      state,
      country,
      duration,
      cost,
      description,
      requirements,
      outcomes,
      published_program_id,
      verification_status
      `
    )
    .eq('id', input.candidateId)
    .maybeSingle()

  if (candidateError) {
    console.error('Failed to load program candidate:', candidateError)
    throw new Error('Could not load program candidate.')
  }

  if (!candidate) {
    throw new Error('Program candidate was not found.')
  }

  if (candidate.published_program_id) {
    throw new Error('This candidate has already been published.')
  }

  if (candidate.verification_status === 'rejected') {
    throw new Error('Rejected candidates cannot be published.')
  }

  const title = cleanString(candidate.title)
  const providerName = cleanString(candidate.provider_name)
  const location = cleanOptionalString(candidate.location) ?? 'See provider'
  const state = cleanOptionalString(candidate.state) ?? 'US'
  const description =
    cleanOptionalString(candidate.description) ??
    `Training program listed by ${providerName}. Review the official source for the most current details.`

  if (!title) throw new Error('Candidate title is required.')
  if (!providerName) throw new Error('Candidate provider name is required.')

  const slug = createSlug(`${providerName}-${title}-${state}`)

  if (!slug) {
    throw new Error('Candidate could not create a valid public program slug.')
  }

  const { data: existingProgram } = await supabase
    .from('programs')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (existingProgram) {
    throw new Error(
      'A public program with this slug already exists. Mark this candidate as duplicate or adjust the source record before publishing.'
    )
  }

  const { data: program, error: publishError } = await supabase
    .from('programs')
    .insert({
      slug,
      name: title,
      provider_name: providerName,
      program_type: normalizeProgramType(input.programType),
      trade_slug: cleanString(input.tradeSlug) || candidate.trade_slug || 'other',
      location,
      state,
      duration: cleanOptionalString(candidate.duration),
      cost: cleanOptionalString(candidate.cost),
      description,
      requirements: candidate.requirements,
      outcomes: candidate.outcomes,
      website_url: candidate.source_url,
      is_active: true,
      review_status: 'approved',
      review_notes: cleanOptionalString(input.reviewNotes),
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      provider_profile_id: null,
      submitted_by: null,
    })
    .select('id')
    .single()

  if (publishError) {
    console.error('Failed to publish program candidate:', publishError)
    throw new Error('Could not publish program candidate.')
  }

  const { error: candidateUpdateError } = await supabase
    .from('training_program_candidates')
    .update({
      verification_status: 'published',
      published_program_id: program.id,
      review_notes: cleanOptionalString(input.reviewNotes),
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', candidate.id)

  if (candidateUpdateError) {
    console.error(
      'Program published but candidate update failed:',
      candidateUpdateError
    )
    throw new Error(
      'Program was published, but candidate status could not be updated.'
    )
  }

  revalidatePath('/admin/program-candidates')
  revalidatePath('/programs')
}