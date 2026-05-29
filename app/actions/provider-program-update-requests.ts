'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ProviderProgramUpdateInput = {
  programId: string
  requestType: string
  changeSummary: string
  proposedName: string
  proposedDescription: string
  proposedDuration: string
  proposedCost: string
  proposedWebsiteUrl: string
  proposedRequirements: string
  proposedOutcomes: string
}

type UpdateRequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_more_info'

type RequestedChanges = {
  proposed_name?: unknown
  proposed_description?: unknown
  proposed_duration?: unknown
  proposed_cost?: unknown
  proposed_website_url?: unknown
  proposed_requirements?: unknown
  proposed_outcomes?: unknown
}

type ProgramUpdateRequestRecord = {
  id: string
  program_id: string
  provider_profile_id: string
  request_type: string
  requested_changes: RequestedChanges
  change_summary: string
  status: string
  admin_notes: string | null
  programs:
    | {
        id: string
        slug: string
      }
    | null
}

type LooseSelectQuery = {
  eq: (column: string, value: string) => {
    maybeSingle: () => Promise<{
      data: unknown
      error: { message: string } | null
    }>
  }
  order: (
    column: string,
    options?: { ascending?: boolean }
  ) => Promise<{
    data: unknown
    error: { message: string } | null
  }>
}

type LooseTable = {
  select: (columns: string) => LooseSelectQuery
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

function getStringValue(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null
}

function getStringArrayValue(value: unknown) {
  if (!Array.isArray(value)) return null

  const cleaned = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)

  return cleaned.length > 0 ? cleaned : null
}

function normalizeRequestType(value: string) {
  const allowed = [
    'correction',
    'content_update',
    'availability_update',
    'cost_update',
    'general_update',
  ]

  return allowed.includes(value) ? value : 'correction'
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

async function requireAdminUser() {
  const supabase = createClient()
  const user = await getCurrentUserOrThrow()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    throw new Error('Only admins can update provider program requests.')
  }

  return user
}

async function loadProviderProgramForUser(programId: string, userId: string) {
  const supabase = createClient()

  const { data: program, error: programError } = await supabase
    .from('programs')
    .select(
      `
      id,
      name,
      slug,
      provider_profile_id,
      training_provider_profiles (
        id,
        name
      )
      `
    )
    .eq('id', programId)
    .maybeSingle()

  if (programError) {
    console.error('Failed to load provider program:', programError)
    throw new Error('Could not load the selected program.')
  }

  if (!program || !program.provider_profile_id) {
    throw new Error('This program is not connected to a provider workspace.')
  }

  const { data: membership, error: membershipError } = await supabase
    .from('training_provider_memberships')
    .select('id, role, status')
    .eq('provider_profile_id', program.provider_profile_id)
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
    throw new Error('You do not have permission to request updates for this program.')
  }

  return {
    id: program.id,
    name: program.name,
    slug: program.slug,
    providerProfileId: program.provider_profile_id,
  }
}

async function loadProgramUpdateRequest(requestId: string) {
  const supabase = createClient()

  const { data, error } = await asLooseSupabase(supabase)
    .from('provider_program_update_requests')
    .select(
      `
      id,
      program_id,
      provider_profile_id,
      request_type,
      requested_changes,
      change_summary,
      status,
      admin_notes,
      programs (
        id,
        slug
      )
      `
    )
    .eq('id', requestId)
    .maybeSingle()

  if (error) {
    console.error('Failed to load provider program update request:', error)
    throw new Error('Could not load update request.')
  }

  if (!data) {
    throw new Error('Update request was not found.')
  }

  return data as ProgramUpdateRequestRecord
}

