import SavedOpportunitiesSection from '@/components/dashboard/SavedOpportunitiesSection'
import JobsMissionGuide from '@/components/dashboard/jobs/JobsMissionGuide'
import MissionPageFrame from '@/components/dashboard/mission/MissionPageFrame'
import MissionNextStep from '@/components/dashboard/mission/MissionNextStep'
import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'

export default async function DashboardJobsPage() {
  const { user, savedOpportunityPipelineItems } = await getDashboardPageData()

  return (
    <MissionPageFrame
      eyebrow="Jobs mission"
      title="Track jobs and apprenticeships."
      description="Keep saved listings organized from interest to research, applying, interviewing, and closed."
      primaryHref="/opportunities"
      primaryLabel="View jobs & apprenticeships"
      secondaryHref="/dashboard/applications"
      secondaryLabel="Next: applications"
    >
      <div className="space-y-8">
        <JobsMissionGuide items={savedOpportunityPipelineItems} />

        <SavedOpportunitiesSection
          userId={user.id}
          items={savedOpportunityPipelineItems}
        />

        <MissionNextStep
          title="Found listings worth pursuing?"
          description="When saved jobs or apprenticeships look like real fits, move into applications and follow-up tracking."
          primaryHref="/dashboard/applications"
          primaryLabel="Go to applications"
          secondaryHref="/opportunities"
          secondaryLabel="View more listings"
        />
      </div>
    </MissionPageFrame>
  )
}