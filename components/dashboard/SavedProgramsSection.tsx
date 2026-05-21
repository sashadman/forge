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
        eyebrow="Training pathways"
        title="Saved programs and apprenticeships"
        description="Use this section to compare programs, track follow-up actions, and decide which pathways are worth applying to."
        href="/programs"
        action={items.length > 0 ? 'Find more programs' : 'Explore programs'}
      />

      {items.length > 0 ? (
        <div className="mt-6">
          <ProgramPipelineBoard userId={userId} items={items} />
        </div>
      ) : (
        <DashboardEmptyState
          title="No saved programs yet"
          description="Save programs while browsing training pathways. Your saved programs become your comparison list for training, apprenticeships, cost, duration, and next steps."
          href="/programs"
          action="Explore programs"
        />
      )}
    </section>
  )
}