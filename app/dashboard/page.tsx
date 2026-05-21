import {
  BriefcaseBusiness,
  GraduationCap,
  Send,
  ShieldCheck,
} from 'lucide-react'
import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'
import DashboardHero from '@/components/dashboard/DashboardHero'
import DashboardProfilePanel from '@/components/dashboard/DashboardProfilePanel'
import DashboardActionCenter from '@/components/dashboard/DashboardActionCenter'
import DashboardReadinessWidget from '@/components/dashboard/DashboardReadinessWidget'
import DashboardQuizResults from '@/components/dashboard/DashboardQuizResults'
import SavedTradesSection from '@/components/dashboard/SavedTradesSection'
import SavedProgramsSection from '@/components/dashboard/SavedProgramsSection'
import SavedOpportunitiesSection from '@/components/dashboard/SavedOpportunitiesSection'
import SubmittedApplicationsSection from '@/components/dashboard/SubmittedApplicationsSection'
import NextStepPanel from '@/components/ui/NextStepPanel'

export default async function DashboardPage() {
  const {
    user,
    profile,
    quizResults,
    savedTrades,
    savedProgramPipelineItems,
    savedOpportunityPipelineItems,
    submittedApplications,
    readinessItems,
    readinessScore,
    readinessItemsForWidget,
    readinessScoreForWidget,
  } = await getDashboardPageData()

  const hasApplications = submittedApplications.length > 0
  const hasSavedOpportunities = savedOpportunityPipelineItems.length > 0
  const hasSavedPrograms = savedProgramPipelineItems.length > 0
  const isReadinessStrong = readinessScore >= 80

  const nextStep = (() => {
    if (!isReadinessStrong) {
      return {
        title: 'Strengthen your readiness before applying.',
        description:
          'Complete your readiness profile so employers can review a stronger application package when you apply.',
        primaryHref: '/dashboard/readiness',
        primaryLabel: 'Improve readiness',
        secondaryHref: '/opportunities',
        secondaryLabel: 'Browse opportunities',
        icon: <ShieldCheck className="h-6 w-6" />,
      }
    }

    if (!hasSavedPrograms) {
      return {
        title: 'Compare training pathways that match your goals.',
        description:
          'Save programs or apprenticeships you want to compare. This helps you build a realistic career pathway before applying.',
        primaryHref: '/programs',
        primaryLabel: 'Explore programs',
        secondaryHref: '/opportunities',
        secondaryLabel: 'Browse opportunities',
        icon: <GraduationCap className="h-6 w-6" />,
      }
    }

    if (!hasSavedOpportunities) {
      return {
        title: 'Start shortlisting real opportunities.',
        description:
          'Save jobs, apprenticeships, trainee roles, or pre-apprenticeships so you can track them and apply when ready.',
        primaryHref: '/opportunities',
        primaryLabel: 'Explore opportunities',
        secondaryHref: '/programs',
        secondaryLabel: 'Review programs',
        icon: <BriefcaseBusiness className="h-6 w-6" />,
      }
    }

    if (!hasApplications) {
      return {
        title: 'You are ready to move from tracking to applying.',
        description:
          'Review your saved opportunities and apply when the listing is a real fit. Your readiness snapshot will support your application.',
        primaryHref: '/opportunities',
        primaryLabel: 'Apply to opportunities',
        secondaryHref: '/dashboard/readiness',
        secondaryLabel: 'Review readiness',
        icon: <Send className="h-6 w-6" />,
      }
    }

    return {
      title: 'Track your applications and keep your profile current.',
      description:
        'You have submitted applications. Watch their status, keep your readiness profile updated, and continue exploring strong fits.',
      primaryHref: '/opportunities',
      primaryLabel: 'Find more opportunities',
      secondaryHref: '/dashboard/readiness',
      secondaryLabel: 'Update readiness',
      icon: <Send className="h-6 w-6" />,
    }
  })()

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
            <NextStepPanel
              title={nextStep.title}
              description={nextStep.description}
              primaryHref={nextStep.primaryHref}
              primaryLabel={nextStep.primaryLabel}
              secondaryHref={nextStep.secondaryHref}
              secondaryLabel={nextStep.secondaryLabel}
              icon={nextStep.icon}
            />

            <DashboardActionCenter
              programItems={savedProgramPipelineItems}
              opportunityItems={savedOpportunityPipelineItems}
            />

            <DashboardReadinessWidget
              items={readinessItemsForWidget}
              score={readinessScoreForWidget}
            />

            <SubmittedApplicationsSection applications={submittedApplications} />

            <DashboardQuizResults quizResults={quizResults} />

            <SavedTradesSection savedTrades={savedTrades} />

            <SavedProgramsSection
              userId={user.id}
              items={savedProgramPipelineItems}
            />

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