'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ApplicationStatus } from '@/lib/supabase/app-types'

type UpdateApplicationReviewInput = {
  applicationId: string
  status: ApplicationStatus
  employerNotes?: string
  eventNote?: string
}

function cleanOptionalText(value?: string) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

async function getCurrentUserAndRole() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must sign in first.')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  return {
    userId: user.id,
    role: profile?.role ?? null,
  }
}

export async function updateApplicationReview({
  applicationId,
  status,
  employerNotes,
  eventNote,
}: UpdateApplicationReviewInput) {
  const supabase = createClient()
  const { userId } = await getCurrentUserAndRole()

  if (status === 'withdrawn') {
    throw new Error('Employers and admins should not withdraw seeker applications.')
  }

  const { data: existingApplication, error: existingError } = await supabase
    .from('applications')
    .select('id, status')
    .eq('id', applicationId)
    .single()

  if (existingError || !existingApplication) {
    throw new Error('Application could not be found or accessed.')
  }

  const oldStatus = existingApplication.status as ApplicationStatus
  const now = new Date().toISOString()

  const updatePayload: {
    status: ApplicationStatus
    employer_notes: string | null
    reviewed_at?: string
    contacted_at?: string
  } = {
    status,
    employer_notes: cleanOptionalText(employerNotes),
  }

  if (status === 'reviewed' || status === 'contacted') {
    updatePayload.reviewed_at = now
  }

  if (
    status === 'contacted' ||
    status === 'interviewing' ||
    status === 'offered'
  ) {
    updatePayload.contacted_at = now
  }

  const { data: updatedApplication, error: updateError } = await supabase
    .from('applications')
    .update(updatePayload)
    .eq('id', applicationId)
    .select('id, status')
    .single()

  if (updateError || !updatedApplication) {
    throw new Error(
      updateError?.message || 'Could not update application review.'
    )
  }

  const note =
    cleanOptionalText(eventNote) ??
    `Application status changed from ${oldStatus} to ${status}.`

  const { error: eventError } = await supabase.from('application_events').insert({
    application_id: applicationId,
    actor_id: userId,
    old_status: oldStatus,
    new_status: status,
    note,
  })

  if (eventError) {
    throw new Error(`Application updated, but event log failed: ${eventError.message}`)
  }

  revalidatePath('/employers/applications')
  revalidatePath('/admin/applications')
  revalidatePath('/dashboard')

  return updatedApplication
}