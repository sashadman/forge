import SavedTradesSection from '@/components/dashboard/SavedTradesSection'
import CareerPathMissionGuide from '@/components/dashboard/career-paths/CareerPathMissionGuide'
import MissionPageFrame from '@/components/dashboard/mission/MissionPageFrame'
import MissionNextStep from '@/components/dashboard/mission/MissionNextStep'
import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'

export default async function DashboardCareerPathsPage() {
  const { savedTrades } = await getDashboardPageData()

  return (
    <MissionPageFrame
      eyebrow="Career path mission"
      title="Track your saved career paths."
      description="Keep your career direction focused before comparing training programs or applying to jobs and apprenticeships."
      primaryHref="/trades"
      primaryLabel="Compare more career paths"
      secondaryHref="/dashboard/training-programs"
      secondaryLabel="Next: training mission"
    >
      <div className="space-y-8">
        <CareerPathMissionGuide savedTrades={savedTrades} />

        <SavedTradesSection savedTrades={savedTrades} />

        <MissionNextStep
          title="Direction selected? Compare training next."
          description="Once you know which career paths interest you, compare training programs that can move you toward those paths."
          primaryHref="/dashboard/training-programs"
          primaryLabel="Go to training mission"
          secondaryHref="/trades"
          secondaryLabel="Compare more paths"
        />
      </div>
    </MissionPageFrame>
  )
}