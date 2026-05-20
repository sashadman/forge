import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { TradeCategory } from '@/types'
import type { OpportunityPipelineStatus } from '@/lib/supabase/app-types'
import type { QuizResultItem } from '@/components/dashboard/DashboardQuizResults'
import type { OpportunityPipelineItem } from '@/components/dashboard/OpportunityPipelineBoard'

type ReadinessItemData = {
  label: string
  helpText: string
  complete: boolean
}

type DashboardProfile = {
  full_name: string | null
  email: string | null
  role: string
  location: string | null
  experience_level: string | null
  quiz_completed: boolean
}

type SavedTrade = {
  trade_slug: string
}

type ProgramRelation = {
  slug: string
  name: string
  provider_name: string
  program_type: string
  trade_slug: string
  location: string
  state: string
  duration: string | null
  description: string
}

type SavedProgram = {
  program_id: string
  created_at: string
  programs: ProgramRelation | ProgramRelation[] | null
}

type EmployerRelation = {
  name: string
}

type OpportunityRelation = {
  slug: string
  title: string
  opportunity_type: string
  trade_slug: string
  location: string
  state: string
  pay_range: string | null
  schedule: string | null
  description: string
  employers: EmployerRelation | EmployerRelation[] | null
}

type SavedOpportunity = {
  opportunity_id: string
  created_at: string
  opportunities: OpportunityRelation | OpportunityRelation[] | null
}

type OpportunityPipelineRow = {
  opportunity_id: string
  status: OpportunityPipelineStatus
  notes: string | null
  next_action: string | null
  follow_up_on: string | null
}

export type DashboardPageData = {
  user: {
    id: string
    email?: string | null
  }
  profile: DashboardProfile | null
  quizResults: QuizResultItem[]
  savedTrades: SavedTrade[]
  savedPrograms: SavedProgram[]
  savedOpportunityPipelineItems: OpportunityPipelineItem[]
  readinessItems: ReadinessItemData[]
  readinessScore: number
}

function getSingleRelation<T>(relation: T | T[] | null | undefined) {
  if (Array.isArray(relation)) return relation[0] ?? null
  return relation ?? null
}

function createPipelineLookupMaps(pipelineRows: OpportunityPipelineRow[]) {
  return {
    statusById: new Map(
      pipelineRows.map((item) => [item.opportunity_id, item.status])
    ),
    notesById: new Map(
      pipelineRows.map((item) => [item.opportunity_id, item.notes ?? ''])
    ),
    nextActionById: new Map(
      pipelineRows.map((item) => [item.opportunity_id, item.next_action ?? ''])
    ),
    followUpOnById: new Map(
      pipelineRows.map((item) => [item.opportunity_id, item.follow_up_on ?? ''])
    ),
  }
}

function normalizeSavedOpportunityPipelineItems({
  savedOpportunities,
  pipelineRows,
}: {
  savedOpportunities: SavedOpportunity[]
  pipelineRows: OpportunityPipelineRow[]
}) {
  const { statusById, notesById, nextActionById, followUpOnById } =
    createPipelineLookupMaps(pipelineRows)

  return savedOpportunities
    .map((savedOpportunity) => {
      const opportunity = getSingleRelation(savedOpportunity.opportunities)

      if (!opportunity) return null

      const employer = getSingleRelation(opportunity.employers)
      const opportunityId = savedOpportunity.opportunity_id

      return {
        opportunityId,
        slug: opportunity.slug,
        title: opportunity.title,
        opportunityType: opportunity.opportunity_type,
        tradeSlug: opportunity.trade_slug,
        location: opportunity.location,
        state: opportunity.state,
        schedule: opportunity.schedule,
        description: opportunity.description,
        employerName: employer?.name || 'Employer listing',
        status: statusById.get(opportunityId) ?? 'saved',
        notes: notesById.get(opportunityId) ?? '',
        nextAction: nextActionById.get(opportunityId) ?? '',
        followUpOn: followUpOnById.get(opportunityId) ?? '',
      }
    })
    .filter((item): item is OpportunityPipelineItem => Boolean(item))
}

