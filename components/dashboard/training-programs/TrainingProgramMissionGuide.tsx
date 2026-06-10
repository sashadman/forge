import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Layers3,
  PhoneCall,
  Route,
  Target,
} from 'lucide-react'
import type { ProgramPipelineItem } from '@/components/dashboard/ProgramPipelineBoard'

type TrainingProgramMissionGuideProps = {
  items: ProgramPipelineItem[]
}

const activeStatuses = ['researching', 'contacted', 'applying', 'enrolled']

function formatProgramType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export default function TrainingProgramMissionGuide({
  items,
}: TrainingProgramMissionGuideProps) {
  const savedCount = items.length
  const activeCount = items.filter((item) =>
    activeStatuses.includes(item.status)
  ).length
  const applyingCount = items.filter((item) => item.status === 'applying').length
  const enrolledCount = items.filter((item) => item.status === 'enrolled').length
  const hasSavedPrograms = savedCount > 0

  const programTypes = Array.from(
    new Set(items.map((item) => formatProgramType(item.programType)))
  ).slice(0, 5)

  const tradeFocuses = Array.from(
    new Set(items.map((item) => item.tradeSlug))
  ).slice(0, 5)

  const programsWithFollowUps = items.filter((item) => item.followUpOn).length
  const programsWithNextActions = items.filter((item) =>
    item.nextAction.trim()
  ).length

  return (
    <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-slate-700/10 to-slate-700/8" />
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-indigo-500/8 blur-xl" />
        <div className="absolute -bottom-20 left-8 h-52 w-52 rounded-full bg-cyan-500/10 blur-xl" />

        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-indigo-300">
            <GraduationCap className="h-4 w-4" />
            Training strategy
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight">
            Turn career interest into a preparation plan.
          </h2>

          <p className="mt-4 leading-7 text-slate-300">
            Training programs should help you answer a practical question:
            which path gives you the best chance to move from interest into real
            jobs or apprenticeships without wasting time or money?
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <Layers3 className="h-6 w-6 text-indigo-300" />
              <p className="mt-3 text-3xl font-black">{savedCount}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Saved
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <Target className="h-6 w-6 text-emerald-300" />
              <p className="mt-3 text-3xl font-black">{activeCount}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Active
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <ClipboardList className="h-6 w-6 text-cyan-300" />
              <p className="mt-3 text-3xl font-black">{applyingCount}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Applying
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-300" />
              <p className="mt-3 text-3xl font-black">{enrolledCount}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Enrolled
              </p>
            </div>
          </div>

          {!hasSavedPrograms && (
            <div className="mt-7 rounded-2xl border border-indigo-300/20 bg-orange-500/10 p-5">
              <p className="font-bold text-orange-100">
                Start by saving training programs that match your career path.
              </p>

              <p className="mt-2 text-sm leading-6 text-orange-100/80">
                Compare programs by provider, cost, duration, location,
                requirements, and how directly they connect to jobs or
                apprenticeships.
              </p>

              <Link href="/programs" className="btn-light mt-5">
                Compare training programs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <Route className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-700">
                Mission rule
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Compare before you commit.
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                A good training choice should fit your location, schedule,
                finances, entry requirements, and target career path. Do not
                treat every program as equal.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
              <CalendarDays className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-700">
                Follow-up discipline
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Track next actions, not just saved programs.
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {programsWithNextActions} program
                {programsWithNextActions === 1 ? '' : 's'} currently have a
                next action. {programsWithFollowUps} program
                {programsWithFollowUps === 1 ? '' : 's'} have a follow-up date.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {programTypes.map((type) => (
                  <span key={type} className="badge-slate">
                    {type}
                  </span>
                ))}

                {tradeFocuses.map((trade) => (
                  <span key={trade} className="badge-orange">
                    {trade}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex gap-3">
            <PhoneCall className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

            <div>
              <p className="font-black text-emerald-900">Best path</p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                Move programs from Saved → Researching → Contacted → Applying
                or Enrolled. Add a next action and follow-up date whenever a
                program becomes serious.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}