import { ClipboardCheck } from 'lucide-react'
import DashboardActionCenter from '@/components/dashboard/DashboardActionCenter'
import SubmittedApplicationsSection from '@/components/dashboard/SubmittedApplicationsSection'
import MissionPageFrame from '@/components/dashboard/mission/MissionPageFrame'
import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'

export default async function DashboardApplicationsPage() {
  const {
    savedProgramPipelineItems,
    savedOpportunityPipelineItems,
    submittedApplications,
  } = await getDashboardPageData()

  return (
    <MissionPageFrame
      eyebrow="Application mission"
      title="Manage applications and next actions."
      description="Review submitted applications, follow-up tasks, saved listings, and next actions from one focused page."
      primaryHref="/opportunities"
      primaryLabel="Find more jobs & apprenticeships"
      secondaryHref="/dashboard"
      secondaryLabel="Return to mission hub"
    >
      <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <ClipboardCheck className="h-6 w-6" />
          </div>

          <div>
            <p className="font-bold text-slate-950">Mission purpose</p>
            <p className="text-slate-600">
              Keep applications and follow-ups from getting lost.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <DashboardActionCenter
          programItems={savedProgramPipelineItems}
          opportunityItems={savedOpportunityPipelineItems}
        />

        <SubmittedApplicationsSection applications={submittedApplications} />
      </div>
    </MissionPageFrame>
  )
}