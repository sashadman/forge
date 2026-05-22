import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  UserRound,
} from 'lucide-react'

const roleSteps = [
  {
    title: 'Career Seeker',
    description:
      'Explore career paths, compare training programs, build readiness, and move toward real jobs or apprenticeships.',
    icon: UserRound,
    href: '/trades',
    action: 'Start as seeker',
  },
  {
    title: 'Employer',
    description:
      'Create a profile, publish real listings, and review applicants through a focused employer workflow.',
    icon: BriefcaseBusiness,
    href: '/for-employers',
    action: 'Employer path',
  },
  {
    title: 'Training Provider',
    description:
      'Help learners understand program requirements, outcomes, and how training connects to career goals.',
    icon: GraduationCap,
    href: '/for-programs',
    action: 'Provider path',
  },
]

export default function HomeHowItWorks() {
  return (
    <section id="how" className="section-dark section-padding">
      <div className="section-shell relative">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="eyebrow-dark">How it works</p>

            <h2 className="section-title-dark mt-6">
              Start by choosing your role.
            </h2>
          </div>

          <p className="lead-text-dark max-w-3xl lg:justify-self-end">
            The platform works best when each user enters the right journey.
            Career seekers should not be mixed with employer tools, and employers
            should not have to navigate through seeker pages to manage hiring.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {roleSteps.map((step, index) => {
            const Icon = step.icon

            return (
              <Link
                key={step.title}
                href={step.href}
                className="card-dark group relative overflow-hidden transition hover:-translate-y-1 hover:border-orange-400/30"
              >
                <div className="absolute right-6 top-6 text-6xl font-bold text-white/5">
                  0{index + 1}
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/20">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-8 text-2xl font-bold text-white">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-300">
                  {step.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-orange-300">
                  {step.action}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}