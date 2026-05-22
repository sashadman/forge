import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  UserRound,
} from 'lucide-react'

const paths = [
  {
    title: 'Career Seeker',
    description:
      'Compare career paths, training programs, and jobs or apprenticeships.',
    href: '/trades',
    action: 'Explore career paths',
    icon: UserRound,
  },
  {
    title: 'Employer',
    description:
      'Create an employer profile and manage real jobs or apprenticeships.',
    href: '/for-employers',
    action: 'Go to employer path',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Training Provider',
    description:
      'Help seekers understand your program and how it connects to work.',
    href: '/for-programs',
    action: 'Go to provider path',
    icon: GraduationCap,
  },
]

export default function HomeEmployerCTA() {
  return (
    <section className="section-light pb-24">
      <div className="section-shell">
        <div className="dark-panel px-8 py-16 md:px-16">
          <div className="dark-panel-content">
            <div className="max-w-3xl">
              <p className="eyebrow-dark">Role-based journeys</p>

              <h2 className="section-title-dark mt-6">
                Each audience has a different workflow.
              </h2>

              <p className="lead-text-dark mt-6">
                Career seekers need exploration and readiness. Employers need
                hiring tools. Training providers need program visibility. Keeping
                these journeys separate makes the platform easier to use and more
                professional.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {paths.map((path) => {
                const Icon = path.icon

                return (
                  <Link
                    key={path.title}
                    href={path.href}
                    className="card-dark group transition hover:-translate-y-1 hover:border-orange-400/30"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/20">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-white">
                      {path.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {path.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-orange-300">
                      {path.action}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}