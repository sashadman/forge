import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'
import DashboardHero from '@/components/dashboard/DashboardHero'
import DashboardProfilePanel from '@/components/dashboard/DashboardProfilePanel'
import DashboardQuizResults from '@/components/dashboard/DashboardQuizResults'
import SavedTradesSection from '@/components/dashboard/SavedTradesSection'
import SavedProgramsSection from '@/components/dashboard/SavedProgramsSection'
import SavedOpportunitiesSection from '@/components/dashboard/SavedOpportunitiesSection'

export default async function DashboardPage() {
  const {
    user,
    profile,
    quizResults,
    savedTrades,
    savedPrograms,
    savedOpportunityPipelineItems,
    readinessItems,
    readinessScore,
  } = await getDashboardPageData()

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

            <SavedTradesSection savedTrades={savedTrades} />

            <SavedProgramsSection
              userId={user.id}
              savedPrograms={savedPrograms}
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