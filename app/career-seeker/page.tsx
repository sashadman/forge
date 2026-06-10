import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Compass,
  GraduationCap,
  Sparkles,
  Trophy,
  UserRound,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Career Seeker — ${siteConfig.name}`,
  description:
    'A dedicated career-seeker path for exploring skilled trades, building readiness, comparing training, and applying to jobs or apprenticeships.',
}

const seekerMissions = [
  {
    title: 'Complete your profile',
    description:
      'Create the basic identity and location information that helps organize your career journey.',
    href: '/dashboard/profile',
    icon: UserRound,
    level: 'Level 1',
  },
  {
    title: 'Build readiness',
    description:
      'Strengthen your application readiness before applying to real jobs or apprenticeships.',
    href: '/dashboard/readiness',
    icon: Trophy,
    level: 'Level 2',
  },
  {
    title: 'Compare career paths',
    description:
      'Explore skilled-trades paths and understand the direction that fits your interests.',
    href: '/trades',
    icon: Compass,
    level: 'Explore',
  },
  {
    title: 'Take the career quiz',
    description:
      'Use a simple quiz to match interests and work style with skilled-trades career paths.',
    href: '/quiz',
    icon: Sparkles,
    level: 'Match',
  },
  {
    title: 'Compare training programs',
    description:
      'Find training programs, apprenticeships, workforce programs, and preparation pathways.',
    href: '/programs',
    icon: GraduationCap,
    level: 'Train',
  },
  {
    title: 'Find jobs & apprenticeships',
    description:
      'Review real active openings and save opportunities that fit your goals.',
    href: '/opportunities',
    icon: BriefcaseBusiness,
    level: 'Apply',
  },
]

export default function CareerSeekerPage() {
  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.10),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.16),transparent_32%)]" />

        <div className="section-shell relative py-24">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-indigo-200">
              <Trophy className="h-4 w-4" />
              Career seeker path
            </p>

            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">
              Your skilled-trades mission hub.
            </h1>

            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
              This area is only for career seekers. Build your profile, compare
              paths, find training, save jobs, and track applications without
              mixing employer or provider workflows.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/dashboard" className="btn-light px-7 py-4">
                Open seeker dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/trades"
                className="btn-outline border-white/20 bg-white/10 px-7 py-4 text-white hover:bg-white/15"
              >
                Start exploring paths
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <section className="-mt-12 grid gap-5 md:grid-cols-3">
            <StatCard label="Start" value="Profile" icon={<UserRound />} />
            <StatCard label="Build" value="Readiness" icon={<BarChart3 />} />
            <StatCard label="Move" value="Apply" icon={<BriefcaseBusiness />} />
          </section>

          <section className="section-padding">
            <div className="max-w-3xl">
              <p className="eyebrow">Mission map</p>

              <h2 className="section-title mt-6">
                Choose what you want to do next.
              </h2>

              <p className="lead-text mt-5">
                Each card keeps you inside the career-seeker journey. No
                employer dashboard. No provider admin flow. Just the seeker path.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {seekerMissions.map((mission) => {
                const Icon = mission.icon

                return (
                  <Link
                    key={mission.title}
                    href={mission.href}
                    className="group rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-1 hover:border-indigo-300/40 hover:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-300/20">
                        <Icon className="h-7 w-7" />
                      </div>

                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-200 ring-1 ring-white/10">
                        {mission.level}
                      </span>
                    </div>

                    <h3 className="mt-6 text-2xl font-black tracking-tight text-white">
                      {mission.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-300">
                      {mission.description}
                    </p>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-black text-indigo-200">
                      Open mission
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        </div>
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="content-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
          {icon}
        </div>
      </div>
    </div>
  )
}