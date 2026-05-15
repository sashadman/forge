import Link from 'next/link'
import { ArrowRight, Building2, GraduationCap, Search } from 'lucide-react'

const steps = [
  {
    title: 'Discover trades',
    description:
      'Explore real trade paths, compare daily work, pay potential, training time, and long-term career direction.',
    icon: Search,
    href: '/trades',
  },
  {
    title: 'Find pathways',
    description:
      'Move from interest to action by connecting trade matches with apprenticeships, schools, and training programs.',
    icon: GraduationCap,
    href: '/programs',
  },
  {
    title: 'Build the pipeline',
    description:
      'Create a stronger bridge between career seekers, training partners, and employers who need skilled workers.',
    icon: Building2,
    href: '/for-employers',
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
              A cleaner path from curiosity to opportunity.
            </h2>
          </div>

          <p className="lead-text-dark max-w-3xl lg:justify-self-end">
            The platform is being built around a simple workforce-development loop:
            help people discover the trades, understand the pathway, and move toward
            real training and employer opportunities.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
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
                  Step {index + 1}
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