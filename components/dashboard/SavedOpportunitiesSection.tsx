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
        eyebrow="Saved opportunities"
        title="Your opportunity shortlist"
        description="Track jobs, apprenticeships, trainee roles, and other real opportunities from saved to applied."
        href="/opportunities"
        action="Explore opportunities"
      />

      {items.length > 0 ? (
        <OpportunityPipelineBoard userId={userId} items={items} />
      ) : (
        <DashboardEmptyState
          title="No saved opportunities yet"
          description="Save real opportunities while browsing listings so you can return to them later."
          href="/opportunities"
          action="Explore opportunities"
        />
      )}
    </section>
  )
}