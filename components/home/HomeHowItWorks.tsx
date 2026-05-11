import { Building2, GraduationCap, Search } from 'lucide-react'

const steps = [
  {
    title: 'Discover trades',
    description:
      'Learn what each trade does, how training works, what skills are needed, and where to begin.',
    icon: Search,
  },
  {
    title: 'Find programs',
    description:
      'Explore apprenticeships, trade schools, community college programs, and local training options.',
    icon: GraduationCap,
  },
  {
    title: 'Connect with employers',
    description:
      'Create a profile, show interest in opportunities, and connect with employers building their workforce.',
    icon: Building2,
  },
]

export default function HomeHowItWorks() {
  return (
    <section id="how" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple path from curiosity to opportunity.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon

            return (
              <div
                key={step.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-6 text-xl font-bold">{step.title}</h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}