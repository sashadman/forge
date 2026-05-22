import { GraduationCap } from 'lucide-react'
import SavedProgramsSection from '@/components/dashboard/SavedProgramsSection'
import MissionPageFrame from '@/components/dashboard/mission/MissionPageFrame'
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
      <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <GraduationCap className="h-6 w-6" />
          </div>

          <div>
            <p className="font-bold text-slate-950">Mission purpose</p>
            <p className="text-slate-600">
              Turn career interest into a realistic preparation plan.
            </p>
          </div>
        </div>
      </div>

      <SavedProgramsSection
        userId={user.id}
        items={savedProgramPipelineItems}
      />
    </MissionPageFrame>
  )
}