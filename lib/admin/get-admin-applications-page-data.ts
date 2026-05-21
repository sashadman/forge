import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type {
  ApplicationEventItem,
  ApplicationReadinessSnapshotItem,
  ApplicationReviewItem,
  ApplicationEmployerSummary,
  ApplicationOpportunitySummary,
} from '@/lib/employers/get-employer-applications-page-data'

type RawEmployerRelation =
  | ApplicationEmployerSummary
  | ApplicationEmployerSummary[]
  | null

type RawOpportunityRelation =
  | (ApplicationOpportunitySummary & {
      employers: RawEmployerRelation
    })
  | (ApplicationOpportunitySummary & {
      employers: RawEmployerRelation
    })[]
  | null

export type AdminApplicationsPageData = {
  applications: ApplicationReviewItem[]
  stats: {
    total: number
    submitted: number
    reviewed: number
    contacted: number
    interviewing: number
    offered: number
    closed: number
  }
}

function getSingleRelation<T>(relation: T | T[] | null | undefined) {
  if (Array.isArray(relation)) return relation[0] ?? null
  return relation ?? null
}

function groupSnapshotsByApplication(
  snapshots: ApplicationReadinessSnapshotItem[]
) {
  const map = new Map<string, ApplicationReadinessSnapshotItem[]>()

  snapshots.forEach((snapshot) => {
    const applicationId = (snapshot as ApplicationReadinessSnapshotItem & {
      application_id: string
    }).application_id

    map.set(applicationId, [...(map.get(applicationId) ?? []), snapshot])
  })

  return map
}

function groupEventsByApplication(events: ApplicationEventItem[]) {
  const map = new Map<string, ApplicationEventItem[]>()

  events.forEach((event) => {
    const applicationId = (event as ApplicationEventItem & {
      application_id: string
    }).application_id

    map.set(applicationId, [...(map.get(applicationId) ?? []), event])
  })

  return map
}

function buildStats(applications: ApplicationReviewItem[]) {
  return {
    total: applications.length,
    submitted: applications.filter((item) => item.status === 'submitted').length,
    reviewed: applications.filter((item) => item.status === 'reviewed').length,
    contacted: applications.filter((item) => item.status === 'contacted').length,
    interviewing: applications.filter((item) => item.status === 'interviewing')
      .length,
    offered: applications.filter((item) => item.status === 'offered').length,
    closed: applications.filter(
      (item) => item.status === 'rejected' || item.status === 'withdrawn'
    ).length,
  }
}

async function requireAdmin() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || profile?.role !== 'admin') {
    redirect('/')
  }
}

export async function getAdminApplicationsPageData(): Promise<AdminApplicationsPageData> {
  const supabase = createClient()

  await requireAdmin()

  const applicationsResult = await supabase
    .from('applications')
    .select(
      `
      id,
      user_id,
      status,
      readiness_score_at_apply,
      readiness_required_completed_at_apply,
      readiness_required_total_at_apply,
      intro_message,
      experience_summary,
      employer_notes,
      submitted_at,
      reviewed_at,
      contacted_at,
      withdrawn_at,
      opportunities (
        title,
        slug,
        trade_slug,
        location,
        state,
        employers (
          id,
          name,
          slug
        )
      )
    `
    )
    .order('submitted_at', { ascending: false })

  if (applicationsResult.error) {
    console.error('Failed to load admin applications:', applicationsResult.error)
  }

  const rawApplications = applicationsResult.data ?? []
  const applicationIds = rawApplications.map((application) => application.id)

  const [snapshotsResult, eventsResult] =
    applicationIds.length > 0
      ? await Promise.all([
          supabase
            .from('application_readiness_snapshots')
            .select(
              `
              id,
              application_id,
              type,
              status,
              label,
              file_path,
              file_name,
              file_size_kb,
              file_mime_type,
              text_content,
              notes,
              captured_at
            `
            )
            .in('application_id', applicationIds)
            .order('captured_at', { ascending: true }),

          supabase
            .from('application_events')
            .select(
              `
              id,
              application_id,
              old_status,
              new_status,
              note,
              created_at
            `
            )
            .in('application_id', applicationIds)
            .order('created_at', { ascending: true }),
        ])
      : [
          { data: [], error: null },
          { data: [], error: null },
        ]

  if (snapshotsResult.error) {
    console.error('Failed to load admin snapshots:', snapshotsResult.error)
  }

  if (eventsResult.error) {
    console.error('Failed to load admin events:', eventsResult.error)
  }

  const snapshotsByApplication = groupSnapshotsByApplication(
    (snapshotsResult.data ?? []) as ApplicationReadinessSnapshotItem[]
  )

  const eventsByApplication = groupEventsByApplication(
    (eventsResult.data ?? []) as ApplicationEventItem[]
  )

  const applications = rawApplications.map((application) => {
    const opportunityWithEmployer = getSingleRelation(
      application.opportunities as RawOpportunityRelation
    )

    const employer = getSingleRelation<ApplicationEmployerSummary>(
      opportunityWithEmployer?.employers
    )

    const opportunity = opportunityWithEmployer
      ? {
          title: opportunityWithEmployer.title,
          slug: opportunityWithEmployer.slug,
          trade_slug: opportunityWithEmployer.trade_slug,
          location: opportunityWithEmployer.location,
          state: opportunityWithEmployer.state,
        }
      : null

    return {
      id: application.id,
      user_id: application.user_id,
      status: application.status,
      readiness_score_at_apply: application.readiness_score_at_apply,
      readiness_required_completed_at_apply:
        application.readiness_required_completed_at_apply,
      readiness_required_total_at_apply:
        application.readiness_required_total_at_apply,
      intro_message: application.intro_message,
      experience_summary: application.experience_summary,
      employer_notes: application.employer_notes,
      submitted_at: application.submitted_at,
      reviewed_at: application.reviewed_at,
      contacted_at: application.contacted_at,
      withdrawn_at: application.withdrawn_at,
      opportunity,
      employer,
      snapshots: snapshotsByApplication.get(application.id) ?? [],
      events: eventsByApplication.get(application.id) ?? [],
    } satisfies ApplicationReviewItem
  })

  return {
    applications,
    stats: buildStats(applications),
  }
}