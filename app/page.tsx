import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Sparkles,
  Swords,
  Trophy,
  UserRound,
} from 'lucide-react'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `${siteConfig.name} — Choose Your Skilled-Trades Path`,
  description:
    'Choose your path as a career seeker, employer, or training provider.',
}

const secondaryPaths = [
  {
    title: 'Employer',
    subtitle: 'Build your skilled-trades hiring pipeline.',
    description:
      'Create an employer account, manage your profile, post real jobs or apprenticeships, and review applicants.',
    href: '/for-employers',
    icon: BriefcaseBusiness,
    stats: ['Profiles', 'Listings', 'Applicants'],
    gradient: 'from-orange-500/20 via-slate-900 to-slate-950',
  },
  {
    title: 'Training Provider',
    subtitle: 'Keep real program data accurate.',
    description:
      'Request provider access, manage verified provider information, and submit programs for admin review.',
    href: '/for-programs',
    icon: GraduationCap,
    stats: ['Claims', 'Programs', 'Review'],
    gradient: 'from-cyan-500/20 via-slate-900 to-slate-950',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute left-0 top-1/2 h-[22rem] w-[22rem] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
              <Swords className="h-6 w-6" />
            </div>

            <div>
              <p className="text-lg font-black tracking-tight">
                {siteConfig.name}
              </p>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
                Choose your path
              </p>
            </div>
          </Link>

          <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-400 sm:block">
            Three paths · One platform
          </div>
        </header>

        <div className="grid flex-1 gap-6 py-10 lg:grid-rows-[1.1fr_0.9fr]">
          <Link
            href="/career-seeker"
            className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-orange-500/20 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-orange-300/40 hover:shadow-orange-950/30 md:p-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.22),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_30%)]" />
            <div className="absolute right-8 top-8 hidden h-24 w-24 rounded-[2rem] border border-orange-300/20 bg-orange-400/10 md:block" />
            <div className="absolute bottom-8 right-24 hidden h-12 w-12 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 md:block" />

            <div className="relative grid h-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-500/15 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-orange-200">
                  <Trophy className="h-4 w-4" />
                  Main quest
                </div>

                <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Career Seeker
                </h1>

                <p className="mt-5 max-w-2xl text-xl font-semibold text-orange-100">
                  Explore skilled-trades careers, build readiness, compare
                  training, save jobs, and track applications.
                </p>

                <p className="mt-5 max-w-3xl leading-8 text-slate-300">
                  This path is only for people exploring or entering skilled
                  trades. Once you enter, the flow stays focused on career
                  discovery, training, readiness, and applications.
                </p>

                <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl shadow-black/20 transition group-hover:bg-orange-100">
                  Enter career seeker path
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  'Career paths',
                  'Training programs',
                  'Jobs & apprenticeships',
                  'Readiness dashboard',
                ].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-orange-200">
                        <span className="font-black">{index + 1}</span>
                      </div>

                      <p className="font-black text-white">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Link>

          <div className="grid gap-6 lg:grid-cols-2">
            {secondaryPaths.map((path) => {
              const Icon = path.icon

              return (
                <Link
                  key={path.title}
                  href={path.href}
                  className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${path.gradient} p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-white/25 md:p-8`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%)]" />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-orange-200 ring-1 ring-white/15">
                        <Icon className="h-7 w-7" />
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-950 transition group-hover:bg-orange-100">
                        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                      </div>
                    </div>

                    <h2 className="mt-7 text-3xl font-black tracking-tight text-white md:text-4xl">
                      {path.title}
                    </h2>

                    <p className="mt-3 text-lg font-semibold text-slate-200">
                      {path.subtitle}
                    </p>

                    <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                      {path.description}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-2">
                      {path.stats.map((stat) => (
                        <span
                          key={stat}
                          className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-300"
                        >
                          {stat}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <footer className="relative flex flex-col justify-between gap-3 border-t border-white/10 py-5 text-xs font-semibold text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Shadman Consulting.</p>
          <p>Career Seeker · Employer · Training Provider</p>
        </footer>
      </section>
    </main>
  )
}