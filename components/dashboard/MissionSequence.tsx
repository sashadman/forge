import Link from 'next/link'
import {
  BriefcaseBusiness,
  Check,
  ClipboardList,
  Compass,
  GraduationCap,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

const missions = [
  {
    href: '/dashboard/profile',
    title: 'Profile',
    description: 'Set up identity',
    icon: UserRound,
    state: 'complete',
  },
  {
    href: '/dashboard/readiness',
    title: 'Ready',
    description: 'Build strength',
    icon: ShieldCheck,
    state: 'active',
  },
  {
    href: '/dashboard/career-paths',
    title: 'Paths',
    description: 'Choose direction',
    icon: Compass,
    state: 'locked',
  },
  {
    href: '/dashboard/training-programs',
    title: 'Training',
    description: 'Compare programs',
    icon: GraduationCap,
    state: 'locked',
  },
  {
    href: '/dashboard/jobs',
    title: 'Jobs',
    description: 'Track listings',
    icon: BriefcaseBusiness,
    state: 'locked',
  },
  {
    href: '/dashboard/applications',
    title: 'Apply',
    description: 'Follow-ups',
    icon: ClipboardList,
    state: 'locked',
  },
]

export default function MissionSequence() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg-void)] py-8">
      <div className="section-shell">
        <div className="mb-5">
          <p className="font-display text-sm font-black uppercase tracking-[0.25em] text-[var(--cyan)]">
            Mission sequence
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Move through each step without returning to the hub.
          </p>
        </div>

        <div className="rounded-[var(--radius-xl)] border border-[var(--border-cyan)] bg-[var(--bg-raised)] p-4">
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {missions.map((mission) => {
              const Icon = mission.icon
              const isActive = mission.state === 'active'
              const isComplete = mission.state === 'complete'

              return (
                <Link
                  key={mission.href}
                  href={mission.href}
                  className={`rounded-[var(--radius-lg)] border p-4 transition hover:-translate-y-0.5 hover:border-[var(--border-cyan)] ${
                    isActive
                      ? 'border-[var(--border-cyan)] bg-[var(--cyan-muted)]'
                      : isComplete
                        ? 'border-[rgba(0,217,126,0.25)] bg-[rgba(0,217,126,0.08)]'
                        : 'border-[var(--border)] bg-[var(--bg-base)]'
                  }`}
                >
                  <div
                    className={`mb-4 grid h-11 w-11 place-items-center rounded-[var(--radius-md)] ${
                      isComplete
                        ? 'bg-[rgba(0,217,126,0.12)] text-[var(--emerald)]'
                        : isActive
                          ? 'bg-[var(--cyan)] text-[var(--text-on-cyan)]'
                          : 'bg-[var(--bg-overlay)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {isComplete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>

                  <p className="font-display font-black text-[var(--text-primary)]">
                    {mission.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {mission.description}
                  </p>
                </Link>
              )
            })}
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--bg-input)] ring-1 ring-[var(--border)]">
            <div className="h-full w-1/5 rounded-full bg-[var(--cyan)] shadow-[var(--cyan-glow)]" />
          </div>
        </div>
      </div>
    </section>
  )
}
