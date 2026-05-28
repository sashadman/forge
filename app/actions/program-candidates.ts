'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ProgramCandidateReviewFilters = {
  status?: string
  trade?: string
  search?: string
  limit?: number
  offset?: number
}

type SupabaseRpcClient = {
  rpc: (
    fn: string,
    args?: Record<string, unknown>
  ) => Promise<{
    data: unknown
    error: { message: string } | null
  }>
  from: (table: string) => {
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
}

type CandidateActionInput =
  | FormData
  | {
      candidateId: string
      status?: string
      verificationStatus?: string
      programType?: string
      tradeSlug?: string
      notes?: string
      reviewNotes?: string
    }

function asRpcClient(client: unknown) {
  return client as SupabaseRpcClient
}

function getCandidateId(input: CandidateActionInput) {
  if (input instanceof FormData) {
    const candidateId = input.get('candidateId')

    if (typeof candidateId !== 'string' || candidateId.length === 0) {
      throw new Error('Candidate ID is required.')
    }

    return candidateId
  }

  if (!input.candidateId) {
    throw new Error('Candidate ID is required.')
  }

  return input.candidateId
}

function getNotes(input: CandidateActionInput, fallback: string) {
  if (input instanceof FormData) {
    const notes = input.get('notes')

    return typeof notes === 'string' && notes.trim().length > 0
      ? notes.trim()
      : fallback
  }

  return input.notes?.trim() || input.reviewNotes?.trim() || fallback
}

export async function getProgramCandidatesForReview({
  status = 'trusted_candidate',
  trade,
  search,
  limit = 50,
  offset = 0,
}: ProgramCandidateReviewFilters = {}) {
  const supabase = asRpcClient(await createClient())

  const { data, error } = await supabase.rpc(
    'list_training_program_candidates_for_review',
    {
      requested_status: status || null,
      requested_trade_slug: trade || null,
      search_text: search || null,
      result_limit: limit,
      result_offset: offset,
    }
  )

  if (error) {
    throw new Error(`Failed to load program candidates: ${error.message}`)
  }

  return data ?? []
}

export async function promoteProgramCandidate(input: CandidateActionInput) {
  const candidateId = getCandidateId(input)
  const supabase = asRpcClient(await createClient())

  const { error } = await supabase.rpc('promote_training_program_candidate', {
    candidate_id: candidateId,
  })

  if (error) {
    throw new Error(`Failed to promote candidate: ${error.message}`)
  }

  revalidatePath('/admin/program-candidates')
  revalidatePath('/admin/programs')
  revalidatePath('/programs')
}

export async function rejectProgramCandidate(input: CandidateActionInput) {
  const candidateId = getCandidateId(input)
  const notes = getNotes(input, 'Rejected from admin candidate review queue.')
  const supabase = asRpcClient(await createClient())

  const { error } = await supabase.rpc('reject_training_program_candidate', {
    candidate_id: candidateId,
    notes,
  })

  if (error) {
    throw new Error(`Failed to reject candidate: ${error.message}`)
  }

  revalidatePath('/admin/program-candidates')
}

export async function markProgramCandidateDuplicate(formData: FormData) {
  const candidateId = formData.get('candidateId')
  const duplicateCandidateId = formData.get('duplicateCandidateId')
  const notes = formData.get('notes')

  if (typeof candidateId !== 'string' || candidateId.length === 0) {
    throw new Error('Candidate ID is required.')
  }

  if (
    typeof duplicateCandidateId !== 'string' ||
    duplicateCandidateId.length === 0
  ) {
    throw new Error('Duplicate candidate ID is required.')
  }

  const supabase = asRpcClient(await createClient())

  const { error } = await supabase.rpc(
    'mark_training_program_candidate_duplicate',
    {
      candidate_id: candidateId,
      duplicate_candidate_id: duplicateCandidateId,
      notes:
        typeof notes === 'string' && notes.trim().length > 0
          ? notes.trim()
          : 'Marked as duplicate from admin candidate review queue.',
    }
  )

  if (error) {
    throw new Error(`Failed to mark candidate duplicate: ${error.message}`)
  }

  revalidatePath('/admin/program-candidates')
}

/**
 * Backward-compatible action used by older admin candidate components.
 */
export async function publishProgramCandidate(input: CandidateActionInput) {
  return promoteProgramCandidate(input)
}

/**
 * Backward-compatible action used by older admin candidate components.
 */
export async function updateProgramCandidateStatus(input: CandidateActionInput) {
  const candidateId = getCandidateId(input)
  const status = input instanceof FormData 
  ? input.get('status')
   : input.status ?? input.verificationStatus
  const notes = getNotes(input, 'Updated from admin candidate review queue.')

  if (status === 'rejected') {
    return rejectProgramCandidate(input)
  }

  if (status === 'published') {
    return promoteProgramCandidate(input)
  }

  if (
    status !== 'candidate' &&
    status !== 'trusted_candidate' &&
    status !== 'needs_review' &&
    status !== 'approved' &&
    status !== 'duplicate'
  ) {
    throw new Error('Unsupported candidate status update.')
  }

  const supabase = asRpcClient(await createClient())

  const { error } = await supabase
    .from('training_program_candidates')
    .update({
      verification_status: status,
      review_notes: notes,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', candidateId)

  if (error) {
    throw new Error(`Failed to update candidate status: ${error.message}`)
  }

  revalidatePath('/admin/program-candidates')
}