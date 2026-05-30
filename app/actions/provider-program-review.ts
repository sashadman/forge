'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ProviderProgramReviewStatus = 'approved' | 'rejected' | 'needs_more_info'

type LooseTable = {
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
    throw new Error('Only admins can review provider programs.')
  }

  return user
}

export async function reviewProviderProgram({
  programId,
  status,
  reviewNotes,
}: {
  programId: string
  status: ProviderProgramReviewStatus
  reviewNotes: string
}) {
  const adminUser = await requireAdminUser()
  const supabase = createClient()
  const programs = asLooseSupabase(supabase).from('programs')

  const now = new Date().toISOString()

  const shouldPublish = status === 'approved'

  const { error } = await programs
    .update({
      review_status: status,
      review_notes: cleanOptionalString(reviewNotes),
      reviewed_by: adminUser.id,
      reviewed_at: now,
      is_active: shouldPublish,
      published_at: shouldPublish ? now : null,
      updated_at: now,
    })
    .eq('id', programId)

  if (error) {
    console.error('Failed to review provider program:', error)
    throw new Error('Could not update provider program review status.')
  }

  revalidatePath('/admin/provider-programs')
  revalidatePath('/admin/programs')
  revalidatePath('/training-providers/programs')
  revalidatePath('/programs')
}