function buildReadinessItems({
  profile,
  quizResults,
  savedTrades,
  savedPrograms,
  savedOpportunityPipelineItems,
}: {
  profile: DashboardProfile | null
  quizResults: QuizResultItem[]
  savedTrades: SavedTrade[]
  savedPrograms: SavedProgram[]
  savedOpportunityPipelineItems: OpportunityPipelineItem[]
}) {
  return [
    {
      label: 'Profile name',
      complete: Boolean(profile?.full_name),
      helpText: 'Add your name so your profile feels complete.',
    },
    {
      label: 'Location',
      complete: Boolean(profile?.location),
      helpText: 'Add your location to compare nearby pathways.',
    },
    {
      label: 'Experience level',
      complete: Boolean(profile?.experience_level),
      helpText: 'Add your current experience level.',
    },
    {
      label: 'Career quiz',
      complete: Boolean(profile?.quiz_completed || quizResults.length > 0),
      helpText: 'Take the quiz to get personalized trade matches.',
    },
    {
      label: 'Saved trade',
      complete: savedTrades.length > 0,
      helpText: 'Save at least one trade you want to explore.',
    },
    {
      label: 'Saved program',
      complete: savedPrograms.length > 0,
      helpText: 'Save at least one training pathway.',
    },
    {
      label: 'Saved opportunity',
      complete: savedOpportunityPipelineItems.length > 0,
      helpText: 'Save at least one real opportunity when available.',
    },
  ]
}

function calculateReadinessScore(readinessItems: ReadinessItemData[]) {
  if (readinessItems.length === 0) return 0

  const completedItems = readinessItems.filter((item) => item.complete).length

  return Math.round((completedItems / readinessItems.length) * 100)
}

export async function getDashboardPageData(): Promise<DashboardPageData> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const [
    profileResult,
    latestQuizResult,
    savedTradesResult,
    savedProgramsResult,
    savedOpportunitiesResult,
    opportunityPipelineResult,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, email, role, location, experience_level, quiz_completed')
      .eq('id', user.id)
      .single(),

    supabase
      .from('quiz_results')
      .select('results, completed_at')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from('saved_trades')
      .select('trade_slug')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),

    supabase
      .from('saved_programs')
      .select(
        `
        program_id,
        created_at,
        programs (
          slug,
          name,
          provider_name,
          program_type,
          trade_slug,
          location,
          state,
          duration,
          description
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),

    supabase
      .from('saved_opportunities')
      .select(
        `
        opportunity_id,
        created_at,
        opportunities (
          slug,
          title,
          opportunity_type,
          trade_slug,
          location,
          state,
          pay_range,
          schedule,
          description,
          employers (
            name
          )
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),

    supabase
      .from('opportunity_pipeline')
      .select('opportunity_id, status, notes, next_action, follow_up_on')
      .eq('user_id', user.id),
  ])

  if (profileResult.error) {
    console.error('Failed to load dashboard profile:', profileResult.error)
  }

  if (latestQuizResult.error) {
    console.error('Failed to load latest quiz result:', latestQuizResult.error)
  }

  if (savedTradesResult.error) {
    console.error('Failed to load saved trades:', savedTradesResult.error)
  }

  if (savedProgramsResult.error) {
    console.error('Failed to load saved programs:', savedProgramsResult.error)
  }

  if (savedOpportunitiesResult.error) {
    console.error(
      'Failed to load saved opportunities:',
      savedOpportunitiesResult.error
    )
  }

  if (opportunityPipelineResult.error) {
    console.error(
      'Failed to load opportunity pipeline:',
      opportunityPipelineResult.error
    )
  }

  const profile = (profileResult.data ?? null) as DashboardProfile | null

  const quizResults = (latestQuizResult.data?.results ??
    []) as unknown as QuizResultItem[]

  const savedTrades = (savedTradesResult.data ?? []) as SavedTrade[]

  const savedPrograms = (savedProgramsResult.data ?? []) as SavedProgram[]

  const savedOpportunities = (savedOpportunitiesResult.data ??
    []) as SavedOpportunity[]

  const opportunityPipelineRows = (opportunityPipelineResult.data ??
    []) as OpportunityPipelineRow[]

  const savedOpportunityPipelineItems = normalizeSavedOpportunityPipelineItems({
    savedOpportunities,
    pipelineRows: opportunityPipelineRows,
  })

  const readinessItems = buildReadinessItems({
    profile,
    quizResults,
    savedTrades,
    savedPrograms,
    savedOpportunityPipelineItems,
  })

  const readinessScore = calculateReadinessScore(readinessItems)

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile,
    quizResults,
    savedTrades,
    savedPrograms,
    savedOpportunityPipelineItems,
    readinessItems,
    readinessScore,
  }
}