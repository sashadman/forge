import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Layers3,
  PhoneCall,
  Route,
  Send,
  Target,
} from 'lucide-react'
import type { OpportunityPipelineItem } from '@/components/dashboard/OpportunityPipelineBoard'

type JobsMissionGuideProps = {
  items: OpportunityPipelineItem[]
}

const activeStatuses = ['interested', 'preparing', 'applied', 'interviewing', 'offer']

function formatOpportunityType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export default function JobsMissionGuide({ items }: JobsMissionGuideProps) {
  const savedCount = items.length
  const activeCount = items.filter((item) =>
    activeStatuses.includes(item.status)
  ).length
  const appliedCount = items.filter((item) => item.status === 'applied').length
  const interviewingCount = items.filter(
    (item) => item.status === 'interviewing'
  ).length
  const offerCount = items.filter((item) => item.status === 'offer').length
  const hasSavedListings = savedCount > 0

  const listingTypes = Array.from(
    new Set(items.map((item) => formatOpportunityType(item.opportunityType)))
  ).slice(0, 5)

  const tradeFocuses = Array.from(
    new Set(items.map((item) => item.tradeSlug))
  ).slice(0, 5)

  const listingsWithFollowUps = items.filter((item) => item.followUpOn).length
  const listingsWithNextActions = items.filter((item) =>
    item.nextAction.trim()
  ).length

  return (
    <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-emerald-500/10 to-cyan-500/10" />
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-8 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-orange-300">
            <BriefcaseBusiness className="h-4 w-4" />
            Jobs strategy
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight">
            Turn saved listings into real action.
          </h2>

          <p className="mt-4 leading-7 text-slate-300">
            This mission is where browsing becomes a pipeline. Save real jobs
            and apprenticeships, move serious listings into active progress, and
            track the next action before applying.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-5">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <Layers3 className="h-6 w-6 text-orange-300" />
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
              <Send className="h-6 w-6 text-cyan-300" />
              <p className="mt-3 text-3xl font-black">{appliedCount}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Applied
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <PhoneCall className="h-6 w-6 text-orange-300" />
              <p className="mt-3 text-3xl font-black">{interviewingCount}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Interview
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-300" />
              <p className="mt-3 text-3xl font-black">{offerCount}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Offer
              </p>
            </div>
          </div>

          {!hasSavedListings && (
            <div className="mt-7 rounded-2xl border border-orange-300/20 bg-orange-500/10 p-5">
              <p className="font-bold text-orange-100">
                Start by saving real jobs or apprenticeships.
              </p>

              <p className="mt-2 text-sm leading-6 text-orange-100/80">
                Save listings that match your target career path, location,
                readiness level, and training plan. Do not track fake or random
                listings.
              </p>

              <Link href="/opportunities" className="btn-light mt-5">
                View jobs & apprenticeships
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
                Save with intention, not anxiety.
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                A job or apprenticeship belongs here only if it matches your
                target path, realistic commute, readiness level, and next action.
                The goal is a clean shortlist, not a giant pile of links.
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
                Every serious listing needs a next action.
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {listingsWithNextActions} listing
                {listingsWithNextActions === 1 ? '' : 's'} currently have a
                next action. {listingsWithFollowUps} listing
                {listingsWithFollowUps === 1 ? '' : 's'} have a follow-up date.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {listingTypes.map((type) => (
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
            <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

            <div>
              <p className="font-black text-emerald-900">Best path</p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                Move listings from Saved → Interested → Preparing → Applied.
                Use Interviewing and Offer only when the employer actually
                moves the process forward.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}