import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { OpportunityPipelineStatus } from '@/lib/supabase/app-types'
import type { OpportunityPipelineItem } from '@/components/dashboard/OpportunityPipelineBoard'
import DashboardHero from '@/components/dashboard/DashboardHero'
import DashboardProfilePanel from '@/components/dashboard/DashboardProfilePanel'
import DashboardQuizResults, {
  type QuizResultItem,
} from '@/components/dashboard/DashboardQuizResults'
import SavedTradesSection from '@/components/dashboard/SavedTradesSection'
import SavedProgramsSection from '@/components/dashboard/SavedProgramsSection'
import SavedOpportunitiesSection from '@/components/dashboard/SavedOpportunitiesSection'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role, location, experience_level, quiz_completed')
    .eq('id', user.id)
    .single()

  const { data: latestQuizResult } = await supabase
    .from('quiz_results')
    .select('results, completed_at')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: savedTrades } = await supabase
    .from('saved_trades')
    .select('trade_slug')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: savedPrograms } = await supabase
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
    .order('created_at', { ascending: false })

  const { data: savedOpportunities } = await supabase
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
    .order('created_at', { ascending: false })

  const { data: opportunityPipelineItems } = await supabase
    .from('opportunity_pipeline')
    .select('opportunity_id, status, notes, next_action, follow_up_on')
    .eq('user_id', user.id)

  const opportunityPipelineStatusById = new Map(
    opportunityPipelineItems?.map((item) => [
      item.opportunity_id,
      item.status as OpportunityPipelineStatus,
    ]) ?? []
  )

  const opportunityPipelineNotesById = new Map(
    opportunityPipelineItems?.map((item) => [
      item.opportunity_id,
      item.notes ?? '',
    ]) ?? []
  )

  const opportunityPipelineNextActionById = new Map(
    opportunityPipelineItems?.map((item) => [
      item.opportunity_id,
      item.next_action ?? '',
    ]) ?? []
  )

  const opportunityPipelineFollowUpOnById = new Map(
    opportunityPipelineItems?.map((item) => [
      item.opportunity_id,
      item.follow_up_on ?? '',
    ]) ?? []
  )

  const savedOpportunityPipelineItems: OpportunityPipelineItem[] =
    savedOpportunities
      ?.map((savedOpportunity) => {
        const opportunity = Array.isArray(savedOpportunity.opportunities)
          ? savedOpportunity.opportunities[0]
          : savedOpportunity.opportunities

        if (!opportunity) return null

        const employer = Array.isArray(opportunity.employers)
          ? opportunity.employers[0]
          : opportunity.employers

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
          status: opportunityPipelineStatusById.get(opportunityId) ?? 'saved',
          notes: opportunityPipelineNotesById.get(opportunityId) ?? '',
          nextAction:
            opportunityPipelineNextActionById.get(opportunityId) ?? '',
          followUpOn:
            opportunityPipelineFollowUpOnById.get(opportunityId) ?? '',
        }
      })
      .filter((item): item is OpportunityPipelineItem => Boolean(item)) ?? []

  const quizResults = (latestQuizResult?.results ??
    []) as unknown as QuizResultItem[]

  const readinessItems = [
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
      complete: Boolean(savedTrades && savedTrades.length > 0),
      helpText: 'Save at least one trade you want to explore.',
    },
    {
      label: 'Saved program',
      complete: Boolean(savedPrograms && savedPrograms.length > 0),
      helpText: 'Save at least one training pathway.',
    },
    {
      label: 'Saved opportunity',
      complete: Boolean(savedOpportunities && savedOpportunities.length > 0),
      helpText: 'Save at least one real opportunity when available.',
    },
  ]

  const completedReadinessItems = readinessItems.filter((item) => item.complete)
    .length

  const readinessScore = Math.round(
    (completedReadinessItems / readinessItems.length) * 100
  )

  return (
    <main className="page-shell">
      <DashboardHero />

      <section className="section-light pb-20">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <DashboardProfilePanel
            userId={user.id}
            userEmail={user.email}
            fullName={profile?.full_name || ''}
            profileEmail={profile?.email}
            location={profile?.location || ''}
            experienceLevel={profile?.experience_level || ''}
            readinessItems={readinessItems}
            readinessScore={readinessScore}
          />

        <div className="-mt-12 space-y-8">
          <DashboardQuizResults quizResults={quizResults} />
          <SavedTradesSection savedTrades={savedTrades ?? []} />
          <SavedProgramsSection savedPrograms={savedPrograms ?? []} />
          <SavedOpportunitiesSection
            userId={user.id}
            items={savedOpportunityPipelineItems}
          />
        </div>
        </div>
      </section>
    </main>
  )
}