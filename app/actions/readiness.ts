'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  ReadinessItemStatus,
  ReadinessItemType,
} from '@/lib/supabase/app-types'

export type ReadinessItemRow = {
  id: string
  user_id: string
  type: ReadinessItemType
  status: ReadinessItemStatus
  file_path: string | null
  file_name: string | null
  file_size_kb: number | null
  file_mime_type: string | null
  text_content: string | null
  notes: string | null
  verified_by: string | null
  verified_at: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
}

export type ReadinessScoreRow = {
  user_id: string
  total_items: number
  completed_items: number
  required_total: number
  required_completed: number
  score_pct: number
}

async function getAuthenticatedUserId() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  return user.id
}

export async function getCurrentUserReadinessItems(): Promise<
  ReadinessItemRow[]
> {
  const supabase = createClient()
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('seeker_readiness_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to load readiness items: ${error.message}`)
  }

  return (data ?? []) as ReadinessItemRow[]
}

export async function getCurrentUserReadinessScore(): Promise<
  ReadinessScoreRow | null
> {
  const supabase = createClient()
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('seeker_readiness_scores')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load readiness score: ${error.message}`)
  }

  return (data ?? null) as ReadinessScoreRow | null
}

async function upsertReadinessItem({
  type,
  status,
  textContent,
  notes,
}: {
  type: ReadinessItemType
  status: ReadinessItemStatus
  textContent?: string | null
  notes?: string | null
}) {
  const supabase = createClient()
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('seeker_readiness_items')
    .upsert(
      {
        user_id: userId,
        type,
        status,
        text_content: textContent ?? null,
        notes: notes ?? null,
      },
      {
        onConflict: 'user_id,type',
      }
    )
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save readiness item: ${error.message}`)
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/readiness')

  return data as ReadinessItemRow
}

export async function toggleReadinessCheckbox({
  type,
  checked,
}: {
  type: ReadinessItemType
  checked: boolean
}) {
  return upsertReadinessItem({
    type,
    status: checked ? 'complete' : 'missing',
  })
}

export async function saveReadinessText({
  type,
  textContent,
}: {
  type: ReadinessItemType
  textContent: string
}) {
  const trimmed = textContent.trim()

  return upsertReadinessItem({
    type,
    textContent: trimmed || null,
    status: trimmed.length > 0 ? 'complete' : 'in_progress',
  })
}

export async function markExternalReadinessItem({
  type,
  complete,
}: {
  type: ReadinessItemType
  complete: boolean
}) {
  return upsertReadinessItem({
    type,
    status: complete ? 'complete' : 'missing',
  })
}