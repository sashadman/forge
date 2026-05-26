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
        eyebrow="Training programs pipeline"
        title="Saved training programs"
        description="Use this section to compare programs, track follow-up actions, and decide which training pathways are worth pursuing."
        href="/programs"
        action={
          items.length > 0
            ? 'Compare more training programs'
            : 'Compare training programs'
        }
      />

      {items.length > 0 ? (
        <div className="mt-6">
          <ProgramPipelineBoard userId={userId} items={items} />
        </div>
      ) : (
        <DashboardEmptyState
          title="No saved training programs yet"
          description="Save training programs while browsing preparation pathways. Your saved programs become your comparison list for cost, duration, requirements, and next steps."
          href="/programs"
          action="Compare training programs"
        />
      )}
    </section>
  )
}