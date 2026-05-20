import Link from 'next/link'
import DashboardSectionHeader from '@/components/dashboard/DashboardSectionHeader'
import DashboardEmptyState from '@/components/dashboard/DashboardEmptyState'
import DashboardArrowCircle from '@/components/dashboard/ArrowCircle'
import RemoveSavedProgramButton from '@/components/dashboard/RemoveSavedProgramButton'

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
  savedPrograms: SavedProgram[] | null
}

function formatProgramType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export default function SavedProgramsSection({
  savedPrograms,
}: SavedProgramsSectionProps) {
  return (
    <section className="content-panel">
      <DashboardSectionHeader
        eyebrow="Saved programs"
        title="Your training pathways"
        description="Keep track of apprenticeships, workforce programs, and training options you want to revisit."
        href="/programs"
        action="Explore programs"
      />

      {savedPrograms && savedPrograms.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {savedPrograms.map((savedProgram) => {
            const program = Array.isArray(savedProgram.programs)
              ? savedProgram.programs[0]
              : savedProgram.programs

            if (!program) return null

            return (
              <div key={savedProgram.program_id} className="card bg-slate-50">
                <Link href={`/programs/${program.slug}`} className="group block">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="badge-orange">
                        {formatProgramType(program.program_type)}
                      </span>

                      <h3 className="mt-4 text-2xl font-bold text-slate-950 transition group-hover:text-orange-700">
                        {program.name}
                      </h3>

                      <p className="mt-2 font-semibold text-slate-600">
                        {program.provider_name}
                      </p>
                    </div>

                    <DashboardArrowCircle />
                  </div>
                </Link>

                <p className="muted-text mt-5 line-clamp-3">
                  {program.description}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="mini-card-white">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Location
                    </p>

                    <p className="mt-1 font-bold text-slate-950">
                      {program.location}, {program.state}
                    </p>
                  </div>

                  <div className="mini-card-white">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Duration
                    </p>

                    <p className="mt-1 font-bold text-slate-950">
                      {program.duration || 'See provider'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="badge-orange">Saved</span>

                  <RemoveSavedProgramButton programId={savedProgram.program_id} />
                </div>
              </div>
            )
          })}
        </div>
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