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

// MissionNav no longer needs isDay — it reads from CSS variables automatically
type MissionNavProps = {
  isDay?: boolean  // kept for API compat, no longer used
}

const missions = [
  {
    href: '/dashboard/profile',
    label: 'Profile',
    shortLabel: 'Profile',
    description: 'Set up your identity',
    icon: UserRound,
    level: '01',
  },
  {
    href: '/dashboard/readiness',
    label: 'Readiness',
    shortLabel: 'Ready',
    description: 'Build strength',
    icon: ShieldCheck,
    level: '02',
  },
  {
    href: '/dashboard/career-paths',
    label: 'Career Paths',
    shortLabel: 'Paths',
    description: 'Choose direction',
    icon: Map,
    level: '03',
  },
  {
    href: '/dashboard/training-programs',
    label: 'Training',
    shortLabel: 'Training',
    description: 'Compare programs',
    icon: GraduationCap,
    level: '04',
  },
  {
    href: '/dashboard/jobs',
    label: 'Jobs',
    shortLabel: 'Jobs',
    description: 'Track listings',
    icon: BriefcaseBusiness,
    level: '05',
  },
  {
    href: '/dashboard/applications',
    label: 'Applications',
    shortLabel: 'Apply',
    description: 'Manage follow-ups',
    icon: ClipboardCheck,
    level: '06',
  },
]

export default function MissionNav({ isDay }: MissionNavProps) {
  const pathname = usePathname()

  const currentIndex = Math.max(
    missions.findIndex((m) => m.href === pathname),
    0
  )

  const progressPercent =
    missions.length > 1 ? (currentIndex / (missions.length - 1)) * 100 : 0

  return (
    <section
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(6, 11, 24, 0.8)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="section-shell py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {/* Label */}
          <div>
            <p
              className="text-xs font-black uppercase tracking-widest"
              style={{ color: 'var(--cyan)', fontFamily: 'var(--font-display)' }}
            >
              Mission sequence
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              Move through each step without returning to the hub.
            </p>
          </div>

          {/* Mission steps container */}
          <div
            className="rounded-2xl p-3"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {missions.map((mission, index) => {
                const Icon = mission.icon
                const isActive = mission.href === pathname
                const isComplete = index < currentIndex

                // Icon bg/color
                let iconBg: string
                let iconColor: string
                if (isActive) {
                  iconBg = 'var(--cyan)'
                  iconColor = 'var(--text-on-cyan)'
                } else if (isComplete) {
                  iconBg = 'rgba(0, 217, 126, 0.15)'
                  iconColor = 'var(--emerald)'
                } else {
                  iconBg = 'var(--bg-overlay)'
                  iconColor = 'var(--text-muted)'
                }

                // Card border/bg
                let cardBorder: string
                let cardBg: string
                let cardBoxShadow: string | undefined
                if (isActive) {
                  cardBorder = 'var(--border-cyan)'
                  cardBg = 'var(--cyan-muted)'
                  cardBoxShadow = '0 0 16px rgba(0,229,255,0.15)'
                } else {
                  cardBorder = 'var(--border)'
                  cardBg = 'var(--bg-base)'
                  cardBoxShadow = undefined
                }

                return (
                  <Link
                    key={mission.href}
                    href={mission.href}
                    className="group rounded-xl p-3 transition-all"
                    style={{
                      border: `1px solid ${cardBorder}`,
                      background: cardBg,
                      boxShadow: cardBoxShadow,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'var(--border-cyan)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = cardBorder
                        e.currentTarget.style.transform = 'none'
                      }
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: iconBg, color: iconColor }}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="truncate text-sm font-black"
                          style={{
                            color: isActive ? 'var(--cyan)' : 'var(--text-primary)',
                            fontFamily: 'var(--font-display)',
                          }}
                        >
                          {mission.shortLabel}
                        </p>
                        <p
                          className="hidden truncate text-xs lg:block"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {mission.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* XP-style overall progress bar */}
            <div className="mt-3 xp-bar-track" style={{ height: '6px' }}>
              <div
                className="xp-bar-fill"
                style={{ width: `${progressPercent}%`, height: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}