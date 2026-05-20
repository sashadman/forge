import DashboardSectionHeader from '@/components/dashboard/DashboardSectionHeader'
import DashboardEmptyState from '@/components/dashboard/DashboardEmptyState'
import ProgramPipelineBoard, {
  type ProgramPipelineItem,
} from '@/components/dashboard/ProgramPipelineBoard'

type SavedProgramsSectionProps = {
  userId: string
  items: ProgramPipelineItem[]
}

export default function SavedProgramsSection({
  userId,
  items,
}: SavedProgramsSectionProps) {
  return (
    <section className="content-panel">
      <DashboardSectionHeader
        eyebrow="Saved programs"
        title="Your training pathways"
        description="Track training programs from saved to researching, applying, enrolled, completed, or closed."
        href="/programs"
        action="Explore programs"
      />

      {items.length > 0 ? (
        <ProgramPipelineBoard userId={userId} items={items} />
      ) : (
        <DashboardEmptyState
          title="No saved programs yet"
          description="Save programs while browsing training pathways so you can compare them later."
          href="/programs"
          action="Explore programs"
        />
      )}
    </section>
  )
}