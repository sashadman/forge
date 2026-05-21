import DashboardSectionHeader from '@/components/dashboard/DashboardSectionHeader'
import DashboardEmptyState from '@/components/dashboard/DashboardEmptyState'
import OpportunityPipelineBoard, {
  type OpportunityPipelineItem,
} from '@/components/dashboard/OpportunityPipelineBoard'

type SavedOpportunitiesSectionProps = {
  userId: string
  items: OpportunityPipelineItem[]
}

export default function SavedOpportunitiesSection({
  userId,
  items,
}: SavedOpportunitiesSectionProps) {
  return (
    <section className="content-panel">
      <DashboardSectionHeader
        eyebrow="Opportunity pipeline"
        title="Saved jobs and apprenticeships"
        description="Track real opportunities from saved to researching, applying, interviewing, and closed."
        href="/opportunities"
        action={
          items.length > 0 ? 'Find more opportunities' : 'Explore opportunities'
        }
      />

      {items.length > 0 ? (
        <div className="mt-6">
          <OpportunityPipelineBoard userId={userId} items={items} />
        </div>
      ) : (
        <DashboardEmptyState
          title="No saved opportunities yet"
          description="Save real opportunities while browsing listings. Your saved opportunities become your action list for applications and follow-up."
          href="/opportunities"
          action="Explore opportunities"
        />
      )}
    </section>
  )
}