'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Map,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

type MissionNavProps = {
  isDay: boolean
}

const missions = [
  {
    href: '/dashboard/profile',
    label: 'Profile',
    shortLabel: 'Profile',
    description: 'Set up your seeker identity',
    icon: UserRound,
  },
  {
    href: '/dashboard/readiness',
    label: 'Readiness',
    shortLabel: 'Ready',
    description: 'Build application strength',
    icon: ShieldCheck,
  },
  {
    href: '/dashboard/career-paths',
    label: 'Career Paths',
    shortLabel: 'Paths',
    description: 'Choose direction',
    icon: Map,
  },
  {
    href: '/dashboard/training-programs',
    label: 'Training',
    shortLabel: 'Training',
    description: 'Compare preparation options',
    icon: GraduationCap,
  },
  {
    href: '/dashboard/jobs',
    label: 'Jobs',
    shortLabel: 'Jobs',
    description: 'Track listings',
    icon: BriefcaseBusiness,
  },
  {
    href: '/dashboard/applications',
    label: 'Applications',
    shortLabel: 'Apply',
    description: 'Manage follow-ups',
    icon: ClipboardCheck,
  },
]

export default function MissionNav({ isDay }: MissionNavProps) {
  const pathname = usePathname()

  const currentIndex = Math.max(
    missions.findIndex((mission) => mission.href === pathname),
    0
  )

  const progressPercent =
    missions.length > 1 ? (currentIndex / (missions.length - 1)) * 100 : 0

  return (
    <section
      className={
        isDay
          ? 'border-y border-slate-200 bg-white/75 backdrop-blur'
          : 'border-y border-white/10 bg-slate-950/85 backdrop-blur'
      }
    >
      <div className="section-shell py-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p
              className={
                isDay
                  ? 'text-xs font-black uppercase tracking-[0.25em] text-orange-700'
                  : 'text-xs font-black uppercase tracking-[0.25em] text-orange-300'
              }
            >
              Mission sequence
            </p>

            <p
              className={
                isDay
                  ? 'mt-1 text-sm font-semibold text-slate-600'
                  : 'mt-1 text-sm font-semibold text-slate-400'
              }
            >
              Move through each focused page without returning to the hub every time.
            </p>
          </div>

          <div
            className={
              isDay
                ? 'rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm'
                : 'rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-lg shadow-black/20'
            }
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {missions.map((mission, index) => {
                const Icon = mission.icon
                const isActive = mission.href === pathname
                const isComplete = index < currentIndex

                return (
                  <Link
                    key={mission.href}
                    href={mission.href}
                    className={
                      isActive
                        ? isDay
                          ? 'group rounded-2xl border border-orange-300 bg-orange-50 p-3 text-orange-800 shadow-sm transition hover:-translate-y-0.5'
                          : 'group rounded-2xl border border-orange-300/40 bg-orange-500/15 p-3 text-orange-200 shadow-lg shadow-orange-950/20 transition hover:-translate-y-0.5'
                        : isDay
                          ? 'group rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-200 hover:text-orange-700'
                          : 'group rounded-2xl border border-white/10 bg-slate-900/80 p-3 text-slate-300 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:text-cyan-200'
                    }
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={
                          isActive
                            ? isDay
                              ? 'flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white'
                              : 'flex h-9 w-9 items-center justify-center rounded-xl bg-orange-400 text-slate-950'
                            : isComplete
                              ? isDay
                                ? 'flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700'
                                : 'flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300'
                              : isDay
                                ? 'flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600'
                                : 'flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-slate-300'
                        }
                      >
                        {isComplete ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black">
                          {mission.shortLabel}
                        </p>
                        <p
                          className={
                            isDay
                              ? 'hidden truncate text-xs text-slate-500 lg:block'
                              : 'hidden truncate text-xs text-slate-500 lg:block'
                          }
                        >
                          {mission.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div
              className={
                isDay
                  ? 'mt-4 h-2 overflow-hidden rounded-full bg-slate-200'
                  : 'mt-4 h-2 overflow-hidden rounded-full bg-white/10'
              }
            >
              <div
                className={
                  isDay
                    ? 'h-full rounded-full bg-gradient-to-r from-orange-500 to-teal-500 transition-all'
                    : 'h-full rounded-full bg-gradient-to-r from-orange-400 to-cyan-300 transition-all'
                }
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}