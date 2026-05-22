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
        eyebrow="Jobs & apprenticeships pipeline"
        title="Saved jobs and apprenticeships"
        description="Track real jobs, apprenticeships, trainee roles, and pre-apprenticeships from saved to researching, applying, interviewing, and closed."
        href="/opportunities"
        action={
          items.length > 0
            ? 'Find more jobs & apprenticeships'
            : 'View jobs & apprenticeships'
        }
      />

      {items.length > 0 ? (
        <div className="mt-6">
          <OpportunityPipelineBoard userId={userId} items={items} />
        </div>
      ) : (
        <DashboardEmptyState
          title="No saved jobs or apprenticeships yet"
          description="Save real listings while browsing. Your saved jobs and apprenticeships become your action list for applications and follow-up."
          href="/opportunities"
          action="View jobs & apprenticeships"
        />
      )}
    </section>
  )
}