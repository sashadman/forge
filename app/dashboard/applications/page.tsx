import { ClipboardCheck } from 'lucide-react'
import DashboardActionCenter from '@/components/dashboard/DashboardActionCenter'
import SubmittedApplicationsSection from '@/components/dashboard/SubmittedApplicationsSection'
import MissionPageFrame from '@/components/dashboard/mission/MissionPageFrame'
import MissionNextStep from '@/components/dashboard/mission/MissionNextStep'
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
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm">
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

        <DashboardActionCenter
          programItems={savedProgramPipelineItems}
          opportunityItems={savedOpportunityPipelineItems}
        />

        <SubmittedApplicationsSection applications={submittedApplications} />

        <MissionNextStep
          eyebrow="Mission loop"
          title="Keep improving your career pathway."
          description="After reviewing applications and follow-ups, return to the hub or continue finding strong jobs and apprenticeships."
          primaryHref="/dashboard"
          primaryLabel="Return to mission hub"
          secondaryHref="/opportunities"
          secondaryLabel="Find more listings"
        />
      </div>
    </MissionPageFrame>
  )
}