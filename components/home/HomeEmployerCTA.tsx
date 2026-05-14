import Link from 'next/link'
import { ArrowRight, Building2, GraduationCap, Users } from 'lucide-react'

const ecosystemItems = [
  {
    title: 'Career seekers',
    description: 'Discover trades, save paths, and prepare for next steps.',
    icon: Users,
  },
  {
    title: 'Training programs',
    description: 'Help learners move from interest to structured preparation.',
    icon: GraduationCap,
  },
  {
    title: 'Employers',
    description: 'Build a stronger pipeline of motivated future workers.',
    icon: Building2,
  },
]

export default function HomeEmployerCTA() {
  return (
    <section id="employers" className="section-light pb-24">
      <div className="section-shell">
        <div className="dark-panel px-8 py-16 md:px-16">
          <div className="dark-panel-content grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="eyebrow-dark">Marketplace ecosystem</p>

              <h2 className="section-title-dark mt-6">
                Build the workforce pipeline, not just another job board.
              </h2>

              <p className="lead-text-dark mt-6">
                The platform is being designed to connect career seekers, training
                pathways, and employers into one practical skilled-trades ecosystem.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link href="/trades" className="btn-primary px-7 py-4">
                  Explore the platform
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link href="/auth/sign-up" className="btn-outline-dark px-7 py-4">
                  Create account
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {ecosystemItems.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.title} className="card-dark">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/20">
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="font-bold text-white">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}