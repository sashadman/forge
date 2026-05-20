import { createClient } from '@/lib/supabase/server'
import type { ProgramPipelineStatus } from '@/lib/supabase/app-types'
import DashboardSectionHeader from '@/components/dashboard/DashboardSectionHeader'
import DashboardEmptyState from '@/components/dashboard/DashboardEmptyState'
import ProgramPipelineBoard, {
  type ProgramPipelineItem,
} from '@/components/dashboard/ProgramPipelineBoard'

type ProgramRelation = {
  slug: string
  name: string
  provider_name: string
  program_type: string
  trade_slug: string
  location: string
  state: string
  duration: string | null
  description: string
}

type SavedProgram = {
  program_id: string
  created_at: string
  programs: ProgramRelation | ProgramRelation[] | null
}

type SavedProgramsSectionProps = {
  userId: string
  savedPrograms: SavedProgram[] | null
}

export default async function SavedProgramsSection({
  userId,
  savedPrograms,
}: SavedProgramsSectionProps) {
  const supabase = createClient()

  const { data: programPipelineItems } = await supabase
    .from('program_pipeline')
    .select('program_id, status, notes, next_action, follow_up_on')
    .eq('user_id', userId)

  const programPipelineStatusById = new Map(
    programPipelineItems?.map((item) => [
      item.program_id,
      item.status as ProgramPipelineStatus,
    ]) ?? []
  )

  const programPipelineNotesById = new Map(
    programPipelineItems?.map((item) => [item.program_id, item.notes ?? '']) ??
      []
  )

  const programPipelineNextActionById = new Map(
    programPipelineItems?.map((item) => [
      item.program_id,
      item.next_action ?? '',
    ]) ?? []
  )

  const programPipelineFollowUpOnById = new Map(
    programPipelineItems?.map((item) => [
      item.program_id,
      item.follow_up_on ?? '',
    ]) ?? []
  )

  const savedProgramPipelineItems: ProgramPipelineItem[] =
    savedPrograms
      ?.map((savedProgram) => {
        const program = Array.isArray(savedProgram.programs)
          ? savedProgram.programs[0]
          : savedProgram.programs

        if (!program) return null

        const programId = savedProgram.program_id

        return {
          programId,
          slug: program.slug,
          name: program.name,
          providerName: program.provider_name,
          programType: program.program_type,
          tradeSlug: program.trade_slug,
          location: program.location,
          state: program.state,
          duration: program.duration,
          description: program.description,
          status: programPipelineStatusById.get(programId) ?? 'saved',
          notes: programPipelineNotesById.get(programId) ?? '',
          nextAction: programPipelineNextActionById.get(programId) ?? '',
          followUpOn: programPipelineFollowUpOnById.get(programId) ?? '',
        }
      })
      .filter((item): item is ProgramPipelineItem => Boolean(item)) ?? []

  return (
    <section className="content-panel">
      <DashboardSectionHeader
        eyebrow="Saved programs"
        title="Your training pathways"
        description="Track training programs from saved to researching, applying, enrolled, completed, or closed."
        href="/programs"
        action="Explore programs"
      />

      {savedProgramPipelineItems.length > 0 ? (
        <ProgramPipelineBoard userId={userId} items={savedProgramPipelineItems} />
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