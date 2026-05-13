import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Hammer,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { siteConfig } from '@/config/site'

const marketplaceSteps = [
  {
    title: 'Discover',
    description: 'Explore trade careers and understand what the work really looks like.',
    icon: Search,
  },
  {
    title: 'Prepare',
    description: 'Compare training pathways, apprenticeships, and career requirements.',
    icon: GraduationCap,
  },
  {
    title: 'Connect',
    description: 'Build toward future connections with programs and employers.',
    icon: BriefcaseBusiness,
  },
]

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.28),transparent_34rem)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_30rem)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-50 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-orange-300">
            <Sparkles className="h-4 w-4" />
            Skilled trades workforce marketplace
          </p>

          <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Build a real path into the skilled trades.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            {siteConfig.name} helps career seekers discover skilled trades, take a career-fit quiz,
            save promising paths, and prepare for training, apprenticeships, and employer opportunities.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-4 font-semibold text-white shadow-lg shadow-orange-950/30 hover:bg-orange-700"
            >
              Start career quiz
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/trades"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-4 font-semibold text-white hover:bg-white/10"
            >
              Explore trades
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {marketplaceSteps.map((step) => {
              const Icon = step.icon

              return (
                <div
                  key={step.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <Icon className="h-6 w-6 text-orange-300" />
                  <p className="mt-4 font-bold text-white">{step.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="rounded-[1.5rem] bg-white p-6 text-slate-950">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                <Hammer className="h-6 w-6" />
              </div>

              <div>
                <p className="font-bold">Marketplace foundation</p>
                <p className="text-sm text-slate-500">Career seekers · programs · employers</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-orange-600" />
                  <p className="font-semibold">Personalized trade matches</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Users take the quiz, save trades, and build their career shortlist.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-orange-600" />
                  <p className="font-semibold">Training pathway layer</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Next, the platform can connect seekers to apprenticeships and programs.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <BriefcaseBusiness className="h-5 w-5 text-orange-600" />
                  <p className="font-semibold">Employer ecosystem</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Employers can later access a stronger workforce pipeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}