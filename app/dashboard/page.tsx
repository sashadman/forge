import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  Gamepad2,
  GraduationCap,
  Map,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { getDashboardPageData } from '@/lib/dashboard/get-dashboard-page-data'

export default async function DashboardPage() {
  const {
    user,
    profile,
    quizResults,
    savedTrades,
    savedProgramPipelineItems,
    savedOpportunityPipelineItems,
    submittedApplications,
    readinessScore,
  } = await getDashboardPageData()

  const displayName = profile?.full_name || user.email || 'Career seeker'
  const savedCareerPathCount = savedTrades.length
  const savedTrainingProgramCount = savedProgramPipelineItems.length
  const savedJobCount = savedOpportunityPipelineItems.length
  const applicationCount = submittedApplications.length
  const quizResultCount = quizResults.length

  const level =
    readinessScore >= 90
      ? 'Level 5'
      : readinessScore >= 75
        ? 'Level 4'
        : readinessScore >= 50
          ? 'Level 3'
          : readinessScore >= 25
            ? 'Level 2'
            : 'Level 1'

  const nextMission = (() => {
    if (!profile?.full_name || !profile?.location || !profile?.experience_level) {
      return {
        title: 'Complete your seeker profile',
        description:
          'Set up your basic profile first so the rest of your career journey has a foundation.',
        href: '/dashboard/profile',
        action: 'Start profile mission',
        icon: UserRound,
      }
    }

    if (readinessScore < 80) {
      return {
        title: 'Build your readiness score',
        description:
          'Complete readiness items before applying so your application package is stronger.',
        href: '/dashboard/readiness',
        action: 'Improve readiness',
        icon: ShieldCheck,
      }
    }

    if (savedCareerPathCount === 0) {
      return {
        title: 'Choose career paths to track',
        description:
          'Save career paths that match your interests so you can compare training and jobs with purpose.',
        href: '/dashboard/career-paths',
        action: 'Review career paths',
        icon: Map,
      }
    }

    if (savedTrainingProgramCount === 0) {
      return {
        title: 'Compare training programs',
        description:
          'Build your training shortlist before applying to jobs or apprenticeships.',
        href: '/dashboard/training-programs',
        action: 'Open training mission',
        icon: GraduationCap,
      }
    }

    if (savedJobCount === 0) {
      return {
        title: 'Track jobs and apprenticeships',
        description:
          'Start saving real listings so you can organize, research, and apply at the right time.',
        href: '/dashboard/jobs',
        action: 'Open jobs mission',
        icon: BriefcaseBusiness,
      }
    }

    return {
      title: 'Track applications and follow-ups',
      description:
        'Review submitted applications and keep your next actions moving.',
      href: '/dashboard/applications',
      action: 'Review applications',
      icon: ClipboardCheck,
    }
  })()

  const missionCards = [
    {
      title: 'Profile Setup',
      description: 'Complete your seeker profile and basic career information.',
      href: '/dashboard/profile',
      action: 'Open profile',
      icon: UserRound,
      stat: profile?.full_name ? 'Started' : 'Not started',
    },
    {
      title: 'Readiness Score',
      description: 'Build the application package you need before applying.',
      href: '/dashboard/readiness',
      action: 'Improve readiness',
      icon: ShieldCheck,
      stat: `${readinessScore}%`,
    },
    {
      title: 'Career Paths',
      description: 'Review saved career paths and keep your direction focused.',
      href: '/dashboard/career-paths',
      action: 'View paths',
      icon: Map,
      stat: `${savedCareerPathCount}`,
    },
    {
      title: 'Training Programs',
      description: 'Compare saved training programs and preparation pathways.',
      href: '/dashboard/training-programs',
      action: 'Compare programs',
      icon: GraduationCap,
      stat: `${savedTrainingProgramCount}`,
    },
    {
      title: 'Jobs & Apprenticeships',
      description: 'Track saved listings from interest to application.',
      href: '/dashboard/jobs',
      action: 'Track listings',
      icon: BriefcaseBusiness,
      stat: `${savedJobCount}`,
    },
    {
      title: 'Applications',
      description: 'Review submitted applications and status history.',
      href: '/dashboard/applications',
      action: 'View applications',
      icon: ClipboardCheck,
      stat: `${applicationCount}`,
    },
  ]

  const NextMissionIcon = nextMission.icon

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <SiteNavbar />

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-indigo-500/8 to-slate-700/8" />
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/8 blur-xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-xl" />

        <div className="section-shell relative py-16 md:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-indigo-200 shadow-lg shadow-slate-950/10 backdrop-blur">
                <Gamepad2 className="h-4 w-4" />
                Career seeker mission hub
              </div>

              <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-orange-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                  {displayName.split(' ')[0]}
                </span>
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                Complete one mission at a time. Build your profile, increase
                readiness, compare training, track listings, and move toward real
                skilled-trades applications.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/30 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                Current status
              </p>

              <div className="mt-4 flex items-end gap-4">
                <p className="text-5xl font-black">{level}</p>
                <div className="pb-1">
                  <p className="font-bold text-indigo-200">
                    {readinessScore}% readiness
                  </p>
                  <p className="text-sm text-slate-400">
                    {quizResultCount} quiz result{quizResultCount === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 via-fuchsia-400 to-cyan-300"
                  style={{ width: `${Math.min(readinessScore, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] border border-indigo-300/20 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/10 backdrop-blur md:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr_auto] lg:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/8 text-indigo-300 ring-1 ring-orange-300/30">
                <NextMissionIcon className="h-8 w-8" />
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-indigo-300">
                  <Sparkles className="h-4 w-4" />
                  Next mission
                </div>

                <h2 className="mt-3 text-3xl font-black tracking-tight">
                  {nextMission.title}
                </h2>

                <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                  {nextMission.description}
                </p>
              </div>

              <Link href={nextMission.href} className="btn-light whitespace-nowrap">
                {nextMission.action}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-slate-950 pb-20">
        <div className="section-shell">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {missionCards.map((mission) => {
              const Icon = mission.icon

              return (
                <Link
                  key={mission.title}
                  href={mission.href}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-indigo-300/30 hover:bg-white/[0.09]"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-fuchsia-400 to-cyan-300 opacity-70" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-indigo-300 ring-1 ring-white/10">
                      <Icon className="h-7 w-7" />
                    </div>

                    <div className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm font-black text-cyan-200">
                      {mission.stat}
                    </div>
                  </div>

                  <h3 className="mt-6 text-2xl font-black tracking-tight">
                    {mission.title}
                  </h3>

                  <p className="mt-3 min-h-14 leading-7 text-slate-300">
                    {mission.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-300">
                    {mission.action}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
              <Trophy className="h-7 w-7 text-indigo-300" />
              <p className="mt-4 text-3xl font-black">{applicationCount}</p>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                Submitted applications
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
              <Target className="h-7 w-7 text-fuchsia-300" />
              <p className="mt-4 text-3xl font-black">
                {savedCareerPathCount + savedTrainingProgramCount + savedJobCount}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                Saved mission items
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
              <BadgeCheck className="h-7 w-7 text-cyan-300" />
              <p className="mt-4 text-3xl font-black">{readinessScore}%</p>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                Application readiness
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-gradient-to-r from-orange-500/10 via-indigo-500/8 to-slate-700/8 p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
                  <Rocket className="h-4 w-4" />
                  Mission flow
                </div>

                <p className="mt-3 max-w-3xl text-slate-300">
                  Use the dashboard as your hub. Each mission opens a focused
                  page so you are not forced to manage everything in one crowded
                  screen.
                </p>
              </div>

              <Link href="/dashboard/readiness" className="btn-light">
                Continue mission
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}