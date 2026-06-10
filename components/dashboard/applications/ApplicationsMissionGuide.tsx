import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Layers3,
  RefreshCcw,
  Send,
  ShieldCheck,
  Target,
} from 'lucide-react'
import type { SubmittedApplicationItem } from '@/components/dashboard/SubmittedApplicationsSection'
import type { ProgramPipelineItem } from '@/components/dashboard/ProgramPipelineBoard'
import type { OpportunityPipelineItem } from '@/components/dashboard/OpportunityPipelineBoard'

type ApplicationsMissionGuideProps = {
  applications: SubmittedApplicationItem[]
  programItems: ProgramPipelineItem[]
  opportunityItems: OpportunityPipelineItem[]
}

export default function ApplicationsMissionGuide({
  applications,
  programItems,
  opportunityItems,
}: ApplicationsMissionGuideProps) {
  const submittedCount = applications.length
  const contactedCount = applications.filter(
    (item) => item.status === 'contacted'
  ).length
  const interviewingCount = applications.filter(
    (item) => item.status === 'interviewing'
  ).length
  const offeredCount = applications.filter((item) => item.status === 'offered')
    .length

  const activeFollowUps = [...programItems, ...opportunityItems].filter(
    (item) => item.nextAction.trim() || item.followUpOn
  ).length

  const averageReadinessAtApply =
    applications.length > 0
      ? Math.round(
          applications.reduce(
            (total, item) => total + item.readinessScoreAtApply,
            0
          ) / applications.length
        )
      : null

  const hasApplications = submittedCount > 0

  return (
    <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-slate-700/10 to-slate-700/8" />
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-indigo-500/8 blur-xl" />
        <div className="absolute -bottom-20 left-8 h-52 w-52 rounded-full bg-cyan-500/10 blur-xl" />

        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-indigo-300">
            <ClipboardCheck className="h-4 w-4" />
            Application strategy
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight">
            Applying is not the finish line.
          </h2>

          <p className="mt-4 leading-7 text-slate-300">
            This mission helps you track what happened after you applied. Keep
            applications visible, watch status changes, and use follow-up actions
            so strong listings do not disappear.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <Send className="h-6 w-6 text-indigo-300" />
              <p className="mt-3 text-3xl font-black">{submittedCount}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Submitted
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <Target className="h-6 w-6 text-cyan-300" />
              <p className="mt-3 text-3xl font-black">{contactedCount}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Contacted
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <BriefcaseBusiness className="h-6 w-6 text-indigo-300" />
              <p className="mt-3 text-3xl font-black">{interviewingCount}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Interviewing
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-300" />
              <p className="mt-3 text-3xl font-black">{offeredCount}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Offered
              </p>
            </div>
          </div>

          {!hasApplications && (
            <div className="mt-7 rounded-2xl border border-indigo-300/20 bg-orange-500/10 p-5">
              <p className="font-bold text-orange-100">
                No applications submitted yet.
              </p>

              <p className="mt-2 text-sm leading-6 text-orange-100/80">
                Before applying, make sure your readiness profile is strong and
                your saved jobs or apprenticeships are realistic fits.
              </p>

              <Link href="/opportunities" className="btn-light mt-5">
                Find jobs & apprenticeships
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
              <RefreshCcw className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-700">
                Mission rule
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Apply, follow up, improve, repeat.
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                After applying, keep improving your readiness and job pipeline.
                A serious career system should help you learn from every
                application, not just submit forms.
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
                Follow-ups turn activity into progress.
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                You currently have{' '}
                <span className="font-bold text-slate-950">
                  {activeFollowUps}
                </span>{' '}
                saved program or job follow-up item
                {activeFollowUps === 1 ? '' : 's'} across your mission system.
              </p>

              {averageReadinessAtApply !== null && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-orange-700" />

                    <p className="font-bold text-slate-950">
                      Average readiness at apply: {averageReadinessAtApply}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex gap-3">
            <Layers3 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

            <div>
              <p className="font-black text-emerald-900">Best path</p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                Keep applying only to real fits. If applications are not moving,
                go back to readiness, adjust your saved jobs, or compare more
                training programs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}