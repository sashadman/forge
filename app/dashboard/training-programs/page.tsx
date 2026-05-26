import SavedProgramsSection from '@/components/dashboard/SavedProgramsSection'
import TrainingProgramMissionGuide from '@/components/dashboard/training-programs/TrainingProgramMissionGuide'
import MissionPageFrame from '@/components/dashboard/mission/MissionPageFrame'
import MissionNextStep from '@/components/dashboard/mission/MissionNextStep'
import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'

export default async function DashboardTrainingProgramsPage() {
  const { user, savedProgramPipelineItems } = await getDashboardPageData()

  return (
    <MissionPageFrame
      eyebrow="Training mission"
      title="Compare training programs."
      description="Organize saved programs, track follow-ups, compare cost and duration, and decide which training path is worth pursuing."
      primaryHref="/programs"
      primaryLabel="Compare more training programs"
      secondaryHref="/dashboard/jobs"
      secondaryLabel="Next: jobs mission"
    >
      <div className="space-y-8">
        <TrainingProgramMissionGuide items={savedProgramPipelineItems} />

        <SavedProgramsSection
          userId={user.id}
          items={savedProgramPipelineItems}
        />

        <MissionNextStep
          title="Training plan ready? Start tracking jobs."
          description="Once you understand preparation options, move into real jobs and apprenticeships so you can see what employers expect."
          primaryHref="/dashboard/jobs"
          primaryLabel="Go to jobs mission"
          secondaryHref="/programs"
          secondaryLabel="Compare more programs"
        />
      </div>
    </MissionPageFrame>
  )
}