function buildProgramUpdatePayload(
  requestedChanges: RequestedChanges,
  adminUserId: string
) {
  const payload: Record<string, unknown> = {
    reviewed_by: adminUserId,
    reviewed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const proposedName = getStringValue(requestedChanges.proposed_name)
  const proposedDescription = getStringValue(
    requestedChanges.proposed_description
  )
  const proposedDuration = getStringValue(requestedChanges.proposed_duration)
  const proposedCost = getStringValue(requestedChanges.proposed_cost)
  const proposedWebsiteUrl = getStringValue(
    requestedChanges.proposed_website_url
  )
  const proposedRequirements = getStringArrayValue(
    requestedChanges.proposed_requirements
  )
  const proposedOutcomes = getStringArrayValue(
    requestedChanges.proposed_outcomes
  )

  if (proposedName) payload.name = proposedName
  if (proposedDescription) payload.description = proposedDescription
  if (proposedDuration) payload.duration = proposedDuration
  if (proposedCost) payload.cost = proposedCost
  if (proposedWebsiteUrl) payload.website_url = proposedWebsiteUrl
  if (proposedRequirements) payload.requirements = proposedRequirements
  if (proposedOutcomes) payload.outcomes = proposedOutcomes

  return payload
}

export async function submitProviderProgramUpdateRequest(
  input: ProviderProgramUpdateInput
) {
  const user = await getCurrentUserOrThrow()

  const programId = cleanString(input.programId)
  const changeSummary = cleanString(input.changeSummary)

  if (!programId) {
    throw new Error('Program ID is required.')
  }

  if (!changeSummary) {
    throw new Error('Please summarize the requested change.')
  }

  const program = await loadProviderProgramForUser(programId, user.id)

  const requestedChanges = {
    proposed_name: cleanOptionalString(input.proposedName),
    proposed_description: cleanOptionalString(input.proposedDescription),
    proposed_duration: cleanOptionalString(input.proposedDuration),
    proposed_cost: cleanOptionalString(input.proposedCost),
    proposed_website_url: cleanOptionalString(input.proposedWebsiteUrl),
    proposed_requirements: cleanLines(input.proposedRequirements),
    proposed_outcomes: cleanLines(input.proposedOutcomes),
  }

  const supabase = createClient()
  const updateRequests = asLooseSupabase(supabase).from(
    'provider_program_update_requests'
  )

  const { error } = await updateRequests.insert({
    program_id: program.id,
    provider_profile_id: program.providerProfileId,
    submitted_by: user.id,
    request_type: normalizeRequestType(input.requestType),
    requested_changes: requestedChanges,
    change_summary: changeSummary,
    status: 'pending',
  })

  if (error) {
    console.error('Failed to submit provider program update request:', error)
    throw new Error('Could not submit update request.')
  }

  revalidatePath('/training-providers/programs')
  revalidatePath(`/training-providers/programs/${program.id}/request-update`)
  revalidatePath('/admin/program-update-requests')
}

export async function updateProviderProgramUpdateRequestStatus({
  requestId,
  status,
  adminNotes,
}: {
  requestId: string
  status: UpdateRequestStatus
  adminNotes: string
}) {
  const adminUser = await requireAdminUser()
  const supabase = createClient()
  const updateRequests = asLooseSupabase(supabase).from(
    'provider_program_update_requests'
  )

  const { error } = await updateRequests
    .update({
      status,
      admin_notes: cleanOptionalString(adminNotes),
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId)

  if (error) {
    console.error('Failed to update provider program update request:', error)
    throw new Error('Could not update request status.')
  }

  revalidatePath('/admin/program-update-requests')
  revalidatePath('/training-providers/programs')
}

export async function approveAndApplyProviderProgramUpdateRequest({
  requestId,
  adminNotes,
}: {
  requestId: string
  adminNotes: string
}) {
  const adminUser = await requireAdminUser()
  const request = await loadProgramUpdateRequest(requestId)
  const supabase = createClient()

  if (request.status === 'rejected') {
    throw new Error('Rejected requests cannot be applied.')
  }

  const programUpdatePayload = buildProgramUpdatePayload(
    request.requested_changes,
    adminUser.id
  )

  const programs = asLooseSupabase(supabase).from('programs')
  const updateRequests = asLooseSupabase(supabase).from(
    'provider_program_update_requests'
  )

  const { error: programUpdateError } = await programs
    .update(programUpdatePayload)
    .eq('id', request.program_id)

  if (programUpdateError) {
    console.error('Failed to apply program update request:', programUpdateError)
    throw new Error('Could not apply changes to the program record.')
  }

  const { error: requestUpdateError } = await updateRequests
    .update({
      status: 'approved',
      admin_notes:
        cleanOptionalString(adminNotes) ??
        'Approved and applied to public program record.',
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', request.id)

  if (requestUpdateError) {
    console.error(
      'Program was updated but request status could not be updated:',
      requestUpdateError
    )
    throw new Error(
      'Program was updated, but the request status could not be updated.'
    )
  }

  revalidatePath('/admin/program-update-requests')
  revalidatePath('/training-providers/programs')
  revalidatePath('/programs')
  revalidatePath(`/programs/${request.programs?.slug ?? ''}`)
}