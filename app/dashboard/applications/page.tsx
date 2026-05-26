import ApplicationsMissionGuide from '@/components/dashboard/applications/ApplicationsMissionGuide'
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
        <ApplicationsMissionGuide
          applications={submittedApplications}
          programItems={savedProgramPipelineItems}
          opportunityItems={savedOpportunityPipelineItems}
        />

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