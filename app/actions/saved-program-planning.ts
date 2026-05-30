'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ProgramPipelineStatus =
  | 'saved'
  | 'researching'
  | 'contacted'
  | 'applying'
  | 'enrolled'
  | 'completed'
  | 'closed'

type ProgramPriority = 'low' | 'medium' | 'high'

type UpdateSavedProgramPlanInput = {
  savedProgramId: string
  pipelineStatus: string
  priority: string
  targetStartDate: string
  lastContactedAt: string
  notes: string
}

type LooseTable = {
  update: (values: Record<string, unknown>) => {
    eq: (column: string, value: string) => {
      eq: (
        column: string,
        value: string
      ) => Promise<{
        error: { message: string } | null
      }>
    }
  }
  delete: () => {
    eq: (column: string, value: string) => {
      eq: (
        column: string,
        value: string
      ) => Promise<{
        error: { message: string } | null
      }>
    }
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

function cleanOptionalDate(value: string) {
  const cleaned = cleanString(value)

  if (!cleaned) return null

  const date = new Date(`${cleaned}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    throw new Error('Please enter a valid date.')
  }

  return cleaned
}

function normalizePipelineStatus(value: string): ProgramPipelineStatus {
  const allowed: ProgramPipelineStatus[] = [
    'saved',
    'researching',
    'contacted',
    'applying',
    'enrolled',
    'completed',
    'closed',
  ]

  return allowed.includes(value as ProgramPipelineStatus)
    ? (value as ProgramPipelineStatus)
    : 'saved'
}

function normalizePriority(value: string): ProgramPriority {
  const allowed: ProgramPriority[] = ['low', 'medium', 'high']

  return allowed.includes(value as ProgramPriority)
    ? (value as ProgramPriority)
    : 'medium'
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

export async function updateSavedProgramPlan(
  input: UpdateSavedProgramPlanInput
) {
  const user = await getCurrentUserOrThrow()
  const savedProgramId = cleanString(input.savedProgramId)

  if (!savedProgramId) {
    throw new Error('Saved program ID is required.')
  }

  const supabase = createClient()
  const savedPrograms = asLooseSupabase(supabase).from('saved_programs')

  const { error } = await savedPrograms
    .update({
      pipeline_status: normalizePipelineStatus(input.pipelineStatus),
      priority: normalizePriority(input.priority),
      target_start_date: cleanOptionalDate(input.targetStartDate),
      last_contacted_at: cleanOptionalDate(input.lastContactedAt),
      notes: cleanOptionalString(input.notes),
      updated_at: new Date().toISOString(),
    })
    .eq('id', savedProgramId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to update saved program plan:', error)
    throw new Error('Could not update saved program plan.')
  }

  revalidatePath('/dashboard/training-programs')
}

export async function removeSavedProgram(savedProgramId: string) {
  const user = await getCurrentUserOrThrow()
  const cleanedSavedProgramId = cleanString(savedProgramId)

  if (!cleanedSavedProgramId) {
    throw new Error('Saved program ID is required.')
  }

  const supabase = createClient()
  const savedPrograms = asLooseSupabase(supabase).from('saved_programs')

  const { error } = await savedPrograms
    .delete()
    .eq('id', cleanedSavedProgramId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to remove saved program:', error)
    throw new Error('Could not remove saved program.')
  }

  revalidatePath('/dashboard/training-programs')
}