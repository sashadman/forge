'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  ApplicationStatus,
  ReadinessItemStatus,
  ReadinessItemType,
} from '@/lib/supabase/app-types'
import { READINESS_CONFIG } from '@/lib/readiness/readiness-config'

export type ApplicationRow = {
  id: string
  user_id: string
  opportunity_id: string
  employer_id: string
  status: ApplicationStatus
  readiness_score_at_apply: number
  readiness_required_completed_at_apply: number
  readiness_required_total_at_apply: number
  intro_message: string | null
  experience_summary: string | null
  seeker_notes: string | null
  employer_notes: string | null
  submitted_at: string
  reviewed_at: string | null
  contacted_at: string | null
  withdrawn_at: string | null
  created_at: string
  updated_at: string
}

type OpportunityForApplication = {
  id: string
  slug: string
  title: string
  employer_id: string
  is_active: boolean
}

type ReadinessScoreSnapshot = {
  user_id: string
  total_items: number
  completed_items: number
  required_total: number
  required_completed: number
  score_pct: number
}

type ReadinessItemSnapshotSource = {
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
}

async function getAuthenticatedUserId() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must sign in first.')
  }

  return user.id
}

export async function submitOpportunityApplication({
  opportunityId,
  introMessage,
  seekerNotes,
}: {
  opportunityId: string
  introMessage: string
  seekerNotes?: string
}): Promise<ApplicationRow> {
  const supabase = createClient()
  const userId = await getAuthenticatedUserId()

  const { data: opportunityData, error: opportunityError } = await supabase
    .from('opportunities')
    .select('id, slug, title, employer_id, is_active')
    .eq('id', opportunityId)
    .maybeSingle()

  if (opportunityError || !opportunityData) {
    throw new Error('Opportunity not found.')
  }

  const opportunity = opportunityData as OpportunityForApplication

  if (!opportunity.is_active) {
    throw new Error('This opportunity is no longer active.')
  }

  const { data: existingApplication } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .eq('opportunity_id', opportunityId)
    .maybeSingle()

  if (existingApplication) {
    return existingApplication as ApplicationRow
  }

  const finalIntroMessage = introMessage.trim()

  if (!finalIntroMessage) {
    throw new Error('Please add a short intro message before applying.')
  }

  const [{ data: readinessScoreData }, { data: readinessItemsData }] =
    await Promise.all([
      supabase
        .from('seeker_readiness_scores')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(),

      supabase
        .from('seeker_readiness_items')
        .select('*')
        .eq('user_id', userId),
    ])

  const readinessScore =
    (readinessScoreData ?? null) as ReadinessScoreSnapshot | null

  const readinessItems =
    (readinessItemsData ?? []) as ReadinessItemSnapshotSource[]

  const experienceSummary =
    readinessItems.find((item) => item.type === 'experience_summary')
      ?.text_content ?? null

  const { data: applicationData, error: applicationError } = await supabase
    .from('applications')
    .insert({
      user_id: userId,
      opportunity_id: opportunityId,
      employer_id: opportunity.employer_id,
      status: 'submitted',
      readiness_score_at_apply: readinessScore?.score_pct ?? 0,
      readiness_required_completed_at_apply:
        readinessScore?.required_completed ?? 0,
      readiness_required_total_at_apply: readinessScore?.required_total ?? 0,
      intro_message: finalIntroMessage,
      experience_summary: experienceSummary,
      seeker_notes: seekerNotes?.trim() || null,
    })
    .select('*')
    .single()

  if (applicationError) {
    throw new Error(`Failed to submit application: ${applicationError.message}`)
  }

  const application = applicationData as ApplicationRow

  if (readinessItems.length > 0) {
    const snapshots = readinessItems.map((item) => ({
      application_id: application.id,
      type: item.type,
      status: item.status,
      label: READINESS_CONFIG[item.type].label,
      file_path: item.file_path,
      file_name: item.file_name,
      file_size_kb: item.file_size_kb,
      file_mime_type: item.file_mime_type,
      text_content: item.text_content,
      notes: item.notes,
    }))

    const { error: snapshotError } = await supabase
      .from('application_readiness_snapshots')
      .insert(snapshots)

    if (snapshotError) {
      throw new Error(
        `Application submitted, but readiness snapshot failed: ${snapshotError.message}`
      )
    }
  }

  await supabase.from('application_events').insert({
    application_id: application.id,
    actor_id: userId,
    old_status: null,
    new_status: 'submitted',
    note: 'Application submitted by seeker.',
  })

  await supabase.from('opportunity_pipeline').upsert(
    {
      user_id: userId,
      opportunity_id: opportunityId,
      status: 'applied',
      last_action_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,opportunity_id',
    }
  )

  await supabase.from('saved_opportunities').upsert(
    {
      user_id: userId,
      opportunity_id: opportunityId,
    },
    {
      onConflict: 'user_id,opportunity_id',
    }
  )

  revalidatePath('/dashboard')
  revalidatePath(`/opportunities/${opportunity.slug}`)

  return application
}

export async function withdrawOpportunityApplication({
  applicationId,
}: {
  applicationId: string
}): Promise<ApplicationRow> {
  const supabase = createClient()
  const userId = await getAuthenticatedUserId()

  const { data: existingApplicationData, error: loadError } = await supabase
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .eq('user_id', userId)
    .maybeSingle()

  if (loadError || !existingApplicationData) {
    throw new Error('Application not found.')
  }

  const existingApplication = existingApplicationData as ApplicationRow

  if (existingApplication.status === 'withdrawn') {
    return existingApplication
  }

  const { data: updatedApplicationData, error: updateError } = await supabase
    .from('applications')
    .update({
      status: 'withdrawn',
      withdrawn_at: new Date().toISOString(),
    })
    .eq('id', applicationId)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (updateError) {
    throw new Error(`Failed to withdraw application: ${updateError.message}`)
  }

  const updatedApplication = updatedApplicationData as ApplicationRow

  await supabase.from('application_events').insert({
    application_id: applicationId,
    actor_id: userId,
    old_status: existingApplication.status,
    new_status: 'withdrawn',
    note: 'Application withdrawn by seeker.',
  })

  await supabase
    .from('opportunity_pipeline')
    .update({
      status: 'closed',
      last_action_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('opportunity_id', existingApplication.opportunity_id)

  revalidatePath('/dashboard')

  return updatedApplication
}