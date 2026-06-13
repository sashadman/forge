import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  Compass,
  GraduationCap,
  Sparkles,
  Trophy,
  UserRound,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
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

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-24">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">
              <Trophy className="h-4 w-4" />
              Career seeker path
            </p>

            <h1 className="page-title-dark mt-6">
              Your skilled-trades mission hub.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Build your profile, compare career paths, find training, save
              jobs, and track applications from one focused seeker workspace.
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
          <section className="section-padding">
            <div className="max-w-3xl">
              <p className="eyebrow">Mission map</p>

              <h2 className="section-title mt-6">
                Choose what you want to do next.
              </h2>

              <p className="lead-text mt-5">
                Each card opens a real career-seeker tool, from readiness work
                to training research and active opportunities.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {seekerMissions.map((mission) => {
                const Icon = mission.icon

                return (
                  <Link
                    key={mission.title}
                    href={mission.href}
                    className="group card card-hover p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{ background: 'var(--amber-muted)', color: 'var(--amber)' }}
                      >
                        <Icon className="h-7 w-7" />
                      </div>

                      <span className="level-badge">
                        {mission.level}
                      </span>
                    </div>

                    <h3
                      className="mt-6 text-2xl font-black tracking-tight"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {mission.title}
                    </h3>

                    <p
                      className="mt-3 leading-7"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {mission.description}
                    </p>

                    <div
                      className="mt-6 inline-flex items-center gap-2 text-sm font-black"
                      style={{ color: 'var(--amber)' }}
                    >
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
    </ThemedPublicPage>
  )
}
