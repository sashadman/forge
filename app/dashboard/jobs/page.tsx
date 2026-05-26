import { BriefcaseBusiness } from 'lucide-react'
import SavedOpportunitiesSection from '@/components/dashboard/SavedOpportunitiesSection'
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
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>

            <div>
              <p className="font-bold text-slate-950">Mission purpose</p>
              <p className="text-slate-600">
                Move from browsing to focused application tracking.
              </p>
            </div>
          </div>
        </div>

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